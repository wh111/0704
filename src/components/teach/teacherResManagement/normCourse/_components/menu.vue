<template>
  <!-- 菜单 -->
  <div class="trmMenuItem" @click="menuClick">
    <span class="trmmText"><slot></slot></span>
  </div>
</template>

<script>
  export default {
    props: ['name'],
    methods: {
      menuClick() {
        this.$emit('click', this.name)
      }
    }
  }

</script>

<style lang="scss">
  /* 菜单 */

  $menuWidth:150px;
  $borderColor:#d1dbe5;
  $menuHeight:44px;
  $padding:16px;
  .trmMenuItem {
    height: $menuHeight;
    padding-left: $padding;
    cursor: pointer;
    &.active {
      // 激活状态
      color: #FFF;
      background: #20A0FF;
      &::before {
        background-image: url(~@/assets/ambuf/images/study/menu_active.png);
      }
    }
    &:not(.active):hover {
      // 鼠标划过状态
      color: #20A0FF;
    }
    &::before {
      // 小图标
      content: ' ';
      width: 14px;
      height: 14px; // background-color: #ccc;
      margin-top: 15px;
      margin-right: 10px;
      display: block;
      float: left;
      background-image: url(~@/assets/ambuf/images/study/menu_default.png);
    }
    .trmmText {
      line-height: $menuHeight;
      font-size: 14px;
    }
    &~& {
      border-top: 1px solid $borderColor;
    }
  }

</style>
