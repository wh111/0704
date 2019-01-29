<template>
  <!-- 课程简介 -->
  <div class="nUeditorBox" ref="nUeditorBox">
    <!--<div v-if="isReadOnly" v-html="ueditorVal.remark"></div>-->
    <show-ueditor name="remark" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal"
                  :ueditor-config="ueditorConfig" style="width:100%"></show-ueditor>
  </div>
</template>

<script>
  import api from '../api';
  import showUeditor from '../../../../common/showUeditor'; // 编辑器
  export default {
    props: ['readOnly'],
    data() {
      return {
        UE: {}, // 编辑器
        rules: {}, // 验证输入规则
        ueditorVal: {
          remark: '' // 内容
        },
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          // zIndex: 9,
          initialFrameHeight: 390 //初始化编辑器高度,默认320
        },
        isReadOnly: false, // 只读
      }
    },
    methods: {
      /**
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       * @param editor {}      编辑器的对象
       */
      storeUE(name, editor) {
        this.UE[name] = editor;
        if (this.isReadOnly) {
          editor.setDisabled()
        }
      },
      /**
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       * @param val  {string}  编辑器的内容
       */
      getUeditorVal(name, val) {
        this.ueditorVal[name] = val;
      },


      // 初始化
      init() {
        this.isReadOnly = this.readOnly !== undefined;
        this.ueditorVal.remark = this.$store.state.curriculum.data.course.remark
      },
      // 保存数据
      saveToStore() {
        this.$store.commit('curriculum/data/updateCourse', {
          remark: this.ueditorVal.remark
        });
        return true
      },
    },
    components: {
      showUeditor
    },
    created() {
      this.init()
    },
  }

</script>

<style>
  /* 课程简介 */

  .nUeditorBox {
    /* padding-left: 16px; */
    height: 100%;
  }

</style>
