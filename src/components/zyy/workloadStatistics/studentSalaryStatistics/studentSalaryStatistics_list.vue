<!--
****--@file     studentSalaryStatistics_list
****--@date     2018-12-03 16:55
****--@author   YC
****--@describe 学员薪资统计
-->
<template>
  <div>

  </div>
</template>
<script>
  /* 当前组件必要引入 */

  // 当前组件引入全局的util
  let Util = null
  export default {
    name: '',
    data () {
      return {}
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util
      },

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {},
  }

</script>
