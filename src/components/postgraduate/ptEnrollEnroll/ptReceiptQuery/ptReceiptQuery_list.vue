<!----------------------------------
****--@name     回执查询
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form :model="formValidate" :inline="true" ref="formValidate">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <!--<el-col :span="4">-->
        <!--<el-button type="info" @click="add">添加通知</el-button>-->
        <!--</el-col>-->
        <!--搜索项-->
        <el-col align="right">
          <el-form-item label="姓名:" prop="major">
            <el-input v-model.trim="formValidate.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="searchEvent" v-if="!searchMore">查询</el-button>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>
          </el-form-item>
        </el-col>
        <!--高级搜索项-->
        <el-col v-if="searchMore" ref="searchMore" align="right">
          <el-form-item prop="sex" label="性别：">
            <el-select v-model="formValidate.sex" placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="男" value="boy"></el-option>
              <el-option label="女" value="girl"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name" label="学校：">
            <el-input v-model="formValidate.schoolName" placeholder="请输入学校"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="年级：">
            <el-input v-model="formValidate.boundary" placeholder="请输入年级"></el-input>
          </el-form-item>

          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!--表格数据-->
    <div id="myTable" ref="myTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                highlight-current-row style="width: 100%;height: 100%">
        <el-table-column align="center" label="序号" prop="index" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="70">
          <template scope="scope">
            <el-button size="small" type="success" @click="show(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="studentId" label="学号">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="姓名">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="sex" label="性别" align="center">
          <template scope="scope">
            {{scope.row.sex | typeText}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="schoolName" label="学校">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="boundary" label="年级">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="phone" label="电话号码">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="messageStrtus" label="短信发送状态">
          <template scope="scope">
            {{ scope.row.messageStrtus | typeText }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <div style="margin: 10px;">
      <div style="float: right;">
        <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                       :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>

    <Modal :mask-closable="false" width="1000" v-model="showModal" class-name="vertical-center-modal"
           :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api  from './api';
  //导入
  import show from './ptReceiptQuery_view';

  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        //查询表单
        formValidate: {
          sex: '', //录取状态
          name: '', // 姓名
          schoolName: '', // 学校
          boundary: '' // 年级
        },

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore: false,
        sendMsgModal: false,
        loading: false,
        totalCount: 0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },

        /*--按钮button--*/
        viewId: {
          id: 'viewId',
          title: '回执查看'
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
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
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
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions,
          this.formValidate);
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent (isLoading) {
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData();
        }
      },

      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore () {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight();
        });
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
      //当前组件引入的子组件
      show
    }
  };

</script>
