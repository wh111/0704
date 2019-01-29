<!----------------------------------
****--@name     订单查询
****--@role     ${*}
****--@date     2017/11/14
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form  ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          &nbsp;
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="用户名称:" prop="buyerUserName" >
            <el-input v-model="formValidate.buyerUserName" placeholder="输入用户名称搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>
      <br>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">
        <el-form-item label="订单号:" prop="orderNumber" >
          <el-input style="width:300px;"   v-model="formValidate.orderNumber" placeholder="输入订单号搜索">
          </el-input>
        </el-form-item>

        <el-form-item label="流水号:" prop="transactionId" >
          <el-input v-model="formValidate.transactionId" placeholder="输入流水号搜索">
          </el-input>
        </el-form-item>
        <el-form-item label="支付状态:" prop="userType" >
          <el-select filterable  v-model="formValidate.tradeState" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="待支付" value="DZF"></el-option>
            <el-option label="已支付" value="YZF"></el-option>
            <el-option label="支付失败" value="ZFSB"></el-option>
            <el-option label="失效" value="GQ"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式:" prop="userType" >
          <el-select filterable  v-model="formValidate.tradeState" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="支付宝" value="A"></el-option>
            <el-option label="微信" value="W"></el-option>
            <el-option label="银联" value="Y"></el-option>
          </el-select>
        </el-form-item>

        <el-button type="info" @click="searchEvent">查询</el-button>

      </div>
    </el-form>

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
            show-overflow-tooltip
            align="center"
            prop="buyerUserName"
            label="用户名称">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="amount"
            label="交易金额">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="buyerId"
            label="支付账户"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="timeEnd"
            label="支付时间"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="channel"
            label="支付渠道">
            <template scope="scope">
              {{scope.row.channel |channel}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="transactionId"
            label="支付流水号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tradeState"
            label="支付状态">
            <template scope="scope">
              {{scope.row.tradeState |tradeState}}
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
      :mask-closable="false"
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from './api'
  //引入--查看--组件
  import show from "./getPay_view.vue";

  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        url:url,
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          orderNumber: '',       //订单号
          buyerUserName: '',       //用户名称
          transactionId: '',       //支付流水号
          tradeState: '',       //支付状态 DZF 待支付 YZF已支付 ZFSB 支付失败 GQ取消
          channel: '',       //支付方式 A 支付宝 W微信 Y银联
        },

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
        searchMore: false,
        loading:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:url.pageList.path,
            params:{},
          }
        },
        /*--按钮button--*/
        viewId:{id:'viewId',title:'查看'},

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
        if(!responseData.data)return;
        this.tableData = this.addIndex(responseData.data);
        if(!responseData.totalCount) return;
        this.totalCount = responseData.totalCount;
      },
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
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
      //当前组件引入的子组件
      show
    }
  }
</script>
