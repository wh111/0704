<!-- 实习生 - 报名招录 - 人员管理 -->
<template>
  <layout-tree>
    <left-tree ref="leftTree" slot="left" @setCurrSltNodeId="treeClickInit" @tree-click="treeClick"
               @tree-remove-node="treeRemoveNode" :treeOptions="treeDefaults"
               :fromWhereTreeType="fromWhereTree"></left-tree>
    <sxs-content slot="right" :deptId="deptId" :deptName="deptName" admin="true" :treeDefaults="treeDefaults"
                 @refreshTree="refreshTree"></sxs-content>
  </layout-tree>
</template>
<script>
  import api from './api';
  /*当前组件必要引入*/
  //引入--修改--组件
  import  layoutTree from '../../../common/layoutTree.vue';
  import  leftTree from '../../../common/leftTree.vue';
  import sxsContent from './usersManagement_content.vue'; // 实习生内容

  export default {
    data() {
      return {
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: "/dept/tree-by-SXS",
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
      init() {
      },


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
      layoutTree,
      leftTree,
      sxsContent,
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
