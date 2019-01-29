<!----------------------------------
****--@name     进修回执查询
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <div class="add-remove">
        </div>
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin"
                   label-width="90px">
            <div class="listUpArea-searchLeft">
              <input class="hidden">
              <el-input placeholder="请输入内容" v-model="formValidate.userName">
                <div slot="prepend">姓名</div>
                <el-button @click="handleSubmit('formValidate')" slot="append" icon="search"></el-button>
              </el-input>
            </div>
            <div class="listUpArea-moreSearch">
              <el-button @click="showMoreSearch" type="text">高级查询</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox">

    </div>
    <br/>
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
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          prop="index"
          width="65">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100">
          <template scope="scope">
            <el-button
              size="small"
              type="info"
              @click="show(scope.$index,scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          align="center"
          width="200">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.gender == 'BOY' ? '男' : '女'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="courseNames"
          label="进修科目名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="studyTime"
          label="进修时间"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.studyTime == 'HALF_YEAR' ? '半年' : '一年'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="checkInTime"
          label="报到时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="workName"
          label="进修单位"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="professionalQualification"
          label="职业资格"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="recordSchooling"
          label="学历"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="hasCompletedReceipt"
          label="是否填写回执"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.hasCompletedReceipt === 'Y' ? '填写' : '未填写' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
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
        <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //引入--修改--组件
  //引入--查看--组件
  import show from "./educationReceiptQuery_view.vue";
  //引入--添加--组件
  import api from "./api.js";
  //当前组件引入全局的util
  let Util = null;

  export default {
    data() {
      return {
        //查询表单
        formValidate: {
          createTimeBegin: '',
          createTimeEnd: '',
          title: '',
          paymentReceipt: '',
          managementId: '',
          sortby: '',
          order: '',
        },
        showData: '',
        /*--按钮button--*/
        showId: {
          id: 'auditId',
          title: '查看'
        },
        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [
          /*{
            "subjectsId":1,
            "userName":"姓名",
            "gender":"性别 BOY 男,GIRL 女",
            "age":"年龄",
            "recordSchooling":"学历",
            "title":"职称",
            "professionalQualification":"职业资格",
            "health":"健康状况",
            "partyMember":"是否党员(Y 是 N 否)",
            "email":"邮箱",
            "position":"职务",
            "phone":"手机号",
            "courseNames":"进修科目名称",
            "workName":"单位",
            "workAddress":"单位地址",
            "zipCode":"邮政编码",
            "psychiatryPhone":"医教处电话",
            "doctorCertificateNumber":"职业医师证书编号",
            "institutionsRegistrationNumber":"职业机构登记证号",
            "paymentReceipt":"是否填回执 0未填 1 已填",
            "studyTime":"进修时间(HALFTYEAR 半年 AYEAR一年)",
            "checkInTime":"报到时间(yyyy-MM-dd)",
            "userId":11
          }*/
        ],
        loading: false,
        listTotal: 0,
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.pageList.path,
            params: {
              createTimeBegin: '',
              createTimeEnd: '',
              title: '',
              paymentReceipt: '',
              managementId: '',
              sortby: '',
              order: '',
            }
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
          //url:this.listUrl,
          params: {curPage: 1, pageSize: Util.pageInitPrams.pageSize}
        }
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
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data;
        this.tableData1 = [];
        data = this.addIndex(data);
        this.tableData1 = data;
        this.listTotal = responseData.totalCount || 0;
      },

      setTableData(params) {
        this.setAjaxParams();
        this.ajax(this.listMessTitle);
      },

      //设置提交的参数
      setAjaxParams() {
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions.params, this.formValidate);
      },

      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name) {
        this.setTableData();
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index) {
        this.operailityData = this.tableData1[index];
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
      }
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
    }

  }
</script>
