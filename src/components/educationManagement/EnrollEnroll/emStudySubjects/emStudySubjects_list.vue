<!----------------------------------
****--科目管理(emStudySubjects_add)
****--@date     2017/9/18
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div id="content" ref="content">
    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <div class="add-remove">
          <el-button  class="but-col"  @click="add"  type="primary">添加</el-button>
        </div>
      </div>
      <div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          <!--右侧查询-->
          <el-form ref="formValidate"  :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="90px" >
            <div class="listUpArea-searchLeft">
              <input class="hidden">
              <el-input placeholder="请输入内容" v-model="formValidate.courseName">
                <div slot="prepend">科目名称</div>
                <el-button @click="handleSubmit('formValidate')" slot="append" icon="search"></el-button>
              </el-input>
            </div>
            <div class="listUpArea-moreSearch">
              <el-button @click="showMoreSearch" type="text">高级查询</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox">

    </div>
    <br />
  <div
    id="myTable"
    ref="myTable"
  >
    <el-table

      align="center"
      :height="dynamicHt"
      :context="self"
      :data="tableData1"

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
        <!--<template scope="scope">-->
        <!--<span>{{scope.row.index}}</span>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
      >
        <template scope="scope">
          <el-button
            size="small"
            type="info"
            @click="show(scope.$index,scope.row)">查看
          </el-button>
          <el-button
            size="small"
            type="warning"
            @click="edit(scope.$index, scope.row)">修改
          </el-button>
          <el-button size="small" v-if="scope.row.state=='Y'" class="but-col" @click="forbidden(scope.$index, scope.row)" type="danger">禁用</el-button>
          <el-button size="small" v-if="scope.row.state=='N'" class="but-col" @click="startUsing(scope.$index, scope.row)">启用</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="courseName"
        label="科目名称"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="organizer"
        label="主办单位"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="enrolmentNumbers"
        label="招收人数"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="learningPeriod"
        label="学习期限"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="schoolTime"
        label="开学时间"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="conditionsEnrolment"
        label="招生条件"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="furtherArrangement"
        label="进修安排"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        show-overflow-tooltip>
        <template scope="scope">
          {{scope.row.state=='Y'?"启用":"禁用"}}
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
        :total="listTotal">
      </el-pagination>
    </div>
    <!--修改弹窗-->
    <Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="960">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal"   @cancel="cancel"  @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--增加弹窗-->
    <Modal
      :mask-closable="false"
      v-model="addModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="960">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal"  @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="960"
    >
      <modal-header slot="header" :parent="self" :content="showId"></modal-header>
      <show v-if="showModal"  @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!---->

    <!--删除弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!---->
  </div>
</div>
</template>
<style>
  .el-select .el-input {
    width: 110px;
  }
</style>
<script >
  /*当前组件必要引入*/
  import api from "./api.js";
  //引入--修改--组件
  import edit from "./emStudySubjects_edit.vue";
  //引入--查看--组件
  import show from "./emStudySubjects_view.vue";
  //引入--添加--组件
  import add from "./emStudySubjects_add.vue";

  //当前组件引入全局的util
  let Util=null;
  let store = null;
  export default{
    props:["isInit"],
    data() {
      return {

        //查询表单
        deleteUrl:'',
        formValidate: {
          courseName: '',
        },

        searchData:{title:'提交',callParEvent:'searchEvent'},
        addData:'',
        editData: '',
        showData:'',
        auditData:'',
        /*--按钮button--*/
        addId:{
          id:'add',
          title:'添加'},
        removeId:{
          id:'remove',
          title:'删除'
        },
        editId:{
          id:'edit',
          title:'修改'
        },
        showId:{
          id:'auditId',
          title:'查看'
        },
        forbiddenId:{id:"forbiddenId",forbiddenId:"禁用"},
        startUsingId:{id:"forbiddenId",startUsingId:"启用"},

        shortNoteModal:false,
        toChannelModal:false,
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [
          /*{
            "managementId":"科目ID",
            "courseName":"科目名称",
            "organizer":"主办单位",
            "enrolmentNumbers":"招收人数",
            "learningPeriod":"学习期限",
            "schoolTime":"开学时间",
            "conditionsEnrolment":"招生条件",
            "furtherArrangement":"进修安排",
            "note":"备注",
            "createTime":"创建时间",
            "createUserName":"创建人",
            "state":"Y 启用 N 禁用"
          }*/
        ],
        loading:false,
        listTotal:0,

        //初始化加载页面信息
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.subPageList.path,
            params:{
              "order":"",
              "sortby":"",
            }
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
          //url:this.listUrl,
          params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
        }

        this.setTableData();
      },


      //设置表格及分页的位置
      setTableDynHeight(n){
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

      //下级科室列表查询
      searchEvent(){
        this.setTableData()
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


      //通过get请求列表数据并渲染表格数据
      updateListData(responseData){
        let data = responseData.data;
        let that = this;
        this.tableData1=[];
        data = that.addIndex(data);
        that.tableData1= data;

        this.listTotal = responseData.totalCount || 0;
      },


      //初始化加载列表数据
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
        this.postParamToServer(this.listMessTitle);
      },


      //向服务器发送数据
      postParamToServer(options){
        this.ajax(options);
      },


      /*
       * 列表查询方法
       * @param string 查询from的id
       * */
      handleSubmit(name){
        this.setTableData();
      },


      /*--点击--添加--按钮--*/
      add(){
        this.openModel('add') ;
      },
      /*--点击--删除--按钮--*/
      remove(index){
        if(typeof index != 'number'){
          if(!this.isSelected(true)) return;
          this.operailityData = this.multipleSelection[0];
          this.openModel('remove')
        }else {
          this.operailityData = this.tableData1[index];
          this.openModel('remove')
        }
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index){
        this.operailityData = this.tableData1[index];
        this.showModal = true;
      },


      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(index){
        if(typeof index != 'number'){
          if(!this.isSelected(true)) return;
          this.operailityData = this.multipleSelection[0];
          this.openModel('edit')
        }else {
          this.operailityData = this.tableData1[index];
          this.openModel('edit')
        }
      },


      //禁用
      forbidden(index){
        this.$Modal.confirm({
          title: '禁用',
          content: '<p>您确定要禁用该科目吗?</p>',
          loading: true,
          onOk: () => {
            let rowData=this.tableData1[index];
            let id =rowData.managementId;
            //初始化加载页面信息
            let resetTitle = {
              ajaxSuccess:(res)=>{
                this.$Modal.remove();
                this.successMess('禁用成功!');
                rowData.state="N";
              },
              errorTitle:'禁用失败!',
              ajaxParams:{
                url:api.subModifyState.path+id,
                method:'put',
                data:{
                  state:"N"
                }
              }
            }
            this.ajax(resetTitle);
          }
        });
      },


      //启用
      startUsing(index){
        this.$Modal.confirm({
          title: '启用',
          content: '<p>您确定要启用该科目吗?</p>',
          loading: true,
          onOk: () => {
            let rowData=this.tableData1[index];
            let id =rowData.managementId;
            //初始化加载页面信息
            let resetTitle = {
              ajaxSuccess:(res)=>{
                this.$Modal.remove();
                this.successMess('启用成功!');
                rowData.state="Y";
              },
              errorTitle:'启用失败!',
              ajaxParams:{
                url:api.subModifyState.path+id,
                method:'put',
                data:{
                  state:"Y"
                }
              }
            }
            this.ajax(resetTitle);
          }
        });
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
    },

    //初始化组件
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
      edit,add,show
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
