<template>
  <layout-tree :hasLeft="deActiveName != 'manage'">
    <!-- 左侧目录树 -->
    <tree-menu v-if="deActiveName != 'manage'" slot="left" @tree-click="treeClick" :treeOptions="leftTreeOpt.treeDefaults" :fromWhereTreeType="leftTreeOpt.fromWhereTree"
      @setCurrSltNodeId="setCurrSltNodeId"></tree-menu>
    <!-- 右侧内容 -->
    <div slot="right" id="content" ref="content" class="modal" style="padding:0;">
      <el-tabs v-model="deActiveName">
        <el-tab-pane label="设备管理" name="manage">
          <device-manage v-if="deActiveName == 'manage'" :contenHeight="contenHeight" :depId="deptId"></device-manage>
        </el-tab-pane>
        <el-tab-pane label="设备入库" name="storage">
          <device-storage v-if="deActiveName == 'storage'" :contenHeight="contenHeight" :depId="deptId"></device-storage>
        </el-tab-pane>
        <el-tab-pane label="借用记录" name="loan">
          <device-loan v-if="deActiveName == 'loan'" :contenHeight="contenHeight" :depId="deptId"></device-loan>
        </el-tab-pane>
        <el-tab-pane label="维修记录" name="servicing">
          <device-servicing v-if="deActiveName == 'servicing'" :contenHeight="contenHeight" :depId="deptId"></device-servicing>
        </el-tab-pane>
        <el-tab-pane label="报废记录" name="Scrap">
          <device-scrap v-if="deActiveName == 'Scrap'" :contenHeight="contenHeight" :depId="deptId"></device-scrap>
        </el-tab-pane>
      </el-tabs>
    </div>
  </layout-tree>
</template>

<script>
  import treeApi from './treeApi';

  // 左侧菜单树
  import layoutTree from "../../common/layoutTree";
  // 右侧内容
  import treeMenu from "./tree/menu";

  // 设备管理
  import deviceManage from './deviceManage/deviceManage_list'
  // 设备入库
  import deviceStorage from "./deviceStorage/deviceStorage_list";
  // 借用记录
  import deviceLoan from './deviceLoan/deviceLoan_list';
  // 维修记录
  import deviceServicing from './deviceServicing/deviceServicing_list';
  // 报废记录
  import deviceScrap from './deviceScrap/deviceScrap_list';

  export default {
    data() {
      return {
        // 内容高度
        contenHeight: 100,
        // 默认激活视图
        deActiveName: 'manage', // storage
        // 左侧菜单
        leftTreeOpt: {
          //tree默认项设置
          treeDefaults: {
            getTreeUrl: treeApi.tree.path, //目录树结构请求地址
            baseUrl: treeApi.baseUrl,
            // getDataUrl: '', //获取目录树叶子节点请求数据地址
            isShowSearch: false, // 隐藏搜索
            isShowMenus: true, // 隐藏操作菜单
          },
          fromWhereTree: "user", // 菜单类型
        },
        deptId: -1, // 菜单选中id
      }
    },
    methods: {
      //---------------------------------- 左侧菜单树 ------------------------------------------//
      // 设置默认ID
      setCurrSltNodeId(id) {
        if (this.deptId && this.deptId != id) {
          this.deptId = id;
        }
//        this.deActiveName = 'manage'
      },
      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       * @param node  {}  整个tree节点所有数据
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        this.deptId = obj.id;
      },
      // 获取内容部分高度
      getContentHeight() {
        this.contenHeight = this.$refs.content.parentNode.offsetHeight;
      },
    },
    components: {
      layoutTree,
      treeMenu,
      deviceManage,
      deviceStorage,
      deviceLoan,
      deviceServicing,
      deviceScrap
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
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
