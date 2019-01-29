<!--
****--@file     physicianWaitingExamination_info
****--@date     2018/5/24 11:30
****--@author   YC
****--@describe 详细信息
-->
<template>
  <div>
    <el-row>
      <el-col :span="8">
        <h2>{{ showData.examDate }}</h2>
      </el-col>
      <el-col :span="8" align="center"><h2>{{ showData.examDate ? '星期' + week[new Date(showData.examDate).getDay()] : '' }}</h2></el-col>
      <el-col :span="8" align="right">
        <h2>{{ nowTime && ((new Date(nowTime).toLocaleString()).split(' '))[1] || '-' }}</h2>
      </el-col>
    </el-row>
    <ab-table-gk :tableData="tableData" :tableHeight="tableHeights"></ab-table-gk>
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
    name: 'physicianWaitingExaminationInfo',
    props: ['tableHeight', 'operailityData'],
    data () {
      return {
        nowTime: '',
        week: ['日', '一', '二', '三', '四', '五', '六'],
        showData: {
          examName: '-',
          examDate: '-'
        },
        tableHeights: this.tableHeight || 600,
        tableData: [],
        nowTimeInt: null,
        loadDataInt: null
      }
    },
    watch: {
      tableHeight (val) {
        this.tableHeights = val
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.loadData()
        this.getNowTime()
      },
      getNowTime () {
        clearInterval(this.nowTimeInt)
        this.getNowTimeCall()
      },
      loadData () {
        this.getShowData()
        this.loadDataInt = setInterval(() => {
          this.getShowData()
        }, 1000 * 60)
      },
      getNowTimeCall () {
        let opt = {
          ajaxSuccess: res => {
            let _this = this
            this.nowTime = parseInt(res.data)
            this.nowTimeInt = setInterval(() => {
              _this.nowTime += 1000
            }, 1000)
          },
          ajaxParams: {
            url: '/nowTime'
          }
        }
        this.ajax(opt)
      },

      getShowData () {
        let opt = {
          ajaxSuccess: res => {
            let {examDate, examName} = this.operailityData
            this.showData = {examDate, examName};
            this.tableData = server2ShowData(res.data).resArr
          },
          ajaxParams: {
            url: api.get.path,
            method: api.get.method, params: {
              examId: this.operailityData.examId
            }
          }
        }
        this.ajax(opt)
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
    },
    components: {
      abTableGk
    }
  }

</script>
