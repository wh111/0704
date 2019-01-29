<template>
  <div>
    <el-row>
      <el-col style="height:300px;">
        <left-tree @tree-click="treeClick" :treeOptions="leftTreeOpt.treeDefaults" :fromWhereTreeType="leftTreeOpt.fromWhereTree"></left-tree>
      </el-col>
      <el-col align="center" style="margin-top:20px">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  let Util = null;

  import treeApi from '../api'; // tree api 

  import leftTree from '../tree/menu'; // 树菜单

  export default {
    props: {
      todoId: { // 操作id
        type: Object,
        default: () => ({
          id: 0,
          treeId: 0,
          treeRoad: ''
        })
      },
      urlParams: { // 编辑
        type: Object,
        required: true
      }
    },
    data() {
      return {
        treeApi,
        selectTree: {
          treeId: '',
          treeRoad: '',
        },
        treeRoadArr: [],
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        fromWhereTree: "user", // 菜单类型
        deptId: '',
        //当前组件提交数据时,ajax处理的 基础信息设置
        moveMessTitle: {
          type: 'move',
          successTitle: '移动成功!',
          errorTitle: '移动失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: `${this.urlParams.path}/${this.todoId.id}`,
            method: this.urlParams.method
          }
        }
      }
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {

        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        this.moveMessTitle.ajaxParams.data = Util.getFormData({
          id: this.todoId.id
        }, this.selectTree);

        this.ajax(this.moveMessTitle, isLoadingFun)
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
        this.setTreeDepId(obj.id);
        this.setTreeObj(obj);
        // this.getTreeRoadArr(node);
      },
      /*
       * 设置菜单树选中id
       */
      setTreeDepId(id) {
        this.deptId = id;
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
        this.selectTree.treeRoad = this.treeRoadArr.join(',');
      },
      /*
       * 设置菜单相关信息（传给子组件） 
       */
      setTreeObj(obj) {
        this.selectTree.treeId = obj.id;
        this.selectTree.treeRoad = obj.treeRoad;
      },
      /*
       * 根据部门id查询当前部门的人员信息
       * @param id number 当前部门id
       * */
      showTreeList(id) {
        //初始化加载页面信息
        let params = Util._.defaultsDeep({}, this.queryQptions, {
          deptId: id
        });
        let listMessTitle = Util._.defaultsDeep({}, this.listMessTitle);
        listMessTitle.ajaxParams["params"]["deptId"] = id;
        this.postParamToServer(listMessTitle);
      },
      //向服务器发送数据
      postParamToServer(options) {
        if (this.deptId != "") {
          options["ajaxParams"]["params"]["deptId"] = this.leftTreeOpt.deptId;
        }
        this.ajax(options);
      },
      init() {

        this.leftTreeOpt = { // 左侧菜单
          //tree默认项设置
          treeDefaults: {
            getTreeUrl: treeApi.structure.path, // 获取数据api
            baseUrl: treeApi.baseUrl.path,
            getDataUrl: treeApi.structure.path,
            isShowSearch: false, // 隐藏搜索
            isShowMenus: false, // 隐藏操作菜单
            defaultProps: {
              label: 'treeName'
            },
            asyn: true,
          },
          fromWhereTree: "custom", // 菜单类型
          //deptId: '1', // 菜单选中id
        }
      }
    },
    components: {
      leftTree
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    }
  }

</script>
