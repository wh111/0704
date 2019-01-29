<!----------------------------------
****--@name     开题报告填写
****--@role     研究生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div style="height: 100%;" class="modal">
    <keep-alive>
      <info-list v-if="showType === 'list'" @show="show"></info-list>
    </keep-alive>
    <info-input v-if="showType === 'input'" @show="show" :operailityData="operailityData"></info-input>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import infoList  from './proposalPeportWriting_index';
  import infoInput from './ProposalPeportWriting_input';
  //当前组件引入全局的util
  let Util = null;
  export default {
//    props: ['api', 'peport'],
    data () {
      return {
        showType: 'list',
        operailityData: null
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
      },
      show (type, obj = null) {
        this.showType = type;
        this.operailityData = obj;
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      //当前组件引入的子组件
      infoList,
      infoInput
    }
  };
</script>

