<!--公告-->

<template>
  <div id="nosocomial" ref="nosocomial" class="modal">
    <el-row>
      <el-form :inline="true" ref="formValidate" label-width="100px" class="demo-ruleForm">
        <el-col :span="14">
          <el-button class="but-col" @click="publish" type="info">发布公告</el-button>
          <el-button class="but-col" type="primary" @click="derive">导出excel</el-button>
          <el-button class="but-col" @click="selected" type="danger">获选</el-button>
        </el-col>
        <el-col :span="10" align="right">
          <el-form-item prop="title">
            <input class="hidden">
            <el-input v-model="formValidate.userName" placeholder="输入姓名搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div id="nosocomialTable" ref="nosocomialTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="序号" prop="index" width="70"></el-table-column>
        <el-table-column label="操作" align="center" width="70" show-overflow-tooltip>
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="grade" label="年级 " show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="group" label="班级 " show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="title" label="评优项目" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="voteNum" label="得票" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="score" label="得分" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.score/100}}
          </template>
        </el-table-column>
        <el-table-column prop="isPublish" label="公告状态" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.isPublish ? '已发布' : '未发布'}}
          </template>
        </el-table-column>
        <el-table-column prop="isElection" label="是否获选" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.isElection | typeText }}
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
      <div>
        <!--发布公告弹窗-->
        <Modal :mask-closable="false" v-model="publishModal" height="200" title="对话框标题"
               class-name="vertical-center-modal" :width="800">
          <modal-header slot="header" :content="publishId"></modal-header>
          <publish v-if="publishModal" @cancel="cancel" @publish="subCallback"
                   :operaility-data="operailityData"></publish>
          <div slot="footer"></div>
        </Modal>
        <!--查看弹窗-->
        <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
               :loading="true" :width="800">
          <modal-header slot="header" :parent="self" :content="showId"></modal-header>
          <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
          <div slot="footer"></div>
        </Modal>
        <!--获选弹窗-->
        <Modal close-on-click-modal="false" height="200" v-model="selectedModal" title="对话框标题"
               class-name="vertical-center-modal" :loading="loading" :width="500">
          <modal-header slot="header" :content="selectedId"></modal-header>
          <operate v-if="selectedModal" :type="'selected'" :messTitle="selectedMessTitle" :operateUrl="selectedUrl"
                   @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
          <div slot="footer"></div>
        </Modal>
        <!--导出弹窗-->
        <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题"
               class-name="vertical-center-modal"
               :width="500">
          <modal-header slot="header" :content="deriveId"></modal-header>
          <div v-if="deriveModal">
            <div class="remove">确认导出吗？</div>
            <el-row>
              <el-col :span="10" :offset="14">
                <a :href="deriveUrl + selectIds.join(',')">
                  <el-button @click="cancel('derive')" type="primary">确定</el-button>
                </a>
                <el-button class="but-col" @click="cancel('derive')">取消</el-button>
              </el-col>
            </el-row>
          </div>
          <div slot="footer"></div>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  import api from './api';
  //引入--发布--组件
  import publish from "./notice_publish.vue";
  //引入--查看--组件
  import show from '../OrganizationaVoting/OrganizationaVoting_poll_view.vue';

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        isRoot: true,
        selectIds: [],
        deriveUrl: '/api/' + api.excelExport.path,
        //查询表单
        selectedUrl: 'appraising/sellOneself/modifyElection',
        selectedMessTitle: {
          title: '确定要标记为获选吗？',
          access: `标记成功`,
          error: '标记失败'
        },
        "formValidate": {
          userName: '', //自荐人姓名
          group: '', //班级
          grade: '', //年级
        },

        totalCount: "",
        searchData: {
          title: '提交',
          callParEvent: 'searchEvent'
        },
        addData: '',
        editData: '',
        showData: '',
        auditData: '',
        /*--按钮button--*/
        addId: {
          id: 'add',
          title: '添加'
        },
        removeId: {
          id: 'remove',
          title: '删除'
        },
        selectedId: {
          id: 'selectedId',
          title: '获选'
        },
        publishId: {
          id: 'publishId',
          title: '发布公告'
        },
        showId: {
          id: 'auditId',
          title: '查看'
        },
        deriveId: {
          id: 'deriveId',
          title: '导出'
        },

        deriveModal: false,
        publishModal: false,
        selectedModal: false,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 0,
        self: this,
        tableData: [
          //          {
          //            "id": "",
          //            "userId": "",
          //            "userName": "",
          //            "grade": "",
          //            "group": "",
          //            "title": "",
          //            "voteNum": "",
          //            "score": "",
          //            "isPublish": "",
          //            "isElection": ""
          //          }
        ],
        loading: false,
        totalCount: 0,
        listMessTitle: {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: {
            url: api.list.path,
            params: {}
          }
        },
      }
    },
    methods: {

      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let nosocomial = this.$refs.nosocomial;
        let parHt = nosocomial.parentNode.offsetHeight;
        let nosocomialTable = this.$refs.nosocomialTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - nosocomialTable.offsetTop - paginationHt;
      },


      /*
       * checkbox 选择后触发事件
       * @param val Array 存在所有的选择每一个行数据
       */
      handleSelectionChange(val) {
        let idsArr = [];
        this.selectIds = [];
        this.multipleSelection = val;
        if (val) {
          val.map(item => idsArr.push(item.id))
        }
        this.selectIds = idsArr
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


      //通过get请求列表数据
      listDataSuccess(res, m, loading) {
        this.tableData = this.addIndex(res.data);
        this.totalCount = res.totalCount || 0
      },

      setTableData(isLoading) {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.formValidate);
        this.ajax(this.listMessTitle, isLoading)
      },

      //搜索监听回调
      searchEvent() {
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData()
        }
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        let flag = false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag;
      },

      // 导出
      derive() {
        if (this.isSelected()) {
          this.openModel('derive')
        }
      },

      /*--点击--添加--按钮--
       * 只允许添加二级
       * */
      add() {
        //如果是一级节点则返回，只添加二级节点
        this.openModel('add');
      },


      /*--点击--删除--按钮--*/
      selected() {
        if (!this.isSelected(true)) return;
        this.operailityData = this.multipleSelection;
        this.openModel('selected')

      },

      // 发布公告
      publish() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('publish')
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.showModal = true;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
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
      //当前组件引入的子组件
      publish,
      show
    },
  }

</script>
<style>
  .add-remove {
    margin-bottom: 20px;
  }

  .header {
    height: 30px;
    font-size: 18px;
    color: #ffffff;
  }

</style>

