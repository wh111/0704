<template>
  <!-- 易耗品 -->
  <div>
    <el-form :inline="true" :model="formValidate" class="demo-form-inline">
      <el-row>
        <el-form-item label="价格筛选">
          <el-input style="width:200px;" v-model="formValidate.priceStart" placeholder="最低价格"></el-input>
          ～
          <el-input style="width: 200px;" v-model="formValidate.priceEnd" placeholder="最高价格"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit('formValidate')">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 操作按钮 -->
    <div class="buttonList">
      <el-button size="small" type="success" @click="add">新建耗材</el-button>
      <el-button size="small" type="primary" @click="edit">修改耗材</el-button>
      <el-button size="small" type="danger" @click="remove">删除耗材</el-button>
      <el-button size="small" type="warning" @click="storage">耗材入库</el-button>
      <el-button size="small" type="info" @click="leadin">导入耗材</el-button>
      <el-button size="small" type="info" @click="derive">导出耗材</el-button>
    </div>
    <!-- 表格数据 -->
    <div id="consumablesTable" ref="consumablesTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange" class="tableShowMoreInfo">
        <el-table-column type="expand">
          <template scope="props">
            <template v-if="props.row.storageList && props.row.storageList.length > 0">
              <keep-alive>
                <!-- 更多数据 -->
                <consumables-manage-info :rowData="props.row.storageList" @edit="subCallback"></consumables-manage-info>
              </keep-alive>
            </template>
            <p v-else style="line-height:40px;text-align:center;">暂无数据</p>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
        <el-table-column label="耗材名称" prop="consumablesName" show-overflow-tooltip></el-table-column>
        <el-table-column label="参考单价" prop="price" show-overflow-tooltip></el-table-column>
        <el-table-column label="库存" prop="stock" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.stock || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="describes" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="createrName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <el-button size="small" type="warning" @click="countCmb(scope.row)">盘点</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :url-params="api.add"></add>
      <div slot="footer"></div>
    </Modal>

    <!-- 模态框 设备入库（storage） -->
    <Modal :mask-closable="false" v-model="storageModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.storageId"></modal-header>
      <storage v-if="storageModal" @cancel="cancel" @storage="subCallback" :id="todoId"></storage>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 导入耗材（leadin） -->
    <Modal :mask-closable="false" v-model="leadinModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.leadinId"></modal-header>
      <leadin v-if="leadinModal" @cancel="cancel" :url="api" @toChannel="subCallback" :operaility-data="operailityData" :url-params="api.save"></leadin>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题" class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="button.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="derUrl">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click=" deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :id="todoId" :url-params="api.modify"
            :get-url-params="api.get"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
           :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 盘点 -->
    <Modal :mask-closable="false" v-model="addCountModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.addCountId"></modal-header>
      <consumables-count-add v-if="addCountModal" @cancel="cancel" @addCount="addCountDone" :operaility-data="operailityData"></consumables-count-add>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;

  import api from './api'; // api

  import add from './consumablesManage_add'; // 新建耗材
  import edit from './consumablesManage_edit'; // 新建耗材
  import consumablesManageInfo from './consumablesManageInfo/consumablesManageInfo_list'; // 耗材详细分类数据
  import storage from './consumablesManageInfo/consumablesManageInfo_add'; // 耗材详细信息入库
  import leadin from './consumablesManage_toChannel.vue'; // 导入设备
  import consumablesCountAdd from '../consumablesCount/consumablesCount_add'; // 盘点

  export default {
    props: {
      contenHeight: {
        type: Number,
        default: 860
      }
    },
    data () {
      return {
        api, // 当前模块api
        derUrl: '',
        formValidate: {
          priceStart: '',
          priceEnd: ''
        },
        operailityData: '', // 操作数据集
        multipleSelection: [], // 表格选中索引
        dynamicHt: 100, // 表格自适应高度
        self: this, // 标识
        // tableData: [], // 表格数据
        loading: false, // 加载动画状态
        totalCount: 0, // 总页数
        todoId: 0, // 当前操作id

        addCountModal: false,
        consumablesId: '', // 盘点的设备

        /* 表格测试数据 */
        tableData: [],

        /*--按钮button--*/
        button: {
          addId: {
            id: 'addId',
            title: '新建耗材'
          },
          editId: {
            id: 'editId',
            title: '修改耗材'
          },
          removeId: {
            id: 'removeId',
            title: '删除耗材'
          },
          storageId: {
            id: 'storageId',
            title: '耗材入库'
          },
          leadinId: {
            id: 'leadinId',
            title: '导入耗材'
          },
          addCountId: {
            id: 'addCountId',
            title: '盘点'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出设备'
          }
        },
        /* 其他模态框标识 */
        storageModal: false, // 消耗品入库
        leadinModal: false, // 消耗品导入库
        deriveModal: false // 消耗品导入库
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: this.api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        },

          this.listMessTitle = { //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
            paramsData: '', // 提交的数据对象
            ajaxSuccess: 'updateListData', // 成功回调函数
            ajaxParams: { // ajax 配置信息
              url: this.api.list.path, // ajax 请求URL
              method: this.api.list.method // ajax 请求方式 get|post|put....
            }
          };
        this.setTableData();
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
        Object.assign(this.queryQptions.params, this.formValidate);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let consumablesTable = this.$refs.consumablesTable;
        let paginationHt = 50 * 2 + 10;
        this.dynamicHt = this.contenHeight - consumablesTable.offsetTop - paginationHt;
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
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },
      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        this.setTableData();
      },
      /************************************** 模态框处理 **************************************************/
      // 增加
      add () {
        this.openModel('add');
      },
      // 编辑
      edit () {
        if (this.isSelected(true)) {
          this.todoId = this.multipleSelection[0].id;
          this.openModel('edit');
        }
      },
      // 查看
      show (id) {
        this.todoId = id;
        this.openModel('show');
      },
      // 盘点
      countCmb (row) {
        this.operailityData = row;
        this.openModel('addCount');
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove');
        }
      },
      // 耗材入库
      storage () {
        if (this.isSelected(true)) {
          this.todoId = this.multipleSelection[0].id;
          this.openModel('storage');
        }
      },
      // 导入耗材
      leadin() {
        this.openModel('leadin');
      },
      // 导出耗材
      derive () {
        let deviceTypeIds = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          deviceTypeIds.push(this.multipleSelection[i].id);
        }
        deviceTypeIds = deviceTypeIds.join(',');
        this.derUrl = '/api/consumables/excelExport?ids=' + deviceTypeIds;
        this.openModel('derive');
      },
      // 盘点完成返回盘点页面
      addCountDone (target, title, updata) {
//        this.subCallback(target, title, true);
        this.subCallback(target, title, updata);
        // 切换为盘点视图
//        this.$emit('show', 'count')
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

      //确定导出
      affirmDerive () {
        this.cancel('derive');

      }
    },
    components: {
      consumablesManageInfo,
      storage,
      leadin,
      add,
      edit,
      consumablesCountAdd
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    watch: {
      contenHeight (val) {
        this.setTableDynHeight();
      }
    },
    created () {
      this.init();
    }
  };

</script>

<style lang="scss">
  .tableShowMoreInfo {
    .el-table__expanded-cell {
      padding: 0;
    }
  }

</style>
