<template>
  <!-- 病例 -->
  <div>
    <el-row>
      <el-col>
        <!-- 操作按钮 -->
        <div class="buttonList">
          <el-button size="small" type="success" @click="add">新建病例</el-button>
          <el-button size="small" type="danger" @click="remove">删除病例</el-button>
          <el-button size="small" type="warning" @click="cases">导入病例</el-button>
          <el-button size="small" type="info" @click="exportFile('excel')">导出到Excel</el-button>
          <el-button size="small" type="info" @click="exportFile('word')">导出到World</el-button>
          <el-button size="small" type="info" @click="scripts">导入剧本</el-button>
          <el-button size="small" type="info" @click="exportFile('script')">导出剧本</el-button>
          <el-button size="small" type="info" @click="move">移动</el-button>
          <el-button size="small" type="info" @click="copy">复制</el-button>
        </div>
      </el-col>
      <!-- 搜索 -->
      <el-col>
        <el-form :inline="true" class="el-form-item-search" ref="searchObj" :model="searchObj" onsubmit="return false">
          <el-form-item label="病例名称：" prop="caseName">
            <el-input size="small" v-model="searchObj.caseName"></el-input>
          </el-form-item>
          <!--<el-form-item label="创建时间：" prop="createTime">
        <el-date-picker v-model="searchObj.createTime" type="datetime" placeholder="选择时间">
        </el-date-picker>
      </el-form-item>-->
          <el-form-item label="是否有剧本：" prop="isScript">
            <el-radio-group v-model="searchObj.isScript">
              <el-radio label="">全部</el-radio>
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <div id="deviceTable" ref="deviceTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="warning" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="病例名称" prop="caseName" show-overflow-tooltip></el-table-column>
        <el-table-column label="是否有剧本" prop="isScript" show-overflow-tooltip>
          <template scope="scope">
            {{ (scope.row.isScript || '0') | typeText }}
          </template>
        </el-table-column>
        <el-table-column label="患者性别" prop="sex" show-overflow-tooltip></el-table-column>
        <el-table-column label="患者年龄" prop="age" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="createName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :url-params="api.add" :todoId="todoId"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :url-params="{modify:api.modify,get:api.get}"
            :todoId="todoId"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
           :width="1000">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :todoId="todoId" :url-params="api.get"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
           :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 导入剧本（script） -->
    <Modal :mask-closable="false" v-model="scriptsModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="button.scriptId"></modal-header>
      <scripts v-if="scriptsModal" :id="treeId" :treeRoad="treeRoad" :url="api" @cancel="cancel" @scripts="subCallback" :operaility-data="operailityData"
               :url-params="api.save"></scripts>
      <div slot="footer"></div>
    </Modal>
    <!--导出剧本弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题" class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="deriveData.titleId"></modal-header>
      <div>
        <div class="remove">{{deriveData.title}}</div>

        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="exportURL">
              <el-button @click="affirmDerive(deriveData.type)" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 导入病例（case） -->
    <Modal :mask-closable="false" v-model="casesModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="840">
      <modal-header slot="header" :content="button.casesId"></modal-header>
      <cases v-if="casesModal" :id="treeId" :treeRoad="treeRoad" :url="api" @cancel="cancel" @cases="subCallback" :operaility-data="operailityData"
             :url-params="api.save"></cases>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 复制（copy） -->
    <Modal :mask-closable="false" v-model="copyModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :content="button.copyId"></modal-header>
      <copy v-if="copyModal" @cancel="cancel" @copy="subCallback" :operaility-data="operailityData" :url-params="{add:api.add,get:api.get}"
            :todoId="todoId"></copy>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 移动（move） -->
    <Modal :mask-closable="false" v-model="moveModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="button.moveId"></modal-header>
      <move v-if="moveModal" @cancel="cancel" @move="subCallback" :operaility-data="operailityData" :url-params="api.modifyTree"
            :todoId="todoId"></move>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;
  let store = null;

  import api from './api'; // api

  import add from './assessmentContentCase_add'; // 增加
  import edit from './assessmentContentCase_edit'; // 编辑
  import copy from './assessmentContentCase_copy'; // 复制
  import show from './assessmentContentCase_view'; // 查看
  import move from './assessmentContentCase_move'; // 移动
  import cases from './caseToChannel/case_toChannel.vue'; // 导入病例
  import scripts from './caseToChannel/script_toChannel.vue'; // 导入剧本

  export default {
    props: {
      treeId: {
        type: Number,
        default: 1
      },
      treeRoad: {
        type: String,
        default: '1'
      },
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      }
    },
    data () {
      return {
        api,
        self: this,
        loading: false,
        dynamicHt: 100,
        totalCount: 0,
        tableData: [],
        exportURL: '',
        searchObj: { // 搜索数据集
          caseName: '', // 病例名称
          isScript: '' // 是否有病例 1|是 0|否
          // createTime: '' // 创建时间 （无此键）
        },
        leadinModal: false,
        copyModal: false,
        moveModal: false,
        casesModal: false,
        scriptsModal: false,
        deriveModal: false,
        deriveData: { //导入弹窗
          titleId: '',
          title: ''
        },
        operailityData: '',
        multipleSelection: [],
        // 操作id
        todoId: {},
        //* 按钮 *//
        button: {
          addId: {
            id: 'addId',
            title: '新增病例'
          },
          showId: {
            id: 'showId',
            title: '查看病例'
          },
          editId: {
            id: 'editId',
            title: '修改病例'
          },
          removeId: {
            id: 'removeId',
            title: '删除病例'
          },
          leadinId: {
            id: 'leadinId',
            title: '导入病例'
          },
          copyId: {
            id: 'copyId',
            title: '复制病例'
          },
          moveId: {
            id: 'moveId',
            title: '移动病例'
          },
          scriptId: {
            id: 'scriptId',
            title: '导入剧本'
          },
          deriveScriptsId: {
            id: 'deriveScriptsId',
            title: '导出剧本'
          },
          casesId: {
            id: 'casesId',
            title: '导入病例'
          }
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.initTree();
        this.setTableData();
      },
      // 初始化树信息
      initTree () {
        this.todoId = {
          treeId: this.treeId,
          treeRoad: this.treeRoad,
          id: null
        }
      },
      //*--------------------------- 表格 -----------------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj, {
          treeId: this.treeId,
          treeRoad: this.treeRoad
        });
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let deviceTable = this.$refs.deviceTable;
        let paginationHt = 50 * 2;
        this.dynamicHt = this.contenHeight - deviceTable.offsetTop - paginationHt;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!')
          flag = false;
        }
        return flag;
      },
      // 重置搜索
      resetForm (formName) {
        this.$refs[formName].resetFields();
      },
      /************************************** 模态框处理 **************************************************/
      // 增加
      add () {
        this.todoId.id = null;
        this.openModel('add')
      },
      // 编辑
      edit (row) {
        this.todoId.id = row.id;
        // console.log(row)
        this.openModel('edit');
      },
      // 查看
      show (row) {
        this.todoId.id = row.id;
        this.openModel('show');
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove () {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },

      // 导入病例
      cases () {
        this.openModel('cases')
      },

      //导入剧本
      scripts () {
        this.openModel('scripts')
      },

      // 复制
      copy () {
        if (this.isSelected(true)) {
          this.todoId.id = this.multipleSelection[0].id
          this.openModel('copy')
        }
      },
      // 移动
      move () {
        if (this.isSelected(true)) {
          this.todoId.id = this.multipleSelection[0].id
          this.openModel('move')
        }
      },
      // 搜索
      search () {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.setTableData();
      },
      // 增加回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      /**************** 导出 *****************************/
      // 导出
      exportFile (type) {
        let deriveData = null;
        let idsArr = [];
        if (type == 'excel') {
          deriveData = {
            titleId: {
              id: 'deriveScriptsId',
              title: '导出到excel'
            },
            title: '确定导出到excel吗？',
            type: 'excelExport'

          }
        } else if (type == 'word') {
          deriveData = {
            titleId: {
              id: 'deriveScriptsId',
              title: '导出到Word'
            },
            title: '确定导出到Word吗？',
            type: 'wordExport'

          }
        } else if (type == 'script') {
          deriveData = {
            titleId: {
              id: 'deriveScriptsId',
              title: '导出剧本'
            },
            title: '确定导出剧本吗？',
            type: 'scriptWordExport'
          }
          if (!this.multipleSelection.length) {
            this.errorMess('请选择需要导出剧本的病例！')
            return
          }
        }
        if (!deriveData) {
          return
        }
        this.multipleSelection.map(item => {
          idsArr.push(item.id);
        });
        this.deriveData = deriveData;
        this.exportURL = `/api/${api[deriveData.type].path}?treeId=${this.treeId}&treeRoad=${this.treeRoad}&ids=${idsArr.join(',')}`
        this.openModel('derive')
        /*  let idsArr = [];
          this.multipleSelection.map(item => {
            idsArr.push(item.id);
            // console.log(item);
          });
          this.ajax({
            successTitle: `导出${type}成功!`,
            errorTitle: `导出${type}失败!`,
            ajaxParams: {
              url: api[type + 'Export'].path,
              method: api[type + 'Export'].method,
              params: {
                treeId: this.treeId,
                treeRoad: this.treeRoad,
                ids: idsArr.join(',')
              }
            }
          })*/
      },

      //确定导出
      affirmDerive (type) {
        //let http = this.$store.getters.getEnvPath.http;
//        let idsArr = [];
//        this.multipleSelection.map(item => {
//          idsArr.push(item.id);
//        });
//        window.open(`/api/${api[type].path}?treeId=${this.treeId}&treeRoad=${this.treeRoad}&ids=${idsArr.join(',')}`);
        this.cancel('derive')
      }

    },
    components: {
      add,
      edit,
      show,
      copy,
      scripts,
      cases,
      move
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      })
    },
    watch: {
      contenHeight (val) {
        this.setTableDynHeight()
      },
      treeId (val) {
        this.initTree();
        this.resetForm('searchObj');
        this.setTableData();
      }
    },
    created () {
      this.init()
    }
  }

</script>
