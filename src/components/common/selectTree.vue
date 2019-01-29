<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/8/7
****--@author   gx
-->
<template>
  <!--增加弹窗-->
  <Modal :mask-closable="false" v-model="typeModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="400">
    <modal-header slot="header" :content="typeId"></modal-header>
    <div style="height:500px;" v-if="typeModal">
      <div style="height:450px;">
        <left-tree slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" :treeOptions="treeDefaults" :fromWhereTreeType="'user'"></left-tree>
      </div>
      </br>
      <el-row>
        <el-col :span="16" :offset="2">
          <div style="margin-left: 100px">
            <load-btn @listenSubEvent="treeSubEvent" :btnData="treeBtn"></load-btn>
            <el-button @click="typeModal = false">取消</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['fromWhereTree', 'getTreeUrl', 'title'],
    data() {
      return {
        typeId: {
          id: 'typeId',
          title: this.title || '资源分类'
        },
        treeObj: {},
        deptId: '',
        typeModal: false,
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: this.getTreeUrl,
          isShowMenus: false,
          isShowSearch: false, //是否显示目录树查询
        },
        treeBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        updateTypeName: '',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        if (this.getTreeUrl) {
          this.treeDefaults.getTreeUrl = this.getTreeUrl;
        }
      },

      openModal() {
        this.typeModal = true;
      },

      //点击数的回调函数
      treeSubEvent() {
        this.typeModal = false;
        this.$emit('selectTree', this.deptId, this.updateTypeName, this.treeObj);
      },


      /*
       *  初始化或者刷新数列表的时候  调用treeClick函数 为deptId赋值
       * */
      treeClickInit(obj) {
        this.treeClick(obj)
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
        this.viewTypes = obj.types;
        this.setTreeDepId(obj.id, obj);
      },


      /*
       * 设置当前部门Id
       * */
      setTreeDepId(id, obj) {
        if (id) {
          this.deptId = id;
          this.updateTypeName = obj.name;
          this.treeObj = obj
        }
      },

    },
    created() {
      this.init();
    },
  }

</script>
