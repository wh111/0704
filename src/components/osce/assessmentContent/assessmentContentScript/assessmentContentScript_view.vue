<template>
  <!-- 查看剧本 -->
  <el-form :model="formValidate" ref="formValidate">
    <el-row>

      <el-col :span="8" :offset="8" align="center">
        <el-form-item>{{ formValidate.scriptName }}</el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="剧本附件：">
          <div style="overflow:hidden">
            <upload-file @setUploadFiles="setUploadFiles" :uploadFiles="filelist" class="viewUploadFile"></upload-file>
          </div>
          <!--<p v-else style="line-height:36px;">暂无剧本附件</p>-->
        </el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="剧本简介：">{{ formValidate.scriptContent }}</el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="病情要点：">{{ formValidate.illnessPoints }}</el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="表演要点：">{{ formValidate.performPoints }}</el-form-item>
      </el-col>

    </el-row>
  </el-form>
</template>

<script>
  import uploadFile from '../../../common/uploadFile'; // 上传
  export default {
    props: {
      urlParams: { // api对象
        type: Object,
        required: true
      },
      id: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        filelist: [],
        formValidate: {
          scriptName: "-",
          scriptContent: "-",
          illnessPoints: "-",
          performPoints: "-",
          fileList: []
        }
      }
    },
    methods: {
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: `${this.urlParams.path}/${this.id}`,
            method: this.urlParams.method
          }
        })
      },
      getDataSuccess(res) {
        this.formValidate = res.data; // 初始化编辑数据
        this.filelist = [];

        for (let i = 0, list = res.data.fileList, l = list.length; i < l; i++) {
          this.filelist.push({
            fileId: list[i].id,
            fileName: list[i].oldName,
            filePath: list[i].path + list[i].name
          })
        }
      },
      setUploadFiles(list) {},
      /*
       * 组件初始化入口
       * */
      init() {
        // 获取编辑数据
        this.getDataForServer();
      },
    },
    created() {
      this.init();
      // console.log(this.id);
    },
    components: {
      uploadFile
    },
  }

</script>

<style lang="scss">
  .viewUploadFile {
    .el-upload__tip,
    .el-upload {
      display: none
    }
    .el-upload-list__item:hover {
      .el-icon-close {
        display: none
      }
      .el-upload-list__item-status-label {
        display: inline-block;
      }
    }
  }

</style>
