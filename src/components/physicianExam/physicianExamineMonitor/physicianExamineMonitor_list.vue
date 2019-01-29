<!--
****--@file     physicianExamineMonitor_list
****--@date     2018/5/21 11:44
****--@author   YC
****--@describe 国家医师考核-考核监控
-->
<template>
  <div style="height: 100%;">
    <el-button class="physicianExamineFullBtn" type="info" @click="fullViewOpen">全屏展示</el-button>
    <div class="physicianExamineMonitor" v-if="!fullViewModal">
      <view-info :show-data="formValidate" :msg-str="msgText"></view-info>
    </div>
    <!--全屏弹窗-->
    <el-dialog class="physicianExamineFullDialog" title="考核监控" size="full" :close-on-press-escape="true" :lock-scroll="true" :modal="false" :visible.sync="fullViewModal"
               :before-close="closeFullView">
      <div class="physicianExamineFullBox">
        <div v-if="fullViewModal" class="physicianExamineMonitor">
          <view-info :show-data="formValidate" :msg-str="msgText"></view-info>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
  @import "../style";

  .physicianExamineFullBtn {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 2;
  }

  .physicianExamineFullBox {
    position: absolute;
    top: 60px;
    left: 20px;
    bottom: 20px;
    right: 20px;
  }

  .physicianExamineFullDialog{
    .el-dialog__header {
      text-align: center;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from '../physicianExamineInterval/api'
  import viewInfo from './physicianExamineMonitor_view'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineMonitorList',
    data () {
      return {
        formValidate: null,
        msgText: '数据加载中...',
        infoInt: null,
        fullViewModal: false
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.loadInfo()
      },
      loadInfo () {
        let that = this
        clearInterval(this.infoInt)
        this.getInfo()
        this.infoInt = setInterval(() => that.getInfo(), 1000)
      },
      closeFullView () {
        this.cancel('fullView')
      },
      /*****************************状态控制**********************/
      getInfo () {
        let opt = {
          allowError: false,
          ajaxLoading: false,
          ajaxSuccess: res => {
            if (res.data instanceof Object && res.data.one) {
              this.formValidate = res.data;
            } else {
              this.msgText = '暂无可监控的数据'
            }
          },
          error: res => this.msgText = res.status.msg,
          ajaxParams: {
            url: api.timeLong.path,
            method: api.timeLong.method
          }
        }
        this.ajax(opt)
      },
      fullViewOpen () {
        this.openModel('fullView')
        console.log('fullViewOpen:' + this.fullViewModal)
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      }
    },
    created () {
      this.init();
    },
    beforeDestroy () {
      clearInterval(this.infoInt)
    },
    mounted () {
    },
    components: {
      viewInfo
    }
  }

</script>
