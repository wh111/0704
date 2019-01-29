<!--档案审核-->
<template>
  <div>
    <show :operaility-data="operailityData"></show>
    <br />
    <fieldset class="layui-elem-field layui-field-title" style="margin-top: 50px;"></fieldset>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form ref="formValidate" :model="formValidate" label-width="80px">
          <el-form-item label="审核结果" prop="auditStatus">
            <el-radio-group v-model="formValidate.auditStatus">
              <el-radio label="AUDIT_SUCCESS">通过</el-radio>
              <el-radio label="AUDIT_FAILURE">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见" prop="desc">
            <el-input type="textarea" v-model="formValidate.reason"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="10" :offset="10">
              <load-btn @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>
              <el-button @click="cancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  /*引入查看的子组件*/
  import show from "../archivesManagement/archivesManagement_view.vue";

  let Util = null;
  export default {
    props:["operailityData"],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'确定',callParEvent:'listenSubEvent'},
        activeName: 'first',
        formValidate: {
          archivesId:this.operailityData.id,
          auditStatus: 'AUDIT_SUCCESS',
          reason: ''
        },
        currentView: 0,
        //当前组件提交(audit)数据时,ajax处理的 基础信息设置
        auditMessTitle:{
          type:'audit',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/audit',
            method:'post'
          }
        },
      };
    },
    created(){
      Util = this.$util;

    },
    methods: {
      saveCurrData(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.auditMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.auditMessTitle, isLoadingFun)
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


      cancel(){
        this.$emit('cancel',this.auditMessTitle.type);
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },


      handleClick(tab, event) {
        this.currentView = tab["index"];
      },
    },
    components:{
      show
    }
  };
</script>


