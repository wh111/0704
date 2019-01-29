<template>
  <!-- 加载动画 -->
  <div class="el-loading-spinner">
    <svg viewBox="25 25 50 50" class="circular">
      <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
    </svg>
    <p class="el-loading-text">拼命加载中</p>
  </div>
</template>

<script>
  export default {
    methods: {
      saveToStore() {
        this.$notify({
          title: '提示',
          message: '请等待数据加载完成再操作',
          type: 'warning'
        });
        return false
      }
    }
  }

</script>

<style>
  /* 加载动画 */

</style>
