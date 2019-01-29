<!----------------------------------
****--新建答辩汇总(respondentSummarizing_add)
****--@date     2017/9/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>

  <div>
    <el-form ref="formValidate" :model="formValidate" :rules="rules"  class="demo-form-inline" label-width="100px">
      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="答辩时间:" prop="defenseTime">
            <el-date-picker
              :editable="false"
              v-model="formValidate.defenseTime"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label=" 答辩地点:" prop="defensePlace">
            <el-input v-model="formValidate.defensePlace" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="答辩人员:" prop="summaryUserList">
            <div class="itemLayout" style="width: 100%">
              <fieldset>
                <legend style="font-size:16px"> 添加人员 <el-button  type="primary" size="mini" @click="addUser" icon="plus"></el-button>&nbsp;&nbsp;</legend>
                <span v-for="(item,index) in formValidate.summaryUserList" :key="index" class="userName"><em class="nameText">{{item.userName}}</em><el-button type="danger" @click="removeUser(index)" size="mini" icon="close"></el-button></span>

              </fieldset>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24">
        <div style="text-align: center;">
          <load-btn @listenSubEvent="save" :btnData="loadBtn"></load-btn>
          <load-btn @listenSubEvent="saveReportedEvent" :btnData="saveReported"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
    <!--增加弹窗-->
    <Modal
      :mask-closable="false"
      v-model="selectUserModal"
      height="400"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="960">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="selectUserModal"  @cancel="cancelSetDep" @setUsers="setUsers" :operaility-data="formValidate.summaryUserList"></add>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import {respondentReply as rules} from "../rules.js";
  import add from "./respondentSummarizing_selectUsers.vue";
  import api from "../api.js";
  //当前组件引入全局的util
  let Util=null;
  export default {
    props:["operailityData"],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        saveReported:{title:'上报',callParEvent:'listenSubEvent'},

        /*--按钮button--*/
        addId:{
          id:'add',
          title:'选择人员'},
        selectUserModal:false,

        //form表单bind数据
        formValidate: {
          "defenseTime":"",   //答辩时间
          "defensePlace":"",  //答辩地点
          "status":"WSB",            //状态
          "summaryUserList":[        //答辩人员
            /*{
              "userId":"申请人id",
              "userName":"申请人名字"
            }*/
          ]
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
//            url:api.defenseSummaryModify.path,
            method:api.defenseSummaryModify.method,
            jsonString:true,
            data:{},
          }
        },
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:api.defenseSummaryGet.path+this.operailityData.id,
            params:{}
          }
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      this.init()
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{
      //通过get请求列表数据
      updateListData(responseData){
        if(!responseData.data)return;
        this.formValidate = responseData.data;
      },


      /*
       * 保存或上报按钮会调用这个公共函数
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          let formValidate = this.getFormData(this.formValidate);
          formValidate = this.formDate(formValidate,['defenseTime'],'yyyy-MM-dd HH:mm');
          this.editMessTitle.ajaxParams.data = formValidate;
          this.ajax(this.editMessTitle,isLoadingFun)
        }
      },

      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers(users){
        this.formValidate.summaryUserList = users;
        this.closeUserModal();
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      cancelSetDep(options){
        this[options+'Modal'] = false;
      },

      //添加人员
      addUser(){
        this.openModel('selectUser');
      },

      //关闭选择人员弹窗
      closeUserModal(){
        this.selectUserModal = false;
      },

      //删除人员
      removeUser(index){
        this.formValidate.summaryUserList.splice(index,1)
      },

      //保存 改变url
      save(isLoadingFun){
        this.editMessTitle.ajaxParams.url = api.defenseSummaryModify.path+this.operailityData.id;
        this.formValidate.status = "WSB";
        this.listenSubEvent(isLoadingFun);
      },

      //保存上报 改变url
      saveReportedEvent(isLoadingFun){
        this.editMessTitle.ajaxParams.url = api.defenseSummaryModify.path+this.operailityData.id;
        this.formValidate.status = "DSH";
        this.listenSubEvent(isLoadingFun);
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.editMessTitle  .type);
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
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
        //请求科室数据
        this.ajax(this.listMessTitle)
      },

    },
    components:{
      add
    }
  }
</script>
