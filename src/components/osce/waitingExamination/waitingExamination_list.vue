<!--
****--@file     waitingExamination_list
****--@date     2018/4/23 19:22
****--@author   YC
****--@describe 候考信息
-->
<template>
  <el-row class="waitingExamination">
    <el-col align="right">
      <el-button type="info" @click="viewTableTimeOpen">全屏展示</el-button>
    </el-col>
    <el-col class="waitingExaminationMain">
      <keep-alive>
        <waiting-examination-view v-if="!fullViewModal" :viewType="viewType" type="Plan"></waiting-examination-view>
      </keep-alive>
    </el-col>
    <!--全屏弹窗-->
    <el-dialog title="候考信息" size="full" :close-on-press-escape="true" :lock-scroll="true" :modal="false" :visible.sync="fullViewModal"
               :before-close="closeViewTable">
      <keep-alive>
        <waiting-examination-view @esc="escFull" v-if="fullViewModal" class="fullViewWaitingExamination" :viewType="viewType" type="Full"></waiting-examination-view>
      </keep-alive>
    </el-dialog>
  </el-row>
</template>
<script>
  /*当前组件必要引入*/
  import waitingExaminationView from './waitingExamination_view'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'waitingExaminationList',
    data () {
      return {
        viewType:'Plan',
        fullViewModal: false
      }
    },
    methods: {
      //初始化请求列表数据
      init () {

      },
      // 全屏查看时间表
      viewTableTimeOpen () {
        this.fullViewModal = true
        setTimeout(()=>this.viewType = 'Full',100)

      },
      closeViewTable () {
        this.fullViewModal = false
        setTimeout(()=>this.viewType = 'Plan',100)
      },
      escFull(){
        console.log('退出全屏')
        this.closeViewTable()
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      waitingExaminationView,
    },
  }

</script>
<style lang="scss">
  .waitingExamination {
    height: 100%;
    position: relative;
  }

  .waitingExaminationMain {
    width: 100%;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
  }

  .fullViewWaitingExamination {
    top: 60px;
    bottom: 20px;
    padding: 0;
    overflow: hidden;
    .waitingExaminationTable {
      p {
        padding: 2vh 0;
        font-size: 3vh;
      }
      .static {
        min-width: 15vh;
      }
      .name {
        min-width: 12vh;
      }
    }
  }
</style>
