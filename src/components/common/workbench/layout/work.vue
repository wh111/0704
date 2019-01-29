<template>
  <!-- 工作台布局基础 -->
  <div class="userWork">
    <!-- 通知 -->
    <div class="uwNotice" v-if="!noNotice">
      <slot name="notice"></slot>
    </div>
    <!-- 操作区 -->
    <div class="uwTodoZone">
      <!-- 右侧快捷导航 -->
      <div class="uwRight" v-if="!noRight">
        <slot name="right"></slot>
      </div>
      <!-- 左侧区域 -->
      <div class="leftContent">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    // noNotice 不需要通知
    // noRight 不需要右侧
    props: ['noNotice', 'noRight'],
  }

</script>

<style lang="scss">
  @import"../../../../assets/ambuf/css/workbench_v1.0/work";

</style>
