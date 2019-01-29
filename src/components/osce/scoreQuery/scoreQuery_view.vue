<template>
  <!-- 列表数据 -->
  <div ref="dataList">
    <el-row style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #dfe6ec;">
      <el-col :span="22" align="center">
        <h2 style="line-height:30px;">{{ stitle || '-' }}</h2>
      </el-col>
      <el-col :span="2" align="right">
        <el-button type="info" size="small" @click="backList">返回列表</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="info" @click="deriveMark">{{ 'export' | sysLan }}成绩</el-button>
      <!--<el-button type="info" @click="printMark">打印成绩</el-button>-->
      <el-button type="info" @click="deriveScore">{{ 'export' | sysLan }}评分表</el-button>
      <el-button type="info" @click="printScore">{{ 'print' | sysLan }}评分表</el-button>
    </el-row>
    <!-- 搜索 -->
    <!--<el-row>
      <el-col align="right" style="width:90px;float:right;">
        <el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">筛选</el-button>
      </el-col>
      <el-col :span="6" style="float:right;">
        <el-input placeholder="请输入考生姓名" v-model="searchObj.userName">
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
      </el-col>
    </el-row>-->
    <!-- 多条件 -->
    <!--<div class="editForm noMarginBottom" style="overflow:hidden;" v-show="showMoreSearch">
      <el-form :inline="true" style="margin-top:10px;float:right;" label-width="74px">
        <el-row>
          <el-form-item label="考生姓名:">
            <el-input v-model="searchObj.userName"></el-input>
          </el-form-item>
          <el-form-item label="所在部门:">
            <el-input v-model="searchObj.userName"></el-input>
          </el-form-item>
          <el-form-item label="考生编号:">
            <el-input v-model="searchObj.userNum"></el-input>
          </el-form-item>
          <el-button @click="search">查询</el-button>
        </el-row>
      </el-form>
    </div>-->
    <!-- 表格数据 -->
    <div id="tableView" ref="tableView" style="padding-top:10px;">
      <el-table border align="center" :height="dynamicHt" :context="self" :data="showData.userList" tooltip-effect="dark" class="tableShowMoreInfo"
                @selection-change="handleSelectionChange" style="width: 100%;">
        <el-table-column type="selection" width="55" :selectable="canPrintScore"></el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row.userId)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column label="考生姓名" prop="userName" show-overflow-tooltip min-width="100px"></el-table-column>
        <!--<el-table-column label="部门" prop="sceneId" show-overflow-tooltip></el-table-column>-->
        <el-table-column label="考生编号" prop="userNum" show-overflow-tooltip min-width="100px"></el-table-column>
        <el-table-column label="性别" prop="sex" show-overflow-tooltip min-width="80px">
          <template scope="scope">
            {{ scope.row.sex | typeText }}
          </template>
        </el-table-column>
        <el-table-column label="考官评分" prop="userNum" show-overflow-tooltip align="center">
          <el-table-column v-for="(item,index) in stationHeader" :key="index" :label="item.stationName+'('+item.stationWeight+')'"
                           show-overflow-tooltip min-width="120px">
            <template scope="scope">
              {{ scope.row.stationList.scoreList[index].examStatus == 'MISS' ? '缺考' : scope.row.stationList.scoreList[index].totalMark }}
            </template>
          </el-table-column>
          <el-table-column label="合计" show-overflow-tooltip min-width="80px" align="center">
            <template scope="scope">
              <el-col align="left">
                {{ showData.stationSize ? scope.row.stationList.staionSum : 0 }}
              </el-col>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="SP评分" prop="userNum" show-overflow-tooltip align="center">
          <el-table-column v-for="(item,index) in stationSpHeader" :key="index" :label="item.stationName+'('+item.stationWeight+')'"
                           show-overflow-tooltip min-width="120px">
            <template scope="scope">
              {{ scope.row.spStationList.scoreList[index].examStatus == 'MISS' ? '缺考' : scope.row.spStationList.scoreList[index].totalMark }}
            </template>
          </el-table-column>
          <el-table-column label="合计" show-overflow-tooltip min-width="80px" align="center">
            <template scope="scope">
              <el-col align="left">
                {{ showData.stationSpSize ? scope.row.spStationList.staionSum : 0 }}
              </el-col>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="成绩汇总" prop="sumMark" show-overflow-tooltip min-width="100px"></el-table-column>
        <el-table-column label="排名" show-overflow-tooltip min-width="70px">
          <template scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <!--<div style="float: right;margin-top:10px;">-->
    <!--<el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"-->
    <!--:page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>-->
    <!--</div>-->
    <!-- 考生信息 -->
    <Modal :mask-closable="false" width="1100" v-model="queryStudentModal" title="考站队列设置" class-name="vertical-center-modal" @on-cancel="cancel">
      <modal-header slot="header" :content="contentHeader.queryStudentId"></modal-header>
      <!--<query-student v-if="queryStudentModal" @cancel="cancel" :id="userId" :sceneId="sceneId"></query-student>-->
      <query-student v-if="queryStudentModal" @cancel="cancel" :userId="userId" :sceneId="sceneId"></query-student>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="contentHeader.deriveId"></modal-header>
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
    <!--打印弹窗-->
    <Modal :mask-closable="false" v-model="printDataModal" height="200" class-name="vertical-center-modal"
           :width="1100">
      <modal-header slot="header" :parent="self" :content="contentHeader.printDataId"></modal-header>
      <print-data v-if="printDataModal" @cancel="cancel" @print="printDone">
        <print-mark v-if="printType === 'mark'" :showData="printData" :stationHeader="stationHeader" :stationSpHeader="stationSpHeader"></print-mark>
        <print-score v-if="printType === 'score'" :printData="printData"></print-score>
      </print-data>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  let Util = null;
  import api from './api'; // api

  import examineTypeOption from '../examineInterval/examineTypeOption'; // 类型选择
  import examineStatuOption from '../examineInterval/examineStatuOption'; // 状态选择

  import queryStudent from './scoreQuery_student'; // 查看
  import printData from '../../../components/common/print.vue';

  import printMark from './scoreQuery_printMark';
  import printScore from './scoreQuery_printScore';

  export default {
    // http://218.241.184.2:9014/#!/project/api/detail?projectID=15&apiID=529
    props: ['sceneId', 'stitle'],
    data () {
      return {
        exportUrl: '',
        userId: 0, // 查看id
        self: this,
        printDataModal: false,
        deriveModal: false,
        dynamicHt: 100,
        examineTypeOption,
        examineStatuOption,
        showMoreSearch: false, // 更多筛选
        queryStudentModal: false,
        searchObj: { // 搜索
          userName: '', // 姓名
          userNum: '' // 编号
        },
        totalCount: 0,
        tableData: [],
        showData: {
          name: '',
          stationSize: 0,
          stationSpSize: 0,
          userList: []
        },
        stationHeader: [], // 教师评分
        stationSpHeader: [], // SP评分
        multipleSelection: null,
        contentHeader: {
          queryStudentId: {
            id: 'queryStudentId',
            title: '考生信息'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出评分表'
          },
          printDataId: {
            id: 'printDataId',
            title: '打印评分表'
          }
        },
        printType: '',
        printData: null
      };
    },
    methods: {
      /************************** 基本逻辑 ******************************/
      //初始化请求列表数据
      init () {
        Util = this.$util;

        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.comprehensiveGet.path,
          method: api.comprehensiveGet.method,
          params: {}
        };
        this.setTableData();
      },
      /************************* 搜索逻辑 *********************************/
      search () {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.setTableData();
      },
      // 获取筛选按钮图标
      getSearchBtnIcon () {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down';
      },
      // 显示更多筛选
      openMoreSearch () {
        this.showMoreSearch = !this.showMoreSearch;
        if (this.showMoreSearch) {
          this.dynamicHt = this.dynamicHt - 47;
        } else {
          this.dynamicHt = this.dynamicHt + 47;
        }
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
      setTableData () {
        Object.assign(this.queryQptions.params, {
          sceneId: this.sceneId,
          statisticsId: ''
        });
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        });
      },
      // 数据请求成功回调
      listDataSuccess (res, m, loading) {
//        this.totalCount = res.totalCount;
//        this.tableData = res.data.data.userList;
        let data = res.data;
        this.stationHeader = [];
        if (data.stationSize && data.userList.length) {
          data.userList[0].stationList.scoreList.map(item => this.stationHeader.push({
            stationName: item.stationName,
            stationWeight: Number((item.stationWeight * 100).toFixed(2)) + '%'
          }));
        }
        this.stationSpHeader = [];
        if (data.stationSpSize && data.userList.length) {
          data.userList[0].spStationList.scoreList.map(item => this.stationSpHeader.push({
            stationName: item.stationName,
            stationWeight: Number((item.stationWeight * 100).toFixed(2)) + '%'
          }));
        }
        this.showData = res.data;
      },
      //设置表格及分页的位置
      setTableDynHeight (otherHeight = 0) {
        let contenHeight = this.$refs.dataList.parentNode.parentNode.offsetHeight;
        let tableView = this.$refs.tableView;
        let paginationHt = otherHeight + 16;
        this.dynamicHt = contenHeight - tableView.offsetTop - paginationHt;
      },
      // 返回列表
      backList () {
        this.$emit('show', {
          view: 'index'
        });
      },
      canPrintScore (row) {
//        return !isNaN(row.sumMark) && Number(row.sumMark) > 0;
        return true;
      },
      // 获取打印的评分表
      getAllScoreTable (userIds, callFun) {
        let opt = {
          ajaxSuccess: res => callFun(res),
          ajaxParams: {
            url: api.allScoreTable.path,
            method: api.allScoreTable.method,
            params: {
              sceneId: this.sceneId,
              userIds
            }
          }
        };
        this.ajax(opt);
      },
      /************************************** 模态框处理 **************************************************/
      // 导出成绩
      deriveMark () {
        this.exportUrl = '/api/scene/statistics/comprehensive/exportExcel?statisticsId=&sceneId=' + this.sceneId;
        this.contentHeader.deriveId.title = '导出成绩';
        this.openModel('derive');
      },
      // 导出评分表
      deriveScore () {
        let userId = []; // 学生ID
        if (!this.multipleSelection || !this.multipleSelection.length) {
          this.errorMess('请选择需要导出的评分表的学生');
          return false;
        }
        this.multipleSelection.map(item => userId.push(item.userId));
        this.exportUrl = '/api/scene/examUser/exportWord?sceneId=' + this.sceneId + '&userIds=' + userId.join(',');
        this.contentHeader.deriveId.title = '导出评分表';
        this.openModel('derive');
      },
      //确定导出
      affirmDerive () {
        this.cancel('derive');
      },
      // 打印成绩
      printMark () {
        let {name, stationSize, stationSpSize, userList} = this.$util._.defaultsDeep({}, this.showData);
        if (this.multipleSelection && this.multipleSelection.length) {
          userList = this.multipleSelection;
        }
        this.printData = {name, stationSize, stationSpSize, userList};
        this.printType = 'mark';
        this.contentHeader.printDataId.title = '打印成绩';
        this.openModel('printData');
      },
      // 打印评分表
      printScore () {
        let userIds = [];
        if (!this.multipleSelection || !this.multipleSelection.length) {
          this.errorMess('请选要打印评分表的学生');
          return false;
        }
        this.multipleSelection.map(item => userIds.push(item.userId));

        this.printType = 'score';
        this.contentHeader.printDataId.title = '打印评分表';
        this.getAllScoreTable(userIds.join(','), res => {
          this.printData = res.data;
          if (res.data.length) {
            this.openModel('printData');
          } else {
            this.errorMess('暂无可打印的评分表');
          }
        });
      },
      // 打印完成
      printDone () {
        this.cancel('printData');
        this.printType = '';
        this.printData = null;
      },
      // 查看
      show (id) {
        this.userId = id;
        this.openModel('queryStudent');
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      }
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
    components: {
      printMark, printScore,
      queryStudent, printData
    },
    created () {
      this.init();
    },
    watch: {
      sceneId (val) {
        this.setTableData();
      }
    }
  };

</script>

<style lang="scss">
  .noMarginBottom {
    .el-form-item {
      margin-bottom: 0;
    }
  }

</style>
