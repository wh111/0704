<!--单个迁入-->
<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules.inAndOut"  class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="房间号:" prop="phone" >
            {{roomData.no}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="房间类别:" prop="inDateString" >
            {{roomData.sex | roomSex}}

          </el-form-item>
        </el-col>
      </el-row >

      <el-row >

        <el-col :span="8" :offset="2">
          <el-form-item label="床位数:" prop="phone" >
            {{roomData.bedNum}}
          </el-form-item>
        </el-col>
        </el-col >
        <el-col :span="8" :offset="2">
          <el-form-item label="迁入时间:" prop="inDateString" >
            <el-date-picker
              v-model="formValidate.inDateString"
              type="date"
              :editable="false"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="选择人员:" prop="userName">
            <el-input readonly v-model="formValidate.userName" @focus="openSelectUser"></el-input>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row  >
        <el-col :span="16" :offset="2">
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
    <!--选择人员-->
    <Modal
      close-on-click-modal="false"
      width="1000"
      v-model="selectUserModal"
      title="对话框标题"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <room-select-user v-if="selectUserModal" :sex="roomData.sex && roomData.sex.toUpperCase()" @cancel="closeSelectUser" :isOnlyOne="true" @setUsers="setUsers" :initUser="userList" :unSelect="Object.keys(selectRoom._userList)" :operaility-data="operailityData" :url="url"></room-select-user>
      <div slot="footer"></div>
    </Modal>
    <!--selectUser.vue-->
  </div>
</template>
<script>
  import roomSelectUser from './roomSelectUser.vue'
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','selectRoom','url','build','rules'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        fs:1,
        userName:[],//选择的人员
        userList:[],//选择人员传过来的数据，已经处理过，修改人员的时候再传过去
        selectUserId:{id:'selectUserId',title:'选择人员'},
        selectUserModal:false,
        //form表单bind数据
        formValidate: {
          buildId:this.build.id,        //大楼id
          roomId:this.selectRoom.id,        //房间ID
          userId:'',        //迁入人员ID
          userName:'',        //迁入人员姓名
          remark:'',        //备注
          inDateString:'',        //迁入时间
        },
        roomData:{},
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'immigration',
          successTitle:'迁入成功',
          errorTitle:'迁入失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            jsonString:true,       //使用Content-Type: application/json
            url:this.url.bedPersonAdd,
            method:'post',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.roomGet + this.selectRoom.id,
          }
        }
      }
    },
    created(){
      //初始化时间
      this.formValidate.inDateString = new Date();
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
          this.editMessTitle.ajaxParams.data =this.formDate(this.getFormData(this.formValidate),['inDateString'],this.yearMonthData) ;
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
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      closeSelectUser(){
        this.selectUserModal = false;
      },

      cancel(){
        this.$emit('cancel','immigration')
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
        this.ajax(this.listMessTitle);
      },


      openSelectUser(){
        this.selectUserModal = true;
      },
      //设置选择人员
      setUsers(users){
        const Residue = this.roomData.bedNum  - this.roomData.yetBedNum;
        let length = users&&users.length||0;

        if(Residue==0){
          this.showMess('入住人数已满')
          return
        }
        let userList = [];
        let userIds = [];
        let userNames = [];
        for(let i=0;i<length;i++){
          let userId = users[i].key;
          if(!this.isHas(userId)){
            userIds.push(userId);
            userNames.push(users[i].label);
            userList.push(users[i])
          }
        }

        this.userList = userList;
        this.formValidate.userId = userIds.join(',');
        this.formValidate.userName = userNames.join(',');
        this.closeSelectUser();
      },

      //验证所选人员是否存在
      isHas(userId){
        let flag = false;
        let userList=this.selectRoom._userList;
        if(userList[userId]){
          this.errorMess(`${userList[userId]} 已在此房间`) ;
          flag = true;
        }
        return flag
      },
    },
    components:{
      roomSelectUser
    }
  }
</script>
