<template>
  <!-- 设备维修 -->
  <div>
    <!-- 操作按钮 -->
    <div class="roomButtonList" ref="buttonList">
      <el-button size="small" type="primary" @click="add">新建维修记录</el-button>
      <el-button size="small" type="info" @click="edit">修改维修记录</el-button>
      <el-button size="small" type="danger" @click="remove">删除维修记录</el-button>
    </div>
    <!-- 数据搜索 -->
    <el-row>
      <el-form :inline="true" :model="searchObj" ref="searchObj" label-width="86px" class="el-form-item-search">
        <el-col :span="4">
          <el-form-item label="设备名称：" prop="deviceTypeName">
            <el-input v-model="searchObj.deviceTypeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="设备编号：" prop="deviceIdentifier">
            <el-input v-model="searchObj.deviceIdentifier"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="创建人：" prop="createrName">
            <el-input v-model="searchObj.createrName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修时间：" prop="statrBeginTime">
            <date-group :dateGroup="{text:'',startDate:searchObj.statrBeginTime,endDate:searchObj.statrEndTime}">
              <el-date-picker name="start" v-model="searchObj.statrBeginTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
                @change="handleStartTime"></el-date-picker>
              <span>-</span>
              <el-date-picker name="end" v-model="searchObj.statrEndTime" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
                @change="handleEndTime"></el-date-picker>
            </date-group>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item style="margin-top:36px">
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 数据表格 -->
    <div id="tableData" ref="tableData">
      <el-table align="center" :context="self" :data="tableData" tooltip-effect="dark" :height="dynamicHt" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" width="140" align="left">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="warning" @click="borrowThis(scope.row)" :disabled="!!scope.row.endTime">归还</el-button>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="deviceTypeName" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备编号" prop="deviceIdentifier" show-overflow-tooltip></el-table-column>
        <el-table-column label="设备状态" prop="status" show-overflow-tooltip>
          <template scope="scope">
            <p>{{ scope.row.status | typeText }}</p>
          </template>
        </el-table-column>
        <el-table-column label="维修时间" prop="startTime" show-overflow-tooltip width="200">
          <template scope="scope">
            <p class="tagTime">
              <el-tag close-transition type="primary">开始：{{ scope.row.startTime | formatDate('yyyy-MM-dd HH:mm:ss') }}</el-tag>
            </p>
            <p class="tagTime" v-if="scope.row.endTime">
              <el-tag close-transition type="success">结束：{{ scope.row.endTime | formatDate('yyyy-MM-dd HH:mm:ss') }}</el-tag>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="维修费用" prop="cost" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.cost | money }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="createrName" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
        :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :depId="depId" :url-params="api.add"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :id="todoId" :depId="depId"
        :url-params="api.modify" :get-url-params="api.get"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
      :width="900">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData" :id="todoId" :url-params="api.get"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
      :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;

  // api
  import api from './api';

  // 模态框
  import add from './deviceServicing_add'; // 新增
  import edit from './deviceServicing_edit'; // 编辑
  import show from './deviceServicing_view'; // 查看

  export default {
    props: {
      contenHeight: { // 接收父组件的高度
        type: Number,
        default: 860
      },
      depId: { // 部门id
        type: [Number, String],
        default: ''
      }
    },
    data() {
      return {
        api,
        // 搜索
        searchObj: {
          // depId: '', // 部门id
          deviceTypeName: '', // 设备名称
          deviceIdentifier: '', // 设备编号
          createrName: '', // 创建人
          statrBeginTime: '', // 创建开始时间
          statrEndTime: '', // 创建结束时间
        },
        multipleSelection: [], // 选项
        operailityData: '', // 操作的数据
        self: this,
        loading: false,
        dynamicHt: 100, // 表格高度
        // 操作id
        todoId: '',
        totalCount: 0,
        tableData: [], // 表格数据
        //* 按钮 *//
        button: {
          addId: {
            id: 'addId',
            title: '新增维修记录'
          },
          showId: {
            id: 'showId',
            title: '查看维修记录'
          },
          editId: {
            id: 'editId',
            title: '修改维修记录'
          },
          removeId: {
            id: 'removeId',
            title: '删除维修记录'
          }
        }
      }
    },
    methods: {
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: this.api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize,
          }
        }

        this.setTableData()
      },

      //*----------- 表格 ------------*//
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj, {
          depId: this.depId
        });
        let params = this.queryQptions.params;
        params.statrBeginTime = this.conductDate(params.statrBeginTime, 'yyyy-MM-dd');
        params.statrEndTime = this.conductDate(params.statrEndTime, 'yyyy-MM-dd');
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let tableData = this.$refs.tableData;
        let paginationHt = 50 * 2;
        this.dynamicHt = this.contenHeight - tableData.offsetTop - paginationHt;
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 归还
      borrowThis(row) {
        this.ajax({
          ajaxSuccess: (res) => {
            this.successMess("归还成功!");
            this.setTableData();
          },
          ajaxError: () => this.errorMess("归还失败!"),
          ajaxParams: {
            url: api.modifyEndTime.path + row.id,
            method: api.modifyEndTime.method,
            data: {
              id: row.id
            }
          }
        })
      },
      /*----------- 模态框 -------------*/
      // 增加
      add() {
        this.openModel('add')
      },
      // 编辑
      edit() {
        if (this.isSelected(true)) {
          this.todoId = this.multipleSelection[0].id;
          this.openModel('edit');
        }
      },
      // 查看
      show(row) {
        this.todoId = row.id;
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
      // 搜索
      search() {
        this.setTableData()
      },
      // 增加回调
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

    },
    components: {
      add,
      edit,
      show
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
    watch: {
      contenHeight(val) {
        this.setTableDynHeight()
      },
      depId(val) {
        this.searchObj.statrEndTime = '';
        this.resetForm('searchObj');
        this.setTableData()
      }
    },
    created() {
      this.init();
      console.log(this.depId);
    }
  }

</script>

<style>
  p.tagTime {
    margin: 4px 0;
  }

</style>
