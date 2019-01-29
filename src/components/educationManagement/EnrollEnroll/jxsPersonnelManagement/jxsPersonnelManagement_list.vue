<!-- 住院医 - 报名招录 - 人员管理 -->
<template>
  <layout-tree>
    <left-tree ref="leftTree" slot="left" @setCurrSltNodeId="treeClickInit" @tree-click="treeClick"
               @tree-remove-node="treeRemoveNode" :treeOptions="treeDefaults"
               :fromWhereTreeType="fromWhereTree"></left-tree>
    <zyy-content slot="right" :deptId="deptId" admin="true" :deptName="deptName" :treeDefaults="treeDefaults"
                 :fromWhereTree="fromWhereTree" @refreshTree="refreshTree"></zyy-content>
  </layout-tree>
</template>
<script>
  /*当前组件必要引入*/
  import layoutTree from "../../../common/layoutTree";
  import leftTree from "../../../common/leftTree.vue";
  // 住院医部门人员
  import zyyContent from "./jxsPersonnelManagement_content";
  export default {
    data() {
      return {
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: "/dept/tree-by-JXS",
          getDataUrl: '',
          isShowMenus: true,
        },
        fromWhereTree: "user",
        //当前tree选中的node id
        deptId: '',
        deptName: '',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {},


      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       *
       * @param node  {}  整个tree节点所有数据
       *
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        // 记录视图
        this.setTreeDepId(obj);
      },



      /*
       * 删除目录树回调
       *
       * */
      treeRemoveNode() {
        this.deptId = '';
      },

      /*
       *  初始化或者刷新数列表的时候  调用treeClick函数 为deptId赋值
       * */
      treeClickInit(id, obj) {
        this.setTreeDepId(obj)
      },

      /*
       * 设置当前部门obj
       * */
      setTreeDepId(obj) {
        if (typeof obj.id != "undefined") {
          this.deptId = obj.id;
          this.deptName = obj.name;
        }
      },

      //刷新目录树
      refreshTree() {
        this.$refs.leftTree.updataTree();
      },

    },

    //初始化组件
    created() {
      this.init();
    },

    components: {
      //当前组件引入的子组件
      zyyContent,
      layoutTree,
      leftTree
    }

  }

</script>
<style lang="scss">
  .add-remove {
    margin-bottom: 20px;
  }

  .header {
    height: 30px;
    font-size: 18px;
    color: #ffffff;
  }

  .userDataTable {
    margin-top: 20px;
  }

  .listUpAreaMoreSearchBox {
    margin-top: 20px;
    .el-select .el-input {
      width: 100%;
    }
    &~.userDataTable {
      margin-top: 0;
    }
  }

</style>
