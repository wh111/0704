<template>
  <div class="CentralFeedback_view">
    <el-form label-width="90px">
      <el-form-item label="反馈名称：">{{ showData.feedbackName || '-'}}</el-form-item>
      <el-form-item label="反馈内容：">{{ showData.feedbackContent || '-'}}</el-form-item>
      <el-form-item label="图片：">
        <div v-if="showData.imgList instanceof Array && showData.imgList.length" class="centralFeedbackImgBox">
          <img v-for="(item,index) in showData.imgList" :key="index" :src="getPhotoPath(item.thumbnailPath)" alt="">
        </div>
        <div v-else>暂无图片</div>
      </el-form-item>
      <el-form-item label="回复列表：">
        <el-table v-if="showData.replyList" :data="showData.replyList" height="250" border style="width: 100%">
          <el-table-column
            prop="replyContent"
            label="回复内容"
            width="180">
          </el-table-column>
          <el-table-column
            prop="replyTime"
            label="回复时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="responderName"
            label="回复人">
          </el-table-column>
        </el-table>
        <div v-else>
          暂无回复
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
  import api from './api'

  export default {
    props: ['operailityData'],
    data() {
      return {
        showData: {},
        path: ''
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.path = this.$store.getters['']
        let opt = {
          ajaxSuccess: res => {
            this.showData = res.data || {};
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        }
        this.ajax(opt)
      },
      //获取图片地址，并进行处理
      getPhotoPath(path) {
        return path && this.$store.getters.getEnvPath.http + path
        // return path
      },
    }
  }
</script>
<style lang="scss">
  .centralFeedbackImgBox {
    img {
      margin: 5px
    }
  }
</style>
