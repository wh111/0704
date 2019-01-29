<!----------------------------------
****--照片墙(uploadPhotoWall)
****--@date     2017/5/26
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div class="uploadPhotoWall" :class="{'show':show}">
    <el-upload
      :action="action"
      list-type="picture-card"
      :file-list="fileLists"
      :on-preview="handlePictureCardPreview"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-error="onError"
      :headers="headers"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog v-model="dialogVisible" size="tiny" :modal="false">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<style lang="scss">
  .uploadPhotoWall {
    &.show {
      .el-upload {
        display: none;
      }
      span.el-upload-list__item-delete {
        display: none;
      }
    }
  }
</style>
<script>
  import config from '../../config/config.js';

  export default {
    props: ['actionUrl', 'imgFile', 'index', 'fileList', 'onlyOnePic', 'show'],
    data () {
      return {
        action: '/file/upload',
        loading: false,
        dialogImageUrl: '',
        dialogVisible: false,
        idx: 0,
        fileLists: [],
        headers: '',
      };
    },
    watch: {
      fileList: function (val, oldVl) {
        this.fileLists = val || [];
      },
    },
    created () {

      if (typeof this.actionUrl != 'undefined') {
        this.action = this.actionUrl;
      }
      if (typeof this.index != 'undefined') {
        this.idx = this.index;
      }
      if (typeof this.fileList != 'undefined') {
        this.fileLists = this.fileList;
      }
      this.action = config.ajaxUrl + this.action;
      this.headers = {
        'Token': this.$util.getCookie('Token'),
      }
    },
    methods: {
      /*
       * 上传成功后处理
       * */
      handleAvatarSuccess (res, file, fileList) {
        if (res.status.code != 0) {
          this.errorMess(res.status.msg);
          fileList.length = fileList.length - 1;
          return;
        }
        if (this.onlyOnePic) {
          if (fileList.length > 1) {
            fileList.shift();
          }
        }
        this.$emit('upladSuccess', this.handleResData(fileList), this.idx, fileList);
      },
      handleRemove (file, fileList) {
        this.$emit('upladSuccess', this.handleResData(fileList), this.idx, fileList);
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      //处理server返回的数据

      handleResData (fileList) {
        let tempArr = [];
        for (var i = 0, item, obj; i < fileList.length; i++) {
          item = fileList[i];
          let imgSrc = item.url;
          let staticUrl = item.url;
          if (typeof item.response != 'undefined') {
            imgSrc = item.response.data.relativePathFile;
            staticUrl = item.response.data.staticUrl;
          }
          obj = {
            src: imgSrc,
            staticUrl: staticUrl,
          }
          tempArr.push(obj);
        }
        return tempArr;
      },
      /*
       * 上传前校验
       * */
      beforeAvatarUpload (file) {
        const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/jpg') || (file.type === 'image/png') || (file.type === 'image/gif');
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$Notice.warning({
            title: '只能上传图片',
            desc: '格式为: JPG、png、gif 格式!',
          });
        }
        if (!isLt2M) {
          this.$Notice.warning({
            title: '超出文件大小限制',
            desc: '文件 ' + file.name + ' 太大，不能超过 2MB!',
          });
        }
        return isJPG && isLt2M;
      },

      onError (error, file, fileList) {
        //文件上传失败时的钩子，返回字段为 error, file, fileList
        this.$Notice.warning({
          title: '上传失败',
        });
      },
    },
  }
</script>
