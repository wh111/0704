<!----------------------------------
****--@name     课程审核(教育处)
****--@role     ${*}
****--@date     2018/5/25
****--@author   gx
----------------------------------->
<template>
  <div>
    <show :editOperailityData="operailityData" whereFrom="jysAudit"></show>
    <el-form label-width="90px">
      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="审核结果:" prop="disState">
            <el-radio-group v-model="formValidate.state">
              <el-radio class="radio" label="5">通过</el-radio>
              <el-radio class="radio" label="4">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="审核意见:">
            <el-input type="textarea" v-model="formValidate.reviewMess"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col :span="24">
        <div align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import show from '../syllabusManagement/syllabusManagement_edit.vue';
  import api from '../api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    name: 'staffRoomFineTuningReviewAudit',
    data() {
      console.log(this.operailityData);
      return {
        saveBtn: {title: '提交', callParEvent: 'listenSubEvent'}, //保存
        formValidate: {
          reviewMess: '',
          state: '5',
          courseTeachingResearchRoom: this.operailityData.courseTeachingResearchRoom,
          outlineId: this.operailityData.outlineId,
          weekSetId: this.operailityData.weekSetId,

        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        auditMessTitle: {
          type: 'audit',
          successTitle: '审核成功!',
          errorTitle: '审核失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.researchRoomReview.path,
            method: 'put',
            data: {},
          }
        },
      };
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
        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);
        let formValidate = this.formValidate;
        this.auditMessTitle.ajaxParams.data = formValidate;
        this.ajax(this.auditMessTitle, isLoadingFun)
      },
      cancel() {
        this.$emit('cancel', 'audit')
      }

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      show
    }
  };

</script>
