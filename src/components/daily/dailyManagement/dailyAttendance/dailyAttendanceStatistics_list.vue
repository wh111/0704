<!--奖惩记录-->
<template>
  <div id="content" ref="content" class="modal">


    <el-form ref="formValidate" :inline="true" class="form-inline lose-margin" label-width="90px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="科室" prop="depId">
            <el-select filterable v-model="formValidate.depId" placeholder="请选择">
              <select-option></select-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="考勤时间" prop="month">
            <el-date-picker
              v-model="formValidate.month"
              type="month"
              :editable="false"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>

        </el-col>
        <el-col :span="5">
          <el-form-item label="生源" prop="userType">
            <el-select v-model="formValidate.userType" placeholder="全部">
              <select-option :type="'role'"></select-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="姓名" prop="userType">
            <el-input v-model="formValidate.userName" placeholder="输入姓名搜索">
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="searchEvent">&nbsp; 搜索 &nbsp;</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--<div class="add-remove">-->
    <!--<el-button  class="but-col" @click="add" type="primary">添加</el-button>-->
    <!--<el-button class="but-col" @click="remove" type="danger">删除</el-button>-->

    <!--</div>-->
    <div
      id="myTable"
      ref="myTable"
    >
      <el-table
        align="center"
        :height="dynamicHt"
        :context="self"
        :data="tableData"
        border
        highlight-current-row
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          label="序号"
          prop="index"
          fixed
          width="75">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="userName"
          label="姓名"
          fixed
          width="120">
        </el-table-column>
        <el-table-column
          prop="workAttendance"
          label="实际出勤"
          width="100"
          show-overflow-tooltip>
          <template scope="scope">
            <el-input type="number" min="0" max="31" @focus="saveCell(scope.row.workAttendance)"
                      @blur="valuationCell(scope.row,'workAttendance')" v-model.number="scope.row.workAttendance"
                      placeholder="0"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="compassionateLeave"
          label="事假"
          width="100"
          show-overflow-tooltip>
          <template scope="scope">
            <el-input type="number" min="0" max="31" @focus="saveCell(scope.row.compassionateLeave)"
                      @blur="valuationCell(scope.row,'compassionateLeave')"
                      v-model.number="scope.row.compassionateLeave" placeholder="0"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="sickLeave"
          label="病假"
          width="100"
          show-overflow-tooltip>
          <template scope="scope">
            <el-input type="number" min="0" max="31" @focus="saveCell(scope.row.sickLeave)"
                      @blur="valuationCell(scope.row,'sickLeave')" v-model.number="scope.row.sickLeave"
                      placeholder="0"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="marriageLeave"
          label="婚假"
          width="100"
          show-overflow-tooltip>
          <template scope="scope">
            <el-input type="number" min="0" max="31" @focus="saveCell(scope.row.marriageLeave)"
                      @blur="valuationCell(scope.row,'marriageLeave')" v-model.number="scope.row.marriageLeave"
                      placeholder="0"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="otherLeave"
          label="其他假"
          width="100"
          show-overflow-tooltip>
          <template scope="scope">
            <el-input type="number" min="0" max="31" @focus="saveCell(scope.row.otherLeave)"
                      @blur="valuationCell(scope.row,'otherLeave')" v-model.number="scope.row.otherLeave"
                      placeholder="0"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="absenteeism"
          label="旷工"
          width="100"
          show-overflow-tooltip>
          <template scope="scope">
            <el-input type="number" min="0" max="31" @focus="saveCell(scope.row.absenteeism)"
                      @blur="valuationCell(scope.row,'absenteeism')" v-model.number="scope.row.absenteeism"
                      placeholder="0"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="notes"
          label="备注"
          min-width="200"
          show-overflow-tooltip>
          <template scope="scope">
            <el-input type="number" max="31" @focus="saveCell(scope.row.notes)" @blur="valuationCell(scope.row,'notes')"
                      v-model="scope.row.notes" placeholder="请输入"></el-input>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>
