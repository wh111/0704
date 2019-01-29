<!--
****--结业审核
****--@date     2017/7/3
****--@author   gx
-->
<template>
  <div ref="graduationAppraisal">
    <el-form :inline="true">
      <el-row>
        <el-col :span="14">
          <el-button type="success" @click="leadin">导入成绩</el-button>
          <el-button type="info" @click="derive('exportQualifiedUser')">导出合格名单</el-button>
          <el-button type="danger" @click="derive('exportNoQualifiedUser')">导出不合格名单</el-button>
          <el-button type="primary" @click="convertToYjs" v-if="changeStudentToYJS">转为研究生</el-button>
        </el-col>
        <el-col :span="10" align="right" style="padding-bottom:20px;">
          <el-input :maxlength="20" placeholder="请输入姓名" icon="search" v-model="searchObj.userName"
                    :on-icon-click="search" style="width:260px;"></el-input>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
          <el-form-item label="姓名：">
            <el-input v-model="searchObj.userName"></el-input>
          </el-form-item>
          <el-form-item label="学校：">
            <el-input v-model="searchObj.schoolName"></el-input>
          </el-form-item>
          <!--<el-form-item label="年份：">-->
          <!--<el-date-picker v-model="searchObj.year" align="right" type="year" placeholder="选择年">-->
          <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="专业：">
            <el-input v-model="searchObj.specialty"></el-input>
          </el-form-item>
          <el-button type="info" @click="search">搜索</el-button>
        </div>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="序号" prop="index" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template scope="scope">
            <el-button size="small" :disabled="scope.row.state!='EDU_NOT_REPORT'" type="success"
                       @click="add(scope.row)">审核
            </el-button>
            <el-button size="small" type="primary" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" width="200"></el-table-column>
        <el-table-column prop="schoolName" label="学校" show-overflow-tooltip></el-table-column>
        <el-table-column prop="profession" label="专业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depQualified" label="出科鉴定" show-overflow-tooltip>
          <template scope="scope">
            <el-button size="small" v-if="scope.row.depQualified"
                       :type="scope.row.depQualified=='QUALIFIED'?'success':scope.row.depQualified=='NO_QUALIFIED'?'danger':'info'"
                       @click="depQualified(scope.row)">{{ scope.row.depQualified | typeText }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="theoryScore" label="结业考试成绩" show-overflow-tooltip>
          <template scope="scope">
            <el-button v-if="scope.row.theoryScore !== null" :plain="true"
                       :type="scope.row.depQualified === 'NO_QUALIFIED' ? 'danger' : 'success'" size="small"
                       @click="showGiven(scope.row)">{{ scope.row.theoryScore }}
            </el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="profession" label="状态" show-overflow-tooltip>
          <template scope="scope">{{state(scope.row.state)}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes"
                       :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <!-- 模态框 增加（add） -->
    <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contenHeader.addId"></modal-header>
      <add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :loading="true"
           :width="900">
      <modal-header slot="header" :parent="self" :content="contenHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看出科情况 -->
    <Modal :mask-closable="false" v-model="givenViewModal" height="200" class-name="vertical-center-modal"
           :loading="true" :width="900">
      <modal-header slot="header" :parent="self" :content="contenHeader.givenViewId"></modal-header>
      <given-view v-if="givenViewModal" @cancel="cancel" :operaility-data="operailityData"></given-view>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" height="200" v-model="deriveModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="contenHeader.deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="deriveUrl">
              <el-button @click="deriveModal=false" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 导入成绩（leadin） -->
    <Modal :mask-closable="false" v-model="leadinModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="800">
      <modal-header slot="header" :content="contenHeader.leadinId"></modal-header>
      <leadin v-if="leadinModal" :url="api" @cancel="cancel" @toChannel="subCallback"></leadin>
      <div slot="footer"></div>
    </Modal>

    <!--转为研究生-->
    <Modal
      width="500"
      v-model="convertToYjsModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="contenHeader.convertToYjsId"></modal-header>
      <operate v-if="convertToYjsModal" :type="'convertToYjs'" methods="post" :operate-url="convertToYjsUrl"
               @cancel="cancel" @operate="subCallback"></operate>
      <div slot="footer"></div>
    </Modal>

    <!-- 模态框 查看实习情况（出科鉴定按钮点击） -->
    <Modal :mask-closable="false" v-model="depQualifiedModal" class-name="vertical-center-modal" :loading="true"
           :width="900">
      <modal-header slot="header" :parent="self" :content="contenHeader.depQualifiedId"></modal-header>
      <depQualified v-if="depQualifiedModal" :operaility-data="operailityData"></depQualified>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import add from './graduationAppraisal_add';
  import show from './graduationAppraisal_view';
  import givenView from '../../rotateRecordWrite/givenTheApplicationOfLarge/givenTheApplicationOfLarge_view';
  import leadin from './graduationAppraisal_toChannel'; // 导入
  import depQualified from './graduationAppraisal_depQualified.vue'//出科查看，出科鉴定按钮用
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        api,
        convertToYjsUrl: '',  // 转为研究生url
        deriveUrl: '',
        leadinModal: false,
        deriveModal: false,
        qualifiedActive: '',
        searchMore: false,
        searchObj: {
          userName: '', // 姓名
          schoolName: '', // 学校名称
          year: new Date().getFullYear().toString(), // 年份
          specialty: '', // 专业
        },
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        givenViewModal: false,
        depQualifiedModal: false,
        convertToYjsModal: false,
        changeStudentToYJS: false, // 实习生学生转换为研究生
        userIdentify: '', // 用户身份
        contenHeader: {
          addId: {
            id: "addId",
            title: '添加审核'
          },
          showId: {
            id: "showId",
            title: "查看审核"
          },
          givenViewId: {
            id: 'givenViewId',
            title: '查看出科详情'
          },
          deriveId: {
            id: "deriveId",
            title: "导出名单"
          },
          leadinId: {
            id: 'leadinId',
            title: "导入成绩"
          },
          convertToYjsId: {
            id: 'convertToYjsId',
            title: "转为研究生"
          },
          depQualifiedId: {
            id: 'depQualifiedId',
            title: "实习情况"
          },
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
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData();
        let userInfo = this.$store.getters.getUserInfo;
        this.userIdentify = userInfo.roleList[0].identify;
      },
      /*************************** 按钮事件 *************************/
      // 搜索
      search() {
        this.setTableData()
      },
      // 筛选
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          if (this.searchMore) {
            this.tabHeight = this.dynamicHt - this.$refs.searchMore.offsetHeight;
          } else {
            this.tabHeight = this.dynamicHt
          }
        })
      },
      // 添加
      add(row) {
        this.operailityData = row;
        this.openModel('add')
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
      },
      // 考核成绩
      showGiven(row) {
        return
        this.operailityData = row;
        this.openModel('givenView')
      },
      // 出科鉴定
      depQualified(row) {
        this.operailityData = row;
        this.openModel('depQualified')
      },
      // 导出
      derive(type) {
        let params = [];
        Util._.map(this.searchObj, (key, val) => {
          params.push(val + '=' + key)
        })
        this.deriveUrl = '/api' + api[type].path + '?' + params.join('&');
        this.openModel('derive');
      },
      // 导入
      leadin() {
        this.openModel('leadin')
      },

      //转为研究生
      convertToYjs() {
        if (!this.isSelected()) return;
        let userIds = [];
        this.multipleSelection.map(item => {
          userIds.push(item.userId)
        })
        this.convertToYjsUrl = api.convertToYjs.path + userIds.join(',');
        this.openModel('convertToYjs');
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

      /********************************* 表格相关 *****************************/
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        let allIsSXS = false;
        this.multipleSelection = val;
        if (this.userIdentify == 'SXSGL') { // 登录人为教育处-实习生管理
          // 选中的学生都是实习生
          allIsSXS = val.every(item => item.studentTypes == 'SXS'); // 所选择的人员角色都是实习生
          // 根据状态显示“转为研究生”按钮
          this.changeStudentToYJS = allIsSXS
        }
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        let params = this.queryQptions.params;
        params.year = this.conductDate(params.year, 'yyyy');
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.totalCount = res.totalCount || 0;
        this.tableData = this.addIndex(res.data || []);
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.graduationAppraisal.parentNode.offsetHeight;
        let tableData = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = contenHeight - tableData.offsetTop - paginationHt;
        this.tabHeight = this.dynamicHt;
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      state(type) {
        let obj = {
          'USER_NOT_REPORT': '未上报',
          'EDU_NOT_REPORT': '待审核',
          'EDU_REPORT': '通过',
          'NO_PASS': '未通过',
        }
        return obj[type] || type;
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 弹窗回调
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
    },
    created() {
      this.init();
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
    components: {
      add,
      show,
      givenView,
      leadin,
      depQualified,
    }
  }

</script>

<style lang="scss">


</style>
