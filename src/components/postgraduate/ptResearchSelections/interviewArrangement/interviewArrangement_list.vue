<!----------------------------------
****--@name     面试安排
****--@role     导师、教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <el-form :model="formInline" :inline="true" ref="formInline">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="6">
          <el-button v-if="identify.includes('DS')" type="primary" :disabled="!isPass" @click="arrange">安排面试
          </el-button>
          <span v-else></span>
        </el-col>
        <!--搜索项-->
        <el-col :span="18" align="right">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="onSubmit">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>
          </el-form-item>
        </el-col>
        <!--高级搜索项-->
        <el-col v-if="searchMore" ref="searchMore" align="right">
          <el-form-item label="专业方向:">
            <el-select v-model="formInline.majorCode" clearable placeholder="请选择">
              <optionList></optionList>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="年级">-->
          <!--<el-select v-model="formInline.boundary" placeholder="">-->
          <!--<el-option label="全部" value=""></el-option>-->
          <!--<el-option v-for="item in optionData" :key="item" :label="item" :value="item" ></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="状态:" prop="status">
            <el-select v-model="formInline.status" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="未安排" value="NOINTERVIEW"></el-option>
              <el-option label="已安排面试" value="INTERVIEW"></el-option>
              <el-option label="教育处已确认" value="JYCCONFIRM"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学位类型:" prop="degree">
            <el-select v-model="formInline.degree" clearable placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option label="学术学位" value="MAJOR"></el-option>
              <el-option label="专业学位" value="LEARNING"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

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
          <el-table-column
            label="操作"
            width="100">
            <template scope="scope">
              <el-button :disabled="!scope.row.status || scope.row.status === 'NOINTERVIEW'" size="small"
                         @click="show(scope.row)">查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            show-overflow-tooltip
            prop="name"
            label="学生姓名"
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
            show-overflow-tooltip
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="majorCode"
            show-overflow-tooltip
            label="专业代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="major"
            label="专业方向"
          >
          </el-table-column>
          <el-table-column
            prop="degree"
            show-overflow-tooltip
            label="学位类型"
          >
            <template scope="scope">
              {{scope.row.degree | interview}}
            </template>
          </el-table-column>
          <!--<el-table-column-->
          <!--prop="teacherName"-->
          <!--show-overflow-tooltip-->
          <!--label="导师姓名">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="status"
            show-overflow-tooltip
            label="状态"
            width="120">
            <template scope="scope">
              {{!scope.row.status ? 'NOINTERVIEW' : scope.row.status | interview}}
            </template>
          </el-table-column>
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
      <!-- 模态框  安排面试 -->
      <Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="600">
        <modal-header slot="header" :content="button.addId"></modal-header>
        <arrange v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></arrange>
        <div slot="footer"></div>
      </Modal>
      <!-- 模态框 查看（view） -->
      <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
             :loading="true" :width="600">
        <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
        <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
    </div>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api                 from './api';
  //引入查看组件
  import optionList          from '../../common/major.vue';
  import arrange             from './interviewArrangement_arrange.vue';
  import show                from './interviewArrangement_view.vue';
  //引入--修改--组件
  //import revise from "../components/revise.vue";
  //引入验证规则
  import { queryAssessment } from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      contentHeight: {
        type: Number,
        default: 0
      }
    },

    data () {
      return {
        queryAssessment,
        isPass: false,
        searchMore: false,
        formInline: {
          major: '',
          boundary: '',
          name: '',
          degree: '',
          status: '',
          majorCode: ''
        },
        //弹窗类型
        modal: {
          type: ''
        },
        button: {
          addId: {
            id: 'addId',
            title: '安排面试'
          },
          showId: {
            id: 'showId',
            title: '查看面试安排'
          }
        },
        operailityData: {},
        multipleSelection: [],
        optionData: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        listTotal: 0,
        tableData1: [],
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },
        identify: []//当前登录人类型
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let year = new Date().getFullYear();
        let tempArr = [];
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
        };

        //教育处只能查看安排
        let identify= [];
        let userInfo = this.$store.getters.getUserInfo;
        userInfo.roleList.map(item=>identify.push(item.identify));
        this.identify = identify;
        if (identify.includes('JYC') || identify.includes('YJSGL')) { // 教育处
//          this.formInline.status = 'INTERVIEW';
          this.listMessTitle.ajaxParams.url = api.jyclist.path;
        } else if (identify.includes('KEZR') || identify.includes('JXMS')) { // 科室主任、教学秘书
          this.formInline.status = 'NOINTERVIEW';
          this.listMessTitle.ajaxParams.url = api.jyslist.path;
        }
        console.log(this.identify);
        this.setTableData();
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,
          this.queryQptions.params, this.formInline);
        this.ajax(this.listMessTitle);
      },
      getTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,
          this.queryQptions.params);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.formInline);
        this.ajax(this.listMessTitle);
      },
      successGetList (res) {
        let data = res.data;
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = res.totalCount;
      },
      //设置表格及分页的位置
      setTableDynHeight () {
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
      },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
      },
      //查询
      onSubmit () {
        this.setTableData();
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 是否允许参与选择
      canTodo (row) {
        return row.status === 'NOINTERVIEW' || !row.status;
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
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
        //console.log(this.multipleSelection);
        if (this.multipleSelection.length > 0) {
          this.isPass = true;
        } else {
          this.isPass = false;
        }
      },
      //安排面试
      arrange () {
        this.operailityData = this.multipleSelection;
        console.log(this.operailityData);
        this.openModel('add');
      },
      //查看
      show (data) {
        this.operailityData = data;
        this.openModel('show');
      }
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
    },
    components: {
      arrange, show, optionList
    }
  };
</script>
