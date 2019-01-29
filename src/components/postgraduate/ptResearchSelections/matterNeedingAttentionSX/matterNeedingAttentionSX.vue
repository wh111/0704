<!--
****--@file     matterNeedingAttentionSX
****--@date     2018/7/31 15:24
****--@author   YC
****--@describe 导师双选注意事项
-->
<template>
  <div ref="matterNeedingAttentionSX" class="matterNeedingAttentionSX">
    <p v-if="!review && edit">
      <show-ueditor name="remark" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal"
                    :ueditor-config="ueditorConfig" style="width:100%"></show-ueditor>
    </p>
    <template v-else>
      <html-content :style="{height:(contentHeight-(edit ? 80 : 0))+'px'}" :html="ueditorVal.remark"></html-content>
    </template>
    <el-col v-if="edit" align="right" class="btnBox">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      <el-button @click="reviewCall" type="success">{{ review ? '取消' : '' }}预览</el-button>
    </el-col>
  </div>
</template>
<style lang="scss">
  .matterNeedingAttentionSX {
    height: 100%;
    position: relative;
    .btnBox {
      width: 100%;
      margin-top: 10px;
      position: absolute;
      left: 0;
      bottom: 10px;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import api         from './api';
  import showUeditor from '../../../common/showUeditor'; // 编辑器
  import htmlContent from '../../../common/htmlContent';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'matterNeedingAttentionSX',
    props: ['code'],
    data () {
      return {
        review: false, // 预览
        edit: false, // 是否编辑模式
        UE: {}, // 编辑器
        rules: {}, // 验证输入规则
        ueditorVal: {
          remark: '' // 内容
        },
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          // zIndex: 9,
          initialFrameHeight: 400 //初始化编辑器高度,默认320
        },
        contentHeight: 0,
        roleList: [], // 当前用户角色列表
        viewData: null, // 阅览数据
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        codeStr: 'SXZYSX'
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let userInfo = this.$store.getters['getUserInfo'];
        let roleList = [];
        Util = this.$util;
        console.log(userInfo);
        (userInfo && userInfo.roleList || []).map(role => {
          roleList.push(role.identify);
        });
        this.roleList = roleList;
        if (this.code) {
          this.codeStr = this.code;
        }
        this.getViewData();
      },
      // 获取查看数据
      getViewData () {
        let opt = {
          ajaxSuccess: res => {
            let {matterCode, matterId, matterContent} = res.data instanceof Object ? res.data : {
              matterCode: '',
              matterId: '',
              matterContent: ''
            };
            this.viewData = {matterCode, matterId};
            this.ueditorVal.remark = matterContent;
            this.setTableDynHeight();
          },
          ajaxParams: {
            url: api.get.path + this.codeStr,
            method: api.get.method
          }
        };
        this.ajax(opt);
      },
      // 预览
      reviewCall () {
        this.review = !this.review;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        if (!this.ueditorVal.remark) {
          this.errorMess('请输入内容才能保存');
          return false;
        }
        if (!isLoadingFun) {
          isLoadingFun = function () {};
        }
        isLoadingFun(true);
        let data = this.$util._.defaultsDeep({}, this.viewData);
        data.matterContent = this.ueditorVal.remark;
        let opt = {
          errorTitle: '保存失败',
          ajaxSuccess: res => this.successMess('保存成功'),
          ajaxParams: {
            jsonString: true,
            url: api.edit.path + data.matterId,
            method: api.edit.method,
            data
          }
        };
        this.ajax(opt, isLoadingFun);
      },
      /**
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       * @param editor {}      编辑器的对象
       */
      storeUE (name, editor) {
        this.UE[name] = editor;
        if (this.isReadOnly) {
          editor.setDisabled();
        }
      },
      /**
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       * @param val  {string}  编辑器的内容
       */
      getUeditorVal (name, val) {
        this.ueditorVal[name] = val;
      },
      setTableDynHeight () {
        this.$nextTick(function () {
          let content = this.$refs.matterNeedingAttentionSX.parentNode;
          let edit = this.roleList.includes('JYC') || this.roleList.includes('YJSGL');
          this.contentHeight = content.offsetHeight;
          if (edit) {
            this.ueditorConfig.initialFrameHeight = this.contentHeight - 190;
            this.edit = edit;
          }
        });
      }
    },
    created () {
//      this.init();
    },
    mounted () {
      this.init();
      //页面dom稳定后调用
//      this.$nextTick(function () {
//        //初始表格高度及分页位置
//        this.setTableDynHeight();
//        //为窗体绑定改变大小事件
//        let Event = Util.events;
//        Event.addHandler(window, 'resize', this.setTableDynHeight);
//      });
    },
    components: {showUeditor, htmlContent}
  };

</script>
