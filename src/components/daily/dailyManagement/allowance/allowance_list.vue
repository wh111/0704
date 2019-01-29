<!--日常管理-->
<!--津贴-->

<template>
  <div id="content" ref="content" class="modal">
    <el-form ref="formValidate" inline class="demo-ruleForm">
      <el-row>
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button class="but-col" @click="grant" type="success">发放</el-button>
          <el-button class="but-col" @click="noGrant" type="danger">不发放</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item prop="title">
            <el-input v-model="formValidate.userName" placeholder="输入姓名搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-form-item>
        </el-col>

        <!--高级搜索项-->
        <el-col v-show="searchMore" ref="searchMore" align="right">
          <el-form-item label="科室:" prop="depId">
            <el-select v-model="formValidate.depId" placeholder="请选择" clearable>
              <select-option type="byUserType"></select-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发放年月:" prop="provideMonth">
            <el-date-picker v-model="formValidate.provideMonth" type="month" placeholder="选择月"
                            :editable="false"></el-date-picker>
          </el-form-item>
          <el-form-item label="生源类型:" prop="userType">
            <el-select filterable v-model="formValidate.userType" placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <!--<el-option label="研究生" value="yjs"></el-option>-->
              <el-option label="住院医" value="zyy"></el-option>
              <el-option label="进修生" value="jxs"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <div id="myTable" ref="myTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="序号" prop="index" width="70"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看
            </el-button>
            <el-button size="small" type="warning" @click="edit(scope.row)">修改
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userSchool" label="学校" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userMajor" label="专业" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="depName" label="科室" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="provideMonth" label="发放月份" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="provideAmount" label="应发金额" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="provideStatus" label="状态" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.provideStatus | typeText}}
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
      <!--修改弹窗-->
      <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal"
             :width="1100">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="editId"></modal-header>
        <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--增加弹窗-->
      <!--<Modal-->
      <!--:mask-closable="false"-->
      <!--v-model="setBenefitModal"-->
      <!--height="200"-->
      <!--title="对话框标题"-->
      <!--class-name="vertical-center-modal"-->
      <!--:width="1000">-->
      <!--&lt;!&ndash;<div slot="header"> &ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--<modal-header slot="header" :content="setBenefitId"></modal-header>-->
      <!--<set-benefit v-if="setBenefitModal" @cancel="cancel" @setBenefit="subCallback"></set-benefit>-->
      <!--<div slot="footer"></div>-->
      <!--</Modal>-->
      <!---->
      <!--查看弹窗-->
      <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
             :width="1000">
        <modal-header slot="header" :parent="self" :content="showId"></modal-header>
        <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
      <!---->

      <!--不发放弹窗-->
      <Modal close-on-click-modal="false" height="200" v-model="noGrantModal" title="对话框标题"
             class-name="vertical-center-modal" :loading="loading" :width="500">
        <modal-header slot="header" :content="noGrantId"></modal-header>
        <operate v-if="noGrantModal" :type="'noGrant'" :operateData="noGrantData" @operate="subCallback"
                 @cancel="cancel" :operaility-data="operailityData"></operate>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--发放弹窗-->
      <Modal close-on-click-modal="false" height="200" v-model="grantModal" title="对话框标题"
             class-name="vertical-center-modal" :loading="loading" :width="500">
        <modal-header slot="header" :content="grantId"></modal-header>
        <operate v-if="grantModal" :type="'grant'" :operateData="grantData" @operate="subCallback" @cancel="cancel"
                 :operaility-data="operailityData"></operate>
        <div slot="footer"></div>
      </Modal>
      <!---->
    </div>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--修改--组件
  import edit from "./allowance_edit.vue";

  import show from "./allowance_view.vue";
  //引入--添加--组件
  //  import setBenefit from "./allowance_setBenefit.vue";
  //当前组件引入全局的util
  let Util = null;

  export default {
    data() {
      //不同角色获取不同列表数据
      return {
        //查询表单
        noGrantData: {
          url: "allowance/modifyStatus",
          data: {
            provideStatus: "BFF"
          }
        },
        grantData: {
          url: "allowance/modifyStatus",
          data: {
            provideStatus: "ZC"
          }
        },
        searchMore: false,
        grantStatue: false, //发放状态
        noGrantUrl: "allowance/modifyStatus",
        formValidate: {
          provideMonth: "", //发放年月
          depId: "", //科室Id
          userType: "", //生源类型
          provideStatus: "", //津贴发放状态
          userId: "", //被发放人Id
          userName: "" //被发放人名称
        },
        options: [
          {
            value: "0",
            label: "待审核"
          },
          {
            value: "1",
            label: "审核通过"
          },
          {
            value: "2",
            label: "未审核"
          }
        ],

        setBenefitModal: false,
        /*--按钮button--*/
        setBenefitId: {
          id: "setBenefit",
          title: "津贴设置"
        },
        removeId: {
          id: "remove",
          title: "删除"
        },
        editId: {
          id: "edit",
          title: "修改"
        },
        auditId: {
          id: "auditId",
          title: "审核"
        },
        showId: {
          id: "auditId",
          title: "查看"
        },
        noGrantId: {
          id: "noGrantId",
          title: "不发放"
        },
        grantId: {
          id: "grantId",
          title: "发放"
        },

        noGrantModal: false,
        grantModal: false,

        operailityData: "",
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        //列表数据
        tableData: [
          //          {
          //            "id":"1",
          //            "userId":"",
          //            "userName":"",
          //            "userSchool":"张三",
          //            "userMajor":"内科",
          //            "depId":"10",
          //            "depName":"呼吸科",
          //            "provideMonth":"2016-01",
          //            "provideAmount":"450",
          //            "provideStatus":"zc"
          //          }
        ],
        loading: false,
        totalCount: 0,
        listMessTitle: {
          ajaxSuccess: "updateListData",
          ajaxParams: {
            url: "/allowance/list",
            params: {}
          }
        }
      };
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
        };

        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight() {
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
          this.showMess("只能修改一条数据!");
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData) {
        this.tableData = this.addIndex(responseData.data);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData() {
        this.listMessTitle.ajaxParams.params = Object.assign(
          this.listMessTitle.ajaxParams.params,
          this.queryQptions,
          this.formValidate
        );
        let params = this.listMessTitle.ajaxParams.params;
        params.provideMonth = this.conductDate(params.provideMonth, 'yyyy-MM');
        this.ajax(this.listMessTitle);
      },
      //搜索监听回调
      searchEvent(isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit("formValidate");
        if (isSubmit) {
          this.setTableData();
        }
      },

      /*
         * 列表查询方法
         * @param string 查询from的id
         * */
      handleSubmit(name) {
        let flag = false;
        this.$refs[name].validate(valid => {
          if (valid) {
            flag = true;
          } else {
            this.$Message.error("表单验证失败!");
          }
        });
        return flag;
      },
      /*--点击--添加--按钮--*/
      setBenefit() {
        this.openModel("setBenefit");
      },
      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel("remove");
      },

      noGrant() {
        if (!this.isSelected()) return;
        this.grantStatue = false;
        this.operailityData = this.multipleSelection;
        this.openModel("noGrant");
      },

      grant() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel("grant");
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
         * 点击--修改角色--按钮
         * @param index string|number  当前行索引
         * */
      edit(data) {
        if (typeof data == "undefined") {
          if (!this.isSelected(true)) return;
          this.operailityData = this.multipleSelection[0];
          this.openModel("edit");
        } else {
          this.operailityData = data;
          this.openModel("edit");
        }
      },
      /*
         * 监听子组件通讯的方法
         * 作用:根据不同的参数关闭对应的模态
         * @param targer string example:"add"、"edit"
         * */
      cancel(targer) {
        this[targer + "Modal"] = false;
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
        this[options + "Modal"] = true;
      },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
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
      });
    },
    components: {
      //当前组件引入的子组件
      edit,
      //      setBenefit,
      show
    }
  };
</script>
