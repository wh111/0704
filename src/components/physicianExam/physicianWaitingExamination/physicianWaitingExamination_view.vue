<!--
****--@file     physicianWaitingExamination_view
****--@date     2018/5/23 20:00
****--@author   YC
****--@describe 候考信息查看
-->
<template>
  <div ref="physicianContent">
    <el-row class="physicianExamineInterval">
      <el-col class="peiBorder" align="center">
        <h2>候考信息</h2>
        <!--<h2 style="line-height: 30px">{{ operailityData.examName }}</h2>-->
      </el-col>
      <div class="rightBtnBox">
        <el-button type="success" size="small" @click="fullView">全屏查看</el-button>
        <el-button type="info" size="small" @click="viewList">返回列表</el-button>
      </div>
    </el-row>

    <div ref="table" style="padding-top: 20px">
      <table-info :operailityData="operailityData" :tableHeight="tableHeight"></table-info>
    </div>

    <!--全屏弹窗-->
    <el-dialog title="候考信息" size="full" :close-on-press-escape="true" :lock-scroll="true" :modal="false" :visible.sync="fullViewModal"
               :before-close="closeFullView">
      <div v-if="fullViewModal" ref="fullViewBox">
        <table-info :operailityData="operailityData" :tableHeight="fullViewTableHeight"></table-info>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
  .physicianExamineInterval {
    position: relative;
    h2 {
      line-height: 32px;
    }
    .rightBtnBox {
      width: 156px;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import tableInfo from './physicianWaitingExamination_info'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianWaitingExaminationView',
    props: ['operailityData'],
    data () {
      return {
        tableHeight: 600,
        fullViewTableHeight: 600,
        fullViewModal: false
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
      },

      // 取消
      viewList () {
        this.$emit('viewChange', 'index')
      },
      // 全屏查看
      fullView () {
        this.openModel('fullView');
        this.$nextTick(function () {
          let content = this.$refs.fullViewBox;
          this.fullViewTableHeight = content.parentNode.parentNode.offsetHeight - content.offsetTop - 60
        })
      },
      closeFullView () {
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
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.physicianContent.parentNode;
        let table = this.$refs.table;
        let paginationHt = 20;
        this.tableHeight = content.offsetHeight - table.offsetTop - paginationHt;
      },
      clearInt () {
        clearInterval(this.nowTimeInt)
        clearInterval(this.loadDataInt)
      }
    },
    created () {
      this.init();
    },
    beforeDestroy () {
      this.clearInt()
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    components: {
      tableInfo
    }
  }

</script>
