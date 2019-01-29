<template>
  <div id="content" ref="content">
    <el-form :model="formInline" :inline="true" ref="formInline">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="6">
          <!--<el-button type="primary" @click="arrange">安排面试</el-button>-->
          <span></span>
        </el-col>
        <!--搜索项-->
        <el-col :span="18" align="right">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="onSubmit">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>
          </el-form-item>
        </el-col>
        <!--高级搜索项-->
        <el-col v-if="searchMore" ref="searchMore" align="right">
          <el-form-item label="学校:" prop="schoolName">
            <el-input v-model="formInline.schoolName" placeholder="请输入学校"></el-input>
          </el-form-item>

          <el-form-item label="年级:" prop="boundary">
            <el-input v-model="formInline.boundary" placeholder="请输入年级"></el-input>
          </el-form-item>

          <el-form-item label="人员类型:" prop="trainingType">
            <el-select v-model="formInline.trainingType" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="博士" value="BS"></el-option>
              <el-option label="硕士" value="SS"></el-option>
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
          <!--align="center"-->
          <!--show-overflow-tooltip-->
          <!--prop="teacherCode"-->
          <!--label="工号"-->
          <!--&gt;-->
          <!--</el-table-column>-->
          <el-table-column
            prop="name"
            label="学生姓名"
          >
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            align="center"
            show-overflow-tooltip
          >
            <template scope="scope">
              <span>{{scope.row.sex | typeText}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="电话"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column
            prop="schoolName"
            label="学校"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="boundary"
            label="年级"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="trainingType"
            label="人员类型"
            show-overflow-tooltip
          >
            <template scope="scope">
              {{scope.row.trainingType | typeText}}
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="userNames"
            label="选择老师"
          >
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
      <!--&lt;!&ndash; 模态框  安排面试 &ndash;&gt;-->
      <!--<Modal :mask-closable="false" v-model="addModal" height="200" class-name="vertical-center-modal" :width="1100">-->
      <!--<modal-header slot="header" :content="button.addId"></modal-header>-->
      <!--<arrange v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></arrange>-->
      <!--<div slot="footer"></div>-->
      <!--</Modal>-->
      <!--&lt;!&ndash; 模态框 查看（view） &ndash;&gt;-->
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
  import api from './api';
  //    import arrange from "../interviewArrangement/interviewArrangement_arrange.vue";
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
          name: '',
          trainingType: '',
          schoolName: '',
          boundary: ''
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
        tableData1: [],
        self: this,
        searchMore: false,
        dynamicHt: 100,
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.listxs.path,
            method: api.listxs.method,
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
//            // 增加回调
//            subCallback(target, title, updata) {
//              this.cancel(target);
//              if (title) {
//                this.successMess(title);
//              }
//              if (!updata) {
//                this.setTableData();
//              }
//            },
//              /*
//           * 打开指定的模态窗体
//           * @param options string 当前指定的模态:"add"、"edit"
//           * */
//            openModel(options) {
//              this[options + 'Modal'] = true;
//            },
//            // 取消
//            cancel(targer) {
//              this[targer + 'Modal'] = false;
//            },
//            //安排面试
//            arrange(){
//              this.operailityData = this.multipleSelection;
//              console.log(this.operailityData);
//              this.openModel('add')
//            },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
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
      }
    },
    created () {
      this.init();
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        if (this.$refs.myTable.offsetTop != 0) {
          sessionStorage.setItem('consumablesTable', this.$refs.myTable.offsetTop);
        }
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {
      //arrange
    }
  };
</script>
