<!--
****--@file     physicianAssessmentTime_list
****--@date     2018/5/21 11:47
****--@author   YC
****--@describe 国家医师考核-倒计时
-->
<template>
  <div style="height: 100%">
    <index v-if="viewType == 'index'" @viewChange="viewChange"></index>
    <view-info v-if="viewType == 'view'" @viewChange="viewChange" :operailityData="operailityData"></view-info>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import index from './physicianAssessmentTime_index'
  import viewInfo from './physicianAssessmentTime_view'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianAssessmentTimeList',
    data () {
      return {
        viewType: 'index',
        operailityData: null
      }
    },
    methods: {
      //初始化请求列表数据
      init () {

      },
      viewChange (val, data) {
        this.viewType = val
        this.operailityData = data || null
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      index,viewInfo
    }
  }

</script>
