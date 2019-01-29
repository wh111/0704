<template>
  <!-- 公告 -->
  <div>
    <show-ueditor name="content" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig" style="width:100%"></show-ueditor>
    <p align="right" class="marginTop20">
      <el-button type="info" @click="addNotice">确定</el-button>
    </p>
    <notice-list ref="noticeList"></notice-list>
  </div>
</template>

<script>
  import api from './api';
  import noticeList from './notice_view';
  import showUeditor from '../../../../common/showUeditor'; // 编辑器
  export default {
    data() {
      return {
        UE: {}, // 编辑器
        rules: {}, // 验证输入规则
        ueditorVal: {
          content: '', // 内容
          courseId: '',
        },
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          // zIndex: 9,
          initialFrameHeight: 200 //初始化编辑器高度,默认320
        },
        // formValidate: {
        //   content: '',
        // },
      }
    },
    methods: {
      init() {
        this.ueditorVal.courseId = this.$store.state.curriculum.look.course.id;
      },
      /**
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       * @param editor {}      编辑器的对象
       */
      storeUE(name, editor) {
        this.UE[name] = editor;
      },
      /**
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       * @param val  {string}  编辑器的内容
       */
      getUeditorVal(name, val) {
        this.ueditorVal[name] = val;
      },
      addNotice() {
        if (!this.UE.content.hasContents()) {
          this.$notify({
            title: '提示',
            message: '请填写公告内容',
            type: 'warning'
          });
          return
        }
        let opt = {
          ajaxSuccess: res => {
            this.$refs.noticeList.init();
            this.UE.content.setContent('');
          },
          ajaxParams: {
            url: api.add.path,
            method: api.add.method,
            data: this.ueditorVal
          }
        };
        this.ajax(opt)
      },
    },
    components: {
      noticeList,
      showUeditor,
    },
    created() {
      this.init()
    },
  }

</script>

<style>
  /* 公告 */

  .noticeDate {
    margin: 10px 0;
  }

  .noticeCon {
    margin-bottom: 10px;
  }

  .noNoticeTips {
    text-align: center;
    line-height: 200px;
  }

</style>
