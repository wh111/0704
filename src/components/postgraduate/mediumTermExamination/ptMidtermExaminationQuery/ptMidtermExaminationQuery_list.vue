<!----------------------------------
****--@name     中期考核查询
****--@role     研究生、导师、教学秘书、教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <!--搜索form-->
    <el-form :inline="true" :model="formInline" :rules="queryAssessment" class="demo-form-inline">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <!--<el-col :span="10">&nbsp;</el-col>-->
        <!--搜索项-->
        <el-col align="right">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="onSubmit">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <!--高级搜索项-->
      <div v-show="searchMore" ref="searchMore" align="right">
        <el-form-item label="专业方向">
          <el-select v-model="formInline.specialtyName" clearable placeholder="请选择">
            <major value="major"></major>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="入学日期:" prop="admissionDate">
      <el-date-picker
        v-model="formInline.createTime"
        align="right"
        type="date"
        :editable="false"
        placeholder="选择入学日期"
        :picker-options="pickerOptions1"
        @change="handleEndTime" style="width: 100%">
      </el-date-picker>
    </el-form-item>-->
        <el-button type="info" @click="onSubmit">{{ 'query' | sysLan }}</el-button>
      </div>
    </el-form>


    <!--- 培养计划列表 --->
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
          style="width: 100%;height: 100%">

          <el-table-column
            align="center"
            label="序号"
            prop="index"
            width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="score"
            label="中期考核成绩"
            width="120">
          </el-table-column>
          <el-table-column
            prop="conclusion"
            label="考核结果"
            width="120">
            <template scope="scope">
              {{scope.row.conclusion | midExamination }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="studentId"
            label="学号"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            width="120">
            <template scope="scope">
              {{scope.row.sex | typeText }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="phone"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="specialtyName"
            label="专业方向"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="specialtyCode"
            label="专业代码"
            show-overflow-tooltip>
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
      <!--查看弹窗-->
      <Modal
        :mask-closable="false"
        v-model="showModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="true"
        :width="800"
      >
        <modal-header slot="header" :parent="self" :content="showId"></modal-header>
        <show v-if="showModal" @add="subCallback" @cancel="cancel" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
    </div>

  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api                 from '../api';
  import major               from '../../common/major.vue';
  //引入验证规则
  import { queryAssessment } from '../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        queryAssessment,
        formInline: {
          createTime: '',
          boundary: '',
          name: '',
          specialtyName: ''
        },
        searchMore: false,
        operailityData: {},
        operailityData1: {},
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        listTotal: 0,
        tableData1: [],
        showId: {
          id: 'auditId',
          title: '查看'
        },
        listMessTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.queryList.path,
            params: {}
          }
        },
        queryListTitle: {
          ajaxSuccess: 'successGetList',
          ajaxParams: {
            url: api.queryList.path,
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
        this.getTableData();
      },
      getTableData () {
        this.queryListTitle.ajaxParams.params = Object.assign(this.queryListTitle.ajaxParams.params, this.queryQptions.params);
        this.queryListTitle.ajaxParams.params = Object.assign(this.queryListTitle.ajaxParams.params, this.formInline);
        this.ajax(this.queryListTitle);
      },
      successGetList (res) {
        let data = res.data;
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = res.totalCount;
      },

      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },

      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */

      //时间处理
      handleEndTime (value) {
        this.formInline.createTime = value;
      },
      /*
       * 列表数据只能选择一个
       * @param isOnly true  是否只选择一个
       */
      isSelected (isOnly) {
        let len = this.multipleSelection.length;
        let flag = true;
        if (len == 0) {
          this.showMess('请选择数据!');
          flag = false;
        }
        if (len > 1 && isOnly) {
          this.showMess('只能修改一条数据!');
          flag = false;
        }
        return flag;
      },

      /**
       * 页面列表查询
       */
      onSubmit () {
        this.getTableData();
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false;
        this.showModal = false;
      },
      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *addMessTitle:{
       *    type:'add',
       *    successTitle:'添加成功!',
       *    errorTitle:'添加失败!',
       *    ajaxSuccess:'ajaxSuccess',
       *    ajaxError:'ajaxError',
       *    ajaxParams:{
       *      url:'/role/add',
       *      method:'post'
       *    }
       *    }
       * @param udata boolean 默认false  是否不需要刷新当前表格数据
       * */
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.setTableData();
          this.showModal = false;
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      //填写中期考核信息
      Add (row) {
        this.operailityData = row;
        this.showModal = true;
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
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    components: {
      major
    }
  };
</script>
