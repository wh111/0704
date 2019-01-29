<!-- 住院医 - 报名招录 - 人员管理 -->
<template>
  <layout-tree>
    <left-tree slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" @tree-remove-node="treeRemoveNode" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
    <teacher-content-audit slot="right" :deptId="deptId" :treeObj="treeObj"></teacher-content-audit>
  </layout-tree>
</template>
<script>
  /*当前组件必要引入*/
  import treeApi from './treeApi';
  import layoutTree from "../../../common/layoutTree";
  import leftTree from "./tree/menu.vue";
  // 住院医部门人员
  import teacherContentAudit from "./teachersManagement_contentAudit.vue"
  export default {
    data() {
      return {
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: treeApi.tree.path,
          getDataUrl: '',
          isShowMenus: true,
        },
        treeObj: {},
        fromWhereTree: "user",
        //当前tree选中的node id
        deptId: '',
        isAudit:false
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
        this.setTreeDepId(obj.id, obj);
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
      treeClickInit(obj) {
        this.treeClick(obj)
      },

      /*
       * 设置当前部门Id
       * */
      setTreeDepId(id, obj) {
        if (id) {
          this.deptId = id;
        }
        this.treeObj = obj || {};
      },

    },

    //初始化组件
    created() {
      this.init();
    },

    components: {
      //当前组件引入的子组件
      teacherContentAudit,
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
