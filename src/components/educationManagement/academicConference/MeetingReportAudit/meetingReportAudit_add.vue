<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/7
****--@author   yc
-->
<template>
  <div>
    <show :operaility-data="operailityData" @getHisProcess="getHisProcess"></show>
    <el-row v-if="hisProcess && hisProcess.hasSp">
      <br>
      <hr>
      <br>
      <el-form labelWidth="100px" :model="formValidate" ref="formValidate" :rules="rules">
        <el-col>
          <el-form-item label="审核结果：" prop="status">
            <el-radio-group v-model="formValidate.status">
              <el-radio v-for="(str,index) in hisProcess.commentTypes" :key="index" :label="str"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="意见：" prop="content">
            <el-input v-model="formValidate.content" type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                      placeholder="请输入意见"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <!-- 操作按钮 -->
      <el-col :span="6" :offset="6" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="6" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {meetingReportAudit as rules} from '../../rules';
  import show from '../MeetingReportWrite/meetingReportWrite_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        names: [],
        hisProcess: null, // 从show中获取（show获取之后返回到该组件）
        formValidate: {
          status: '', // 审核结果
          content: '', // 意见
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '',
          errorTitle: '',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
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
//          isLoadingFun(true);
          this.addMessTitle.successTitle = this.formValidate.status + '成功!';
          this.addMessTitle.errorTitle = this.formValidate.status + '失败!';
          this.addMessTitle.ajaxParams.url = api.add.path + this.hisProcess.taskId;
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

      // 获取审批数据
      getHisProcess(res){
        this.hisProcess = res
      },

      // 取消
      cancel(){
        this.$emit('cancel','add')
      },
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
