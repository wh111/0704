<!----------------------------------
****--@name     老师绩效查询
****--@role     ${*}
****--@date     2017/12/6
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal">
    <el-form  ref="formValidate" inline label-width="90px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          <el-button type="primary" @click="quota">绩效指标</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="姓名:" prop="userType" >
            <el-input v-model="formValidate.userName" placeholder="输入姓名搜索">
              <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
            </el-input>
          </el-form-item>
          <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>
        </el-col>
      </el-row>
      <!--高级搜索项-->
      <div v-if="searchMore" ref="searchMore" >
        <el-form-item label="编号:" prop="userType" >
          <el-input  placeholder="输入编号搜索">
          </el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="activityBeginTime" >
          <el-date-picker
            v-model="formValidate.beginTime"
            type="date"
            :clearable="false"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions0"
            @change="handleStartTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="activityEndTime" >
          <el-date-picker
            v-model="formValidate.endTime"
            align="right"
            type="date"
            :clearable="false"
            :editable="false"
            placeholder="选择日期"
            :picker-options="pickerOptions1"
            @change="handleEndTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最小分值:" prop="userType" >
          <el-input  placeholder="输入最小分值搜索">
          </el-input>
        </el-form-item>
        <el-form-item label="最大分值:" prop="userType" >
          <el-input  placeholder="输入最大分值搜索">
          </el-input>
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
            type="index"
            width="75">
            <!--<template scope="scope">-->
            <!--<span>{{scope.row.index}}</span>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template scope="scope">
              <el-button  type="info" size="small" @click="show(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="codeNumber"
            label="编号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="score"
            label="得分">
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
            :total="5">
          </el-pagination>
        </div>
      </div>
    </div>
    <!--&lt;!&ndash;新建&ndash;&gt;-->
    <!--<Modal-->
    <!--:mask-closable="false"-->
    <!--width="1000"-->
    <!--v-model="addModal"-->
    <!--title="对话框标题"-->
    <!--class-name="vertical-center-modal"-->
    <!--:loading="loading">-->
    <!--<modal-header slot="header" :content="addId"></modal-header>-->
    <!--<add v-if="addModal" @cancel="cancel" @add="subCallback" :operaility-data="operailityData" :url="url"></add>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--&lt;!&ndash;修改&ndash;&gt;-->
    <!--<Modal-->
    <!--:mask-closable="false"-->
    <!--width="1000"-->
    <!--v-model="editModal"-->
    <!--title="对话框标题"-->
    <!--class-name="vertical-center-modal"-->
    <!--:loading="loading">-->
    <!--<modal-header slot="header" :content="editId"></modal-header>-->
    <!--<edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :url="url"></edit>-->
    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--&lt;!&ndash;删除弹窗&ndash;&gt;-->
    <!--<Modal-->
    <!--:mask-closable="false"-->
    <!--height="200"-->
    <!--v-model="removeModal"-->
    <!--title="对话框标题"-->
    <!--class-name="vertical-center-modal"-->
    <!--:loading="loading"-->
    <!--:width="500">-->
    <!--<modal-header slot="header" :content="removeId"></modal-header>-->
    <!--<remove  v-if="removeModal" :delete-url="url.buildRemove" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>-->

    <!--<div slot="footer"></div>-->
    <!--</Modal>-->
    <!--绩效指标弹窗-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="quotaModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="quotaId"></modal-header>
      <quota v-if="quotaModal" @cancel="cancel" @show="subCallback" ></quota>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import quota from './teacherPerQuery_quota.vue'
  import show from './teacherPerQuery_view.vue'
  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          name: '',       //大楼名称模糊检索
          sortby: '',//排序列
          order: '' ,    //升序、降序
          beginTime:'',
          endTime:'',
        },

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
          {
            name:'季怀魁',
            codeNumber:'R005',
            score:'90',
          },
          {
            name:'都伟',
            codeNumber:'SU-6201',
            score:'87',
          },
          {
            name:'苏敏',
            codeNumber:'SU-6202',
            score:'85',
          },
          {
            name:'李杰',
            codeNumber:'SU-6203',
            score:'84',
          },
          {
            name:'孟令飞',
            codeNumber:'SU-6204',
            score:'60',
          },
        ],
        searchMore: false,
        loading:false,
        quotaModal:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
//            url:url.buildList,
            params:{}
          }
        },
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},
        quotaId:{id:'quotaId',title:'绩效指标'},

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

//        this.setTableData();
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
        this.operailityData = [data];
        this.openModel("show");
      },
      /*
       * 点击--绩效指标--按钮
       * */
      quota(){
        this.openModel("quota");
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
      quota,show,
    }
  }
</script>
