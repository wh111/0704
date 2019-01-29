<!----------------------------------
****--网上预审(rdyOnlinePrequalification_list)
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
          <el-form-item label="学校：">
            <el-input v-model="searchObj.school"></el-input>
          </el-form-item>
          <el-form-item label="应聘培训专业：">
            <el-input v-model="searchObj.trainingSpecialty"></el-input>
          </el-form-item>
          <el-form-item label="状态：" v-if="whereFrom !=='rdyUnapproved'">
            <el-select placeholder="请选择" v-model="searchObj.ysState" clearable>
              <el-option v-for="(item,index) in typeOption" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>

            <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
          </el-form-item>
          <el-button type="info" @click="search">搜索</el-button>
        </el-col>
        <div v-show="searchMore" style="clear:both;" align="right" ref="searchMore">
        </div>
      </el-row>
    </el-form>
    <!-- 顶部按钮 -->
    <div>
      <el-button type="primary" @click="derive">导出excel</el-button>
      <el-button type="primary" @click="registration" :disabled="disabled.deleteProject">批量审核通过</el-button>
      <!--<el-button type="primary" @click="add">短信通知</el-button>-->
    </div>
    <br>
    <!-- 表格 -->
    <div id="myTable" ref="myTable">
      <el-table ref="multipleTable" align="center" :height="tabHeight" :context="self" :data="tableData"
                tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="edit(scope.row)"
                       :disabled="scope.row.ysState !== 'SUBMIT'">审核
            </el-button>
            <!--<el-button size="small" type="primary" @click="add(scope.row)">发短信</el-button>-->
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="school" label="学校" show-overflow-tooltip></el-table-column>
        <el-table-column prop="trainingSpecialty" label="应聘培训专业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="secondarySpecialty" label="次选专业" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="xcState" label="状态" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.ysState | yjsYsState }}
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
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :parent="self" :content="headerContent.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="1000">
      <modal-header slot="header" :parent="self" :content="headerContent.editId"></modal-header>
      <edit v-if="editModal" :whereFrom="whereFrom" @edit="subCallback" @cancel="cancel"
            :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--短信通知弹窗-->
    <Modal :mask-closable="false" height="200" v-model="shortNoteModal" class-name="vertical-center-modal" :width="800">
      <modal-header slot="header" :content="headerContent.shortNoteId"></modal-header>
      <short-note v-if="shortNoteModal" @shortNote="subCallback" @cancel="cancel"
                  :operaility-data="operailityData" :content="shortNoteContent"></short-note>
      <div slot="footer"></div>
    </Modal>
    <!--导出弹窗-->
    <Modal :mask-closable="false" v-model="deriveModal" class-name="vertical-center-modal" :width="450">
      <modal-header slot="header" :content="headerContent.deriveId"></modal-header>
      <derive v-if="deriveModal" type="derive" :url="deriveUrl" messTitle="确定要导出到excel吗？" @derive="subCallback"
              @cancel="cancel"></derive>
      <div slot="footer"></div>
    </Modal>
    <!--批量处理-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="replyTo "
      title="批量审核"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="headerContent.toreplyId"></modal-header>
      <reply v-if="replyTo " :whereFrom="whereFrom" :multipleSelectionResponse="multipleSelectionResponse"
             @subCallback="toReply"></reply>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import typeOption from './typeOption';
  import show from './rdyOnlinePrequalification_view.vue';
  // import shortNote from '../../../common/shortNote.vue';
  import shortNote from './shortNote.vue';
  import edit from './rdyOnlinePrequalification_edit.vue';
  import reply from './reply.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    //如果 whereFrom 等于 rdyUnapproved 是从‘补调剂’过来的
    props: ['whereFrom'],
    data() {
      return {
        typeOption,
        deriveUrl: '',
        searchMore: false,
        shortNoteContent: "您提交的报名表已通过网上预审，请携带相关材料于 年 月 日，到  进行现场资格审核。具体资料见招生通知。",
        searchObj: {
          trainingSpecialty: '', // 专业
          ysState: '', // 状态
          name: '', // 姓名
          school: '', // 学校
        },
        dynamicHt: 100,
        tabHeight: 0,
        self: this,
        loading: false,
        shortNoteModal: false,
        deriveModal: false,
        replyTo: false,
        disabled: {
          deleteProject: false
        },
        multipleSelectionResponse: '',
        operailityData: [],
        multipleSelection: [],
        tableData: [],
        totalCount: 0,
        headerContent: {
          shortNoteId: {
            id: 'shortNoteId',
            title: '短信通知'
          },
          editId: {
            id: 'edit',
            title: '审核'
          },
          showId: {
            id: 'show',
            title: '查看'
          },
          deriveId: {
            id: 'deriveId',
            title: '导出'
          },
          toreplyId: {
            id: 'reply',
            title: '批量审核'
          }
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
          url: api.list.path,
          params: {
            curPage: 1,
            pageSize: Util.pageInitPrams.pageSize
          }
        }

        this.setTableData()
      },

      /******************************** 按钮事件 *********************/
      // 短信通知
      add() {
        /* if(this.multipleSelection.length > 0){
         this.operailityData = this.multipleSelection;
         this.openModel('shortNote')
       }else{
         this.errorMess('请选择短信人员！')
       }*/
        this.operailityData = this.multipleSelection;
        this.openModel('shortNote')
      },
      // 修改
      edit(row) {
        this.operailityData = row;
        this.openModel('edit')
      },
      registration(row) {//批量审核
        if (!this.isSelected()) return;
        this.multipleSelectionResponse = this.multipleSelectionResponse;
        this.operailityData = row;
        this.replyTo = true;
      },
      toReply() {//审核完毕
        this.replyTo = false;
        this.$message.success('处理成功');
        this.setTableData();
      },
      // 导出
      derive() {
        let ids = this.multipleSelection.reduce((arr, item) => {
          arr.push(item.id);
          return arr;
        }, []).join(',')
        let searchObj = Object.assign({}, this.searchObj, {ids: ids, isYs: true})
        this.deriveUrl = api.exportToWord.path + '?' + Util.serializeParams(searchObj);
        this.openModel('derive')
      },
      // 查看
      show(row) {
        this.operailityData = row;
        this.openModel('show')
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
      /********************************* 表格相关 *****************************/
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
          this.tableData = res.data;
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
        this.multipleSelectionResponse = '';
        var that = this;
        let disabled = {
          deleteProject: false
        };
        val.map((item) => {
          that.multipleSelectionResponse += item.id + ',';
          // if (item.ysState == 'NO_PASS') {
          //   that.multipleSelectionResponse += item.id + ',';
          //   console.log(that.multipleSelectionResponse,item.id)
          // }
          if (this.whereFrom === 'rdyUnapproved' ? item.xcState != 'NO_PASS' : item.xcState != 'SUBMIT') {
            disabled.deleteProject = true;
          }
        });
        this.disabled = disabled;
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
        return row.ysState == 'PASS'
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
      show,
      shortNote,
      edit,
      reply
    }
  }
</script>
