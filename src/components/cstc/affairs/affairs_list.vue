<template>
  <!-- 中心事务 -->
  <div ref="affairs">
    <el-form :inline="true">
      <el-row>
        <el-col :span="13">
          <el-button type="primary" @click="add">新建事项</el-button>
          <el-button type="success" @click="edit">修改事项</el-button>
          <el-button type="danger" @click="remove">删除事项</el-button>
          <el-button type="info" @click="toChannel">导入事项</el-button>
          <el-button type="info" @click="derive">导出事项</el-button>
          <!-- <el-button type="info">导出Excel</el-button> -->
        </el-col>
        <el-col :span="11" align="right">
          <el-form-item label="事项名称：">
            <el-input v-model="searchObj.affairName" style="width: 150px"></el-input>
            <el-button type="info" @click="search">搜索</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
          <date-group :dateGroup="{text:'',startDate:searchObj.startTimeBegin,endDate:searchObj.startTimeEnd}" style="display:inline-block;">
            <el-form-item label="接待开始时间：">
              <el-date-picker name="start" v-model="searchObj.startTimeBegin" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
                              @change="handleStartTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="-">
              <el-date-picker name="end" v-model="searchObj.startTimeEnd" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
                              @change="handleEndTime"></el-date-picker>
            </el-form-item>
          </date-group>
          <date-group :dateGroup="{text:'',startDate:searchObj.endTimeBegin,endDate:searchObj.endTimeEnd}" style="display:inline-block;">
            <el-form-item label="接待结束时间：">
              <el-date-picker name="start" v-model="searchObj.endTimeBegin" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
                              @change="handleStartTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="-">
              <el-date-picker name="end" v-model="searchObj.endTimeEnd" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
                              @change="handleEndTime"></el-date-picker>
            </el-form-item>
          </date-group>

          <el-form-item label="接待对象：">
            <el-input v-model="searchObj.receptionObject"></el-input>
          </el-form-item>

          <el-form-item label="事务类型：">
            <el-select placeholder="请选择" v-model="searchObj.affairType" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in typeOption" :key="index" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人数：">
            <el-input v-model="searchObj.peopleNum"></el-input>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="affairName" label="事项名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" label="接待开始时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endTime" label="接待结束时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="affairType" label="类型" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.affairType | affairType(self) }}
          </template>
        </el-table-column>
        <el-table-column prop="receptionObject" label="接待对象" show-overflow-tooltip>
          <template scope="scope">
            {{ (scope.row.receptionObject || '-').replace(/,/g,'、') }}
          </template>
        </el-table-column>
        <el-table-column prop="peopleNum" label="人数" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.peopleNum || 0 }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!--增加弹窗-->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback"></add>
      <div slot="footer"></div>
    </Modal>

    <!--编辑弹窗-->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>

    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="960">
      <modal-header slot="header" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>

    <!--删除弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" class-name="vertical-center-modal" :loading="loading" :width="500">
      <modal-header slot="header" :content="headerContent.removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--导入弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="toChannelModal" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="headerContent.toChannelId"></modal-header>
      <toChannel v-if="toChannelModal" @toChannel="subCallback" @cancel="cancel" :operaility-data="operailityData"></toChannel>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="headerContent.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="exportUrl">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  let Util = null;
  import api from './api';
  //  import typeOption from './typeOption'; // 事务类型
  //  import userOption from './userOption'; // 事务类型

  // 引入操作模态组件
  import add       from './affairs_add'; // 增加
  import edit      from './affairs_edit'; // 编辑
  import show      from './affairs_view'; // 编辑
  import toChannel from './affairs_toChannel.vue';

  export default {
    data () {
      return {
        api,
//        userOption,
        exportUrl: '',
        typeOption: {},
        toChannelModal: false,
        deriveModal: false,
        searchMore: false,
        searchObj: {
          affairName: '', // 事务名称
          startTimeBegin: '', // 接待开始时间开始
          startTimeEnd: '', // 接待开始时间结束
          endTimeBegin: '', // 接待结束时间开始
          endTimeEnd: '', // 接待结束时间结束
          receptionObject: '', // 接待对象
          affairType: '', // 事务类型
          peopleNum: '' // 人数
//          registerStartDate: '', // 开始日期
//          registerEndDate: '', // 结束日期
//          affairType: '', // 事务类型
//          department: '', // 使用部门
//          trainingObject: '', // 培训/考核对象
        },
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        loading: false,
        operailityData: [],
        multipleSelection: [],
        tableData: [], // 缺少 classhour
        totalCount: 0,
        headerContent: {
          addId: {
            id: 'add',
            title: '新增事务'
          },
          editId: {
            id: 'edit',
            title: '修改事务'
          },
          showId: {
            id: 'show',
            title: '查看事务'
          },
          removeId: {
            id: 'remove',
            title: '删除事务'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出事务'
          },
          toChannelId: {
            id: 'toChannelId',
            title: '导入事务'
          }
        }
      };
    },
    methods: {
      init: function () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.getTypeOption();
//        this.setTableData()
      },
      getTypeOption () {
        let opt = {
          ajaxSuccess: res => {
            if (!res.data.length) {
              return;
            }
            res.data.map(item => {
              this.typeOption[item.code] = item;
            });
            this.setTableData();
          },
          ajaxParams: {
            url: api.getAffairType.path,
            method: api.getAffairType.method
          }
        };
        this.ajax(opt);
      },
      /********************************* 按钮事件 *****************************/
      // 搜索
      search () {
        this.setTableData();
      },
      // 筛选
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          if (this.searchMore) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
          } else {
            this.tabHeight = this.dynamicHt;
          }
        });
      },
      // 增加
      add () {
        this.openModel('add');
      },
      // 修改
      edit () {
        if (this.isSelected(true)) {
          this.operailityData = this.multipleSelection[0];
//          if (this.operailityData.affairType == 'TRAIN') {
//            this.errorMess('该类型不能修改！');
//            return false;
//          }
          this.openModel('edit');
        }
      },
      // 查看
      show (row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 删除
      remove () {
        if (this.isSelected()) {
          this.operailityData = this.multipleSelection;
          this.openModel('remove');
        }
      },

      //导入
      toChannel () {
        this.openModel('toChannel');
      },

      //导出
      derive () {
        if (this.isSelected()) {
          this.getDeriveURL();
          this.openModel('derive');
        }
      },

      // 获取导出URL
      getDeriveURL () {
        let ids = [];
        if (this.multipleSelection.length) {
          this.multipleSelection.map(item => ids.push(item.id));
        }
        this.exportUrl = '/api/' + api.excelExport + ids.join(',');
      },

      //确定导出
      affirmDerive () {
        this.cancel('derive');
      },
      /********************************* 表格相关 *****************************/
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData (isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        let params = this.queryQptions.params;
        params.startTimeBegin = this.conductDate(params.startTimeBegin, 'yyyy-MM-dd');
        params.startTimeEnd = this.conductDate(params.startTimeEnd, 'yyyy-MM-dd');
        params.endTimeBegin = this.conductDate(params.endTimeBegin, 'yyyy-MM-dd');
        params.endTimeEnd = this.conductDate(params.endTimeEnd, 'yyyy-MM-dd');
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
        let contenHeight = this.$refs.affairs.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
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
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      // 弹窗回调
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
      }
    },
    components: {
      add,
      edit,
      show,
      toChannel
    },
    created () {
      this.init();
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
    }
  };

</script>
