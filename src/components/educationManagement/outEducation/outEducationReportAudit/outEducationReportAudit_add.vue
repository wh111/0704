<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <show :operailityData="operailityData" v-if="successData" :viewData="successData"></show>
    <div>
      <el-row style="margin: 10px 0">
        <el-col :span="18" :offset="2">
          <img :src="data.hisProcessReport.base64Img" alt="" style="max-width:100%">
        </el-col>
      </el-row>
      <!--审核历史-->
      <el-table
        v-if="data.hisProcessReport.listHisTaskLog && data.hisProcessReport.listHisTaskLog!=0"
        align="center"
        :height="200"
        :data="data.hisProcessReport.listHisTaskLog"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          align="center"
          prop="spUserName"
          label="审核人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="审核时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="mess"
          label="审核意见"
          align="center">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="status"
          label="审核状态"
        ></el-table-column>
      </el-table>

      <el-form v-if="data.hisProcessReport.hasSp" :model="formValidate" ref="formValidate" :rules="rules.leaveManagement"
               label-width="80px">
        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="审核结果" prop="reportStatus">
              <el-radio-group v-model="formValidate.reportStatus">
                <el-radio v-for="(item,index) in data.hisProcessReport.commentTypes" :key="index" :label="item"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="审核意见" prop="content">
              <el-input type="textarea" v-model="formValidate.content" :rows="6" resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row v-if="data.hisProcessReport.hasSp">
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../outEducationAntragWrite/api';
  import show from '../outEducationReportWrite/outEducationReportWrite_view.vue';
  import {outEducationReportAudit as rules} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        formValidate: {
          ids: this.operailityData.id,
          status: '',
          content: '',
          reportStatus: '',
        },

        successData: '',
        data: {
          hisProcessReport: {
            listHisTaskLog: [],
          },//
        },//当前组件默认请求(list)数据时,ajax处理的 基础信息设置 get
        listMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
          }
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '审核通过成功!',
          errorTitle: '审核通过失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.audit.path,
            method: api.audit.method
          }
        },
      }
    },
    methods:
      {
        //初始化请求列表数据
        init() {
          //给当前组件注入全局util
          Util = this.$util;
          this.ajax(this.listMessTitle)
        },
        /*
        * 点击提交按钮 监听是否提交数据
        * @param isLoadingFun boolean  form表单验证是否通过
        * */
        listenSubEvent(isLoadingFun) {
          let isSubmit = this.submitForm("formValidate");
          if (isSubmit) {
            if (!isLoadingFun) isLoadingFun = function () {
            };
            isLoadingFun(true)
            this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
            this.ajax(this.addMessTitle, isLoadingFun)
          }
        },
        /*
         * 点击提交按钮 监听是否验证通过
         * @param formName string  form表单v-model数据对象名称
         * @return flag boolean   form表单验证是否通过
         * */
        submitForm(formName) {
          let flag = false;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              flag = true;
            }
          });
          return flag;
        },
        /*
         * 获取表单数据
         * @return string  格式:id=0&name=aa
         * */
        getFormData(data) {
          let myData = Util._.defaultsDeep({}, data);
          return myData;
        },


        /*
         * 默认组件第一次请求数据
         * @param res JSON  数据请求成功后返回的数据
         * */
        SuccessGetCurrData(responseData) {
          this.successData = responseData;
          let data = responseData.data;
          if (data.hisProcessReport.commentTypes) {
            this.formValidate.reportStatus = data.hisProcessReport.commentTypes[0]
          } else {
            data.hisProcessReport.commentTypes = [];
          }
          this.data = data;
          this.addMessTitle.ajaxParams.url += data.hisProcessReport.taskId
        },

        //取消
        cancel(){
          this.$emit('cancel','add')
        }

      },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      show,
    }
  }

</script>
