<template>
  <layout-tree>
    <!-- 左侧目录树 -->
    <tree-menu slot="left" @tree-click="treeClick" @setCurrSltNodeId="setCurrSltNodeId" :treeOptions="leftTreeOpt.treeDefaults"
      :fromWhereTreeType="leftTreeOpt.fromWhereTree"></tree-menu>
    <!-- 右侧内容 -->
    <div slot="right" id="content" ref="content" class="modal" style="padding:0;">
      <el-tabs v-model="acActiveName">
        <el-tab-pane label="评分" name="score">
          <assessment-content-score v-if="acActiveName == 'score'" :contenHeight="contenHeight" :treeId="treeId" :treeRoad="treeRoad"></assessment-content-score>
        </el-tab-pane>
        <el-tab-pane label="病例" name="case">
          <assessment-content-case v-if="acActiveName == 'case'" :contenHeight="contenHeight" :treeId="treeId" :treeRoad="treeRoad"></assessment-content-case>
        </el-tab-pane>
      </el-tabs>
    </div>
  </layout-tree>
</template>


<script>
  //当前组件引入全局的util
  let Util = null;
  let store = null;

  import api from './api'; // api

  // 左侧菜单树
  import layoutTree from "../../common/layoutTree";
  // 右侧内容
  import treeMenu from "./tree/menu";

  import assessmentContentScore from './assessmentContentScore/assessmentContentScore_list'; // 评分
  import assessmentContentCase from './assessmentContentCase/assessmentContentCase_list'; // 病例

  export default {
    data() {
      return {
        // 内容高度
        contenHeight: 100,
        // 默认激活视图
        acActiveName: '',
        treeRoadArr: [], // 节点路径数组
        treeRoad: '', // 节点路径
        treeId: 0, // 节点id
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;

        this.leftTreeOpt = { // 左侧菜单
          //tree默认项设置
          treeDefaults: {
            getTreeUrl: api.structure.path, // 获取数据api
            baseUrl: '/tree',
            getDataUrl: api.get.path,
            isShowSearch: false, // 隐藏搜索
            isShowMenus: true, // 隐藏操作菜单
            defaultProps: {
              label: 'treeName'
            },
            asyn: true,
          },
          fromWhereTree: "custom", // 菜单类型
          //deptId: '1', // 菜单选中id
        }
      },

      //---------------------------------- 左侧菜单树 ------------------------------------------//
      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       * @param node  {}  整个tree节点所有数据
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        // this.leftTreeOpt.deptId = obj.id;
        this.treeId = obj.id;
        // 获取节点路径
        this.treeRoad = obj.treeRoad;
        // this.getTreeRoadArr(node);
      },
      // 根据node来获取节点路径
      getTreeRoadArr(node) {
        let tag = true;
        let _node = node;
        this.treeRoadArr.length = 0;
        while (tag) {
          this.treeRoadArr[_node.level - 1] = _node.data.id;
          _node = _node.parent;
          if (_node.level === 0) {
            tag = false;
          }
        }
        this.treeRoad = this.treeRoadArr.join(',');
      },
      // 设置节点默认id
      setCurrSltNodeId(id, data) {
        this.treeId = id;
        this.treeRoad = data.treeRoad;
        this.acActiveName = 'score';
      },
      // 获取内容部分高度
      getContentHeight() {
        this.contenHeight = this.$refs.content.parentNode.offsetHeight;
      }
    },
    components: {
      layoutTree,
      treeMenu,
      assessmentContentScore,
      assessmentContentCase
    },
    created() {
      this.init()
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.getContentHeight);
      })
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

  .buttonList {
    &,
    .el-button--small {
      margin-bottom: 10px;
    }
  }

</style>
