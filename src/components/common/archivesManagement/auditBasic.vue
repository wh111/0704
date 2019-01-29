<!--档案管理修改-->
<!--基本情况-->

<template>
  <div>
    <bks-basic-input v-if="thisUserType==='BKS'" :operailityData="formData" ref="BKS"></bks-basic-input>
    <jxs-basic-input v-if="thisUserType==='JXS'" :operailityData="formData" ref="JXS"></jxs-basic-input>
    <sxs-basic-input v-if="thisUserType==='SXS'" :operailityData="formData" ref="SXS"></sxs-basic-input>
    <yjs-basic-input v-if="thisUserType==='YJS'" :operailityData="formData" ref="YJS"></yjs-basic-input>
    <zyy-basic-input v-if="thisUserType==='ZYY'" :operailityData="formData" ref="ZYY"></zyy-basic-input>
    <other-basic-input v-if="thisUserType === 'OTHER'" :operailityData="formData" ref="OTHER"></other-basic-input>
    <br/>
    <el-row>
      <el-col :span="24" style="text-align: center;">
        <load-btn v-if="userInfo.auditStatus!='NOT_AUDIT'" @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>
        <load-btn v-if="userInfo.auditStatus!='NOT_AUDIT'" @listenSubEvent="subAndAudit" :btnData="loadBtnSub"></load-btn>
        <span v-if="userInfo.auditStatus=='NOT_AUDIT'" style="margin-right: 10px;color: #FF4949;">您的基本信息正在审核中……</span>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  let Util = null;
  import otherBasicInput from './archivesManagement_basic/other/input.vue'; // 其他人员
  import bksBasicInput from './archivesManagement_basic/s_bks/input.vue'; // 本科生
  import jxsBasicInput from './archivesManagement_basic/s_jxs/input.vue'; // 进修生
  import sxsBasicInput from './archivesManagement_basic/s_sxs/input.vue'; // 实习生
  import yjsBasicInput from './archivesManagement_basic/s_yjs/input.vue'; // 研究生
  import zyyBasicInput from './archivesManagement_basic/s_zyy/input.vue'; // 住院医
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData', 'fromWhere'],
    data() {
      return {
        // 当前登录人的角色
        thisUserType:'',
        //保存的类型,是否为上报审核
        saveType: "save",

        //学校
        selectOptions: {
          multiple: false, //是否多选
          url: "/schools/queryList"
        },
        isShowSlt: false,

        //保存按钮基本信息
        loadBtn:{title:'保存修改',callParEvent:'listenSubEvent'},
        loadBtnSub:{title:'上报审核',callParEvent:'listenSubEvent'},
        countDate: 0,
        //form表单bind数据
        formData: null,

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'saveDataSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/save/basic',
            method:'post',
            data:{}
          }
        },


        //上报审核
        auditMessTitle:{
          type:'edit',
          successTitle:'上报成功!',
          errorTitle:'上报失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/submit-audit',
            method:'put',
            data:{}
          }
        },


        //上报审核
        auditFrontEditMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'saveAuditFrontDataSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/save/basic',
            method:'post',
            data:{}
          }
        },


        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/archives/get/basic/'+this.operailityData.id
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
    },
    mounted(){
    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        let api = {
          ZYY:{
            get: '/user/getZYY/'+this.operailityData.id,
            edit: '/user/saveZYY',
          },
          SXS:{
            get: '/user/getSXS/'+this.operailityData.id,
            edit: '/user/saveSXS',
          },
        };
        let thisUserRole = this.$store.getters.getUserRolu.code;
        let isStudent = ['YJS','ZYY','JXS','SXS','BKS'].indexOf(thisUserRole) > -1;
        this.thisUserType = isStudent ? thisUserRole : "OTHER";
        console.log('用户类型:',this.thisUserType)
        //默认请求加载数据
        if(['ZYY','SXS'].indexOf(this.thisUserType) > -1){ // 实习生与住院医的资料接口初始化
          this.initMessTitle.ajaxParams.url = api[this.thisUserType].get;
          this.editMessTitle.ajaxParams.url = api[this.thisUserType].edit;
        }
        this.ajax(this.initMessTitle);
      },


      //上报审核
      subAndAudit(isLoadingFun){
        let data = this.$refs[this.thisUserType].getInputData();
        if(data) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.auditFrontEditMessTitle.ajaxParams.data = data;
          this.ajax(this.auditFrontEditMessTitle, isLoadingFun);
          console.log('上报')
        }
      },

      //上报审核前保存基本信息
      saveAuditFrontDataSuccess(responseData){
        this.ajax(this.auditMessTitle);
      },


      //保存修改--成功后回调
      saveDataSuccess(responseData){
          //this.$emit(messTitle.type, messTitle.type, messTitle.successTitle);
        this.successMess("信息修改成功!");
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saveCurrData(isLoadingFun){
        let data = this.$refs[this.thisUserType].getInputData();
        if(data) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = data;
          this.ajax(this.editMessTitle, isLoadingFun)
          console.log('保存')
        }
      },


      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        this.formData = responseData.data;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },



    },
    computed:{
      userInfo(){
        let info = this.$store.getters.getUserInfo || {};
        if (!Util.isEmptyObject(info)) {
          this.operailityData = info;
          if (this.isOnce) {
            if (!!info.auditStatus) {
              if (info.auditStatus != "AUDIT_SUCCESS") {
                this.archivesModal = true;
              }
              if (info.auditStatus == "NOT_SUBMIT") { //未提交
                this.currAuditStatus = "您的档案未提交,请先完善个人档案!";
              } else if (info.auditStatus == "NOT_AUDIT") { //未审核
                this.currAuditStatus = "您的档案审核中,请等待!";
              } else { //AUDIT_FAILURE  审核拒绝
                this.currAuditStatus = "您的档案审核拒绝,请检查并重新填写!";
              }
            }
          }
        }
        return info;
      }
    },
    components:{
      otherBasicInput,bksBasicInput,jxsBasicInput,sxsBasicInput,yjsBasicInput,zyyBasicInput,
    }
  }

</script>
