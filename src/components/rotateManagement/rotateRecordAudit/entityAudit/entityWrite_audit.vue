<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="entityAudit" class="demo-form-inline" label-width="90px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="科室:" prop="name">
            {{formValidate.depName}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="病人姓名:" prop="phone">
            {{formValidate.patientName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="病历号:" prop="phone">
            {{formValidate.patienNo}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="日期:" prop="phone">
            {{formValidate.fillTime}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="病种名称:" prop="name">
            {{formValidate.deName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="主要诊断:" prop="name">
            <el-input type="textarea" readonly v-model="formValidate.mainDiagnosis"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="次要诊断:" prop="name">
            <el-input type="textarea" readonly v-model="formValidate.secondaryDiagnosis"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="是否主管:" prop="name">
            {{formValidate.isDirector | typeText}}
          </el-form-item>
        </el-col>
      </el-row>

      <!--<el-row >-->
      <!--<el-col :span="16" :offset="2">-->
      <!--<el-form-item label="是否抢救:" prop="name" >-->
      <!--{{formValidate.isRescue | typeText}}-->
      <!--</el-form-item>-->
      <!--</el-col >-->
      <!--</el-row >-->

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="转归情况:" prop="situation">
            <el-input type="textarea" readonly v-model="formValidate.situation"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="相关证明材料:" prop="name">
            <upload-file :uploadFiles="formValidate.fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <!--审核信息-->
      <!--审核历史列表-->
      <el-table
        v-if="formValidate.reviewMess && formValidate.reviewMess[0]"
        align="center"
        :height="200"
        :data="formValidate.reviewMess"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createUserName"
          label="审核人"
          width="200">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="审核时间"
          width="300">
        </el-table-column>
        <el-table-column
          prop="reviewMess"
          label="审核意见"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="spState"
          label="审核状态"
        >
          <template scope="scope">
            {{ scope.row.spState | typeText}}
          </template>
        </el-table-column>
      </el-table>
      <el-row>

        <!--审核项-->
        <el-col :span="8" :offset="2">
          <el-form-item label="创建人:" prop="name">
            {{formValidate.createUserName}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="创建时间:" prop="phone">
            {{formValidate.createTime}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="审核结果:" prop="disState">
            <el-radio-group v-model="formValidate.disState">
              <el-radio class="radio" label="PASS">通过</el-radio>
              <el-radio class="radio" label="REJECT">未通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="审核意见:" prop="reviewMess">
            <el-input type="textarea" v-model="reviewMess"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col :span="16" :offset="2">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from '../api'
  import {entityAudit} from '../rules'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        entityAudit,
        disTitle: [],

        reviewMess: "",
        getMyRotaryRequirements: [],
        optionData: '',
        depUrl: '',
        //保存按钮基本信息
        saveBtn: {title: '提交', callParEvent: 'listenSubEvent'}, //保存
        //form表单bind数据
        formValidate: {
//          patientName:'',        //病人姓名·
//          patienNo:'',     //病历号
//          fillTime:'',       //填写时间(yyy-MM-dd HH:mm:ss)
//          poddIds:[],      //病种ID(多个逗号分隔)
//          poddNames:'',      //病种名(多个逗号分隔)
//          mainDiagnosis:'',      //主要诊断
//          secondaryDiagnosis:'',      //次要诊断
//          fileIds:'',      //附件IDs(多个逗号分隔)
//          podId:'',      //病种名(多个逗号分隔)
//          isDirector:'',      //是否主管
//          isRescue:'',      //是否抢救
//          situation:'',      //转归情况
//          "diseaseId":12,
//          "depId":12,
//          "depName":"111",
//          "disState":"NO_SUBMIT",
//          "createUserName":"填写人名称",
//          "deId":1,
//          "deName":"病种名称",
//          "createTime":"2017-05-08 12:00:00",
//          "fileList":[
//            {
//              "id":11,
//              "fileName":"123",
//              "fileType":"txt",
//              "fileUrl":"www.baidu.com"
//            }
//          ]
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'audit',
          successTitle: '审核成功!',
          errorTitle: '审核失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.diseaseRecordManageModifyState + this.operailityData.diseaseId,
            method: 'post',
            data: {},
          }
        },
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '',  //向后台请求数据的地址

          }
        },
        getMessTitle: {
          ajaxSuccess: 'getListData',
          ajaxParams: {
            url: api.diseaseRecordGet + this.operailityData.diseaseId,  //向后台请求数据的地址

          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      let userInfo = this.$store.getters.getUserInfo;
      this.listMessTitle.ajaxParams.url = api.userRotaryDeptlist + 'SXS-' + userInfo.id;
      this.ajax(this.getMessTitle);
    },
    mounted() {
      //暂时没有初始化,预留初始化入口
    },
    methods: {
      getListData(res) {
        let data = res.data;
        if (!data) return;
        this.formValidate = data;
        this.formValidate.disState = 'PASS';
        this.formValidate.reviewMess = '';
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
          isLoadingFun(true);
//          reviewMess
          let formValidate = this.getFormData(this.formValidate);
          formValidate.reviewMess = this.reviewMess;
          this.addMessTitle.ajaxParams.data = formValidate;
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
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
       * 组件初始化入口
       * */
      init() {
        //this.ajax(this.listMessTitle)
      },

      //轮转科室改变重新获取病种名称
      podIdChange(val) {
        let listMessTitle = {
          ajaxSuccess: 'podIdChangeListData',
          ajaxParams: {
            url: api.getMyRotaryRequirements + 'bz-' + val,
          }
        }
        this.ajax(listMessTitle)

      },

      podIdChangeListData(res) {
        let data = res.data;
        if (!data) return;
        this.getMyRotaryRequirements = data

      },


      expenseFileEvent(ids) {
        this.formValidate.fileIds = ids;
      },
    }
  }
</script>
