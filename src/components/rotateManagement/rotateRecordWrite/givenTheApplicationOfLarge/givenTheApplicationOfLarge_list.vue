<!-- 出科申请（大科） -->
<template>
  <div ref="givenTheApplicationOfLarge">
    <!--<el-row>
      <el-col>
        <el-form :inline="true">
          <el-form-item label="排序字段：">
            <el-select v-model="otherParams.sortby" placeholder="请选择">
              <el-option v-for="item in sortbyOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序方式：">
            <el-select v-model="otherParams.order" placeholder="请选择">
              <el-option v-for="item in orderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="search">搜索</el-button>
        </el-form>
      </el-col>
    </el-row>-->
    <!-- 数据表格 -->
    <div id="tableData" ref="tableData" class="givenTheAppTable">
      <el-table align="center" :context="self" :height="dynamicHt" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column label="序号" prop="index" width="100"></el-table-column>
        <el-table-column label="操作" width="140">
          <template scope="scope">
            <!-- <template v-if="scope.row.examinationId"> -->
            <!-- <el-button size="small" type="success" @click="rotary(scope.row)">出科</el-button> -->
            <!-- <el-button size="small" type="success" @click="rotary(scope.row)" v-if="scope.row.depQualified === 'QUALIFIED'">出科</el-button> -->
            <!-- <el-button size="small" type="warning" @click="show(scope.row)" v-else>查看</el-button> -->
            <!-- </template>
            <span v-else>---</span> -->
            <el-button :disabled="!scope.row.examinationId" size="small" type="warning" @click="show(scope.row)">查看</el-button>
            <el-button :disabled="!canRotary(scope.row)" size="small" type="success" @click="rotary(scope.row)">出科</el-button>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室" prop="greatName" show-overflow-tooltip></el-table-column>
        <el-table-column label="入科时间" prop="rotaryBeginTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="出科时间" prop="rotaryEndTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.rotaryEndTime || '---' }}
          </template>
        </el-table-column>
        <el-table-column label="理论考核成绩" prop="theoryScore" width="120px">
          <template scope="scope">
            {{ scope.row.theoryScore || '---' }}
            <!--<el-button type="info" size="mini" @click="theory(scope.row)" v-if="scope.row.theoryScore && scope.row.theoryIsMakeup">补考</el-button>-->
          </template>
        </el-table-column>
        <el-table-column label="技能考核成绩" prop="skillScore" width="120px">
          <template scope="scope">
            {{ scope.row.skillScore || '---' }}
            <el-button type="info" size="mini" @click="skill(scope.row)" v-if="scope.row.skillScore && scope.row.skillIsMakeup">补考</el-button>
          </template>
        </el-table-column>
        <el-table-column label="出科是否合格" prop="depQualified" show-overflow-tooltip>
          <template scope="scope">
            <el-button @click="depQualified(scope.row)" v-if="scope.row.depQualified" size="mini" :type="scope.row.depQualified === 'QUALIFIED' ? 'success' : 'danger'">{{ scope.row.depQualified | typeText }}</el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
    </div>
    <!-- 模态框 出科 -->
    <Modal :mask-closable="false" v-model="rotaryModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.rotaryId"></modal-header>
      <rotary v-if="rotaryModal" @cancel="cancel" @rotary="subCallback" :operaility-data="operailityData"></rotary>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 理论补考 -->
    <Modal :mask-closable="false" v-model="theoryModal" height="200" class-name="vertical-center-modal" :width="900">
      <modal-header slot="header" :content="contentHeader.theoryId"></modal-header>
      <theory v-if="theoryModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></theory>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 技能补考 -->
    <Modal :mask-closable="false" v-model="skillModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="contentHeader.skillId"></modal-header>
      <skill v-if="skillModal" @cancel="cancel" @skill="subCallback" :operaility-data="operailityData"></skill>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 理论补考 -->
    <Modal :mask-closable="false" v-model="depQualifiedModal" height="200" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="contentHeader.depQualifiedId"></modal-header>
      <dep-qualified v-if="depQualifiedModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></dep-qualified>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import userTypeOption from './userTypeOption'; // 生源类型
  import orderOption from './orderOption'; // 排序方式
  import sortbyOption from './sortbyOption'; // 排序字段
  import rotary from './givenTheApplicationOfLarge_rotary'; // 出科
  import show from './givenTheApplicationOfLarge_view'; // 查看
  import theory from './givenTheApplicationOfLarge_theory'; // 理论补考
  import skill from './givenTheApplicationOfLarge_skill'; // 技能补考
  import depQualified from './givenTheApplicationOfLarge_depQualified'; // 考核详情
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        orderOption,
        sortbyOption,
        userTypeOption,
        userInfo: {}, // 用户角色
        tableData: [],
        self: this,
        totalCount: 0,
        dynamicHt: 100,
        loading: false,
        operailityData: [],
        otherParams: {
          sortby: '', // rotaryBeginTime|开始时间 endBeginTime|结束时间 theoryScore|理论成绩 skillScore|技能成绩
          order: 'DESC',
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
          theoryId: {
            id: 'theoryId',
            title: '出科考核（理论）补考申请'
          },
          skillId: {
            id: 'skillId',
            title: '出科考核（技能）补考申请'
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
          url: api.pagelist.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.userInfo = this.$store.getters.getUserInfo;

        this.setTableData();
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
        Object.assign(this.queryQptions.params, this.otherParams);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res) {
        this.totalCount = res.totalCount || 0;
        this.tableData = this.addIndex(res.data || []);
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contentHeight = this.$refs.givenTheApplicationOfLarge.parentNode.offsetHeight;
        let tableData = this.$refs.tableData;
        let paginationHt = 50;
        this.dynamicHt = contentHeight - tableData.offsetTop - paginationHt;
      },
      // 是否可出科
      canRotary(row) {
        let thisTime = new Date().getTime();
        let rotaryEndTime = 0;
        let validTime = 5 * 24 * 3600 * 1000; // 结束出科前后五天
        let tag = false;
        if (row.rotaryEndTime) {
          rotaryEndTime = new Date(row.rotaryEndTime).getTime();
          // 前五天                                       后五天
//          tag = ((thisTime > (rotaryEndTime - validTime)) && (thisTime < (rotaryEndTime + validTime)));
          tag = thisTime > (rotaryEndTime - validTime);
        }
        if (tag && row.state) {
          tag = row.state === 'USER_NOT_REPORT';
        }
        return tag
      },
      /*************************************** 按钮事件 **********************************/
      // 出科
      rotary(row) {
        this.operailityData = row;
        this.openModel('rotary');
      },
      // 搜索
      search() {
        this.setTableData()
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },
      // 理论考核补考
      theory(row) {
        this.operailityData = row;
        this.openModel('theory');
      },
      // 技能考核补考
      skill(row) {
        this.operailityData = row;
        this.openModel('skill');
      },
      // 合格查看
      depQualified(row) {
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
      show(row) {
        this.operailityData = row;
        this.openModel('show');
      },
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
      theory,
      skill,
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
