<!----------------------------------
****--@name     批量审核
****--@role     ${*}
****--@date     2018/5/28
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form ref="formValidate" label-width="80px">
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="审核结果">
            <el-radio-group v-model="formValidate.courseArrangeState">
              <el-radio label="PASS">通过</el-radio>
              <el-radio label="REJECT">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="审核意见">
            <el-input type="textarea" v-model="formValidate.reviewMess" :rows="6"
                      resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'url', 'type'],
    data() {
      return {
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        formValidate: {
          courseArrangeState: 'PASS',
          reviewMess: '',
          type: this.type
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        auditMessTitle: {
          type: 'batchAudit',
          successTitle: '审核成功',
          errorTitle: '审核失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: this.url.review.path + this.operailityData.ids,
            method: 'put',
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        console.log(this.url);
      },
      /*
      * 点击提交按钮 监听是否提交数据
      * @param isLoadingFun boolean  form表单验证是否通过
      * */
      listenSubEvent(isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);
        this.auditMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        this.ajax(this.auditMessTitle, isLoadingFun)
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        return this.$util._.defaultsDeep({}, data);
      },
      cancel() {
        this.$emit('cancel', 'batchAudit')
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }
</script>
