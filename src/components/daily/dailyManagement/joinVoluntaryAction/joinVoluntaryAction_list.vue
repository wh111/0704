<!----------------------------------
****--@name     参加志愿者活动
****--@role     ${*}
****--@date     2017/11/27
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form  ref="formValidate" inline label-width="100px" class="demo-ruleForm">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >&nbsp;</el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item  label="活动主题:" prop="diseaseName">
            <el-input   v-model="formValidate.volunteSubject" placeholder="输入活动主题搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
        </el-col>
      </el-row>

      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore">
        <el-form-item  label="活动主题:" prop="volunteSubject">
          <el-input  v-model="formValidate.volunteSubject" placeholder="输入活动主题搜索">
          </el-input>
        </el-form-item>
        <el-form-item label="活动地点:"  prop="place">
          <el-input   v-model="formValidate.place" placeholder="输入活动地点搜索">
          </el-input>
        </el-form-item>

        <el-form-item label="时间" prop="data1">
          <el-date-picker
            v-model="formValidate.beginTime"
            type="date"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            @change="handleStartTime"
          >
          </el-date-picker>
          到
          <el-date-picker
            v-model="formValidate.endTime"
            align="right"
            :editable="false"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
            @change="handleEndTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="volunteStatus" >
          <el-select filterable  v-model="formValidate.volunteStatus" placeholder="请选择">
            <el-option label="已发布" value="YFB"></el-option>
            <el-option label="已结束" value="YJS"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="info" @click="searchEvent">查询</el-button>
      </div>
    </el-form>

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
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          prop="index"
          width="70">
          <template scope="scope">
            <span>{{scope.row.index}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150">
          <template scope="scope">
            <el-button
              size="small"
              type="info"
              @click="show(scope.row)">查看
            </el-button>
            <el-button
              v-if="scope.row.isJoin=='YES'"
              size="small"
              type="danger"
              @click="abolish(scope.row)">取消
            </el-button>
            <el-button
              v-else
              size="small"
              type="success"
              @click="join(scope.row)">参加
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="volunteSubject"
          label="活动主题"
          align="center"
          width="300">
        </el-table-column>
        <el-table-column
          prop="place"
          label="活动地点"
          align="center"
          width="300">
        </el-table-column>
        <el-table-column
          prop="rewardDate"
          label="活动时间"
          align="center"
          width="250"

          show-overflow-tooltip>
          <template scope="scope">
            <span >{{scope.row.beginTime}}~{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="applicantNum"
          label="已报名人数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="isJoin"
          label="是否参加活动"
          align="center"
        >
          <template scope="scope">
            {{scope.row.isJoin=='YES'?'已参加':'未参加'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="volunteStatus"
          label="状态"
          show-overflow-tooltip>
          <template scope="scope">
            {{converter(scope.row.volunteStatus)}}
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
          :total="totalCount">
        </el-pagination>
      </div>

      <!--查看档案管理弹窗-->
      <Modal
        width="1000"
        v-model="showModal"
        title="查看档案管理弹窗"
        class-name="vertical-center-modal"
        :loading="loading">
        <modal-header slot="header" :content="viewId"></modal-header>
        <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--参加弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="joinModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="500">
        <modal-header slot="header" :content="joinId"></modal-header>
        <operate v-if="joinModal" :type="'join'" :operate-data="joinData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--取消弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="abolishModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="500">
        <modal-header slot="header" :content="abolishId"></modal-header>
        <operate v-if="abolishModal" :type="'abolish'" :operate-data="abolishData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
        <div slot="footer"></div>
      </Modal>
      <!---->
    </div>
  </div>
</template>
<script >
  /*当前组件必要引入*/
  //引入--查看--组件
  import show from "../volunteerActivity/volunteerActivity_view.vue";

  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/volunteering/remove',

        formValidate: {
          volunteSubject:'',  //活动主题
          place:'',           //活动地点
          beginTime:'',       //开始时间
          endTime:'',         //结束时间
          volunteStatus:'YFB',    //活动状态
        },
        searchMore: false,
        //发布
        publishData:{
          method:'put',
          url:'volunteering/modifyLeaveStatus',
          data:{
            volunteStatus:'YFB'

          }
        },
        //撤销
        revocationData:{
          method:'put',
          url:'volunteering/modifyLeaveStatus',
          data:{
            volunteStatus:'WFB'
          }
        },
        //参加
        joinData:{
          method:'post',
          url:'volunteering/enroll',
          data:{
            volunteeringId:'', //志愿活动ID
            applicantId:'',     //报名人员ID
            type:'1'            //操作类型 1 参加
          }
        },
        //取消
        abolishData:{
          method:'post',
          url:'volunteering/enroll',
          data:{
            volunteeringId:'', //志愿活动ID
            applicantId:'',     //报名人员ID
            type:'2'            //操作类型 1 参加
          }
        },


        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData:[],
        loading:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'volunteering/list',
            params:''
          }
        },

        publishModal:false,
        revocationModal:false,
        joinModal:false,
        abolishModal:false,
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},
        publishId:{id:'publishId',title:'发布'},
        revocationId:{id:'revocationId',title:'撤销'},
        joinId:{id:'joinId',title:'参加'},
        abolishId:{id:'abolishId',title:'取消'},

      }
    },
    methods: {
      //初始化请求列表数据
      init(){

        //获取用户的基本信息，添加到basicBySelf
        let userInfo = this.$store.getters.getUserInfo;
        this.basicBySelf =  this.getFormValidate(this.basicBySelf,userInfo);
        this.joinData.data.applicantId = userInfo.id;
        this.abolishData.data.applicantId = userInfo.id;


        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {curPage: 1,pageSize: Util.pageInitPrams.pageSize}

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
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
          let params = this.listMessTitle.ajaxParams.params;
          params.beginTime = this.conductDate(params.beginTime, 'yyyy-MM-dd');
          params.endTime = this.conductDate(params.endTime, 'yyyy-MM-dd');
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


      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('remove') ;
      },


      /*--点击--发布--按钮--*/
      publish(){
        if(!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('publish') ;
      },


      /*--点击--撤销--按钮--*/
      revocation(){
        if(!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('revocation') ;
      },


      /*--点击--修改--按钮--*/
      edit(data){
        this.operailityData = data;
        this.openModel("edit");
      },


      /*
       * 点击--查看--按钮
       * @param data obj  当前行对象
       * */
      show(data){
        this.operailityData = data;
        this.openModel("show");
      },


      /*
       * 点击--参加--按钮
       * @param data obj  当前行对象
       * */
      join(data){
        this.joinData.data.volunteeringId = data.id;
        this.openModel("join");
      },


      /*
       * 点击--取消--按钮
       * @param data obj  当前行对象
       * */
      abolish(data){
        this.abolishData.data.volunteeringId = data.id;
        this.openModel("abolish");
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


      //converter转换'WFB.未发布、YFB.已发布、YJS.已结束
      converter(status){
        switch (status){
          case 'WFB':status = '未发布';
            break;
          case 'YFB':status = '已发布';
            break;
          case 'YJS':status = '已结束';
            break;
        }
        return status;
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
<style>

  .add-remove{
    margin-bottom: 20px;
  }
  .header{
    height: 30px;
    font-size: 18px;
    color: #ffffff;

  }


</style>

