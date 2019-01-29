<template>
  <!-- 试运行评估表 -->
  <div class="nTREInfo">
    <upload-file @setUploadFiles="setUploadFiles" :uploadFiles="filelist" url="/"></upload-file>
  </div>
</template>

<script>
  import {
    plan as rules
  } from '../rules';
  import uploadFile from '../../../../common/uploadFile'; // 上传
  export default {
    data() {
      return {
        rules, // 验证输入规则
        filelist: [],
      }
    },
    methods: {
      // 初始化
      init() {
        // this.evaluate = this.$store.state.curriculum.data.evaluate;
      },
      /******************************************** 弹窗回调 ***************************************/
      // 上传评估表
      setUploadFiles(id, list) {
        this.formValidate.fileIds = id;
      },
      // 添加评价项
      addEvaluate(type) {
        this.$store.commit('curriculum/data/addEvaluate', type)
      },
      // 删除评价项
      removeEvaluate(type, delIndex) {
        this.$store.commit('curriculum/data/removeEvaluate', {
          type,
          delIndex
        })
      },
      /******************************************** 数据提交 ***************************************/
      /******************************************** 数据提交 ***************************************/
      // 保存
      saveToStore() {
        if (!this.checkData()) {
          return false;
        }
        return true
      },
      // 检测数据完整性
      checkData() {
        let flag = true;
        return flag;
      },
    },
    components: {
      uploadFile,
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 试运行评估表 */

  .nTREInfo {
    // padding-left: 16px;
  }

</style>
