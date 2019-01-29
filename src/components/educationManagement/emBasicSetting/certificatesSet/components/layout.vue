<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div class="ebsLayout" :class="{'edit':edit,'showRuler':showRuler}">
    <div class="ebsLeft">
      <div class="ebsContent" ref="ebsContent">
        <div class="ebsDiplomaBox" v-if="initView" :style="{'width':rulers.w+viewUnit,'height':rulers.h+viewUnit,'transform':'scale('+ rulers.s+ ',' + rulers.s + ')'}">
          <template v-if="showRuler">
            <div class="ebsHorizontalRuler">
              <svg width="100%" height="25">
                <g v-for="i in rulers.hNum" :transform="getSVG_G_Transform(i,'H')">
                  <line x1="0" x2="0" y1="25" y2="0" stroke="#ddd"></line>
                  <line v-for="j in 9" :x1="getToFixed(j * rulers.hg)" :x2="getToFixed(j * rulers.hg)" y1="25" y2="20"
                        stroke="#dfdfdf"></line>
                  <line :x1="getToFixed(10 * rulers.hg - 1)" :x2="getToFixed(10 * rulers.hg - 1)" y1="25" y2="0"
                        stroke="#ddd"></line>
                  <text x="5" y="17" text-anchor="begin" fill="#666">{{ getToFixed((i-1) * rulers.hg * 10) }}</text>
                </g>
              </svg>
            </div>
            <div class="ebsVerticalRuler">
              <svg width="25" height="100%">
                <g v-for="i in rulers.vNum" :transform="getSVG_G_Transform(i)">
                  <line x1="25" x2="0" y1="0" y2="0" stroke="#ddd"></line>
                  <line v-for="j in 9" :y1="getToFixed(j * rulers.vg)" :y2="getToFixed(j * rulers.vg)" x1="25" x2="20"
                        stroke="#dfdfdf"></line>
                  <line x1="25" x2="0" :y1="getToFixed(10 * rulers.vg - 1)" :y2="getToFixed(10 * rulers.vg - 1)"
                        stroke="#ddd"></line>
                  <text y="12" x="20" text-anchor="end" fill="#666">{{ getToFixed((i-1) * rulers.vg * 10) }}</text>
                </g>
              </svg>
            </div>
          </template>
          <div class="ebsMain printNoBorder">
            <div class="ebsDiploma">
              <slot name="diploma"></slot>
            </div>
          </div>
        </div>
        <slot name="left"></slot>
      </div>
    </div>
    <div class="ebsRight" v-if="edit">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<style lang="scss">
  $ebsRigthWidth: 300px; // 右侧宽度
  $ebsBorderColor: #ccc; // 边框颜色
  $ebsRulerBorderColor: #e5e5e5; // 比例尺边框颜色
  .ebsLayout {
    width: 100%;
    height: 100%;
    position: relative;
    &.edit {
      .ebsLeft {
        padding-right: $ebsRigthWidth + 10px;
        overflow: auto;
      }
      .ebsRight {
        display: block;
        overflow: auto;
        background-color: #fff;
      }
    }
  }

  .ebsLeft {
    width: 100%;
    height: 100%;
  }

  .ebsRight {
    width: $ebsRigthWidth;
    height: 100%;
    border: 1px solid $ebsBorderColor;
    position: absolute;
    right: 0;
    top: 0;
    display: none;
  }

  .ebsContent {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .ebsDiplomaBox{transform-origin:0 0;}

  .ebsHorizontalRuler {
    position: absolute;
    left: 25px;
    right: 0;
    top: 0;
    height: 25px;
    border-bottom: 1px solid $ebsRulerBorderColor;
  }

  .ebsVerticalRuler {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 25px;
    border-right: 1px solid $ebsRulerBorderColor;
    & ~ .ebsMain {
      padding: 25px 0 0 25px;
    }
  }

  .ebsMain {
    width: 100%;
    height: 100%;
    border: 1px solid $ebsRulerBorderColor;
  }

  .ebsDiploma {
    width: 100%;
    height: 100%;
    border-bottom: 1px solid $ebsRulerBorderColor;
    position: relative;
  }
</style>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      edit: { // 开启编辑模式
        type: Boolean,
        default: true,
      },
      showRuler: { // 显示标尺
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        initView:false,
        viewUnit:"px",
        content: { // 内容区域
          w: 0,
          h: 0,
        },
        a4: { // A4（横版）
          w: 978, // 宽
          h: 650, // 高
        },
        rulers: { // 比列尺
          s: 1, // 比例
          w: 978, // 证书显示宽度
          h: 650, // 证书显示高度
          hg: 10, // 每个水平刻度宽度
          vg: 10, // 每个垂直刻度宽度
          hNum: 10, // 水平数量
          vNum: 7, // 垂直数量
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
      },

      /***************************** 计算 *****************/
      // 获取每个比例尺的宽度
      getSVG_G_Transform(index, type) {
        return type == 'H' ? 'translate(' + ((index - 1) * this.getToFixed(this.rulers.hg * 10)) + ', 0)' : 'translate(0,' + ((index - 1) * this.getToFixed(this.rulers.vg * 10)) + ')';
      },
      // 获取内容宽度
      getEbsContent() {
        let content = this.content;
        let contentDom = this.$refs.ebsContent;
        content.w = contentDom.offsetWidth;
        content.h = contentDom.offsetHeight;
        this.getContentScaleByA4();
        this.initView = true;
      },
      // 根据A4纸的长宽获取内容的比例
      getContentScaleByA4() {
        let a4 = this.a4;
        let rulers = this.rulers;
        let content = this.content;

        // 获取证书显示区域
        rulers.w = a4.w + (this.showRuler ? 25 : 0);
        rulers.h = a4.h + (this.showRuler ? 25 : 0);

        let s = this.getToFixed(content.w / rulers.w, 3); // 比例只保留三位数
        rulers.s = s;

        // 抛出数据
//        this.$emit('contentData', {a4, rulers, content})
      },
      // 获取小数
      getToFixed(num = 0, fixed = 0) {
        return +(num.toFixed(fixed))
      },
    },
    created() {
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getEbsContent();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.getEbsContent);
      })
    },
    beforeDestroy() {
      Util.events.removeHandler(window, "resize", this.getEbsContent)
    },
    components: {}
  }

</script>
