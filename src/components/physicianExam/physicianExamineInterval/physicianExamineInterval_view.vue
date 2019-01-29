<!--
****--@file     physicianExamineInterval_view
****--@date     2018/5/23 13:54
****--@author   YC
****--@describe 查看
-->
<template>
  <div ref="physicianContent">
    <el-row class="physicianExamineInterval">
      <el-col class="peiBorder">
        <el-col :span="20">
          <h2 style="line-height: 30px">{{ showData.examName }}</h2>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="info" size="small" @click="cancel">返回列表</el-button>
        </el-col>
      </el-col>
    </el-row>

    <div ref="table" style="padding-top: 20px">
      <ab-table-gk :tableData="tableData" :tableHeight="tableHeight"></ab-table-gk>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import { server2ShowData } from '../components/formatData'
  import abTableGk from '../components/ab_table_gk'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineIntervalView',
    props: ['operailityData'],
    data () {
      return {
        showData: {
          examName: '-'
        },
        tableHeight: 600,
        tableData: []
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.getShowData()
      },
      getShowData () {
        let opt = {
          ajaxSuccess: res => {
            this.showData.examName = res.data.examName;
            this.tableData = server2ShowData(res.data.examArrangementList).resArr
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.examId,
            method: api.get.method
          }
        }
        this.ajax(opt)
      },
      // 取消
      cancel () {
        this.$emit('viewChange', 'index')
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.physicianContent.parentNode;
        let table = this.$refs.table;
        let paginationHt = 0;
        this.tableHeight = content.offsetHeight - table.offsetTop - paginationHt;
      }
    },
    created () {
      this.init();
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
      abTableGk
    }
  }

</script>
