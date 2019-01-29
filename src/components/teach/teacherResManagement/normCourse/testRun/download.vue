<template>
  <!-- 课程试运行 下载评估表 -->
  <div>
    <h3>课程“{{ operailityData.title }}”下载试运行评估表</h3>
    <el-form style="margin-top:20px;">
      <el-form-item>
        {{ fileData.oldName }} （{{ fileData.size | formatSize }}）
      </el-form-item>
    </el-form>
    <el-row>
      <el-col align="center">
        <a :href="downUrl">
          <el-button type="info" @click.stop="cancel">下载</el-button>
        </a>
        <el-button @click="cancel" style="margin-left:10px;">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from '../api';
  export default {
    props: ['operailityData'],
    data() {
      return {
        downUrl: '',
        fileData: {},
      }
    },
    methods: {
      getFiles() {
        let opt = {
          ajaxSuccess: res => {
            this.fileData = res.data;
            this.downUrl = this.$store.state.envPath.http + res.data.path
          },
          ajaxParams: {
            url: api.getFile.path + this.operailityData.assessmentFileId,
            method: api.getFile.method,
          }
        };
        this.ajax(opt)
      },
      cancel() {
        this.$emit('cancel', 'testRun')
      },
    },
    created() {
      this.getFiles()
    },
  }

</script>
