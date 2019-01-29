<!--投票-->
<!--评优项目管理-->

<template>
  <div id="nosocomial" ref="nosocomial" class="modal">
    <el-row>
      <el-form :inline="true" ref="formValidate" class="demo-ruleForm">
        <el-col align="right">
          <el-form-item prop="title">
            <input class="hidden">
            <el-input v-model="formValidate.title" placeholder="输入标题搜索">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div id="nosocomialTable" ref="nosocomialTable">
      <el-table align="center" :height="dynamicHt" :context="self" :data="tableData" tooltip-effect="dark"
                style="width: 100%">
        <el-table-column type="id" width="70">
          <template scope="scope">
            <el-radio v-model="selProject" :label="scope.row.id"> {{' '}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="70">
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" show-overflow-tooltip>
          <template scope="scope">
            <el-button size="small" type="info" @click="show(scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="roleName" label="对象 " width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="startDate" label="自荐开始时间" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="endDate" label="自荐结束时间" width="150" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" title="对话框标题" class-name="vertical-center-modal"
           :loading="true" :width="800">
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--查看--组件
  import show from "./OrganizationaVoting_edit_selectProject__view.vue";

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['appraisingId'],
    data() {
      return {
        selProject: +this.appraisingId, //选中的项目
        //查询表单
        formValidate: {
          title: '', //  标题
          roleId: '', //对象
          status: 'ONGOING', //项目状态（进行中）
          startBeginDate: '', //自荐开始时间开始时间
          startEndDate: '', //自荐开始时间结束时间
        },

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
        editId: {
          id: 'edit',
          title: '修改'
        },
        auditId: {
          id: 'auditId',
          title: '审核'
        },
        showId: {
          id: 'auditId',
          title: '查看'
        },

        publishModal: false,
        revocationModal: false,
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 400,
        self: this,
        tableData: [
          //          {
          //            "id":"",
          //            "title":"",
          //            "roleId":"",
          //            "roleName":"",
          //            "startDate":"",
          //            "endDate":"",
          //            "status":""
          //          }
        ],
        loading: false,
        totalCount: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: 'appraising/project/select/list',
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

        //目前没有分页
        //        this.queryQptions = {
        //          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        //        }
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
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },


      //通过get请求列表数据
      updateListData(responseData) {
        //        this.totalCount = responseData.totalCount;    //目前没有分页
        this.tableData = responseData.data;
      },

      //请求数据
      setTableData() {
        let formValidate = this.formDate(this.getFormData(this.formValidate), ['startEndDate', 'startBeginDate'], this.yearMonthData);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, formValidate);
        this.ajax(this.listMessTitle)
      },


      //搜索监听回调
      searchEvent(isLoading) {
        //        isLoading(true);
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
        return flag
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
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
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
      show
    },
    watch: {
      selProject(val) {
        this.$emit('selProjectCall', val)
      },
      appraisingId(val) {
        if (!this.selProject) {
          this.selProject = val;
        }
      }
    }
  }

</script>

