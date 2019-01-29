<!--
****--@file     dailyAttendanceRecord_list.vue
****--@date     2018/3/1 2:49
****--@author   wh
****--@describe   考勤记录
-->
<template>
  <div id="content" ref="content" class="modal">

    <el-form :model="formValidate" ref="formValidate" inline class="demo-ruleForm">
      <!--<el-button  class="but-col" @click="add" type="primary">添加</el-button>-->
      <!--<el-button class="but-col" @click="remove" type="danger">删除</el-button>-->
      <el-form-item label="类型" prop="signType">
        <el-select filterable v-model="formValidate.signType" placeholder="请选择" @change="searchEvent">
          <el-option label="全部" value=""></el-option>
          <el-option label="教学活动" value="TEACH"></el-option>
          <el-option label="课程" value="COURSE"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--表格数据-->
    <div
      id="myTable"
      ref="myTable"
    >
      <el-table
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          label="序号"
          type="index"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="signTime"
          label="签到时间"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.signTime|formatDate('yyyy-MM-dd HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="signType"
          label="类型"
          show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.signType|typeText}}
          </template>
        </el-table-column>
        <el-table-column
          prop="signUserName"
          label="签到人姓名"
          show-overflow-tooltip>
          <!--<template scope="scope">-->
          <!--{{converterLeaveType(scope.row.leaveType)}}-->
          <!--</template>-->
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
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>


    </div>
  </div>
</template>
<script>

  let Util = null;
  export default {
    data() {
      return {

        //查询表单
        deleteUrl: 'leave/remove',
        formValidate: {
          beginDate: '',
          endDate: '',
          depId: '',
          status: 'DSH',
          userType: '',
          userName: ''
        },
        options: {},
        "tableData": [],
        searchMore: false,
        statusData: {
          url: 'leave/modifyLeaveStatus/approval/batch',
          method: 'put',
          data: {
            status: 'TG'
          }
        },
        reportedData: {
          url: 'leave/modifyLeaveStatus',
          method: 'put',
          data: {
            status: 'YSB'
          }
        },

        operailityData: '',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        loading: false,
        totalCount: 0,


        reportedModal: false,
        passModal: false,
        rejectModal: false,


        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: 'attendance/signRecord/list',
            params: ''
          }
        },

        type: 'dep',
        role: '',
        formValidate: {
          signType: '',
        }


      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        let userInfo = this.$store.getters.getUserInfo;
//                if(userInfo.roleList[0].identify == 'DJLS'){
//                    this.type = 'getDepByTeacher';
//                }else {
//                    this.type = 'byUserType';
//                }
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize,
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

      //通过get请求列表数据
      updateListData(responseData) {
        let data = responseData.data.list;
        if (!data) return;
        this.tableData = responseData.data.list;
        this.totalCount = responseData.data.total || 0;
      },
      setTableData() {
        let formValidate = {
          signType: '',
        }
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.formValidate);
        this.ajax(this.listMessTitle);
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


      /*--点击--添加--按钮--*/
      add() {
        this.operailityData = {userNmae: '张三', id: '2'}
        this.openModel("add");
      },


      /*--点击--修改--按钮--*/
      edit(data) {
        this.operailityData = data;
        this.openModel("edit");
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
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
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
      let userInfo = this.$store.getters.getUserInfo;
      this.userId = userInfo.id;
      this.userType = userInfo.studentTypes;
      this.role = userInfo.roleList[0].identify;
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
    components: {},
    computed: {
      //计算总共多少天
      length() {
        if (!this.formValidate.endDate || !this.formValidate.beginDate) return 0
        let length = this.formValidate.timeLength = (this.deformatterDate(this.formValidate.endDate) - this.deformatterDate(this.formValidate.beginDate)) / 86400000 + 1;
        return length
      }

    },
    watch: {
      showData() {
        this.loading = true;
      }
    }

  }
</script>
<style>

  .add-remove {
    margin-bottom: 20px;
  }


</style>
