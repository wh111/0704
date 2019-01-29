<!--
****--@file     physicianExamineInterval_list
****--@date     2018/5/21 11:43
****--@author   YC
****--@describe 国家医师考核-考核管理
-->
<template>
  <div style="height: 100%">
    <physician-examine-interval-index v-if="viewType == 'index'" @viewChange="viewChange"></physician-examine-interval-index>
    <physician-examine-interval-input v-if="viewType == 'input'" @viewChange="viewChange" :operailityData="operailityData"></physician-examine-interval-input>
    <physician-examine-interval-view v-if="viewType == 'view'" @viewChange="viewChange" :operailityData="operailityData"></physician-examine-interval-view>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import physicianExamineIntervalIndex from './physicianExamineInterval_index'
  import physicianExamineIntervalInput from './physicianExamineInterval_input'
  import physicianExamineIntervalView from './physicianExamineInterval_view'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineIntervalList',
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
      physicianExamineIntervalIndex,
      physicianExamineIntervalInput,
      physicianExamineIntervalView
    }
  }

</script>
<style>

</style>
