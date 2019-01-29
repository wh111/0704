<!--
****--@file     perteach_jxspy
****--@date     2018/10/18 17:20
****--@author   ZWT
****--@describe 进修生培养
-->
<template>
  <layout-tree>
    <left-tree slot="left" @tree-click="treeClick" @tree-remove-node="treeRemoveNode"
               :treeOptions="treeDefaults" ref="leftTree"
               :fromWhereTreeType="fromWhereTreeType"></left-tree>
    <!--默认 教师指标维护 -->
    <per-teach v-if="leaf" slot="right" admin="true" :deptId="deptId" :operaility-data="operailityData"
               @refreshTree="refreshTree"></per-teach>
  </layout-tree>
</template>
<script>
  /*当前组件必要引入*/
  import layoutTree from '../../../common/layoutTree.vue';
  import leftTree from '../../../common/leftTreeMaintain';
  import perTeach from './perteach_view';
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'perteach_jxspy',
    data () {
      return {
        viewTypes: 'jxspy', // 视图类型
        treeDefaults: {
          getTreeUrl: '/examination/achievetree/tree?code=' + 'teach_jxspy',
          getDataUrl: '',
          isShowMenus: true
        },
        fromWhereTreeType: 'teach_jxspy',
        //查询表单
        deleteUrl: '/role/remove',
        //当前tree选中的node id
        deptId: '',
        deptName: '',
        isClassNode: false,//本科生是否是班级节点
        nodeNumber: '',
        leaf: '',
        operailityData: {}
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      },
      treeClickInit (id, obj) {
        this.setTreeDepId(obj);
      },
      /*
     * 设置当前部门obj
     * */
      setTreeDepId (obj) {
        if (typeof obj.id != 'undefined') {
          this.deptId = obj.id;
          this.deptName = obj.name;
          this.leaf = obj.leaf;
        }
      },
      getData (obj) {
        console.log(obj);
        let options = {
          paramsData: 'listUrl',
          ajaxSuccess: 'loginSuccess',
          ajaxParams: {
            url: api.achieveproperties.path + obj,
            method: api.achieveproperties.method
          }
        };
        this.ajax(options);
      },
      loginSuccess (data) {
        this.operailityData = data.data;
      },
      treeClick (obj, node, self) {
        this.setTreeDepId(obj);
      },
      refreshTree () {
        this.$refs.leftTree.updataTree();
      },
      /*
      * 删除目录树回调
      *
      * */
      treeRemoveNode () {
        this.deptId = '';
      }
    },
    watch: {
      deptId (val) {
        this.getData(val);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      layoutTree, leftTree, perTeach
    }
  };
</script>

