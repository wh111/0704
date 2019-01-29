<!--更换房间-->
<template>
  <div>
    <el-form :model="selectRoomData" ref="formValidate" :rules="rules.inAndOut"   class="demo-form-inline" label-width="90px" >
      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名:" >
            {{operailityData.userName}}
          </el-form-item>
        </el-col>
        <el-col :span="1" :offset="2">
          <el-form-item label="迁出时间:" >
            <el-date-picker
              v-model="formValidate.outDateString"
              type="date"
              :editable="false"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
            <fieldset class="layui-elem-field">
              <legend>调出房间信息</legend>
              <div class="layui-field-box">
                <el-form-item label="房间号:" >
                  {{roomData.no}}
                </el-form-item>
                <el-form-item label="房间类别:" >
                  {{roomData.sex | roomSex}}
                </el-form-item>
                <el-form-item label="床位数:" >
                  {{roomData.bedNum}}
                </el-form-item>
              </div>
            </fieldset>
        </el-col>
        <el-col :span="10" :offset="1">
          <fieldset class="layui-elem-field">
            <legend>调入房间信息</legend>
            <div class="layui-field-box">
              <el-form-item label="房间号:" prop="no">
                <el-input readonly v-model="selectRoomData.no" @focus="openSelectRoom"></el-input>
              </el-form-item>
              <el-form-item label="房间类别:" >
                {{selectRoomData.sex | roomSex}}
              </el-form-item>
              <el-form-item label="床位数:" >
                {{selectRoomData.bedNum}}
              </el-form-item>
            </div>
          </fieldset>
        </el-col>

      </el-row >
    </br>
      <el-row  >
        <el-col :span="21" :offset="2">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="formValidate.remark" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

    </el-form>
    <el-row >
      <el-col :span="16" :offset="2">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
    <!--选择房间-->
    <Modal
      close-on-click-modal="false"
      width="1000"
      v-model="selectRoomModal"
      title="对话框标题"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" @cancel="close" :selectRoomData="selectRoomData" :build="build"  @selectRoom="setSelectRoom" :initUser="userList" :selectRoom="selectRoom" :operaility-data="operailityData" :url="url"></select-room>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import selectRoom from './changeRoom_selectRoom.vue'
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','selectRoom','url','build','rules'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        userList:[],//选择人员传过来的数据，已经处理过，修改人员的时候再传过去
        selectUserId:{id:'selectUserId',title:'选择人员'},
        selectUserModal:false,
        //form表单bind数据
        formValidate: {
          buildId:this.build.id,//大楼id
          roomId:'',        //房间ID
          userId:'',        //迁出人员ID
          userName:'',
          remark:'',        //备注
          outDateString:'',        //迁入时间
        },
        selectRoomData:{no:''},  //已选择将要迁入的房间信息
        roomData:{}, //获取到的房间信息
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'changeRoom',
          successTitle:'迁出成功',
          errorTitle:'迁出失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            jsonString:true,       //使用Content-Type: application/json
            url:this.url.bedPersonChange,
            method:'put',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.roomGet+this.selectRoom.id,
          }
        },

        selectRoomModal:false,  //选择房间

        /*--按钮button--*/
        selectRoomId:{id:'selectRoomId',title:'选择房间'},
      }
    },
    created(){
      //初始化时间
      this.formValidate.outDateString = new Date();
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data =this.formDate(this.getFormData(this.formValidate),['outDateString'],this.yearMonthData) ;
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.roomData = data;
      },
      cancel(){
        this.$emit('cancel','changeRoom')
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.formValidate.userName =  this.operailityData.userName;
        this.formValidate.userId =  this.operailityData.userId;
        this.ajax(this.listMessTitle);
      },


      openSelectUser(){
        this.selectUserModal = true;
      },


      //选择房间
      openSelectRoom(data){
        this.selectRoomModal = true
      },

      close(){
        this.selectRoomModal = false
      },


      setSelectRoom(roomObj){
        this.selectRoomData = roomObj;
        this.formValidate.buildId =roomObj.buildId;
        this.formValidate.roomId =roomObj.id;
        this.close();
      }
    },
    components:{
      //当前组件引入的子组件
      selectRoom
    },
  }
</script>
