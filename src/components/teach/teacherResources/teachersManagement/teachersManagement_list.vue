<!-- 住院医 - 报名招录 - 人员管理 -->
<template>
  <layout-tree>
    <left-tree slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" @tree-remove-node="treeRemoveNode" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
    <teacher-content slot="right" :deptId="deptId" :type="type"
                     :deptName="deptName"
                     :isLastDept="isLastDept"></teacher-content>
  </layout-tree>
</template>
<script>
  /*当前组件必要引入*/
  import treeApi from './treeApi';
  import layoutTree from "../../../common/layoutTree";
  import leftTree from "./tree/menu.vue";
  // 住院医部门人员
  import teacherContent from "./teachersManagement_content.vue";
  export default {
    data() {
      return {
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: treeApi.tree.path,
          getDataUrl: '',
          isShowMenus: true,
        },
        fromWhereTree: "user",
        //当前tree选中的node id
        deptId: '',
        deptName:'',
        isAudit: false,
        type: '',//类型，区分是带教老师还是导师
        isLastDept: false, //是否是最后一级目录
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
        this.type = obj.types;
        this.deptName = obj.name;
        if (!obj.children) {
          this.isLastDept = true
        }
        // 记录视图
        this.setTreeDepId(obj.id);
      },


      /*
       * 删除目录树回调
       *
       * */
      treeRemoveNode() {
        this.deptId = '';
        this.deptName = '';
        this.isLastDept = false
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
      setTreeDepId(id) {
        if (id) {
          this.deptId = id;
        }
      },

    },

    //初始化组件
    created() {
      this.init();
    },

    components: {
      //当前组件引入的子组件
      teacherContent,
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
