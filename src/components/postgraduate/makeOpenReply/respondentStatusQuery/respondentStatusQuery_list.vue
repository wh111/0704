<!--
****--@file     respondentStatusQuery_list
****--@date     2018/8/9 19:07
****--@author   YC
****--@describe 答辩状态查询
-->
<template>
  <div id="content" ref="content">
    <el-form ref="formValidate" :model="formValidate" inline>
      <el-row style="margin-bottom:0">
        <el-col align="right">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formValidate.name" placeholder="输入姓名">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!searchMore" type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-show="searchMore" ref="searchMore" align="right">
        <el-form-item label="专业方向">
          <el-select v-model="formValidate.major" clearable placeholder="请选择">
            <major value="major"></major>
          </el-select>
        </el-form-item>
        <el-form-item label="学位">
          <el-select v-model="formValidate.degree" clearable placeholder="请选择">
            <el-option v-for="(item,index) in degreeOption" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="学校">-->
        <!--<el-input v-model="formValidate.schoolName" placeholder="请输入学校"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item prop="name" label="年级">
          <el-input v-model="formValidate.boundary" placeholder="请输入年级"></el-input>
        </el-form-item>
        <!--<el-form-item label="状态" prop="status">-->
        <!--<el-select v-model="formValidate.resultStatus" clearable placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="item in options"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-button type="info" @click="searchEvent">{{ 'query' | sysLan }}</el-button>
        </el-form-item>
      </div>
    </el-form>

    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div id="myTable" ref="myTable">
        <el-table
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%">
          <el-table-column
            align="center"
            label="序号"
            prop="index"
            width="70">
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)" type="info"
                         :disabled="scope.row.resultStatus===null||scope.row.accountStatus===null||scope.row.resultStatus===''">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="studentId"
            label="学号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sex"
            label="性别">
            <template scope="scope">
              {{scope.row.sex | typeText}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="phone"
            label="电话">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="major"
            label="专业方向">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="majorCode"
            label="专业代码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="schoolName"
            label="学校">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="boundary"
            label="年级">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="degree"
            label="学位">
            <template scope="scope">
              {{scope.row.degree | typeText}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="applicationStatus"
            label="答辩申请状态">
            <template scope="scope">
              {{scope.row.applicationStatus | typeText}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="resultStatus"
            label="答辩结果">
            <template scope="scope">
              {{scope.row.resultStatus | dsresultRecord}}
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
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="900"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api          from '../api.js';
  import major        from '../../common/major.vue';
  import degreeOption from './typeOption';
  import show         from './respondentStatusQuery_view';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'respondentStatusQueryList',
    data () {
      return {
        degreeOption,
        formValidate: {
          name: '', //姓名
          major: '', //专业
          degree: '', // 学位
          boundary: '' // 年级
//          resultStatus: '' // 状态
        },
        viewId: {id: 'viewId', title: '查看'},
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore: false,
        loading: false,
        totalCount: 0
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        };
        this.setTableData();
      },

      //设置表格及分页的位置
      setTableDynHeight () {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },
      //通过get请求列表数据
      updateListData (responseData) {
        this.tableData = this.addIndex(responseData.data || []);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData () {
        let params = Object.assign({}, this.queryQptions, this.formValidate);
        let opt = {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.defenseAppStatusQueryList.path,
            params
          }
        };
        this.ajax(opt);
      },

      //搜索监听回调
      searchEvent () {
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData();
        }
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit (name) {
        let flag = false;
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
        return flag;
      },

      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show (data) {
        this.operailityData = data;
        this.openModel('show');
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false;
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
        }
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
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
      Util = this.$util;
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
      show, major
    }
  };

</script>
