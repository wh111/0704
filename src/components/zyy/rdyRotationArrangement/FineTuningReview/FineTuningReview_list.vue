<!----------------------------------
****--@name     微调审核（使用 轮转管理-安排轮转-轮转审核 的列表）
****--@role     ${*}
****--@date     2018/6/12
****--@author   gx
----------------------------------->
<template>
  <arrangeRotaryRotationAudit podClass="ZYY"></arrangeRotaryRotationAudit>
</template>
<script>
  /*当前组件必要引入*/
  import arrangeRotaryRotationAudit from '../../../rotateManagement/arrangeRotation/arrangeRotaryRotationAudit/arrangeRotaryRotationAudit_list.vue'
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {}
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
      arrangeRotaryRotationAudit
    }
  }
</script>
