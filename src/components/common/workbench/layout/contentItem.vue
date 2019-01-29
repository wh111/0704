<template>
  <!-- 项目内容 -->
  <div class="contentItem">
    <div class="ctTitle">
      <slot name="title"></slot>
    </div>
    <div class="ctContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {

  }

</script>

<style lang="scss">
  @import"../../../../assets/ambuf/css/workbench_v1.0/var";
  /* 内容项 */

  .contentItem {
    padding: $paddingSize;
    &~& {
      border-top: $mdBorderSize solid $mdBorderColor;
    }
    .ctTitle {
      &::after {
        content: ' ';
        clear: both;
      }
      border-bottom: $smallBorderSize solid $mdBorderColor;
    }
    .ctContent {
      padding-top: 10px;
    }
  }

</style>
