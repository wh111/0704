<!--
****--@file     physicianAssessmentTime_index
****--@date     2018/5/24 14:21
****--@author   YC
****--@describe 列表
-->
<template>
  <div>
    <ab-table-search :hasSearch="false" :tableURL="listApi" :hasSelect="false">
      <template slot="tableItem">
        <el-table-column align="center" label="操作" width="210">
          <template scope="scope">
            <el-button type="info" @click="view(scope.row)">{{ 'view' | sysLan }}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="考试名称" prop="examName" min-width="100"></el-table-column>
        <el-table-column align="center" label="状态" prop="examStatus" min-width="80">
          <template scope="scope">
            {{ scope.row.examStatus | typeText }}
          </template>
        </el-table-column>
      </template>
    </ab-table-search>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../physicianWaitingExamination/api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianAssessmentTimeIndex',
    data () {
      return {
        listApi: api.list,
      }
    },
    methods: {
      //初始化请求列表数据
      init () {

      },
      view (data) {
        this.$emit('viewChange', 'view', data)
      },
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  }

</script>
