<!--教育处---教学秘书-->

<template>
  <div id="content" ref="content">
    <!--查询-->
    <el-form :inline="true" :model="formSearch" ref="formValidate" :rules="rules.teachingActivitiesSetList">

      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10">
          <el-button type="primary" @click="add">新 建</el-button>
          <el-button type="danger" :disabled="disabled.remove" @click="remove">删 除</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14" align="right">
          <el-form-item label="活动名称" prop="activityName">
            <el-input v-model="formSearch.activityName" placeholder="活动名称">
              <el-button @click="searchEvent" slot="append" icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">
        <el-form-item label="活动类型" prop="user">
          <el-select v-model="formSearch.activityType" label="活动状态" placeholder="请选择活动类型">
            <select-option :id="'value'" :isCode="true" :type="'teachActivityType'"></select-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="user">
          <el-select v-model="formSearch.activityState" placeholder="请选择">
            <el-option label='全部' value=""></el-option>
            <el-option label='未发布' value="NO_RELEASE"></el-option>
            <el-option label="已发布" value="RELEASE"></el-option>
            <el-option label="结束" value="STOP"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="beginTime">
          <el-date-picker
            v-model="formSearch.activityBeginTime"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            @change="handleStartTime">
          </el-date-picker>
          至
        </el-form-item>
        <el-form-item prop="activityEndTime">
          <el-date-picker
            v-model="formSearch.activityEndTime"
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
        :height="dynamicHt"
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
          width="260">
          <template scope="scope">
            <el-button
              size="small"
              @click="show(scope.row)">查看
            </el-button>
            <el-button
              size="small"
              v-if="scope.row.activityState=='NO_RELEASE'"
              @click="publish(scope.row)">发布
            </el-button>
            <el-button
              size="small"
              v-if="scope.row.activityState=='RELEASE' && hashRepeal"
              @click="unpublish(scope.row)">撤销
            </el-button>
            <el-button
              size="small"
              v-if="scope.row.activityState=='NO_RELEASE'"
              @click="edit(scope.row)">修改
            </el-button>
            <el-button
              size="small"
              v-if="['STOP','RELEASE'].includes(scope.row.activityState)"
              @click="signIn(scope.row)">签到
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="活动时间"
          prop="activityTime"
          show-overflow-tooltip
          width="150">
        </el-table-column>
        <el-table-column
          prop="activitySite"
          show-overflow-tooltip
          label="活动地点"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="hostUserName"
          label="授课老师"
          show-overflow-tooltip
          width="120">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="activityName"
          label="活动名称"
          width="120">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="activityType"
          label="活动类型"
          width="120">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="activityUser"
          label="参加人"
          width="120">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="activityState"
          label="状态"
          width="120">
          <template scope="scope">
            {{ scope.row.activityState == 'NO_RELEASE' ? '未发布' : scope.row.activityState == 'RELEASE' ? '已发布' : '结束'}}
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
          :total="listTotal">
        </el-pagination>
      </div>
    </div>
    <!--新建教学活动-->
    <Modal
      :mask-closable="false"
      width="800"
      v-model="addModal"
      title="新建教学活动"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" :fromWhere="fromWhere" :rules="rules" @cancel="cancel" :url="url" @add="subCallback"></add>
      <div slot="footer"></div>
    </Modal>
    <!--修改角色弹窗-->
    <Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="800">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" :fromWhere="fromWhere" :rules="rules" @cancel="cancel" :url="url" @edit="subCallback"
            :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--查看教学活动-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="showModal"
      title="查看教学活动"
      class-name="vertical-center-modal"
      :width="960"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" :url="url" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--发布弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="publishModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="publishId"></modal-header>
      <operate v-if="publishModal" :type="'publish'" :operateUrl="url.teachctivityRelase" @operate="subCallback"
               @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!--撤销发布弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="unpublishModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="unpublishId"></modal-header>
      <operate v-if="unpublishModal" :type="'unpublish'" :operateUrl="url.teachctivityNoRelase" @operate="subCallback"
               @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>

    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="url.teachctivityRemove" @remove="subCallback" @cancel="cancel"
              :operaility-data="operailityData"></remove>

      <div slot="footer"></div>
    </Modal>
    <!--签到弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="signInModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="900">
      <modal-header slot="header" :content="signInId"></modal-header>
      <signIn v-if="signInModal" :url="url" @cancel="cancel" :operaility-data="operailityData"></signIn>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import rules from '../../rules.js'
  import url from '../app'
  //引入--新建教学活动--组件
  import add from './teachingActivitiesSet_add';
  //引入--修改教学活动--组件
  import edit from './teachingActivitiesSet_edit';
  //引入--新建教学活动--组件

  import show from './teachingActivitiesSet_view';
  import signIn from './teachingActivitiesSet_signIn.vue'

  let Util = null;
  export default {
    props: ['fromWhere', 'hashRepeal'],   //hashRepeal是否有撤销按钮
    data() {
      return {
        rules: rules,
        //查询项
        starTimes: '',
        endTimes: '',
        url: url,
        disabled: {
          remove: false,
        },
        searchMore: false,
        publishModal: false, //发布
        unpublishModal: false, //撤销发布
        signInModal: false, //签到
        /*--按钮button--*/
        publishId: {id: 'publishId', title: '发布'},
        unpublishId: {id: 'unpublishId', title: '撤销发布'},
        signInId: {id: 'signInId', title: '签到'},

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
//          {
//            "id":1,
//            "activityName":"教学查房",
//            "activityType":"理论",
//            "hostUserName":"张三",
//            "activityTime":"2017-03-31",
//            "activitySite":"教学楼三楼301室",
//            "activityUser":"呼吸科-住院医师",
//            "shouldUserCount":30,
//            "actuallyUserCount":30,
//            "recordTimes":"9:00-10:00,10:10-11:00",
//            "activityState":"nosubmit"
//          }
        ],
        dynamicHt: '',
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
      this.init();
    },
    components: {
      add, edit, show, signIn
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
      searchEvent(isLoading) {
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if (isSubmit) {
          this.setTableData(isLoading)
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
        //console.log(this.getFormData(this.formSearch))
        //查询成功后 this.setTableData()
      },
      //表格数据
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
        let disabled = {remove: false};
        val.map(item => {
          if (item.activityState === 'RELEASE') {
            disabled.remove = true;
          }
        })
        this.disabled = disabled;
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
        this.tableData = responseData.data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData() {
        let formSearch;
        formSearch = this.formDate(this.getFormData(this.formSearch), ['activityBeginTime', 'activityEndTime'], this.yearMonthData);
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, formSearch);
        this.ajax(this.listMessTitle);
      },
      //签到
      signIn (rowData) {
        this.operailityData = rowData
        this.openModel('signIn')
      },

      /*
      * 改变每页显示条数调用
      * @param n number  当前要设置的显示条数
      * */
      changePageSize(n) {
        this.queryQptions.pageSize = n;
        this.setTableData();
      },
      /*
       * 改变页码调用
       * @param n number  当前要设置的页码
       * */
      changePage(n) {
        // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
        this.queryQptions.curPage = n;
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
        this.openModel('show');

      },
      /*--点击--发布--按钮--*/
      publish(data) {
        this.operailityData = data;
        this.openModel('publish');
      },
      /*--点击--撤销发布--按钮--*/
      unpublish(data) {
        this.operailityData = data;
        this.openModel('unpublish');
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
