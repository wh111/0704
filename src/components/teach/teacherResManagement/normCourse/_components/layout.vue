<template>
  <!-- 布局基础 -->
  <div class="tvmInfoMain" ref="tvmInfoMain">
    <div class="tvmInfoBox" :style="{'height':tvmInfoBoxHeight}">
      <div class="tvmInfoleft">
        <div class="tvmInfMenuTop" ref="tvmInfMenuTop">
          <slot name="menuTop"></slot>
        </div>
        <div class="tvmInfoMenu">
          <slot name="menu"></slot>
        </div>
      </div>
      <div class="tvmInfoRight">
        <div class="tvmInfoTitle">
          <slot name="title"></slot>
        </div>
        <div class="tvmInfoContent">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="tvmInfoFooter" ref="tvmInfoFooter">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  /**
   * 属性 displayfooter 不显示底部
   */
  export default {
    // 是否是编辑模式
    props: ['isEdit'],
    data () {
      return {
        tvmInfoBoxHeight: '100%'
      };
    },
    methods: {
      getContentHeight () {
        if (this.isEdit) {
          let main = this.$refs.tvmInfoMain.offsetHeight;
          let footer = this.$refs.tvmInfoFooter.offsetHeight;
          let tvmInfMenuTop = this.$refs.tvmInfMenuTop.offsetHeight;
          this.tvmInfoBoxHeight = main - footer + 'px';
        }
      }
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, 'resize', this.getContentHeight);
      });
    }
  };

</script>

<style lang="scss">
  /* 布局基础 */
  $menuWidth: 210px;
  $borderColor: #d1dbe5;
  $padding: 16px;
  .tvmInfoMain {
    margin: -$padding;
    &[displayfooter] {
      .tvmInfoFooter {
        display: none;
      }
      .tvmInfoTitle {
        left: 0;
      }
    }
  }

  .tvmInfoBox {
    width: 100%;
    height: 100%; // min-height: 500px;
    overflow: hidden;
    position: relative;
    &::before {
      content: ' ';
      width: 1px;
      height: 100%;
      background-color: $borderColor;
      position: absolute;
      left: $menuWidth - 1;
      top: 0;
      bottom: 0;
      z-index: 1;
    }
    &::after {
      content: ' ';
      clear: both;
    }
  }

  .tvmInfoleft {
    // 左侧
    width: $menuWidth;
    border-right: 1px solid $borderColor;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
  }

  .tvmInfoRight {
    // 右侧
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    padding: $padding;
    padding-left: $menuWidth + $padding; // position: relative;
  }

  .tvmInfoFooter {
    // 底部
    padding: $padding;
    border-top: 1px solid $borderColor;
  }

  .tvmInfMenuTop {
    // 菜单顶部
    img {
      width: 100%;
      height: 168px;
    }
    &:not(:empty) ~ .tvmInfoMenu {
      top: 168px;
    }
  }

  .tvmInfoMenu {
    // 菜单
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
  }

  .tvmInfoTitle {
    // 课程标题
    font-size: 20px; // line-height: 88px;
    // height: 88px;
    // width: 100%;
    color: #20A0FF;
    text-align: center;
    padding: 26px 0;
    background-color: #fff;
    z-index: 100;
    position: absolute;
    top: 0;
    left: $menuWidth + $padding;
    right: $padding;
    border-bottom: 1px solid $borderColor;
    &:empty {
      height: 0;
      padding: 0;
      border: none;
    }
    &:not(:empty) ~ .tvmInfoContent {
      padding-top: 70px;
    }
  }

  .tvmInfoContent {
    // 内容区域
    height: 100%;
    position: relative;
    /*z-index: 1;*/
  }

  /*
   * 查看时的样式
   */

  .contentTitleBox {
  }

</style>
