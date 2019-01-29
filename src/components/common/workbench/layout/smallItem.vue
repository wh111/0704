<template>
  <!-- 小项目 -->
  <div class="smallItem">
    <slot></slot>
  </div>
</template>

<style lang="scss">
  @import"../../../../assets/ambuf/css/workbench_v1.0/var";
  /* 小项目 */

  .smallItem {
    padding: $smallPaddingSize;
    &~& {
      border-top: $smallBorderSize solid $mdBorderColor;
    }
  }

</style>
