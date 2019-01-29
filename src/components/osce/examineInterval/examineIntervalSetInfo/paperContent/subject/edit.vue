<template>
  <!-- 题干 -->
  <div>
    <view-u-editor name="subject" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                   :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></view-u-editor>
    <!--<el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="subject"></el-input>-->
    <p align="center" class="modelSaveBtn">
      <el-button @click="save" type="info">确定</el-button>
    </p>
  </div>
</template>

<script>
  import viewUEditor from '../../../../../common/showUeditor.vue';

  export default {
    props: ['operailityData'],
    data() {
      return {
        // subject: '',
        //富文本编译器
        UE: {},
        ueditorVal: {
          subject: "",
        },
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          initialFrameHeight: 220  //初始化编辑器高度,默认320
        },
      };
    },
    methods: {
      save() {
        this.$emit('save', this.ueditorVal.subject);
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
        // editor.setDisabled()
      },
    },
    created() {
      this.ueditorVal.subject = this.operailityData || '';
    },
    components: {
      viewUEditor,
    },
  };

</script>

<style>
  /* 题干 */

</style>
