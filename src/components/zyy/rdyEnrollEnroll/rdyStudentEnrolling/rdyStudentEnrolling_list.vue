<!----------------------------------
****--招生录取(rdyStudentEnrolling_list)
****--@date     2017/7/21
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div ref="content">
    <el-form :inline="true">
      <el-row>
        <el-col align="right">
          <el-form-item label="姓名：">
            <el-input v-model="searchObj.name"></el-input>
          </el-form-item>
          <!--<el-form-item label="年届：">-->
          <!--<el-date-picker v-model="searchObj.year" type="year" :editable="false" placeholder="选择年份"-->
          <!--@change="selectYear"></el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="应聘培训专业：">
            <el-input v-model="searchObj.trainingSpecialty"></el-input>
          </el-form-item>
          <el-form-item label="分数范围：">
            <el-input v-model="searchObj.minScore" style="max-width: 100px;" placeholder="最低分数"></el-input>
            <span>~</span>
            <el-input v-model="searchObj.maxScore" style="max-width: 100px;" placeholder="最高分数"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select placeholder="请选择" v-model="searchObj.lqexamMarkState" clearable>
              <el-option v-for="(item,index) in stateOption" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
            <el-button type="info" @click="search">搜索</el-button>
            <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
          </el-form-item>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
        </div>
      </el-row>
    </el-form>
    <!-- 顶部按钮 -->
    <div>
      <el-button type="success" @click="enterUser('Y')">正式录取</el-button>
      <el-button type="danger" @click="enterUser('N')">不录取</el-button>
      <el-button type="primary" @click="add">发短信给录取人员</el-button>
      <el-button type="warning" @click="toChannel">从Excel导入录取人员成绩</el-button>
      <el-button type="info" @click="derive">导出录取信息到Excel</el-button>
    </div>
    <!-- 表格 -->
    <div id="myTable" ref="myTable" style="margin-top: 16px">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" :selectable="canSelect"></el-table-column>
        <el-table-column prop="index" label="序号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gender" label="性别" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.gender | typeText }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
        <el-table-column prop="trainingSpecialty" label="应聘培训专业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examMark" label="成绩" show-overflow-tooltip></el-table-column>
        <el-table-column prop="lqexamMarkState" label="状态" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.lqexamMarkState | lqexamMarkState }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <!-- 上报 -->
    <Modal close-on-click-modal="false" height="200" v-model="enterUserModal" class-name="vertical-center-modal"
           :loading="loading" :width="500">
      <modal-header slot="header" :content="headerContent.enterUserId"></modal-header>
      <div v-if="enterUserModal">
        <p class="remove">确定对“{{ selectUserName.join('、') }}”进行{{ enterType == 'N' ? '不' : '' }}录取操作？</p>
        <div align="center">
          <el-button type="info" @click="enterUserCall">确定</el-button>
          <el-button @click="cancel('enterUser')">取消</el-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <!--<Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="900">-->
    <!--<modal-header slot="header" :parent="self" :content="headerContent.showId"></modal-header>-->
    <!--<show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--短信通知弹窗-->
    <Modal :mask-closable="false" height="200" v-model="shortNoteModal" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="headerContent.shortNoteId"></modal-header>
      <short-note v-if="shortNoteModal" @shortNote="subCallback" @cancel="cancel"
                  :operaility-data="operailityData" :content="shortNoteContent"></short-note>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题"
           class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="headerContent.deriveId"></modal-header>
      <div v-if="deriveModal">
        <div class="remove">确认导出吗？</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="deriveUrl">
              <el-button @click="cancel('derive')" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="cancel('derive')">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--导入弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="toChannelModal"
           class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="headerContent.toChannelId"></modal-header>
      <to-channel v-if="toChannelModal" @toChannel="subCallback" @cancel="cancel"
                  :operaility-data="operailityData"></to-channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import stateOption from './stateOption';
  //  import show from './rdyOnlinePrequalification_view.vue';
  import shortNote from '../../../common/shortNote.vue';
  import toChannel from './rdyStudentEnrolling_toChannel.vue';
  //  import edit from './rdyOnlinePrequalification_edit.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        stateOption,
        deriveUrl: '/api' + api.exportToWord,
        searchMore: false,
        shortNoteContent: "您报名参加我院住院医师规培已被录取，请您与 - 年 - 月 - 日在我院参加规培。岗前培训安排时间：--",
        searchObj: {
          trainingSpecialty: '', // 专业
          lqexamMarkState: '', // 状态
          year: "", // 年届
          name: '', // 姓名
          minScore: '', // 最小分数
          maxScore: '', // 最大分数
        },
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        loading: false,
        shortNoteModal: false,
        enterUserModal: false,
        deriveModal: false,
        toChannelModal: false,
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        headerContent: {
          shortNoteId: {
            id: 'shortNoteId',
            title: '短信通知'
          },
          toChannelId: {
            id: 'toChannelId',
            title: '从Excel导入录取人员成绩'
          },
          deriveId: {
            id: 'deriveIdId',
            title: '导出'
          },
          enterUserId: {
            id: "enterUserId",
            title: "录取操作",
          },
        },

        // 选中的人员
        selectUserName: [],
        selectUserId: [],
        // 录取相关
        enterType: '', // 是否录取状态
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

        this.setTableData()
      },

      /******************************** 按钮事件 *********************/
      // 是否录取
      enterUser(type) {
        if (this.isSelected()) {
          this.enterType = type;
          this.selectUserName = [];
          this.selectUserId = [];
          for (let i = 0, d = this.multipleSelection, l = d.length; i < l; i++) {
            if (d[i].lqexamMarkState == 'PASS') {
              this.errorMess('已经录取的人员不允许进行该操作');
              return
            }
            this.selectUserName.push(d[i].name);
            this.selectUserId.push(d[i].id);
          }
          this.openModel('enterUser')
        }
      },
      // 录取回调
      enterUserCall() {
        let str = this.enterType == 'N' ? '不' : '';
        let opt = {
          ajaxSuccess: res => this.subCallback('enterUser', str + '录取操作成功'),
          ajaxError: () => this.errorMess(str + '录取操作失败'),
          ajaxParams: {
            url: api.whetherAdmission.path + this.selectUserId.join(','),
            method: api.whetherAdmission.method,
            data: {type: this.enterType}
          }
        };
        this.ajax(opt)
      },

      // 短信通知
      add() {
//        if (this.isSelected() && this.checkSelectData('PASS', '未录取')) {
//          this.operailityData = this.multipleSelection;
//          this.openModel('shortNote')
//        }
        this.operailityData = this.multipleSelection;
        this.openModel('shortNote')
      },

      // 导出
      derive() {
        this.selectUserName = [];
        this.selectUserId = [];
        let ids = this.multipleSelection.reduce((arr, item) => {
          arr.push(item.id)
          return arr;
        }, []).join(',');
        let params = Object.assign({}, this.searchObj, {ids: ids, isYs: 'false'})
        this.operailityData = this.multipleSelection;
        this.deriveUrl = '/api' + api.exportToWord + '?' + Util.serializeParams(params),
          this.openModel('derive')
      },

      //导入
      toChannel() {
        this.openModel('toChannel')
      },

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
      // 切换年份
      selectYear(val) {
        this.searchObj.year = val || ''
      },
      /********************************* 表格相关 *****************************/
      // 检测选择数据中是否含有指定状态的数据
      checkSelectData(state, str) {
        for (let i = 0, d = this.multipleSelection, l = d.length; i < l; i++) {
          if (d[i].lqexamMarkState != state) {
            this.errorMess(str + '的人员不允许进行该操作');
            return false
          }
          this.selectUserName.push(d[i].name);
          this.selectUserId.push(d[i].id);
        }
        return true
      },
      /*
       * 设置表格数据
       * @param isLoading Boolean 是否加载
       */
      setTableData(isLoading) {
        Object.assign(this.queryQptions.params, this.searchObj);
        this.ajax({
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: this.queryQptions
        }, isLoading)
      },
      // 数据请求成功回调
      listDataSuccess(res, m, loading) {
        this.tableData = [];
        this.totalCount = res.totalCount || 0;
        if (res.data && res.data.length) {
          res.data.map(item => item.mobile = item.phone);
          this.tableData = this.addIndex(res.data);
        }
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let contenHeight = this.$refs.content.parentNode.offsetHeight;
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
          this.showMess("只能选择一条数据!")
          flag = false;
        }
        return flag;
      },
      // 允许选择的行
      canSelect(row) {
        return row.lqexamMarkState != 'NO_PASS'
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
//      show,
      shortNote,
      toChannel,
//      edit
    }
  }
</script>
