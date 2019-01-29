<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <print :beforePrint="beforePrint">
    <show :operailityData="operailityData" ref="show"></show>
  </print>
</template>
<script>
  /*当前组件必要引入*/
  import print from '../../../common/print.vue';
  import show  from './ptPrintReceipts_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {};
    },
    methods: {
      //初始化请求列表数据
      init () {
      },
      beforePrint () {
        return this.$refs.show.beforePrint()
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      print,
      show
    }
  };

</script>
