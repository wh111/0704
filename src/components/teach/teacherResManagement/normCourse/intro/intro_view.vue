<template>
  <!-- 课程简介 - 查看 -->
  <!--<div v-html="remark"></div>-->
  <div style="height: 100%;">
    <show-ueditor v-if="ueditorVal.remark" name="remark" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                  :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig" style="width:100%"></show-ueditor>
  </div>
</template>

<script>
  import showUeditor from '../../../../common/showUeditor'; // 编辑器
  export default {
    data() {
      return {
        UE: {},
        ueditorVal: {
          remark: "",
        },  //
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          initialFrameHeight: 390,  //初始化编辑器高度,默认320
        },

        remark: '',
      }
    },
    methods: {
      // 初始化
      init() {
        this.ueditorVal.remark = this.$store.state.curriculum.look.course.remark || ' ';
//        this.remark = this.$store.state.curriculum.look.course.remark;
      },

      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */
      storeUE(name, editor) {
        this.UE[name] = editor;
        editor.setDisabled()
      },

      setMyVal(name, v) {
        this.UE[name].setContent(v);
      },
      /**
       *
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       *
       * @param val  {string}  编辑器的内容
       *
       */
      getUeditorVal(name, val) {
        this.ueditorVal[name] = val;
      },

    },
    created() {
      this.init()
    },
    components: {
      showUeditor,
    }
  }

</script>

<style>
  /* 课程简介 - 查看 */

</style>
