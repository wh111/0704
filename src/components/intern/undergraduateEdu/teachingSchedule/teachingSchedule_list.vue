<!---楼房信息管理--->
<!--档案审核-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form  ref="formValidate" inline label-width="100px">
      <el-row style="margin-bottom:0">
        <!--列表操作按钮-->
        <el-col :span="10" >
          <el-button @click="exportExcel">{{ 'export' | sysLan}}</el-button>
        </el-col>
        <!--搜索项-->
        <el-col :span="14"  align="right">
          <el-form-item label="开始时间" prop="name">
            <el-date-picker
              v-model="formValidate.courseBeginTime"
              type="date"
              :editable="false"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="pickerOptions0"
              @change="handleStartTime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="name">
            <el-date-picker
              v-model="formValidate.courseEndTime"
              align="right"
              type="date"
              :clearable="false"
              :editable="false"
              placeholder="选择日期"
              :picker-options="pickerOptions1"
              @change="handleEndTime">
            </el-date-picker>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>

          <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
        </el-col>
      </el-row>
      <!--高级搜索项-->
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
            width="240">
            <template scope="scope">
              <el-button :disabled="!scope.row.courseDataId" size="small" @click="show(scope.row)">查看</el-button>
              <el-button v-if="typeof scope.row.courseDataId!='number'" size="small" @click="upload(scope.$index, scope.row)">上传</el-button>
              <el-button v-if="typeof scope.row.courseDataId=='number'" size="small" @click="editUpload(scope.$index, scope.row)">修改</el-button>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="courseContent"
            label="课程内容">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="courseType"
            label="课程类型">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="courseTime"
            label="课程时间"
            align="center">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="timeInfo"
            label="时间段">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="courseAddress"
            label="授课地点">
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
    <!--修改上传弹窗-->
    <Modal
      :mask-closable="false"
      v-model="uploadEditModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="660">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="editId"></modal-header>
      <edit-upload v-if="uploadEditModal"  @cancel="cancel" @uploadEdit="subCallback" :operaility-data="operailityData"></edit-upload>
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
      <remove  v-if="removeModal" :delete-url="url.buildRemove" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--上传弹窗-->
    <Modal
      :mask-closable="false"
      v-model="uploadModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="660">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="uploadId"></modal-header>
      <upload v-if="uploadModal"  @cancel="cancel" @upload="subCallback" :operaility-data="operailityData"></upload>
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
      <show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData" :url="url"></show>
      <div slot="footer"></div>
    </Modal>
    <Modal :mask-closable="false" close-on-click-modal="false" height="200" v-model="deriveModal" title="值班费标题"
           class-name="duty-fee-modal"
           :width="500">
      <modal-header slot="header" :content="deriveId"></modal-header>
      <ajax-derive v-if="deriveModal" :params="deriveParams" type="derive" messTitle="确定要课程表吗？"
                   :url="url.exportReport.path"
                   @cancel="deriveModal = false"></ajax-derive>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url from '../api'
  //引入--查看--组件
  import show from "./teachingSchedule_view.vue";
  import editUpload from "../syllabusData/syllabusData_uploadEdit.vue";
  import upload from "../syllabusData/syllabusData_upload.vue";
  import ajaxDerive from '../../../common/ajax-derive.vue'
  //当前组件引入全局的util
  let Util=null;
  export default{
    data() {
      return {
        uploadId:{
          id:'upload',
          title:'上传'
        },
        deriveParams: {},//导出参数
        uploadModal:false,
        deriveModal: false,
        url: url,
        //查询表单
        listUrl:'/role/list?name=&identify=&type=',
        deleteUrl:'/role/remove',
        formValidate: {
          courseBeginTime: '', //查询课程开始时间
          courseEndTime: '', //查询课程结束时间
          sortby: '',//排序列
          order: ''     //升序、降序
        },
        uploadEditModal:false,
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
            url:url.teacherCourseFile,
            params:{}
          }
        },
        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},
        deriveId: {id: 'deriveId', title: '导出'},

      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1, pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },
      /*
     * 点击--查看--按钮
     * @param index string|number  当前行索引
     * */
      upload(index){
        this.operailityData = this.tableData[index];
        this.openModel("upload");
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
    * 点击--修改角色--按钮
    * @param index string|number  当前行索引
    * */
      editUpload(index){
        if(typeof index == 'undefined'){
          if(!this.isSelected(true)) return;
          this.operailityData = this.multipleSelection[0];
          this.openModel('uploadEdit')
        }else {
          this.operailityData = this.tableData[index];
          this.openModel('uploadEdit')
        }
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
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params, this.queryQptions, this.getFormValidate())
        console.log(this.listMessTitle.ajaxParams)
        this.ajax(this.listMessTitle);
      },
      getFormValidate () {
        return this.formDate(this.$util._.defaultsDeep({}, this.formValidate), ['courseBeginTime', 'courseEndTime'], 'yyyy-MM-dd')
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
       * 点击--导出--按钮
       * */
      exportExcel () {
        let ids = this.multipleSelection.reduce((arr, item) => {
          arr.push(item.courseArrangeId)
          return arr
        }, []).join(',')
        Object.assign(this.deriveParams, {courseArrangeIdList: ids}, this.getFormValidate())
        this.openModel('derive')
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
      show, upload, editUpload, ajaxDerive
    }
  }
</script>
