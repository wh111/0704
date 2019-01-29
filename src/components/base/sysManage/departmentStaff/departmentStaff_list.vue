<!--系统管理-->
<!--部门人员管理-->
<template>
  <layout-tree>
    <left-tree slot="left" @setCurrSltNodeId="treeClickInit" @tree-click="treeClick" @tree-remove-node="treeRemoveNode"
               :treeOptions="treeDefaults" ref="leftTree"
               :fromWhereTreeType="fromWhereTree"></left-tree>
    <template v-if="['ZYY','SXS','YJS','JXS','BKS'].indexOf(viewTypes) > -1">
      <!-- 住院医人员管理 -->
      <zyy-content v-if="viewTypes === 'ZYY'" slot="right" admin="true" :deptName="deptName" :deptId="deptId"
                   @refreshTree="refreshTree"></zyy-content>
      <!-- 实习生人员管理 -->
      <sxs-content v-if="viewTypes === 'SXS'" slot="right" admin="true" :deptName="deptName" :deptId="deptId"
                   @refreshTree="refreshTree"></sxs-content>
      <!-- 研究生人员管理 -->
      <yjs-content v-if="viewTypes === 'YJS'" slot="right" admin="true" :deptName="deptName" :deptId="deptId"
                   @refreshTree="refreshTree"></yjs-content>
      <!-- 进修生人员管理 -->
      <jxs-content v-if="viewTypes === 'JXS'" slot="right" admin="true" :deptName="deptName" :deptId="deptId"
                   @refreshTree="refreshTree"></jxs-content>
      <!-- 本科生人员管理 -->
      <bks-content v-if="viewTypes === 'BKS'" slot="right" admin="true" :deptName="deptName" :deptId="deptId"
                   @refreshTree="refreshTree"
                   :isClassNode="isClassNode" :nodeNumber="nodeNumber"></bks-content>
    </template>
    <!-- 默认部门人员管理 -->
    <dep-content v-else slot="right" admin="true" :deptName="deptName" :deptId="deptId"
                 @refreshTree="refreshTree"></dep-content>
  </layout-tree>
</template>
<script>
  /*当前组件必要引入*/
  import layoutTree from "../../../common/layoutTree.vue";
  import leftTree from "../../../common/leftTree.vue";
  // 默认部门人员
  import depContent from "./departmentStaff_content";
  // 住院医部门人员
  import zyyContent from "../../../zyy/rdyEnrollEnroll/rdyPersonnelManagement/rdyPersonnelManagement_content";
  // 实习生
  import sxsContent from "../../../intern/recruitStudent/usersManagement/usersManagement_content.vue";
  // 研究生
  import yjsContent from '../../../postgraduate/ptEnrollEnroll/yjsPersonnelManagement/yjsPersonnelManagement_content.vue';
  // 进修生
  import jxsContent from '../../../educationManagement/EnrollEnroll/jxsPersonnelManagement/jxsPersonnelManagement_content.vue';
  // 本科生
  import bksContent from '../../../educationManagement/EnrollEnroll/bksPersonnelManagement/bksPersonnelManagement_content.vue';

  //当前组件引入全局的util
  let Util = null;
  let store = null;
  export default {
    data() {
      return {
        viewTypes: '', // 视图类型
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: "/dept/tree-by-manager",
          getDataUrl: '',
          isShowMenus: true,
        },
        fromWhereTree: "user",

        //查询表单
        deleteUrl: '/role/remove',
        //当前tree选中的node id
        deptId: '',
        deptName: '',
        isClassNode: false,//本科生是否是班级节点
        nodeNumber: '',
      }
    },
    methods: {

      //初始化请求列表数据
      init() {
        Util = this.$util;
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
        if (obj.path.split('/').length === 6 && obj.types === 'BKS') {
          this.isClassNode = true;
        } else {
          this.isClassNode = false;
        }
        this.nodeNumber = obj.path.split('/').length
        this.viewTypes = obj.types;
//        console.log(obj.types)
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
        if (typeof obj.id!="undefined") {
          this.deptId = obj.id;
          this.deptName = obj.name;
        }
      },

      refreshTree(){
        this.$refs.leftTree.updataTree();
      },

    },

    //初始化组件
    created() {
      this.init();
    },

    components: {
      //当前组件引入的子组件
      depContent,
      zyyContent,
      sxsContent,
      yjsContent,
      jxsContent,
      bksContent,
      layoutTree,
      leftTree
    }
  }

</script>
<style>
  .add-remove {
    margin-bottom: 20px;
  }

  .header {
    height: 30px;
    font-size: 18px;
    color: #ffffff;
  }

</style>
