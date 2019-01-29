<!--奖惩记录-->
<template>
  <div id="content" ref="content" @click="selectHide" class="modal">
    <el-form :model="formValidate" ref="formValidate" :rules="rules.leaveManagementList" :inline="true"
             class="form-inline lose-margin" label-width="90px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="科室" prop="depId">
            <el-select filterable v-model="formValidate.depId" placeholder="请选择">
              <select-option :role="role" :type="type" :name="type=='getDepByTeacher'?'depName':''"
                             :id="type=='getDepByTeacher'?'depId':''" :userType="userType"
                             :userId="userId"></select-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考勤时间" prop="month">
            <el-date-picker
              :clearable="false"
              v-model="formValidate.month"
              type="month"
              :editable="false"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="生源" prop="userType">
            <el-select v-model="formValidate.userType" placeholder="全部">
              <el-option label="全部" value=""></el-option>
              <el-option label="实习生" value="SXS"></el-option>
              <el-option label="研究生" value="YJS"></el-option>
              <el-option label="住院医" value="ZYY"></el-option>
              <el-option label="进修生" value="JXS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="userType">
            <el-input v-model="formValidate.userName" placeholder="输入姓名搜索">
            </el-input>
          </el-form-item>
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
        :data="data"
        border
        v-if="isShow"
        highlight-current-row
        @cell-click="cell"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          label="序号"
          type="index"
          fixed
          width="75">
          <template scope="scope">{{scope.row.index}}</template>
        </el-table-column>

        <el-table-column
          prop="userName"
          label="姓名"
          fixed
          show-overflow-tooltip
          width="120">
        </el-table-column>
        <el-table-column
          prop="depName"
          label="上半月"
          show-overflow-tooltip>
          <el-table-column
            label="1————————15"
            show-overflow-tooltip>
            <el-table-column
              v-for="num in 15"
              :key="num"
              :label="num+''"
              width="60"
              show-overflow-tooltip>
              <template scope="scope">
                {{commutator(scope.row.clockList && scope.row.clockList[num-1] && scope.row.clockList[num-1].type)}}
              </template>
            </el-table-column>

          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="depName"
          label="下半月"
          show-overflow-tooltip>
          <el-table-column
            prop="leaveType"
            :label="'16————————'+(15+headerLength)"
            show-overflow-tooltip>

            <el-table-column
              v-for="nums in headerLength"
              :key="15+'_'+nums"
              :label="(15+nums)+''"
              width="60"
              show-overflow-tooltip>
              <template scope="scope">
                {{commutator(scope.row.clockList && scope.row.clockList[15+nums-1] &&
                scope.row.clockList[15+nums-1].type)}}
              </template>
            </el-table-column>

          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="workAttendance"
          label="实际出勤"
          width="96"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="compassionateLeave"
          label="事假"
          width="75"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sickLeave"
          label="病假"
          width="75"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="marriageLeave"
          label="婚假"
          width="75"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="otherLeave"
          label="其他假"
          width="80"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="absenteeism"
          label="旷工"
          width="75"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="dayShift"
          label="白班"
          width="75"
          show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="leaveEarly"-->
          <!--label="早退"-->
          <!--width="75"-->
          <!--show-overflow-tooltip>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="notes"
          label="备注"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>


      <div class="daily el-select-dropdown " :style="{top:row.top,left:row.left}" v-show="row.isSelect"
           style="position:fixed; top: 603px; left: 706px; transform-origin: center top 0px; z-index: 2019;"
           x-placement="bottom-start">
        <div class="el-scrollbar">
          <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -12px;">
            <ul class="el-scrollbar__view el-select-dropdown__list">
              <li class="el-select-dropdown__item" @click="valuationCell('CQ')">
                <span>出勤|</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('SJ')">
                <span>事假+</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('BJ')">
                <span>病假++</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('CJ')">
                <span>产假#</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('TQJ')">
                <span>探亲假△</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('SANGJ')">
                <span>丧假☓</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('HJ')">
                <span>婚假✔</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('KG')">
                <span>旷工◯</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('OTHER')">
                <span>其他◆</span>
              </li>

              <li class="el-select-dropdown__item" @click="valuationCell('YB')">
                <span>夜班●</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('XX')">
                <span>休息◆●</span>
              </li>
              <li class="el-select-dropdown__item" @click="valuationCell('BB')">
                <span>白班●◆</span>
              </li>
              <!--<li class="el-select-dropdown__item" @click="valuationCell('CD')">-->
              <!--<span>迟到◆</span>-->
              <!--</li>-->
              <!--<li class="el-select-dropdown__item" @click="valuationCell('ZT')">-->
              <!--<span>早退●</span>-->
              <!--</li>-->
              <!--<li class="el-select-dropdown__item" @click="valuationCell('CZ')">-->
              <!--<span>迟到并且早退◆●</span>-->
              <!--</li>-->
              <!--<li class="el-select-dropdown__item" @click="valuationCell('')">-->
              <!--<span>    </span>-->
              <!--</li>-->
            </ul>
          </div>
          <div class="el-scrollbar__bar is-horizontal">
            <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
          </div>
          <div class="el-scrollbar__bar is-vertical">
            <div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
          </div>
        </div>
      </div>
    </div>

    <div style="padding: 5px;font-size: 16px">
      考勤标记: &nbsp;&nbsp; 出勤|&nbsp;&nbsp; 事假+ &nbsp;&nbsp; 病假++ &nbsp;&nbsp; 产假#&nbsp;&nbsp; 探亲假△ &nbsp;&nbsp; 丧假☓&nbsp;&nbsp;
      婚假✔&nbsp;&nbsp; 旷工◯ &nbsp;&nbsp; 其他◆ &nbsp;&nbsp; &nbsp;&nbsp;夜班●&nbsp;&nbsp; 休息◆●&nbsp;&nbsp; 白班●◆
      <!--迟到◆ &nbsp;&nbsp; 早退● &nbsp;&nbsp; 迟到并且早退◆●-->
    </div>
    <div style="margin:10px">
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

  import rules from '../rules'

  let Util = null;

  export default {
    data() {
      return {
        oldDay: 0,
        rules: rules,
        totalCount:0,
        isShow: true,
        data: [],
        formValidate: {
          depId: '',  //科室id
          userType: '',  //生源类型
          month: '',  //考勤时间
          userName: '',  //学员姓名
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
        tableData1: [],
        reportedModal: false,
        addId: {id: 'addId', title: '新建'},
        editId: {id: 'editId', title: '修改'},
        removeId: {id: 'removeId', title: '删除'},
        viewId: {id: 'viewId', title: '删除'},
        auditId: {id: 'auditId', title: '审核'},
        reportedId: {id: 'reportedId', title: '上报'},

        //当前点击行数据
        row: {
          key: '',
          row: '',
          top: 1000,
          left: -1000,
          isSelect: false,
        },
        headerLength: 10,
        oldDate: '',
        type: 'dep',
        role: ''
      }
    },

    methods: {
      //初始化请求列表数据
      init() {
        let userInfo = this.$store.getters.getUserInfo;
        if (userInfo.roleList[0].identify == 'DJLS') {
          this.type = 'getDepByTeacher';
        } else {
          this.type = 'byUserType';
        }
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;
        this.queryQptions = {
          curPage: 1,
          pageSize: Util.pageInitPrams.pageSize,
        };
        //初始化月份
        let date = new Date();
        date = this.yearMonth(+this.yearMonth(date));
        this.formValidate.month = date;
        this.oldDate = date;
        //获取当月有多少天,data是
        let newDate = date.split('-');
        this.getAlsoNum(newDate[0], newDate[1]);
        this.setTableData();
      },
      getAlsoNum(y, m) {
        let date = this.yearMonth(+this.yearMonth(this.formValidate.month || ''));
        // //获取当月有多少天,判断是否需要跟新头部，更新则隐藏头部
        let newDate = date.split('-');
        let ts = new Date(y || newDate[0], m || newDate[1], 0).getDate();//天数
        if (ts != this.oldDay) {
          this.isShow = false;
        }
        this.headerLength = ts - 15;
        setTimeout(() => {
          this.oldDay = ts;
          this.isShow = true;
        }, 10)
      },
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 90;
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


      //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
      setTableData(row, key, val) {
        this.ajaxCreateLoading(true);
        let that = this;
        //处理服务数据
        let params = this.formDate(this.getFormData(this.formValidate), ['month'], this.yearMonth);
        params = Object.assign(params, this.queryQptions, params);
        console.log(params);
        let myPromise = Util.queryData({
          url: 'attendance/list',
          method: 'get',
          params: params
        })();
        let arr = [{clockList: []}];
        myPromise.then(function (res) {
          let responseData = res.data;
          that.ajaxCreateLoading(false);
          if (Util._.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            if (responseData.data == 0) {
              that.data = responseData.data;
              //that.errorMess('数据为空');
              return;
            }
            // let date = that.yearMonth(+that.yearMonth(that.formValidate.month));
            // //获取当月有多少天,判断是否需要跟新头部，更新则隐藏头部
            // let newDate = date.split('-');
            // let ts = new Date(newDate[0], newDate[1], 0);//天数
            // if (ts != that.headerLength) {
            //   that.isShow = false;
            //   that.headerLength = ts;
            // }
            that.data = that.addIndex(responseData.data);
            that.totalCount = responseData.totalCount || 0;
            // that.isShow = true;
          } else {
            if (row) {
              row['clockList'][key].type = val;
              that.errorMess('操作失败');
            }
            that.errorMess('获取数据失败');

          }
        }).catch(function (response) {
          if (response instanceof Error) {
            that.ajaxCreateLoading(false);
            // 意外发生在设置要求引发一个错误
            that.errorMess(response.message);
          } else {
            that.errorMess(response.status + "错误!");
            that.ajaxCreateLoading(false);
          }
        })
      },


      //当前组件添加时调用
      addCell(row, key, val) {
        if (!row) {
          that.errorMess('操作错误');
        }
        let that = this;
        that.ajaxCreateLoading(true);
        //处理服务数据
        let date = (key + 1) > 9 ? (key + 1) : '0' + (key + 1);
        let month = this.yearMonth(this.formValidate.month) + '';

        let clockDate = month.split('');
        clockDate.splice(4, 0, "-");
        clockDate.push('-');
        clockDate.push(date);
        clockDate = clockDate.join('');
        let myPromise = Util.queryData({
          url: 'attendance/clock/add',
          method: 'post',
          data: {
            userId: row.userId,   //学员Id
            depId: row.depId,   //科室Id
            type: row['clockList'][key].type,   //签到类型
            clockDate: clockDate,   //yyyy-MM-dd
            month: month,//yyyymm
            userType: this.formValidate.userType,
          }
        })();
        myPromise.then(function (res) {
          that.ajaxCreateLoading(false);
          let responseData = res.data;
          if (Util._.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            that.setTableData(row, key, val)
          } else {
            if (row) {
              row['clockList'][key].type = val;
              that.errorMess('操作失败');
            }
            that.errorMess('获取数据失败');

          }
        }).catch(function (response) {
          row['clockList'][key].type = val;
          if (response instanceof Error) {
            that.ajaxCreateLoading(false);
            // 意外发生在设置要求引发一个错误
            that.errorMess(response.message);
          } else {
            that.ajaxCreateLoading(false);
            that.errorMess(response.status + "错误!");
          }
        })
      },


      //当前组件修改时调用
      editCell(row, key, val) {
        if (!row) {
          that.errorMess('操作错误');
        }
        let that = this;
        that.ajaxCreateLoading(true);
        let dateData = row['clockList'][key];
        //处理服务数据
        let date = key + 1 > 9 ? key+1 : '0' + (key + 1);
        //拼clockDate 为yyyy-MM-dd
        let clockDate = (row.month + '').split('');
        clockDate.splice(4, 0, "-");
        clockDate.push('-');
        clockDate.push(date);
        clockDate = clockDate.join('');

        let myPromise = Util.queryData({
          url: 'attendance/clock/modify/' + dateData.id,
          method: 'put',
          data: {
            idL: dateData.id,
            userId: row.userId,   //学员Id
            depId: row.depId,   //科室Id
            type: dateData.type,   //签到类型
            clockDate: clockDate,   //yyyy-MM-dd
            month: row.month,   //yyyymm
            userType: this.formValidate.userType,
          }
        })();
        myPromise.then(function (res) {
          that.ajaxCreateLoading(false);
          let responseData = res.data;
          if (Util._.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            //修改成功目前未刷新列表， 保留
            that.setTableData(row, key, val)
          } else {
            if (row) {
              dateData.type = val;
              that.errorMess('操作失败');
            }
            that.errorMess('获取数据失败');

          }
        }).catch(function (response) {
          if (response instanceof Error) {
            that.ajaxCreateLoading(false);
            // 意外发生在设置要求引发一个错误
            that.errorMess(response.message);
          } else {
            that.ajaxCreateLoading(false);
            that.errorMess(response.status + "错误!");
          }
        })
      },

      //搜索监听回调
      searchEvent() {
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.getAlsoNum();
          this.setTableData();
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

      //请假管理操作


      //转化，使cq转换成‘|’
      commutator(type) {
        let text = {
          CQ: '|', SJ: '+', BJ: '++', CJ: '#', TQJ: '△', SANGJ: '☓', HJ: '✔',
          KG: '◯', CD: '◆', ZT: '●', CZ: '◆●', OTHER: '◆', YB: '●', XX: '◆●', BB: '●◆'
        };
        return text[type] || '';
      },

      /*
       * cq转换成
       *
       * */
      converter(type) {
        //产假，探亲假，丧假 是其他
        let text = {
          CQ: 'workAttendance',
          SJ: 'compassionateLeave',
          BJ: 'sickLeave',
          CJ: 'otherLeave',
          TQJ: 'otherLeave',
          SANGJ: 'otherLeave',
          HJ: 'marriageLeave',
          KG: 'absenteeism',
          CD: 'otherLeave',
          ZT: 'leaveEarly',
          OTHER: 'otherLeave',
          YB: 'workAttendance',
          BB: 'dayShift'
        };
        return text[type] || '';
      },


      /*
       * 单元格点击事件
       * @params   row   obj   当前点击行数据
       * @params   column   obj   列数据
       * @params   cell   obj   当前单元格dom对象
       *
       * */
      cell(row, column, cell, event) {
        if (column.level != 3) return;  //不是1-31天的返回
        this.row.key = column.label - 1;
        this.row.row = row;
        if (event.pageY > this.dynamicHt / 2 + 120) {
          this.row.top = event.pageY - 276 + 'px';
        } else {
          this.row.top = event.pageY + 14 + 'px';
        }
        this.row.left = event.pageX - 30 + 'px';
        this.row.isSelect = true;
        event.stopPropagation();
        return false;
      },


//      点击非单元格是列表隐藏
      selectHide() {
        this.row.isSelect = false;
      },


      /*
       * 为单元格赋值，并隐藏
       *
       * */
      valuationCell(value) {
        let oldval = '';
        let old = '';
        let next = '';
        let row = this.row.row;
        let key = this.row.key;
        if (typeof key == 'number') {
          oldval = row['clockList'][key].type;
          if (row['clockList'][key].type == value) return;
          old = this.converter(row['clockList'][key].type);
          console.log(row,old,row[old]);
//          row[old]--;
          next = this.converter(value);
          console.log(row,next,row[next]);
//          row[next]++;

          row['clockList'][key].type = value;
        } else {
          return;
        }
        if (!row['clockList'][key].id) {
          this.addCell(row, key, oldval);
        } else {
          this.editCell(row, key, oldval);
        }
        this.row.isSelect = false;
      },


      /*
       * 对表单数据的时间进行转换
       * @parans date   string|obj  操作的方法
       * @return 199-02-12格式的时间
       * */
      yearMonthData(date) {
        if (typeof date != 'object') return date;
        let datetime = new Date(date);
        let year = datetime.getFullYear();
        let month = datetime.getMonth() + 1;
        let D = date.getDate() + ' ';
        if (month < 10) {
          month = "0" + month;
        }
        return year + '-' + month + '-' + D;
      },
    },


    created() {
      let userInfo = this.$store.getters.getUserInfo;
      this.userId = userInfo.id;
      this.userType = userInfo.studentTypes;
      this.role = userInfo.roleList[0].identify;
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
  .daily .el-select-dropdown__item:hover {
    background-color: #e4e8f1;

  }


</style>
