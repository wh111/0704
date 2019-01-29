<!----------------------------------
****--轮转要求(科室要求)(emTrainingStandards_list)
****--@date     2017/9/14
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div ref="content">
    <require-set  :userType="'JXS'" :height="dynamicHt"></require-set>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import requireSet from "../../../intern/internBasisData/deptRequireSet/deptRequireSet_edit.vue";
  //当前组件引入全局的util
  let Util = null;
  export default{
    data() {
      return {
        dynamicHt:'500',
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contentHeight = this.$refs.content.parentNode.offsetHeight;
        let tableData = 70;
        let paginationHt = 80;
        this.dynamicHt = contentHeight - tableData - paginationHt;
      },
    },
    created(){
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      requireSet
    }
  }
</script>
