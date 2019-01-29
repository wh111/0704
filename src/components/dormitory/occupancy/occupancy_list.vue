<!---人员入住情况--->
<template>
  <div id="content" ref="content" class="modal">
    <steps></steps>
    <el-form  :model="formValidate" inline ref="formValidate" :rules="rules.occupancyList" label-width="100px">

      <el-row >
        <el-row style="margin-bottom:0">
          <!--&lt;!&ndash;列表操作按钮&ndash;&gt;-->
          <el-col :span="9" >
            <el-button @click="derive" type="info">导出excel</el-button>
          </el-col>
          <!--搜索项-->
          <el-col :span="14"  align="right">
            <el-form-item  prop="userName">
              <input class="hidden">
              <el-input   v-model="formValidate.userName" placeholder="输入姓名搜索">
                <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
              </el-input>
            </el-form-item>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-col>
        </el-row>
        </br>
        <!--高级搜索项-->
        <div v-if="searchMore" ref="searchMore">
          <el-form-item label="大楼名称" prop="buildingName" >
            <el-input   v-model="formValidate.buildingName" placeholder="输入大楼名称搜索">
            </el-input>
          </el-form-item>
          <el-form-item label="迁出时间起始" prop="outDateBegin" >
            <el-date-picker
              v-model="formValidate.outDateBegin"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
              @change="handleStartTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="迁出时间结束" prop="outDateEnd" >
            <el-date-picker
              v-model="formValidate.outDateEnd"
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
      </el-row>
    </el-form>
    <!--列表操作按钮-->
    <!--列表数据-->
    <div>
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
          highlight-current-row
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="序号"
            prop="index"
            width="100">
            <template scope="scope">
              <span>{{scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="160">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="userName"
            label="姓名"
            show-overflow-tooltip
            width="200">
          </el-table-column>
          <el-table-column
            prop="userSex"
            label="性别"
            show-overflow-tooltip
            width="100">
            <template scope="scope">
              {{scope.row.userSex | typeText}}
            </template>
          </el-table-column>
          <el-table-column
            prop="buildingName"
            label="大楼名称"
            show-overflow-tooltip
            align="center"
            width="300"
          >
          </el-table-column>
          <el-table-column
            prop="roomName"
            label="房间号"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="inDate"
            label="迁入时间"
            show-overflow-tooltip
          >
            <template scope="scope">
              {{conductDate(scope.row.inDate,'yyyy-MM-dd')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="outDate"
            show-overflow-tooltip
            label="迁出时间">
            <template scope="scope">
              {{conductDate(scope.row.outDate,'yyyy-MM-dd')}}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="动作"
            show-overflow-tooltip
          >
            <template scope="scope">
              {{scope.row.status?'迁出':'迁入'}}
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
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--查看弹窗-->
    <Modal
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>

    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题" class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <!--<a :href="config.urlPrefix+url.exportBedPerson+'?buildingName='+formValidate.buildingName+'&userName='+formValidate.userName+'&outDateBegin='+formValidate.outDateBegin1+'&outDateEnd='+formValidate.outDateEnd1">-->
              <!--<el-button @click="affirmDerive" type="primary">确定</el-button>-->
            <!--</a>-->
            <a :href="config.urlPrefix+url.exportBedPerson">
            <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../app'
  import rules from '../rules.js'
  import config from "../../../config/config.js";

  //引入--查看--组件
  import show from "./occupancy_view.vue";

  import steps from '../dormitory_common/steps.vue'

  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        config,
        url:url,
        rules:rules,
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          buildingName: '',       //大楼名称模糊检索
          roomName : '',       //房间名称
          userName: '',       //姓名
          inDateBegin: '',       //入住时间起始
          inDateEnd: '',       //入住时间结束
          outDateBegin: '',       //迁出时间起始
          outDateBegin1: '',       //迁出时间起始
          outDateEnd: '',       //迁出时间结束
          outDateEnd2: '',       //迁出时间结束
          status: '',       //动作
          sortby: '',//排序列
          order: ''     //升序、降序
        },

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
//          {
//          "curPage":1,
//          "pageSize":20,
//          "sortby":"",
//          "order":"",
//          "id":22,
//          "userId":10000,
//          "userName":"小张一号",
//          "userSex":"boy",
//          "buildingName":"一号楼",
//          "roomName":"7",
//          "inDate":1494950400000,
//          "outDate":1494950400000,
//          "status":true,
//          "sort":" ORDER BY ID DESC",
//          "limit":" LIMIT 0,20"
//        }
        ],
        searchMore: false,
        loading:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.userInfo,
            params:{}
          }
        },
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},

        deriveModal:false,
        deriveId: {
          id: 'deriveId',
          title: '导出人员入住情况'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        }
        this.setTableData();
      },
      //设置表格及分页的位置
      setTableDynHeight(){
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
      isSelected(isOnly){
        let len = this.multipleSelection.length;
        let flag = true;
        if(len==0){
          this.showMess("请选择数据!");
          flag = false;
        }
        if(len>1 && isOnly){
          this.showMess("只能修改一条数据!")
          flag = false;
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData(responseData){
        this.tableData = this.addIndex(responseData.data);
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData(){
        let formValidate = this.formDate(this.getFormData(this.formValidate),['outDateBegin','outDateEnd'],'yyyy-MM-dd');
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,formValidate);
        this.ajax(this.listMessTitle);
      },

      //搜索监听回调
      searchEvent(isLoading){
        //        isLoading(true);
        let isSubmit = this.handleSubmit('formValidate');
        if(isSubmit){
          this.setTableData()
        }
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        let flag =false
        this.$refs[name].validate((valid) => {
          if (valid) {
            flag =true;
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
      show(data){
        this.operailityData = data;
        this.openModel("show");
      },
      //导出
      derive() {
        let formValidate = this.formDate(this.getFormData(this.formValidate),['outDateBegin','outDateEnd'],'yyyy-MM-dd');
        this.formValidate.outDateBegin1 = formValidate.outDateBegin;
        this.formValidate.outDateEnd1 = formValidate.outDateEnd;
        this.openModel("derive");
      },
      //确定导出
      affirmDerive() {
        this.cancel('derive');
      },


      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer){
        this[targer+'Modal'] = false;
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
      subCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.setTableData();
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
      },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },

    },
    created(){
      this.init();
    },
    mounted(){
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components:{
      //当前组件引入的子组件
      show,steps
    }
  }
</script>
