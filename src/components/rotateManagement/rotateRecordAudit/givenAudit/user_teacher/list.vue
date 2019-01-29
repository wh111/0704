<!-- 出科审核（小科） - 带教老师 -->
<template>
  <div ref="givenTheApplication">
    <el-row>
      <el-col>
        <el-form :inline="true">
          <el-row style="margin-bottom:0">
            <!--列表操作按钮-->
            <el-col :span="10">
              &nbsp;
            </el-col>
            <!--搜索项-->
            <el-col :span="14" align="right">
              <el-form-item label="学生姓名：">
                <el-input v-model="manageParams.userName">
                  <el-button @click="search" slot="append" icon="search"></el-button>
                </el-input>
              </el-form-item>
              <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
            </el-col>
          </el-row>

          <!--高级搜索项-->
          <div v-if="searchMore" ref="searchMore" align="right">
            <el-form-item label="生源类型：">
              <el-select v-model="manageParams.userType" placeholder="请选择">
                <el-option v-for="item in userTypeOption" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <date-group :dateGroup="{text:'',startDate:manageParams.rotaryBeginTime,endDate:manageParams.rotaryEndTime}"
                        style="display:inline;">
              <el-form-item label="开始日期：">
                <el-date-picker v-model="manageParams.rotaryBeginTime" :editable="false" type="date"
                                placeholder="选择入科开始日期" :picker-options="pickerOptions0"
                                @change="handleStartTime"></el-date-picker>
              </el-form-item>
              <el-form-item label="结束日期：">
                <el-date-picker v-model="manageParams.rotaryEndTime" :editable="false" type="date"
                                placeholder="选择入科结束日期" :picker-options="pickerOptions1"
                                @change="handleEndTime"></el-date-picker>
              </el-form-item>
            </date-group>

            <!--<el-form-item label="科室：">-->
            <!--<el-select v-model="departmentId" placeholder="请选择">-->
            <!--<select-option type="byUserType"></select-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->

            <!--<el-form-item label="排序字段：">-->
            <!--<el-select v-model="otherParams.sortby" placeholder="请选择">-->
            <!--<el-option v-for="item in sortbyOption" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="排序方式：">-->
            <!--<el-select v-model="otherParams.order" placeholder="请选择">-->
            <!--<el-option v-for="item in orderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-button type="info" @click="search">查询</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据表格 -->
    <div id="tableData" ref="tableData" class="givenTheAppTable">
      <el-table align="center" :context="self" :height="dynamicHt" :data="tableData" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="序号" prop="index" width="100"></el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <!-- <template scope="scope">
            <template v-if="scope.row.depExaminationId">
              <el-button size="small" type="warning" @click="show(scope.row)">查看</el-button>
              <el-button size="small" type="success" @click="rotary(scope.row)" v-if="scope.row.depQualified === 'QUALIFIED'">出科</el-button>
            </template>
            <span v-else>---</span>
          </template> -->
          <template scope="scope">
            <!-- <el-button size="small" type="success" @click="rotary(scope.row)">出科</el-button> -->
            <el-button :disabled="!scope.row.depExaminationId" size="small" type="warning" @click="show(scope.row)">查看
            </el-button>
            <el-button :disabled="scope.row.graduateAppraisalState!=='TEC_NOT_REPORT'" size="small" type="success"
                       @click="rotary(scope.row)">审核
            </el-button>
            <!--<el-button size="small" type="success" @click="rotary(scope.row)">审核</el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室" prop="depName" show-overflow-tooltip></el-table-column>
        <el-table-column label="入科时间" prop="rotaryBeginTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="出科时间" prop="rotaryEndTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.rotaryEndTime || '---' }}
          </template>
        </el-table-column>
        <el-table-column label="理论考核成绩" prop="theoryScore" width="120px">
          <template scope="scope">
            {{ scope.row.theoryScore || '---' }}
          </template>
        </el-table-column>
        <el-table-column label="技能考核成绩" prop="skillScore" width="120px">
          <template scope="scope">
            {{ scope.row.skillScore || '---' }}
          </template>
        </el-table-column>
        <el-table-column label="出科是否合格" prop="depQualified" show-overflow-tooltip>
          <template scope="scope">
            <el-button @click="depQualified(scope.row)" v-if="scope.row.depQualified" size="mini"
                       :type="scope.row.depQualified === 'QUALIFIED' ? 'success' : 'danger'">
              {{ scope.row.depQualified | typeText }}
            </el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                     :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 出科 -->
    <Modal :mask-closable="false" v-model="rotaryModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.rotaryId"></modal-header>
      <template v-if="rotaryModal">
        <!--带教老师-->
        <rotary @cancel="cancel" @rotary="subCallback" :operaility-data="operailityData"
                :user-type="viewUserType"></rotary>
      </template>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"
            :user-type="viewUserType"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 分数详情 -->
    <Modal :mask-closable="false" v-model="depQualifiedModal" height="200" class-name="vertical-center-modal"
           :width="800">
      <modal-header slot="header" :content="contentHeader.depQualifiedId"></modal-header>
      <dep-qualified v-if="depQualifiedModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"
                     :user-type="viewUserType"></dep-qualified>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api';
  import userTypeOption from '../userTypeOption'; // 生源类型
  import orderOption from '../../../rotateRecordWrite/givenTheApplication/orderOption'; // 排序方式
  import sortbyOption from '../../../rotateRecordWrite/givenTheApplication/sortbyOption'; // 排序字段
  import rotary from './rotary'; // 出科
  import show from '../../../rotateRecordWrite/givenTheApplication/givenTheApplication_view'; // 查看
  import depQualified from '../../../rotateRecordWrite/givenTheApplication/givenTheApplication_depQualified'; // 考核详情
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        orderOption,
        sortbyOption,
        userTypeOption,
        viewUserType: '', // 当前查看的用户角色
        userInfo: {}, // 用户信息
        userIdentify: [], // 用户角色
        departmentId: '',
        departmentOption: [],
        tableData: [],
        self: this,
        totalCount: 0,
        dynamicHt: 100,
        loading: false,
        searchMore: false,
        operailityData: [],
        manageParams: {
          userName: '', // 轮转生
          userType: '', // 生源类型
          rotaryBeginTime: '', // 入科时间-开始时间(yyyy-MM-dd)
          rotaryEndTime: '', // 入科时间-结束时间(yyyy-MM-dd)
        },
        otherParams: {
//          sortby: '', // rotaryBeginTime|开始时间 endBeginTime|结束时间 theoryScore|理论成绩 skillScore|技能成绩
//          order: 'DESC',
        },
        rotaryModal: false,
        theoryModal: false,
        skillModal: false,
        depQualifiedModal: false,
        contentHeader: {
          rotaryId: {
            id: 'rotaryId',
            title: '出科申请'
          },
          showId: {
            id: 'showId',
            title: '查看'
          },
          depQualifiedId: {
            id: 'depQualifiedId',
            title: '出科考核情况'
          },
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          url: api.managePagelist.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.userInfo = this.$store.getters.getUserInfo;

        this.userInfo.roleList.map(item => this.userIdentify.push(item.identify)) // 多角色

        this.getDepartmentOption();
        this.setTableData();
      },
      /*************************************** 数据获取 **********************************/
      // 获取科室
      getDepartmentOption() {
        this.ajax({
          ajaxSuccess: res => {
            if (res.data && res.data.length) {
              this.departmentOption = this.getQTBObj(res.data);
            }
          },
          ajaxParams: {
            url: api.getDepartmentTree.path + this.userInfo.roleList[0].identify + '-' + this.userInfo.id,
            method: api.getDepartment.method,
          }
        })
      },
      // 处理科室数据结构（三级以下）
      getQTBObj(arr, res, depth = -1) {
        depth++;
        let t = res || [];
        if (arr && arr.length) {
          arr.map(item => {
            item.label = '　'.repeat(depth) + item.depName;
            t.push(item);
            if (item.childList) {
              return t.concat(this.getQTBObj(item.childList, t, depth))
            }
          })
        }
        return t
      },
      /*************************************** 表格相关 **********************************/
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
        Object.assign(this.queryQptions.params, this.otherParams, this.manageParams, {
          depId: this.departmentId
        });
        let params = this.queryQptions.params;
        params.rotaryBeginTime = this.conductDate(params.rotaryBeginTime, 'yyyy-MM-dd');
        params.rotaryEndTime = this.conductDate(params.rotaryEndTime, 'yyyy-MM-dd');
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
        let contentHeight = this.$refs.givenTheApplication.parentNode.parentNode.offsetHeight;
        let tableData = this.$refs.tableData;
        let paginationHt = 50;
        this.dynamicHt = contentHeight - tableData.offsetTop - paginationHt;
      },
      /*************************************** 按钮事件 **********************************/
      // 出科
      rotary(row) {
        this.viewUserType = row.podClass;
        this.operailityData = row;
        this.openModel('rotary');
      },
      // 搜索
      search() {
        this.setTableData()
      },
      // 查看
      show(row) {
        this.viewUserType = row.podClass;
        this.operailityData = row;
        this.openModel('show');
      },
      // 合格查看
      depQualified(row) {
        this.viewUserType = row.podClass;
        this.operailityData = row;
        this.openModel('depQualified');
      },
      /*************************************** 模态框 **********************************/
      // 编辑
      edit(row) {
        this.operailityData = row;
        this.openModel('edit');
      },
      // 查看
      // show(row) {
      //   this.operailityData = row;
      //   this.openModel('show');
      // },
      // 操作回调
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
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

    },
    watch: {
      departmentId(val) {
        this.setTableData()
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
      rotary,
      show,
      depQualified
    }
  }

</script>

<style lang="scss">
  .givenTheAppTable {
    .el-tag {
      cursor: pointer;
    }
  }

</style>
