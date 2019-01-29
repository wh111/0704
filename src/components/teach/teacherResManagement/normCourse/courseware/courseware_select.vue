<template>
  <!-- 选择课件资源 -->
  <div>
    <el-tabs v-model="viewType" @tab-click="handleClick">
      <el-tab-pane label="视频库" name="video"></el-tab-pane>
      <el-tab-pane label="文档文献" name="literature"></el-tab-pane>
      <el-tab-pane label="医学图谱" name="atlas"></el-tab-pane>
      <el-tab-pane label="病例库" name="cases"></el-tab-pane>
    </el-tabs>
    <el-row>
      <el-col :span="16">
        <layout-tree style="height:500px">
          <template slot="left">
            <left-tree v-if="treeType === 'video'" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
            <left-tree v-if="treeType === 'literature'" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
            <left-tree v-if="treeType === 'cases'" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
            <left-tree v-if="treeType === 'atlas'" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
          </template>
          <!-- 标准课程 -->
          <div slot="right" id="content" ref="content">
            <el-form :model="formValidate" ref="formValidate" :inline="true">
              <!-- 搜索框 -->
              <el-col>
                <el-form-item label="名称:" prop="name">
                  <el-input v-if="viewType === 'video'" placeholder="名称" v-model="formValidate.name" style="width:200px;" :maxlength="51">
                    <el-button slot="append" icon="search" @click="search"></el-button>
                  </el-input>
                  <el-input v-else placeholder="名称" v-model="formValidate.title" style="width:200px;" :maxlength="51">
                    <el-button slot="append" icon="search" @click="search"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-form>
            <!-- 数据表格 -->
            <div ref="tableView">
              <el-table @selection-change="handleSelectionChange" align="center" :context="self" :height="406" :data="tableData" tooltip-effect="dark" style="width: 100%">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="名称" align="center" show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.name || scope.row.title }}
                  </template>
                </el-table-column>
                <el-table-column label="查看次数" prop="viewNum" show-overflow-tooltip></el-table-column>
                <el-table-column label="上传时间" prop="createTime" show-overflow-tooltip>
                  <template scope="scope">
                    {{ (scope.row.createTime || '-') | formatDate('yyyy-MM-dd HH:mm') }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页按钮 -->
            <div style="float: right;margin-top:10px;">
              <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
            </div>
          </div>
        </layout-tree>
      </el-col>
      <el-col :span="8">
        <el-form align="center">
          <el-form-item label="已选资源"></el-form-item>
        </el-form>
        <el-table @selection-change="selectTableDataChange" ref="selectTableData" align="center" :context="self" :height="406" :data="selectTableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="名称" align="center" prop="title" show-overflow-tooltip></el-table-column>
          <el-table-column label="资源类型" prop="resourceType" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.resourceType | resourceType }}
            </template>
          </el-table-column>
          <el-table-column label="查看次数" prop="viewNum" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
      <el-col align="center">
        <el-button type="info" @click="save">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  let Util = null;
  import api from './selectApi';
  import layoutTree from "../../../../common/layoutTree";
  import leftTree from "../../../../common/leftTree";
  export default {
    data() {
      return {
        viewType: 'video',
        treeType: 'video',
        self: this,
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: api.resourceTypeTree.path + 'VIDEO',
          getDataUrl: '',
          isShowMenus: false,
          isShowSearch: false, //是否显示目录树查询
        },
        fromWhereTree: "user",

        //当前tree选中的node id
        deptId: 1,
        totalCount: 0,
        tableData: [],
        selectTableData: [],
        selectTableDataArr: [],
        selectTableDataId: [],

        formValidate: {
          name: '',
          title: ''
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
      },

      // 搜索
      search() {
        this.setTableData();
      },
      // 切换分类
      handleClick() {
        if (this.treeType == this.viewType) {
          return
        }
        this.formValidate.name = '';
        this.formValidate.title = '';
        this.tableData.length = 0;
        this.treeDefaults.getTreeUrl = api.resourceTypeTree.path + this.viewType.toLocaleUpperCase();
        this.treeType = this.viewType;
      },

      // 确定
      save() {
        this.$emit('select', this.selectTableDataArr)
      },

      //初始化加载列表数据
      setTableData() {
        let opt = {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api[this.viewType].path,
            params: {}
          }
        }
        opt.ajaxParams.params = Object.assign(opt.ajaxParams.params, this.queryQptions.params, this.formValidate);
        this.postParamToServer(opt);
      },
      //向服务器发送数据
      postParamToServer(options) {
        if (this.deptId != "") {
          options.ajaxParams.params.typeId = this.deptId;
          this.ajax(options);
        }
      },
      //通过get请求列表数据
      updateListData(responseData) {
        if (!responseData.data) return;
        this.tableData = responseData.data || [];
        this.totalCount = responseData.totalCount || 0;
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        if (!val.length) {
          return
        }
        let selArr = [];
        val.map(item => {
          let temp = {
            "number": this.viewType + item.id, // 排重使用
            "fileId": item.fileId || '', // 文件ID
            "title": item.name || item.title, // 课件显示名称
            "fileName": item.fileName || '', //文件名称
            "filePath": item.pdf || item.filePath || '', //文件路径
            "fileType": item.fileType || '', //文件类型
            "fileSize": item.size || item.fileSize || '', //文件大小
            "viewNum": item.viewNum || 0, // 播放次数
            "resourceId": item.id, // 原资源id
            "resourceType": this.viewType.toLocaleUpperCase(), // 资源类型
          };
          if (this.selectTableDataId.indexOf(temp.number) > -1) {
            temp = null;
            return
          }
          this.selectTableDataId.push(temp.number);
          this.selectTableData.push(temp);
          this.$nextTick(() => {
            // 默认选中
            this.$refs.selectTableData.toggleRowSelection(temp);
          })
        })
      },

      // 在选择表中再选
      selectTableDataChange(val) {
        this.selectTableDataArr = val;
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
       *  初始化或者刷新数列表的时候  调用treeClick函数 为deptId赋值
       * */
      treeClickInit(obj) {
        this.treeClick(obj);
      },

      /*
       * 设置当前部门Id
       * */
      setTreeDepId(id, obj) {
        if (id) {
          this.deptId = id;
          this.typeName = obj.name;
        };
        this.setTableData()
      },
    },
    //初始化组件
    created() {
      this.init();
    },
    filters: {
      resourceType(val) {
        let type = {
          VIDEO: '视频库',
          LITERATURE: '文档文献',
          CASES: '病例库',
          ATLAS: '医学图谱',
        }
        return type[val]
      }
    },
    components: {
      //当前组件引入的子组件
      layoutTree,
      leftTree
    },
  }

</script>

<style>
  /* 选择课件资源 */

</style>
