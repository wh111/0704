<!--
* @TODO
* @pageName workshopsManagement_list
* @description 工作坊-列表页面,用于湘雅三院会议直播
* @Author zyc 332533011@qq.com
* @Created by zyc on 2018-04-10 14:22
-->
<template>
  <div id="content" ref="content" class="modal">
    <div class="listUpAreaBox">
      <div class="listUpArea-menus">
        <!--表格数据操作按钮-->
        <div class="ivu-row">
          <div class="ivu-col ivu-col-span-24">
            <el-button  class="but-col"  @click="add"  type="primary">新 建</el-button>
            <el-button  @click="remove" type="danger">删除</el-button>
          </div>
        </div>
      </div>
      <!--<div class="listUpArea-search">
        <div class="listUpArea-searchWrapper">
          &lt;!&ndash;右侧查询&ndash;&gt;
          <el-form ref="formValidate"  :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px" >
            <div class="listUpArea-searchLeft">
              <input class="hidden">
              <el-input placeholder="请输入内容" v-model="formValidate.holidayName">
                <div slot="prepend">节日名称</div>
                <el-button slot="append" @click="handleSubmit('formValidate')" icon="search"></el-button>
              </el-input>
            </div>
            &lt;!&ndash; <div class="listUpArea-moreSearch">
              <el-button @click="showMoreSearch" type="text">高级查询</el-button>
            </div> &ndash;&gt;
          </el-form>
        </div>
      </div>-->
    </div>
    <br />
    <div>
      <div
        id="myTable"
        ref="myTable"
      >
        <el-table
          align="center"
          :height="dynamicHt"
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
            type="index"
            width="65">
          </el-table-column>
          <el-table-column label="操作"  width="80" align="center">
            <template scope="scope">
              <!--<el-button
                size="small"
                @click="show(scope.$index,scope.row)">查看</el-button>-->
              <el-button
                size="small"
                @click="edit(scope.$index, scope.row)">修改</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="workshopsName"
            label="工作坊名称"
            show-overflow-tooltip
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="roomNum"
            label="房间"
            width="150" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="summary"
            label="简介"
            show-overflow-tooltip>
            <template scope="scope">
                <span>{{scope.row.summary | delHtmlTag(true)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页按钮 -->
    <div style="float: right;margin-top:10px;">
      <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                     :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <!--修改弹窗-->
    <Modal
      :mask-closable="false"
      v-model="editModal"
      height="200"
      title="修改"
      class-name="vertical-center-modal"
      :width="960">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal"   @cancel="cancel"  @edit="subCallback"  :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--增加弹窗-->
    <Modal
      :mask-closable="false"
      v-model="addModal"
      height="200"
      title="新建"
      class-name="vertical-center-modal"
      :width="960">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal"  @cancel="cancel" @add="subCallback" ></add>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--查看弹窗-->
    <Modal
      :mask-closable="false"
      v-model="showModal"
      height="200"
      title="查看"
      class-name="vertical-center-modal"
      :width="960"
    >
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal"  @cancel="cancel"   :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      height="200"
      v-model="removeModal"
      title="删除"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--新建--组件
  import api from "./api";
  //引入--修改--组件
  import edit from "./workshopsManagement_edit.vue";
  //引入--查看--组件
  import show from "./workshopsManagement_view.vue";
  //引入--添加--组件
  import add from "./workshopsManagement_add.vue";
  //当前组件引入全局的util
  let Util = null
  export default {
    name: 'workshopsManagement_list',
    data () {
      return {
        api,
        //查询表单
        deleteUrl:api.workshopsRemove.path,
        formValidate: {},

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

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        tableData1: [],
        loading:false,
        listTotal:0,
        initParams:{
          workshopsId: '', //工作坊ID
          workshopsName: '',  //工作坊的名称
          roomId: '',  //房间id
          roomNum: '',  //房间号
          summary: '',  //房间简介
          imageThumbnailPath: '',  //缩略图地址
        },
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.workshopsList.path,
            params:{

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
        this.queryQptions = {
          params:this.initParams,
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
        let data = responseData.data;
        this.tableData1=[];
        this.tableData1=data;
        this.listTotal = responseData.totalCount || 0;
      },
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
        this.ajax(this.listMessTitle);
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
        this.openModel('add');
      },
      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected()) return;
        let tempArr = [];
        for(var i=0,item;i<this.multipleSelection.length;i++){
          item = this.multipleSelection[i]
          tempArr.push({id:item["workshopsId"]})
        }
        this.operailityData = tempArr;
        this.openModel('remove') ;
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
        if(typeof index == 'undefined'){
          if(!this.isSelected(true)) return;
          this.operailityData = this.multipleSelection[0];
          this.openModel('edit')
        }else {
          this.operailityData = this.tableData1[index];
          this.openModel('edit')
        }
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
          this.formValidate = this.setObjValEmpty(this.formValidate);
          this.setTableData();
        }
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false
      },

      openModel (options) {
        this[options + 'Modal'] = true
      },
    },
    created () {
      this.init()
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      //当前组件引入的子组件
      add,edit,show
    },
  }
</script>

<style scoped>

</style>
