<!--
****--照片墙(uploadPhotoWall)
-->
<template>
  <div :class="{'rUFShow':show}">
    <el-upload :action="action" list-type="picture-card" :file-list="fileLists" :headers="headers" :on-preview="handlePictureCardPreview"
      :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog v-model="dialogVisible" size="tiny" :modal="false">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import config from '../../../config/config.js';
  export default {
    props: ["actionUrl", "imgFile", "index", "fileList", "onlyOnePic", "show"],
    data() {
      return {
        headers: {},
        action: "/file/upload",
        loading: false,
        dialogImageUrl: '',
        dialogVisible: false,
        idx: 0,
        ids: [],
        fileLists: []
      };
    },
    watch: {
      fileList: function (val, oldVl) {
        this.fileLists = val || [];
      }
    },
    created() {
      //设置请求头部
      this.headers = {
        "Token": this.$util.getCookie("Token")
      }
      if (typeof this.actionUrl != "undefined") {
        this.action = this.actionUrl;
      }
      if (typeof this.index != "undefined") {
        this.idx = this.index;
      }
      if (typeof this.fileList != "undefined") {
        this.fileLists = this.fileList;
      }
      this.action = config.ajaxUrl + this.action;
    },
    methods: {
      /*
       * 上传成功后处理
       * */
      handleAvatarSuccess(res, file, fileList) {
        if (this.onlyOnePic) {
          if (fileList.length > 1) {
            fileList.shift();
          }
        }
        this.handleResData(fileList);
      },
      handleRemove(file, fileList) {
        this.handleResData(fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      //处理server返回的数据
      handleResData(fileList) {
        this.ids = [];
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response) {
            fileList[i].name = fileList[i].response.data;
          }
          this.ids.push(fileList[i].name)
        }
        this.$emit("upladSuccess", this.ids.join(','));
      },
      /*
       * 上传前校验
       * */
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/jpg') || (file.type === 'image/png') || (
          file.type === 'image/gif');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$Notice.warning({
            title: '只能上传图片',
            desc: '格式为: JPG、png、gif 格式!'
          });
        }
        if (!isLt2M) {
          this.$Notice.warning({
            title: '超出文件大小限制',
            desc: '文件 ' + file.name + ' 太大，不能超过 2MB!'
          });
        }
        return isJPG && isLt2M;
      },
    }
  }

</script>
<style lang="scss">
  .rUFShow {
    .el-upload,
    .el-upload-list__item-actions span.el-upload-list__item-delete {
      display: none;
    }
  }

</style>
