<!--
****--@file     roomReserveSituation-list
****--@date     2018/7/20 10:44
****--@author   YC
****--@describe 预约房间情况
-->
<template>
  <div ref="roomReserve">
    <el-row>
      <el-col :span="8">
        <!-- 操作按钮 -->
        <el-button @click="derive" type="info">{{ 'export' | sysLan }}</el-button>
      </el-col>
      <!-- 搜索框 -->
      <el-col :span="16" align="right">
        <el-form :inline="true">
          <el-form-item label="预约名称：">
            <el-input placeholder="请输入预约名称" v-model="searchObj.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" type="info" v-if="!showMoreSearch">查询</el-button>
            <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">高级查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 多条件 -->
    <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
      <el-form :inline="true">
        <el-form-item label="申请时间:">
          <date-group :dateGroup="{text:'',startDate:searchObj.startDate,endDate:searchObj.endDate}">
            <el-date-picker name="start" v-model="searchObj.startDate" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
                            @change="handleStartTime"></el-date-picker>
            <span>-</span>
            <el-date-picker name="end" v-model="searchObj.endDate" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
                            @change="handleEndTime"></el-date-picker>
          </date-group>
        </el-form-item>
        <el-form-item label="预约状态:">
          <el-select v-model="searchObj.status" placeholder="请选择" clearable>
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用类型:">
          <el-select v-model="searchObj.useType" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in useType" :key="item.code" :label="item.value" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间号:">
          <el-select v-model="searchObj.roomId" filterable placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in rooms" :key="item.id" :label="item.roomNum" :value="item.roomId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-right:0;">
          <el-button @click="search" type="info">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格数据 -->
    <div id="tableView" ref="tableView">
      <el-table align="center" :height="tableHeight" :context="self" :data="tableData" tooltip-effect="dark" class="tableShowMoreInfo" style="width: 100%;"
                @selection-change="handleSelectionChange">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <!--<el-table-column label="操作" width="260">-->
        <!--<template scope="scope">-->
        <!--<el-button size="small" type="info" @click="show(scope.row)">查看</el-button>-->
        <!--<el-button size="small" type="success" :disabled="!['REPORTED'].includes(scope.row.status)" @click="changStatus(scope.row,'ADOPT')">通过</el-button>-->
        <!--<el-button size="small" type="danger" :disabled="!['REPORTED'].includes(scope.row.status)" @click="changStatus(scope.row,'REJECT')">驳回</el-button>-->
        <!--<el-button size="small" type="warning" :disabled="!['REPORTED'].includes(scope.row.status)" @click="edit(scope.row)">修改</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="预约名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请人" prop="applicantName" show-overflow-tooltip width="100"></el-table-column>
        <el-table-column label="房间号" prop="roomReserveDetailsList" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.roomReserveDetailsList | getRoomNum }}
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="roomReserveDetailsList" show-overflow-tooltip>
          <template scope="scope">
            <template v-if="scope.row.roomReserveDetailsList.length>1">
              <p v-for="(item,index) in scope.row.roomReserveDetailsList" :key="index">
                {{ item.roomNum }}：{{ item.date | formatDate('yyyy-MM-dd') }} ({{item.startTime}}-{{item.endTime}})
              </p>
            </template>
            <p v-else>
              {{ scope.row.roomReserveDetailsList[0].date | formatDate('yyyy-MM-dd')
              }} ({{scope.row.roomReserveDetailsList[0].startTime}}-{{scope.row.roomReserveDetailsList[0].endTime}})
            </p>
          </template>
        </el-table-column>
        <el-table-column label="使用类型" prop="useType" show-overflow-tooltip width="100">
          <template scope="scope">
            {{ scope.row.useType | affairType(self) }}
          </template>
        </el-table-column>
        <el-table-column label="预约状态" prop="status" show-overflow-tooltip width="100">
          <template scope="scope">
            {{ scope.row.status | roomReserve }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>

    <!-- 查看 -->
    <!--<Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1000">-->
    <!--<modal-header slot="header" :content="contentHeader.showId"></modal-header>-->
    <!--<show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--导出弹窗-->
    <Modal :mask-closable="false" v-model="deriveModal" class-name="vertical-center-modal" :width="450">
      <modal-header slot="header" :content="headerContent.deriveId"></modal-header>
      <derive v-if="deriveModal" type="derive" :url="deriveUrl" messTitle="确定要导出到excel吗？" @derive="subCallback"
              @cancel="cancel"></derive>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../roomReserve/api';
  import statusOption from '../roomReserve/statusOption';

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'roomReserveSituationList',
    data () {
      return {
        self: this,
        statusOption,
        totalCount: 0,
        tableHeight: 0,
        dynamicHt: 100, // 表格高度
        loading: false,
        reportModal: false,
        deriveModal: false,
        showMoreSearch: false, // 更多筛选
        operailityData: [],
        multipleSelection: [], // 表格已选集
        useType: {},
        rooms: [],
        tableData: [],
        searchObj: { // 搜索
          name: '', //  名称
          startDate: '', // 开始时间
          endDate: '', // 结束时间
          status: '', // 状态
          useType: '', // 使用类型
          roomId:'' // 房间号
        },
        headerContent: {
          deriveId: {
            id: 'deriveId',
            title: '导出'
          }
        },
        deriveUrl: ''
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;//ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        };
        this.getRooms();
        this.getTypeOption();
      },
      getRooms () {
        let opt = {
          ajaxSuccess: res => this.rooms = res.data,
          ajaxParams: {
            url: api.roomList.path
          }
        };
        this.ajax(opt);
      },
      // 获取使用类型
      getTypeOption () {
        let opt = {
          ajaxSuccess: res => {
            if (!res.data.length) {
              return;
            }
            res.data.map(item => {
              this.useType[item.code] = item;
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
      /************************* 搜索逻辑 *********************************/
      search () {
        this.setTableData();
      },
      // 获取筛选按钮图标
      getSearchBtnIcon () {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down';
      },
      // 显示更多筛选
      openMoreSearch () {
        this.showMoreSearch = !this.showMoreSearch;
        this.$nextTick(() => {
          if (this.showMoreSearch) {
            this.tableHeight = this.dynamicHt - this.$refs.showMoreSearch.offsetHeight;
          } else {
            this.tableHeight = this.dynamicHt;
          }
        });
      },
      /************************* 表格逻辑 *********************************/
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
        let searchObj = this.formDate(this.$util._.defaultsDeep({}, this.searchObj), ['startDate', 'endDate']);
        Object.assign(this.queryQptions.params, searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading);
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
        this.totalCount = res.totalCount;
        this.tableData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        let contenHeight = this.$refs.roomReserve.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
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

      //评价提交数据前回调
      submitBeforeFun (data) {
        data.projectId = this.operailityData.id;
        console.log(data);
        return data;
      },
      /************************************** 按钮相关 **************************************************/
      // 查看
      show (row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 导出
      derive () {
        let searchObj = Object.assign({}, this.searchObj, this.queryQptions.params);
        this.deriveUrl = api.exportExcel.path + '?' + Util.serializeParams(searchObj);
        this.openModel('derive');
      },
      /************************************** 模态框处理 **************************************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
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
      }

    },
    created () {
      this.init();
    },
    filters: {
      getRoomNum (val) {
        let room = [];
        val.map(item => !room.includes(item.roomNum) && room.push(item.roomNum));
        return room.join('、');
      },
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
    components: {}
  };

</script>