<script>


  let Util = null;

  export default {
    data() {
      return {

        "tableData": [
//          {
//            "id":"1",
//            "userId":"1",
//            "userName":"张三",
//            "userType":"实习生",
//            "month":"201601",
//            "workAttendance":"21",
//            "compassionateLeave":"1",
//            "sickLeave":"0",
//            "marriageLeave":"0",
//            "maternityLeave":"0",
//            "familyLeave":"0",
//            "funeralLeave":"0",
//            "otherLeave":"0",
//            "absenteeism":"0",
//            "notes":"0",
//
//          }
        ],

        //获取列表所需数据
        formValidate: {
          depId: '',  //科室id
          userType: '',  //生源类型
          month: '',  //考勤时间
          userName: '',  //学员姓名
        },

        //保存或修改所需数据 (目前直接使用传过来的数据，此数据只做展示)
        saveValidate: {
          userId: "",   //学员id
          depId: "",   //科室id
          userType: "",   //生源类型
          month: "",   //考勤年月
          workAttendance: "",   //出勤天数
          compassionateLeave: "",   //事假天数
          sickLeave: "",   //病假天数
          marriageLeave: "",   //婚假天数
          maternityLeave: "",   //产假天数
          familyLeave: "",   //探亲假天数
          funeralLeave: "",   //丧假天数
          otherLeave: "",   //其他假期
          notes: "",   //备注
          absenteeism: "",   //旷工天数

        },

        options: [{
          value: '',
          label: '全部'
        }, {
          value: 'wsb',
          label: '未上报'
        }, {
          value: 'dsh',
          label: '待审核'
        }, {
          value: '3',
          label: '通过'
        }, {
          value: '4',
          label: '不通过'
        }],
        multipleSelection: [],
        operailityData: '',
        dynamicHt: 100,
        self: this,
        loading: false,
        reportedModal: false,
        addId: {id: 'addId', title: '新建'},
        editId: {id: 'editId', title: '修改'},
        removeId: {id: 'removeId', title: '删除'},
        viewId: {id: 'viewId', title: '删除'},
        auditId: {id: 'auditId', title: '审核'},
        reportedId: {id: 'reportedId', title: '上报'},

        //当前点击行数据
        row: {
          val: '',
          key: '',
          row: '',
          top: '',
          left: '',
          isSelect: false,
          inputValue: '',
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置

        //初始化月份
        let date = new Date();
        date = this.yearMonth(+this.yearMonth(date));

        this.formValidate.month = date
        this.myPages = Util.pageInitPrams;
        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 12;
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
      * 修改后调用保存修改信息
      * */
      handleEdit() {

        this.ajax(this.editMessTitle)

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


      //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
      setTableData(row, key, val) {
        let that = this;
        //处理服务数据
        let params = this.formDate(this.getFormData(this.formValidate), ['month'], this.yearMonthData);
        let myPromise = Util.queryData({
          url: 'attendance/listCount',
          method: 'get',
          params: this.formValidate
        })();
        myPromise.then(function (res) {
          let responseData = res.data;
          if (Util._.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            that.tableData = responseData.data
          } else {
            if (row) {
              row[key] = val;
              that.errorMess('操作失败');
            }
            that.errorMess('获取数据失败');

          }
        }).catch(function (response) {
          if (response instanceof Error) {
            // 意外发生在设置要求引发一个错误
            that.errorMess(response.message);
          } else {
            that.errorMess(response.status + "错误!");
          }
        })
      },


      //当前组件添加时调用
      addCell(row, key, val) {
        if (!row) {
          that.errorMess('操作错误');
        }
        let that = this;
        //处理服务数据

        let myPromise = Util.queryData({
          url: 'attendance/add',
          method: 'post',
          data: row
        })();
        myPromise.then(function (res) {
          let responseData = res.data;
          if (Util._.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            that.setTableData(row, key, val)
          } else {
            if (row) {
              row[key] = val;
              that.errorMess('操作失败');
            }
            that.errorMess('操作失败');

          }
        }).catch(function (response) {

          if (response instanceof Error) {
            // 意外发生在设置要求引发一个错误

            row[key] = val;
            that.errorMess(response.message);
          } else {
            row[key] = val;
            that.errorMess(response.status + "错误!");
          }
        })
      },

      //当前组件添加时调用
      editCell(row, key, val) {
        if (!row) {
          that.errorMess('操作错误');
        }
        let that = this;
        //处理服务数据

        let myPromise = Util.queryData({
          url: 'attendance/modify/' + row.id,
          method: 'put',
          data: row
        })();
        myPromise.then(function (res) {
          let responseData = res.data;
          if (Util._.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            //修改目前不获取列表
//            that.setTableData(row,key,val)
          } else {
            if (row) {
              row[key] = val;
              that.errorMess('操作失败');
            }
            that.errorMess('操作失败');

          }
        }).catch(function (response) {
          row[key] = val;
          if (response instanceof Error) {
            // 意外发生在设置要求引发一个错误

            that.errorMess(response.message);
          } else {
            that.errorMess(response.status + "错误!");
          }
        })
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
        this.openModel("add");
      },


      /*--点击--修改--按钮--*/
      edit(data) {
        this.operailityData = data;
        this.openModel("edit");
      },


      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data) {
        this.operailityData = data;
        this.openModel("show");
      },

      //审核
      audit(data) {
        this.operailityData = data;
        this.openModel("audit");
      },

      //上报
      reported(data) {
        this.operailityData = data;
        this.openModel("reported");
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

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },


      //考勤操作


      saveCell(val) {
        this.row.val = val;
      },
      /*
          input 失去焦点时调用
       * 为单元格赋值，并隐藏
       *
       * */
      valuationCell(row, type) {
        let old = this.row.val;
        if (old == row[type]) return;
        if (!row.id) {
          this.addCell(row, type, old)
        } else {
          this.editCell(row, type, old)
        }

        this.row.isSelect = false;
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

  }
</script>
<style>
  .add-remove {
    margin-bottom: 20px;
  }
</style>
