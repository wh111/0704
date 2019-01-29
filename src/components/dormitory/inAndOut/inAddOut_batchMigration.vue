<!--批量迁出-->
<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules.inAndOut"  class="demo-form-inline" label-width="90px" >

      <el-row >

        <el-col :span="8" :offset="2">
          <el-form-item label="房间号:"  >
            {{roomData.no}}
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="迁出时间:" prop="inDateString" >
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
        <el-col :span="16" :offset="2">
          <el-form-item label="姓名:" >
            <el-checkbox-group v-model="userIds">
              <el-checkbox v-for="(item,index) in userIdList" :key="index" :label="item">{{selectRoom._userList[item]}}</el-checkbox>
            </el-checkbox-group>
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
  </div>
</template>
<script>
  //当前组件引入全局的util
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
          roomId:this.selectRoom.id,        //房间ID
          userIds:'',        //迁出人员ID
          remark:'',        //备注
          outDateString:'',        //迁入时间
        },
        userIds:[],    //选中的迁出人员数组id
        userIdList:[],//待选人员数组id列表
        roomData:[], //获取到的房间信息
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'batchMigration',
          successTitle:'批量迁出成功',
          errorTitle:'批量迁出失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            jsonString:true,       //使用Content-Type: application/json
            url:this.url.bedPersonModifyList,
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
        }
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
      //处理当前房间的人员id
      this.userIdList=this.extractUsers(this.selectRoom._userList);
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
          this.formValidate.userIds = this.userIds.join(',');
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
        this.$emit('cancel','batchMigration')
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

      //提取人员id obj=>arr
      extractUsers(users){
        return Object.keys(users)

      },
    }
  }
</script>
