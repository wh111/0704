<!----------------------------------
****--@name    安排轮转审核(审核)
****--@role     ${*}
****--@date     2018/5/30
****--@author   gx
----------------------------------->
<template>
  <div>
    <show v-if="!type" :operailityData="operailityData" :podClass="podClass" :url="url"></show>
    <el-form ref="formValidate" :model="formValidate" class="form-inline lose-margin" label-width="80px">
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="审核结果">
            <el-radio-group v-model="formValidate.auditState">
              <el-radio label="PASS">通过</el-radio>
              <el-radio label="REJECT">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="审核意见">
            <el-input type="textarea" v-model="formValidate.reviewMess" :rows="6"
                      resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align: center;">
          <el-button type="success" @click="listenSubEvent">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  //当前组件引入全局的util
  import show from './arrangeRotaryRotationAudit_view.vue'

  let Util = null;
  export default {
    props: ['operailityData', 'url', 'podClass', 'type'],
    data() {
      return {
        //form表单bind数据
        formValidate: {
          auditState: "PASS",
          reviewMess: "",
        },
        //教研室设置时间添加
        saveCourseTitle: {
          type: this.type ? 'batchAudit' : 'audit',
          successTitle: '审核成功!',
          errorTitle: '审核失败!',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url[this.podClass ? 'auditZYYRotaryDataAudit' : 'auditDepRotaryDataAudit'].path + this.operailityData.id,
            method: this.url.auditDepRotaryDataAudit.method,
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      /**保存或者上报*/
      listenSubEvent() {
        let isSubmit = true;
        if (isSubmit) {
          let formValidate = this.$util._.defaultsDeep({}, this.formValidate);
          this.saveCourseTitle.ajaxParams.data = formValidate;
          this.ajax(this.saveCourseTitle);
        }
      },
      cancel() {
        this.$emit('audit', this.saveCourseTitle.type)
      }
    },
    created() {
    },

    mounted() {
    },
    components: {
      //当前组件引入的子组件
      show,
    }

  }
</script>
