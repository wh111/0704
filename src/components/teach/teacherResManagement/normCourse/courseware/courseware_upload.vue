<template>
  <!-- 课件上传 -->
  <div>
    <upload-file @setUploadFiles="setUploadFiles" :uploadUrl="api.upload" :size="2097152"
                 accept="doc|docx|xls|xlsx|ppt|pptx|pdf|mp4|webm|ogg"></upload-file>
    <el-row style="margin-top:20px;">
      <el-col :span="6" :offset="6" align="center">
        <el-button type="info" @click="save">确定</el-button>
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
        uploadData: [], // 上传附件
      }
    },
    methods: {
      // 上传文件
      setUploadFiles(upObj, fileList) {
        console.log(fileList);
        this.uploadData=fileList;
      },
      // 取消
      cancel() {
        this.$emit('cancel', 'upload')
      },
      // 保存
      save() {
        if (!this.uploadData.length) {
          this.showMess('请上传文件并等待其上传完成之后再操作')
          return
        }
        this.$emit('upload', this.uploadData, this.operailityData)
      },
    },
    components: {
      uploadFile
    },
  }

</script>
