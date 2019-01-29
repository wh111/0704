<!----------------------------------
****--@name     分配导师
****--@role     ${*}
****--@date     2017/10/18
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <!--搜索form-->
    <el-form :inline="true" :model="formInline" :rules="queryAssessment" class="demo-form-inline">
      <!--<el-form-item label="年级">-->
      <!--<el-select v-model="formInline.boundary" placeholder="">-->
      <!--<el-option label="全部" value=""></el-option>-->
      <!--<el-option v-for="item in optionData" :key="item" :label="item" :value="item" ></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->

      <el-form-item label="姓名" prop="name">
        <el-input v-model="formInline.name" placeholder=""></el-input>
      </el-form-item>

      <el-form-item label="专业方向">
        <el-select v-model="formInline.major" placeholder="">
          <optionList></optionList>
        </el-select>
      </el-form-item>

      <el-form-item label="学位类型" prop="specialtyName">
        <el-select v-model="formInline.degree" placeholder="">
          <el-option label="全部" value=""></el-option>
          <el-option label="学术学位" value="MAJOR"></el-option>
          <el-option label="专业学位" value="LEARNING"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!--列表操作按钮-->
    <div style="margin-bottom: 20px;">
      <el-button :disabled="!isPass" type="primary" @click="distributionTutor">分配导师</el-button>
    </div>

    <!--- 开放导师列表 --->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
            :selectable="canTodo">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            prop="index">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template scope="scope">
              <el-button size="small" type="success" @click="show(scope.row)">查看导师</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="name"
            label="姓名"
          >
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="boundary"-->
          <!--label="年级"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <el-table-column
            prop="phone"
            label="电话号码"
            align="center"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="majorCode"
            label="专业代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="major"
            label="专业方向"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="degree"
            label="学位类型"
          >
            <template scope="scope">
              {{scope.row.degree | interview}}
            </template>
          </el-table-column>
          <!--<el-table-column-->
            <!--show-overflow-tooltip-->
            <!--prop="studentNames"-->
            <!--label="备注"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--show-overflow-tooltip-->
          <!--prop="studentNames"-->
          <!--label="是否第二导师">-->
          <!--<template scope="scope">-->
          <!--{{scope.row.isSubsidiary |typeText}}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column-->
          <!--prop="status"-->
          <!--label="状态">-->
          <!--<template scope="scope">-->
          <!--{{!scope.row.status?'NOINTERVIEW':scope.row.status | dsInterview}}-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </div>
      <!--分页-->
      <div style="margin: 10px;">
        <div style="float: right;">
          <el-pagination
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="myPages.currentPage"
            :page-sizes="myPages.pageSizes"
            :page-size="myPages.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listTotal">
          </el-pagination>
        </div>
      </div>
    </div>

    <!--选择导师-->
    <Modal
      width="900"
      v-model="selectModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectId"></modal-header>
      <selectTutor v-if="selectModal" @cancel="selectModal=false" :url="api" @select="subCallback"
                   :operaility-data="operailityData"></selectTutor>
      <div slot="footer"></div>
    </Modal>

    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api'
  //引入查看组件
  import selectTutor from './ptDistributionTutor_selectTutor.vue'
  import optionList from '../../common/major.vue';
  import show from './ptDistributionTutor_view';
  //引入--修改--组件
  //import revise from "../components/revise.vue";
  //引入验证规则
  import {queryAssessment} from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      contentHeight: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        api,
        queryAssessment,
        formInline: {
          boundary: '',
          name: '',
          major: '',
          degree: '',
          status: 'JYCCONFIRM'
        },
        optionData: [],
        ids: '',
        operailityData: {},
        operailityData1: {},
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        selectModal: false,
        listTotal: 0,
        tableData1: [],
        isPass: false,
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.dslist.path,
            params: {}
          }
        },

        showId: {
          id: 'showId',
          title: '查看导师'
        },

        queryListTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.dslist.path,
            params: {}
          }
        },

        selectId: {id: 'selectId', title: '选择导师'},
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        let year = new Date().getFullYear();
        let tempArr = []
        for (let i = 0; i < 4; i++) {
          tempArr.push(year - i);
        }
        this.optionData = tempArr;


        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          //url:this.listUrl,
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
        this.setTableData()
      },
      getTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params);
        this.ajax(this.listMessTitle);
      },
      setTableData () {
        this.queryListTitle.ajaxParams.params = Object.assign(this.queryListTitle.ajaxParams.params, this.queryQptions.params);
        this.queryListTitle.ajaxParams.params = Object.assign(this.queryListTitle.ajaxParams.params, this.formInline);
        this.ajax(this.queryListTitle);
      },
      successGetList(res) {
        let data = res.data;
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = res.totalCount;
      },
      //查询
      onSubmit() {
        this.setTableData()
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        if (this.contentHeight > 0) {
          let consumablesTable = this.$refs.myTable;
          let paginationHt = 50 * 2 + 25;
          this.dynamicHt = this.contentHeight - consumablesTable.offsetTop - paginationHt;
          //console.log(this.contentHeight,this.dynamicHt,consumablesTable.offsetTop);
        } else {
          let content = this.$refs.content;
          let parHt = content.parentNode.offsetHeight;
          let myTable = this.$refs.myTable;
          let paginationHt = 50;
          this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
          //console.log(this.contentHeight,this.dynamicHt,consumablesTable.offsetTop,2);
        }
        ;
      },
      /*
      * checkbox 选择后触发事件
      * @param val Array 存在所有的选择每一个行数据
      */
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length === 1) {
          this.isPass = true;
        } else {
          this.isPass = false;
        }
      },
      /**
       * 是否允许参与选择
       * @param {Object} row 列表的行数据
       * @return {Boolean} true是禁止选择
       * */
      canTodo(row) {
        return !row.isSubsidiary;
      },

      //分配导师
      distributionTutor() {
        this.operailityData = this.multipleSelection;
        this.selectModal = true
      },

      show(row) {
        this.operailityData = row;
        this.showModal = true
      },

      cancel(type) {
        this[type + 'Modal'] = false;
      },

      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
        }
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
      optionList, selectTutor, show
    },
    watch: {
      contentHeight(val) {
        console.log(val)
      }
    },
  }
</script>
