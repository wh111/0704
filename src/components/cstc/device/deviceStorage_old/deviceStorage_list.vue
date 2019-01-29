<template>
  <!-- 设备入库 -->
  <div id="nosocomial" ref="nosocomial">
    <el-row>
      <el-col :xs="24" :md="14">
        <!-- 操作按钮 -->
        <div class="buttonList">
          <el-button size="small" type="success" @click="add">新建设备</el-button>
          <el-button size="small" type="primary" @click="edit">修改设备</el-button>
          <el-button size="small" type="danger" @click="remove">删除设备</el-button>
          <el-button size="small" type="warning" @click="storage">设备入库</el-button>
          <el-button size="small" type="info" @click="leadin">导入设备</el-button>
          <el-button size="small" type="info" @click="excelExport">导出设备</el-button>
          <el-button size="small" type="info" @click="print">打印二维码</el-button>
        </div>
      </el-col>
      <el-col :xs="5" :md="10" align="right">
        <!-- 搜索 -->
        <el-form :inline="true" class="el-form-item-search">
          <el-form-item label="设备名称：">
            <el-input size="small" v-model="deviceTypeName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <div id="deviceTable" ref="deviceTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                class="tableShowMoreInfo" ref="multipleTable"
                style="width: 100%" @selection-change="SelectionChangeDevice">
        <el-table-column type="expand">
          <template scope="props">
            <template v-if="props.row.deviceList && props.row.deviceList.length > 0">
              <keep-alive>
                <el-checkbox-group v-model="qrCodeIds" @change="selectQrCodeIds">
                  <!-- 更多数据 -->
                  <device-storage-more-info :rowData="props.row.deviceList" @edit="subCallback">
                    <template v-for="item in props.row.deviceList" :slot="`slot${item.id}`">
                      <el-checkbox :key="item.id" class="tsmiSonCheckBox" :label="item.id"
                                   @change="selectQrCodeItem(props.row.id)" :parentId="props.row.id">
                      </el-checkbox>
                    </template>
                  </device-storage-more-info>
                </el-checkbox-group>
              </keep-alive>
            </template>
            <p v-else align="center">暂无数据</p>
          </template>

        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
        <el-table-column label="名称" prop="deviceTypeName" show-overflow-tooltip></el-table-column>
        <el-table-column label="数量" prop="deviceNum" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.deviceNum || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="describes" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建人" prop="createrName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage"
                     :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 新增（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="800">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :depId="depId"
           :url-params="api.add" :url="api"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 打印二维码（add） -->
    <Modal :mask-closable="false" v-model="printModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="800">
      <modal-header slot="header" :content="button.printId"></modal-header>
      <print v-if="printModal" @cancel="cancel" :codeList="codeList" @print="subCallback"></print>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="1100">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :id="todoId"
            :url-params="api.modify"
            :get-url-params="api.get" :url="api"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题"
           class-name="vertical-center-modal" :loading="loading"
           :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal"
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
    <!-- 模态框 设备入库（storage） -->
    <Modal :mask-closable="false" v-model="storageModal" height="200" title="对话框标题"
           class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.storageId"></modal-header>
      <storage v-if="storageModal" @cancel="cancel" @storage="subCallback" :operaility-data="operailityData"
               :id="todoId" :depId="addDepId"
               :url-params="api.storage"></storage>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 导入设备（leadin） -->
    <Modal :mask-closable="false" v-model="leadinModal" height="200" title="对话框标题"
           class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="button.leadinId"></modal-header>
      <leadin v-if="leadinModal" :id="depId" :url="api" @cancel="cancel" @toChannel="subCallback"
              :operaility-data="operailityData"
              :url-params="api.leadin"></leadin>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  //当前组件引入全局的util
  let Util = null;
  let store = null;

  // API
  import api from './api';

  // 设备详细信息
  import deviceStorageMoreInfo from './deviceStorageMoreInfo/deviceStorageMoreInfo_list.vue';

  // 模态框
  import add from './deviceStorage_add'; // 增加
  import edit from './deviceStorage_edit'; // 删除
  import storage from './deviceStorageMoreInfo/deviceStorageMoreInfo_add'; // 设备入库
  import leadin from './deviceStorage_toChannel'; // 导入设备
  import print from './deviceStorageMoreInfo/deviceStorage_printCode.vue'

  export default {
    props: {
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      },
      depId: { // 部门id
        type: [Number],
        default: -1
      }
    },
    data() {
      return {
        printModal: false,

        tableAllIds: {}, // 记录表格中的所有id对应关系 id:{sid:[子id],index:所在行}
        tableDeviceListObj: {}, // 记录所有的设备供打印使用
        qrCodeIds: [],
        selectQrCodeItemParentId: '',

        codeList: [], // 需要打印二维码的数据

        self: this,
        api,
        // 表格数据
        totalCount: 0,
        tableData: [],
        deviceTypeName: '', // 搜索设备名称
        multipleSelection: '', // 选项
        operailityData: '', // 操作的数据
        loading: false,
        dynamicHt: 100,
        listTotal: 0,
        // 按钮
        button: {
          addId: {
            id: 'addId',
            title: '新建设备'
          },
          editId: {
            id: 'editId',
            title: '修改设备信息'
          },
          removeId: {
            id: 'removeId',
            title: '删除设备信息'
          },
          storageId: {
            id: 'storageId',
            title: '设备入库'
          },
          leadinId: {
            id: 'leadinId',
            title: '导入设备'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出设备'
          },
          printId: {
            id: 'printId',
            title: '打印二维码'
          }

        },
        storageModal: false,
        leadinModal: false,
        deriveModal: false,
        // 操作id
        todoId: '',
        // 设备入库的部门id的
        addDepId: '',
        derUrl: ''
      }
    },
    methods: {
      // 二维码选中事件回调
      selectQrCodeIds(arr) {
        let len = 0;
        let selObj = this.tableAllIds[this.selectQrCodeItemParentId];
        let sid = selObj.sid;
        arr.map(id => sid.includes(id) && ++len);
        if (len == sid.length) {
          this.$refs.multipleTable.toggleRowSelection(this.tableData[selObj.index]);
          selObj.selAll = true;
          console.log('全选')
        } else if (selObj.selAll) {
          this.$refs.multipleTable.toggleRowSelection(this.tableData[selObj.index]);
          selObj.selAll = false;
          console.log('单选')
        }
        console.log('qrIds', arr)
      },
      // 单个二维码选项选中回调事件
      selectQrCodeItem(id) {
        this.selectQrCodeItemParentId = id;
        console.log('选项的父级id：', id)
      },
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: this.api.list.path,
          method: this.api.list.method,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }
        this.setTableData();
      },
      //*--------------------------- 表格 -----------------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      SelectionChangeDevice(val) {
        let ids = [];
        let oldMultipleSelection = Util._.defaultsDeep([], this.multipleSelection);
        this.todoId = (val[0] && val[0].depId) || '';
        (oldMultipleSelection || []).map(item => this.tableAllIds[item.id].selAll = false);
        // 同时选中子选项
        val.map(item => {
          (item.deviceList || []).map(cItem => ids.push(cItem.id));
          this.tableAllIds[item.id].selAll = true;
        });
        this.multipleSelection = val;
        this.qrCodeIds = ids;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData() {
        this.tableData = [];
        this.queryQptions.params.depId = this.depId;
        this.queryQptions.params.deviceTypeName = this.deviceTypeName || '';
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        })
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data;
        let tableAllIds = {};
        let tableDeviceListObj = {};
        this.tableData.map(function (item, index) {
          tableAllIds[item.id] = {sid: [], index, selAll: false};
          if (item.deviceList) {
            for (var i = 0; i < item.deviceList.length; i++) {
              item.deviceList[i].deviceTypeName = item.deviceTypeName;
              tableAllIds[item.id].sid.push(item.deviceList[i].id);
              tableDeviceListObj[item.deviceList[i].id] = item.deviceList[i]
            }
          }
        })
          console.log(this.tableData)
          console.log(tableDeviceListObj)
          console.log(tableAllIds)
        console.log('表格行与id对应关系：', tableAllIds)
        this.tableAllIds = tableAllIds;
        this.tableDeviceListObj = tableDeviceListObj;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let deviceTable = this.$refs.deviceTable;
        let paginationHt = 50 * 2;
        this.dynamicHt = this.contenHeight - deviceTable.offsetTop - paginationHt;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected(isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess("请选择数据!");
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },
      /************************************** 模态框处理 **************************************************/
      // 增加
      add() {
        this.openModel('add')
      },
      print() {
        console.log(this.qrCodeIds)
        let codeList = [];
        if (this.qrCodeIds.length == 0) {
          this.showMess("请选择需要打印的数据!");
          return false;
        }
        this.qrCodeIds.map(id => codeList.push(this.tableDeviceListObj[id]));
        this.codeList = codeList;
        this.openModel('print');
      },
      // 编辑
      edit() {
        if (this.isSelected(true)) {
          this.todoId = this.multipleSelection[0].id;
          this.openModel('edit');
        }
      },
      // 查看
      show(id) {
        this.todoId = id;
        this.openModel('show');
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove() {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove')
        }
      },
      // 设备入库
      storage() {
        if (this.isSelected(true)) {
          this.todoId = this.multipleSelection[0].id;
          this.addDepId = this.multipleSelection[0].depId || 1;
          this.openModel('storage');
        }
      },
      // 导出设备
      excelExport() {
        if (this.isSelected()) {
          this.openModel('derive')
          let deviceTypeIds = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            deviceTypeIds.push(this.multipleSelection[i].id);
          }
          deviceTypeIds = deviceTypeIds.join(',');
          // let http = this.$store.getters.getEnvPath.http;
          this.derUrl = '/api/device/excelExport' + '?depId=' + this.depId + '&deviceTypeIds=' + deviceTypeIds
        }
      },
      // 导入设备
      leadin() {
        this.openModel('leadin')
      },
      // 搜索
      search() {
        this.queryQptions.params.curPage = 1; // 从第一页开始
        this.setTableData();
      },
      // 回调
      subCallback(target, title, updata) {
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
      openModel(options) {
        this[options + 'Modal'] = true;
      },

      //确定导出
      affirmDerive() {

        this.cancel('derive')
      },
    },
    components: {
      deviceStorageMoreInfo,
      add,
      print,
      edit,
      storage,
      leadin
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    created() {
      this.init()
    },
    watch: {
      contenHeight(val) {
        this.setTableDynHeight()
      },
      depId(val) {
        //   this.depId = val;
        this.deviceTypeName = '';
        this.setTableData();
      }
    },
  }

</script>

<style lang="scss">
  .tableShowMoreInfo {
    .el-table__expanded-cell {
      padding: 0;
    }
    .tsmiSonCheckBox {
      .el-checkbox__input {
        margin-right: 0;
      }
    }
  }

</style>
