<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <print>
    <diploma style="height: 716px;" :operailityData="operailityData"></diploma>
  </print>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import print from '../../../common/print.vue';
  import diploma from '../../emBasicSetting/certificatesSet/certificatesSet_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      print,
      diploma,
    }
  }

</script>
