<!--
****--@file     seedetailModal.vue
****--@date     2018/1/19 19:47
****--@author   wh
****--@describe   值班费弹窗
-->
<template>
  <div>
    <el-table
      :data="LastTableData"
      border
      style="width: 100%;">
      <el-table-column
        prop="userName"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        label="科室"
        prop="depName"
        align="center">
      </el-table-column>
      <el-table-column
        label="日期"
        prop="time"
        align="center">
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  let Util = null
  export default {
    props: ['operailityData', 'activeName'],
    data() {
      return {
        LastTableData: []
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.ajax({
          ajaxSuccess: this.getNightSuccess,
          ajaxParams: {
            //baseURL:'PUBLIC',
            url: '/duty-fee-issue/get-' + this.operailityData,
            method: 'get',
            params: {
              type: this.activeName,
            }

          },
        })
      },
      getNightSuccess(res) {
        this.LastTableData = res.data
      },

    },
    created() {
      this.init();
    },
    mounted() {

    },
    components: {}
  }

</script>
<style lang="scss">

</style>
