<template>
  <basic-view class="view" :operailityData="operailityData"></basic-view>
</template>
<script>
  import basicView from '../ProposalPeportWriting/ProposalPeportWriting_base-view';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'view', 'peport'],
    data () {
      return {};
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted () {
      //初始化
    },
    methods: {},
    components: {
      basicView
    }
  };
</script>

