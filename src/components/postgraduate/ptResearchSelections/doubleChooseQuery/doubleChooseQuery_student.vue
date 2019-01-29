<template>
  <div id="content" ref="content" style="position: relative;">
    <el-form :model="formInline" :inline="true" ref="formInline">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="6">
          <!--<el-button :disabled="true" type="primary" >安排面试</el-button>-->
          <span></span>
        </el-col>
        <!--搜索项-->
        <el-col :span="18" align="right">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="onSubmit">{{ 'query' | sysLan }}</el-button>
            <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
          </el-form-item>
        </el-col>
        <!--高级搜索项-->
        <el-col v-if="searchMore" ref="searchMore" align="right">
        </el-col>
      </el-row>
    </el-form>

    <!--搜索form-->
    <!--<el-col align="right">-->
    <!--<el-form :inline="true" :model="formInline" class="demo-form-inline">-->
    <!--&lt;!&ndash;<el-form-item label="年级">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-select v-model="formInline.boundary" placeholder="">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="2015" value="2015"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="2016" value="2016"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="2017" value="2017"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->

    <!--<el-form-item label="姓名:" prop="name">-->
    <!--<el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>-->
    <!--</el-form-item>-->

    <!--&lt;!&ndash;<el-form-item label="专业方向">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-select v-model="formInline.major" placeholder="">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="内科学" value="内科学"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="神经病学" value="神经病学"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="外科学" value="外科学"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="妇产科学" value="妇产科学"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="肿瘤学" value="肿瘤学"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->


    <!--&lt;!&ndash;<el-form-item label="学位类型" prop="specialtyName">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-select v-model="formInline.degree" placeholder="">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="学术学位" value="学术学位"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-option label="专业学位" value="专业学位"></el-option>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->

    <!--<el-form-item>-->
    <!--<el-button type="primary" @click="onSubmit">查询</el-button>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--</el-col>-->
    <!--列表操作按钮-->

    <!--<div style="margin-bottom: 20px;">-->
    <!--<el-button :disabled="true" type="primary" >安排面试</el-button>-->
    <!--</div>-->

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
        >
          <!--<el-table-column-->
          <!--type="selection"-->
          <!--width="55">-->
          <!--</el-table-column>-->
          <el-table-column
            align="center"
            label="序号"
            prop="index">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column-->
          <!--label="操作"-->
          <!--width="100">-->
          <!--<template scope="scope">-->
          <!--<el-button v-if="scope.row.status == 'CONFIRM'" size="small" @click="show(scope.row)">查看</el-button>-->
          <!--<el-button v-else :disabled="true" size="small" @click="show(scope.row)">查看</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="老师"
          ></el-table-column>
          <!--<el-table-column-->
          <!--prop="sex"-->
          <!--label="性别"-->
          <!--&gt;-->
          <!--<template scope="scope">-->
          <!--{{scope.row.sex|typeText}}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            prop="phone"
            label="电话"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userNames"
            label="报名学生">
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
      <!-- 模态框 查看（view） -->
      <!--<Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"-->
      <!--:width="800">-->
      <!--<modal-header slot="header" :parent="self" :content="button.showId"></modal-header>-->
      <!--<show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>-->
      <!--<div slot="footer"></div>-->
      <!--</Modal>-->
    </div>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api  from './api';
  import show from '../interviewArrangement/interviewArrangement_view.vue';
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
        formInline: {
//          major:'',
//          boundary:'',
          name: ''
//          degree:''
        },
        //弹窗类型
        modal: {
          type: ''
        },
        button: {
          showId: {
            id: 'showId',
            title: '查看面试安排'
          }
        },
        tableData1: [],
        self: this,
        searchMore: false,
        dynamicHt: 100,
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.listls.path,
            method: api.listls.method,
            params: {}
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          //url:this.listUrl,
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        };
        this.setTableData();
      },
      setTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,
          this.queryQptions.params);
        this.ajax(this.listMessTitle);
      },
      successGetList (res) {
        let data = res.data;
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = res.totalCount;
      },
      getTableData () {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,
          this.queryQptions.params);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.formInline);
        this.ajax(this.listMessTitle);
      },
      //查询
      onSubmit () {
        this.getTableData();
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange (val) {
        this.multipleSelection = val;
        //console.log(this.multipleSelection);
        if (this.multipleSelection.length > 0) {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].status == 'INTERVIEW') {
              this.isPass = true;
            } else {
              this.isPass = false;
            }
          }
        } else {
          this.isPass = false;
        }
      },
      //设置表格及分页的位置
      setTableDynHeight () {
        if (this.contentHeight > 0) {
          let consumablesTable;
          if (this.$refs.myTable.offsetTop == 0) {
            consumablesTable = sessionStorage.getItem('consumablesTable');
          } else {
            consumablesTable = this.$refs.myTable.offsetTop;
          }
          let paginationHt = 65 * 2;
          this.dynamicHt = this.contentHeight - consumablesTable - paginationHt;
          //console.log(this.contentHeight,this.dynamicHt,consumablesTable.offsetTop);
        } else {
          let content = this.$refs.content;
          let parHt = content.parentNode.offsetHeight;
          let myTable = this.$refs.myTable;
          let paginationHt = 65;
          this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
          //console.log(this.contentHeight,this.dynamicHt,consumablesTable.offsetTop,2);
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false;
      },
      show (data) {
        this.operailityData = data;
        this.openModel('show');
      },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        if (this.$refs.myTable.offsetTop != 0) {
          sessionStorage.setItem('consumablesTable', this.$refs.myTable.offsetTop);
        }
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {
      show
    }
  };
</script>
