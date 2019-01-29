<!--
****--@file     physicianAssessmentTime_list
****--@date     2018/5/21 11:47
****--@author   YC
****--@describe 国家医师考核-倒计时
-->
<template>
  <div ref="content">
    <template v-if="tabHeader">
      <div class="em_tabHeader" style="position:relative;">
        <div style="padding-right:100px;">
          <el-tabs v-model="tabHeader">
            <template v-for="roomNum in tabList">
              <el-tab-pane :label="'考站：'+roomNum" :name="roomNum.toString()" :key="roomNum"></el-tab-pane>
            </template>
          </el-tabs>
        </div>
        <div style="width:100px;height:42px;border-bottom:1px solid #d1dbe5;position:absolute;right:0;top:0;text-align:right;">
          <el-button type="info" @click="fullView">全屏展示</el-button>
        </div>
      </div>
      <div ref="viewInfoBox">
        <info :roomNum="tabHeader" :viewHeight="viewHeight" :clearInt="clearInt"></info>
      </div>
    </template>
    <p v-else style="position: absolute;top: 50%;text-align: center;width: 100%;">{{ msgText }}</p>

    <!--全屏弹窗-->
    <el-dialog size="full" :close-on-press-escape="true" :lock-scroll="true" :modal="false" :visible.sync="fullViewModal"
               :before-close="closeFullView">
      <div v-if="fullViewModal" ref="fullViewBox">
        <info :roomNum="tabHeader" :viewHeight="fullViewTableHeight" type="fullView"></info>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import info from './physicianAssessmentTime_info'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianAssessmentTimeList',
    data () {
      return {
        self: this,
        clearInt: false,
        tabHeader: '',
        tabList: [],
        viewHeight: 100,
        fullViewModal: false,
        fullViewTableHeight: 100,
        msgText: '暂无可查看的考核场次'
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
      },
      // 全屏查看
      fullView () {
        this.clearInt = true
        this.openModel('fullView');
        this.$nextTick(function () {
          let content = this.$refs.fullViewBox;
          this.fullViewTableHeight = content.parentNode.parentNode.offsetHeight - content.offsetTop - 60
        })
      },
      closeFullView () {
        this.clearInt = false
        this.cancel('fullView')
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
      },
      /*****************************基础逻辑**********************/
      // 获取监控考核场次列表
      getMonitorList () {
        this.ajax({
          allErrors: false,
          error: res => {
            this.errorMess(res.status.msg)
            this.msgText = res.status.msg
          },
          ajaxSuccess: 'updateTabData',
          ajaxParams: {
            url: api.list.path,
            method: api.list.method
          }
        })
      },
      // 更新tab
      updateTabData (res) {
        if (res.data.length) {
          this.tabList = res.data;
          this.tabHeader = res.data[0].toString();
          setTimeout(() => this.setTableDynHeight(), 10)
        }
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        if (!this.tabHeader) {
          return
        }
        let content = this.$refs.content.parentNode;
        let viewInfo = this.$refs.viewInfoBox;
        let paginationHt = 0;
        this.viewHeight = content.offsetHeight - viewInfo.offsetTop - paginationHt;
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        this.getMonitorList()
        //初始表格高度及分页位置
//        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {
      info
    }
  }

</script>
