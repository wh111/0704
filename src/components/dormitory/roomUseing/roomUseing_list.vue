<!---房间使用情况--->
<template>
  <div id="content" ref="content" class="modal">
    <steps></steps>
    <el-form  :model="formValidate"  ref="formValidate" :rules="rules.roomUseingList" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--&lt;!&ndash;列表操作按钮&ndash;&gt;-->
        <el-col :span="9" >
        <el-button @click="derive" type="info">导出excel</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item  prop="buildingName" >
            <input class="hidden">
            <el-input   v-model="formValidate.buildingName" placeholder="输入大楼名称搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <div class="listUpArea-moreSearch">
            <el-button @click="showSearchMore" type="text">高级查询</el-button>
          </div>
          <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
        </el-col>
      </el-row>
      </br>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">
        <el-form-item label="房间号" prop="roomNum" >
          <el-input   v-model="formValidate.roomNum" placeholder="输入房间号搜索">
          </el-input>
        </el-form-item>
        <el-button type="info" @click="searchEvent">查询</el-button>

      </div>
    </el-form>

    <el-table
      align="center"
      :context="self"
      :data="roomInfoData"
      tooltip-effect="dark"
      highlight-current-row
    >
      <el-table-column
        show-overflow-tooltip
        prop="allBedNum"
        align="center"
        label="床位总数"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="allZeroNum"
        align="center"
        label="空床位数"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="havBeenStayNum"
        label="已住床位数"
        align="center"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="allRoom"
        label="房间总数"
        align="center"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="allZeroRoom"
        label="全空房间数"
        align="center"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="allFullRoom"
        label="全满房间数"
        align="center"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="allHaveBeenStayNum"
        label="未满房间数"
        align="center"
      >
      </el-table-column>

    </el-table>
    <div style="height: 20px"></div>
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
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%;height: 100%"
          @selection-change="handleSelectionChange">
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
            align="center"
            prop="buildingName"
            label="大楼名称"
            width="300">
          </el-table-column>
          <el-table-column
            prop="roomSex"
            label="房间类别"
            width="100">
            <template scope="scope">
              {{scope.row.roomSex | roomSex}}
            </template>
          </el-table-column>

          <el-table-column
            prop="roomNum"
            label="房间号"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="allBedNum"
            label="床位数"
          >
          </el-table-column>
          <el-table-column
            prop="noBedNum"
            label="空床位"
          >
          </el-table-column>
          <el-table-column
            prop="haveBedNum"
            label="入住人数"
          >
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
    <!--导出弹窗-->
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="对话框标题" class-name="vertical-center-modal"
           :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <div>
        <div class="remove">确认导出吗</div>
        <el-row>
          <el-col :span="10" :offset="14">
            <a :href="config.urlPrefix+url.exportRoomUsingInfo">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
<!--
            <a :href="config.urlPrefix+url.exportRoomUsingInfo+'?buildingName='+formValidate.buildingName+'&roomNum='+formValidate.roomNum">
              <el-button @click="affirmDerive" type="primary">确定</el-button>
            </a>
-->
            <el-button class="but-col" @click="deriveModal=false">取消</el-button>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!---->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import config from "../../../config/config.js";
  import url from '../app'
  import rules from '../rules.js'
  import steps from '../dormitory_common/steps.vue'
  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        config,
        rules,
        url:url,
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          buildingName: '',       //大楼名称模糊检索
          roomNum: '',       //房间号
          sortby: '',//排序列
          order: ''     //升序、降序
        },
        searchMore: false,
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        roomInfoData:[],
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        //房间使用情况列表
        roomUsingInfoMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.roomUsingInfo,
            params:{}
          }
        },
        deriveModal:false,
        deriveId: {
          id: 'deriveId',
          title: '导出房间使用情况'
        },
        //房间使用情况总分析
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        findAllRoomInfoMessTitle:{
          ajaxSuccess:'findAllRoomInfoListData',
          ajaxParams:{
            url:url.findAllRoomInfo,
            params:{}
          }
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
      findAllRoomInfoListData(responseData){
        this.roomInfoData = []
        this.roomInfoData.push(responseData.data);
      },
      setTableData(){
        this.roomUsingInfoMessTitle.ajaxParams.params = Object.assign(this.roomUsingInfoMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
        this.ajax(this.roomUsingInfoMessTitle);
        this.ajax(this.findAllRoomInfoMessTitle);
      },

      //搜索监听回调
      searchEvent(isLoading){
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

      //导出
      derive() {
        this.openModel("derive");
      },
      /*--点击--添加--按钮--*/
      add(){
        this.openModel("add");
      },
      /*--点击--修改--按钮--*/
      edit(data){
        this.operailityData = data;
        this.openModel("edit");
      },
      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove') ;
      },
      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data){
        this.operailityData = data;
        this.openModel("show");
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
      //确定导出
      affirmDerive() {
        this.cancel('derive');
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
      steps
    }
  }
</script>
