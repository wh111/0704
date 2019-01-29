<template>
  <!-- 课程试运行 -->
  <div>
    <h3>请给课程“{{ operailityData.title }}”上传试运行评估表</h3>
    <upload-file :length="1" @setUploadFiles="setUploadFiles" :uploadUrl="api.upload" :size="2097152" style="margin-top:20px;"></upload-file>
    <el-row style="margin-top:20px;">
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
  import api from '../api';
  import uploadFile from '../../../../common/uploadFile';
  export default {
    props: ['operailityData'],
    data() {
      return {
        api,
        assessmentFileId: '', // 试运行评估表(附件表ID)
        //保存按钮基本信息
        loadBtn: {
          title: '确定',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'testRun',
          successTitle: '试运行成功!',
          errorTitle: '试运行失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.operation.path + this.operailityData.id,
            method: api.operation.method
          }
        },
      }
    },
    methods: {
      // 上传文件
      setUploadFiles(upObj, fileList) {
        this.assessmentFileId = fileList[0].response.data.id
      },
      // 取消
      cancel() {
        this.$emit('cancel', 'testRun')
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if (!this.assessmentFileId) {
          this.errorMess('请上传试运行评估表！')
          return
        }
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        this.addMessTitle.ajaxParams.data = {
          assessmentFileId: this.assessmentFileId
        };
        this.ajax(this.addMessTitle, isLoadingFun)
      }
    },
    components: {
      uploadFile
    },
  }

</script>
