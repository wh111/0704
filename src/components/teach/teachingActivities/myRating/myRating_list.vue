<!--我的评价-->
<!--教育处---教学秘书-->

<template>
  <div id="content" ref="content" class="myRating">
    <div v-show="viewType=-'list'">
      <el-form ref="formValidate" inline label-width="90px" class="demo-ruleForm">

        <el-row>
          <el-col :span="10">

          </el-col>
          <el-col :span="14" :offset="10" align="right">
            <el-form-item label="活动名称" prop="activityName">
              <el-input style="width:300px;" v-model="formValidate.activityName" placeholder="输入活动名称搜索">
                <el-button @click="searchEvent" slot="append" icon="search"></el-button>
              </el-input>
            </el-form-item>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-col>
        </el-row>
        <div v-if="searchMore" ref="searchMore">
          <el-form-item label="活动类型" prop="user">
            <el-select v-model="formValidate.activityType" label="活动状态" placeholder="请选择活动类型">
              <select-option :id="'value'" :isCode="true" :type="'teachActivityType'"></select-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间" prop="activityBeginTime">
            <el-date-picker
              v-model="formValidate.activityBeginTime"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime"
            >
            </el-date-picker>
            到
            <el-date-picker
              v-model="formValidate.activityEndTime"
              align="right"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>

          <el-button type="info" @click="searchEvent">查询</el-button>

        </div>
      </el-form>

      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable">
        <el-table
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="65">
          </el-table-column>
          <el-table-column
            label="操作"
            width="160">
            <template scope="scope">
              <el-button
                size="small"
                @click="show(scope.row)">详-情
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="activityName"
            label="课程名称"
            width="120">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityType"
            label="课程类型"
            width="120">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activitySite"
            label="授课地点"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="hostUserName"
            label="授课老师"
            width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="activityTime"
            label="日期"
            width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="recordTimes"
            label="时间"
            width="120"
          >
          </el-table-column>

        </el-table>
      </div>
    </div>
    <div v-if="viewType=-'view'">
      <el-button @click="changeView('list')">返回</el-button>
      <show :url="url" :operaility-data="operailityData"></show>
    </div>
    <!--&lt;!&ndash;查看教学活动&ndash;&gt;-->
    <!--<Modal-->
    <!--close-on-click-modal="false"-->
    <!--height="200"-->
    <!--v-model="showModal"-->
    <!--title="查看教学活动"-->
    <!--class-name="vertical-center-modal"-->
    <!--:width="960"-->
    <!--:loading="loading">-->
    <!--<modal-header slot="header" :content="viewId"></modal-header>-->
    <!--<show v-if="showModal" :url="url" :operaility-data="operailityData"></show>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
  </div>
</template>
<style>
  .myRating .el-row {
    margin-bottom: 20px;
  }
</style>
<script>
  /*当前组件必要引入*/

  import url from '../app'
  //引入--新建教学活动--组件
  import show from './myRating_view';

  let Util = null;
  export default {
    data() {
      return {
        viewType: 'list',
        showSearchMore: '',
        //查询项
        starTimes: '',
        endTimes: '',
        url: url,

        publishModal: false, //评价
        /*--按钮button--*/
        publishId: {id: 'publishId', title: '发布'},
        formSearch: {
          activityName: '',    //获得名称
          activityType: '',    //活动类型
          activityBeginTime: '',    //活动时间(开始)
          activityEndTime: '',    //活动时间(结束)
          activityState: '',    //活动状态
          depId: '',    //科室ID
        },

        //表格数据
        listUrl: '',
        deleteUrl: '',
        loading: false,
        tableData: [
          {
            "id": 1,
            "activityName": "教学查房",
            "activityType": "理论",
            "hostUserName": "张三",
            "activityTime": "2017-03-31",
            "activitySite": "教学楼三楼301室",
            "activityUser": "呼吸科-住院医师",
            "shouldUserCount": 30,
            "actuallyUserCount": 30,
            "recordTimes": "9:00-10:00,10:10-11:00",
            "activityState": "nosubmit"
          }
        ],

        operailityData: '',
        multipleSelection: [],
        /*--按钮button--*/
        addId: {id: 'add', title: '添加'},
        editId: {id: 'edit', title: '修改'},
        viewId: {id: 'view', title: '查看'},
        removeId: {id: 'remove', title: '删除'},

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateList',
          ajaxParams: {
            url: url.teachctivityList,
            params: {},
          }
        },

      }
    },
    created() {
      this.init()
    },
    components: {
      show
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages = Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },
      //查询
      deformatterDate(d) {
        return new Date(d).getTime() - 1000 * 60 * 60 * 24;
      },
      handleStartTime(d) {
        this.starTimes = this.deformatterDate(d);
      },
      handleEndTime(d) {
        this.endTimes = this.deformatterDate(d);
      },
      //点击查询按钮调用
      onSubmitSearch() {
//        console.log(this.getFormData(this.formSearch))
        //查询成功后 this.setTableData()
      },
      //表格数据
      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 100;
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
      /*
       * 更新列表数据
       * @param JSON 后台返回的data
       */
      updateList(responseData) {
        let data = responseData.data;
        if (!data) return;
        this.tableData = this.addIndex(data);
        this.listTotal = data.listTotal || 0;
      },
      setTableData() {
        let formSearch;
        formSearch = this.formDate(this.getFormData(this.formSearch), ['activityBeginTime', 'activityEndTime'], this.yearMonthData);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, formSearch);
        this.ajax(this.listMessTitle);
      },

      /*
       * 改变每页显示条数调用
       * @param n number  当前要设置的显示条数
       * */
      changePageSize(n) {
        alert(n)
        this.queryQptions.params.pageSize = n;
        this.setTableData();
      },
      /*
       * 改变页码调用
       * @param n number  当前要设置的页码
       * */
      changePage(n) {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.queryQptions.params.curPage = n;
        this.setTableData();
      },

      /*--点击--添加--按钮--*/
      add() {
        this.openModel('add');
      },
      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(data) {
        this.operailityData = data;
        this.openModel('edit')
      },
      /*--点击--查看--按钮--*/
      show(data) {
        this.operailityData = data;
        this.changeView('view');
//        this.openModel('show');

      },
      /*--点击--发布--按钮--*/
      publish(data) {
        this.operailityData = data;
        this.openModel('publish');

      },
      /*--点击--删除--按钮--*/
      remove() {
        if (!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove');
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
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

      //改变视图
      changeView(type) {
        this.viewType = type;
      },
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
  };
</script>

