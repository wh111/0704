<!----------------------------------
****--病例库(normCourseTree_list)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div ref="treeContent">
    <layout-tree :style="{'height':contenHeight + 'px'}">
      <left-tree slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" @tree-remove-node="treeRemoveNode" :treeOptions="treeDefaults"
                 :fromWhereTreeType="fromWhereTree"></left-tree>
      <!-- 标准课程 -->
      <div slot="right" id="content" ref="content">
        <el-form :model="formValidate" :rules="videoBankList" ref="formValidate" inline label-width="100px" >
          <el-row style="padding-bottom:20px;">
            <el-col :span="14">
              <el-button type="primary" @click="add">新建</el-button>
              <el-button type="danger" @click="remove">删除</el-button>
              <el-button type="primary" @click="jurisdictionSet">权限设置</el-button>
              <el-button type="primary" @click="audit">批量审核</el-button>
              <el-button type="primary" @click="publish">发布</el-button>
              <el-button type="primary" @click="revocation">撤销</el-button>
            </el-col>
            <!-- 搜索框 -->
            <el-col :span="10" align="right">
              <el-form-item label="名称:" prop="title">
                <el-input placeholder="名称" v-model="formValidate.title" style="width:300px;" :maxlength="51">
                  <el-button slot="append" icon="search" @click="search"></el-button>
                </el-input>
              </el-form-item>
              <!--<el-button :icon="getSearchBtnIcon()" @click="openMoreSearch()">筛选</el-button>-->
            </el-col>
          </el-row>
          <!-- 多条件 -->
          <div style="overflow:hidden;" v-show="showMoreSearch" ref="showMoreSearch" align="right">
            <!--<el-form :inline="true">-->
              <!--<el-form-item label="卡号:">-->
                <!--<el-input v-model="searchObj.cardNum"></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="申请时间:">-->
                <!--<date-group :dateGroup="{text:'',startDate:searchObj.createTimeBegin,endDate:searchObj.createTimeEnd}">-->
                  <!--<el-date-picker name="start" v-model="searchObj.createTimeBegin" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"-->
                                  <!--@change="handleStartTime"></el-date-picker>-->
                  <!--<span>-</span>-->
                  <!--<el-date-picker name="end" v-model="searchObj.createTimeEnd" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"-->
                                  <!--@change="handleEndTime"></el-date-picker>-->
                <!--</date-group>-->
              <!--</el-form-item>-->
              <!--<el-form-item style="margin-right:0;">-->
                <!--<el-button @click="search" type="info">查询</el-button>-->
              <!--</el-form-item>-->
            <!--</el-form>-->
          </div>
        </el-form>
        <!-- 数据表格 -->
        <div ref="tableView">
          <el-table @selection-change="handleSelectionChange" align="center" :context="self" :height="tableHeight" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" prop="index" width="80"></el-table-column>
            <el-table-column label="操作" align="center" width="140">
              <template scope="scope">
                <el-button size="small" @click="show(scope.row)">查看</el-button>
                <el-button v-if="scope.row.publishStatus == 'UNPUBLISH' && scope.row.auditStatus == 'AUDIT_SUCCESS'" :disabled="scope.row.auditStatus == 'AUDIT_FAILURE'" size="small" type="info" @click="modify(scope.row)">修改</el-button>
                <el-button v-else :disabled="scope.row.publishStatus == 'PUBLISH' ||scope.row.auditStatus == 'AUDIT_FAILURE' " size="small" type="primary" @click="edit(scope.row)">修改</el-button>
                <!--<el-button :disabled="scope.row.publishStatus == 'PUBLISH'" size="small" type="primary" @click="edit(scope.row)">修改</el-button>-->
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="title" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="标签" prop="tags" show-overflow-tooltip></el-table-column>
            <el-table-column label="浏览次数" prop="viewNum" show-overflow-tooltip></el-table-column>
            <el-table-column label="上传时间" prop="createTime" width="200">
              <template scope="scope">
                <template v-if="scope.row.createTime">
                  {{ scope.row.createTime | formatDate('yyyy-MM-dd HH:mm') }}
                </template>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="上传者" prop="operator" show-overflow-tooltip></el-table-column>
            <el-table-column label="审核状态" prop="auditStatus">
              <template scope="scope">
                <template v-if="scope.row.auditStatus">
                  {{ scope.row.auditStatus | casesStatus }}
                </template>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="发布状态" prop="publishStatus">
              <template scope="scope">
                <template v-if="scope.row.publishStatus">
                  {{ scope.row.publishStatus | casesStatus }}
                </template>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页按钮 -->
        <div style="float: right;margin-top:10px;">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage" :page-sizes="myPages.pageSizes"
                         :page-size="myPages.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
        </div>
      </div>
    </layout-tree>
    <!--修改弹窗-->
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
      <edit v-if="editModal" :id="deptId" :name="typeName"  :fromWhereTree="fromWhereTree"  @cancel="cancel"  @edit="subCallback" :url="url" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--修改浏览次数弹窗-->
    <Modal
      :mask-closable="false"
      v-model="modifyModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="1000"
    >
      <modal-header slot="header" :parent="self" :content="modifyId"></modal-header>
      <modify v-if="modifyModal" :id="deptId" :name="typeName"  :fromWhereTree="fromWhereTree" @cancel="cancel" @modify="subCallback" :url="url"  :operaility-data="operailityData"></modify>
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
      :width="800">
      <!--<div slot="header"> -->
      <!--</div>-->

      <modal-header slot="header" :content="addId"></modal-header>
      <add v-if="addModal" :id="deptId" :name="typeName" :fromWhereTree="fromWhereTree"  :url="url" @cancel="cancel" @add="subCallback" :operaility-data="operailityData"></add>
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
      :width="1200"
    >
      <modal-header slot="header" :parent="self" :content="showId"></modal-header>
      <show v-if="showModal"  @cancel="cancel"   :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
    <!--权限设置-->
    <Modal
      :mask-closable="false"
      v-model="jurisdictionSetModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="800"
    >
      <modal-header slot="header" :parent="self" :content="jurisdictionSetId"></modal-header>
      <jurisdiction  v-if="jurisdictionSetModal" :id="deptId" :name="typeName" @jurisdictionSet="subCallback"  :url="url" @cancel="cancel" :operaility-data="operailityData"></jurisdiction>
      <div slot="footer"></div>
    </Modal>
    <!--批量审核-->
    <Modal
      :mask-closable="false"
      v-model="auditModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="800"
    >
      <modal-header slot="header" :parent="self" :content="auditId"></modal-header>
      <audit v-if="auditModal"  @audit="subCallback" :fromWhereTree="fromWhereTree" @cancel="cancel" :url="url" :operaility-data="operailityData"></audit>
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
    <!--发布弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="publishModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="publishId"></modal-header>
      <operate v-if="publishModal" :type="'publish'"  :methods="'post'" :operate-data="publishData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
    <!---->
    <!--撤销弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="revocationModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="revocationId"></modal-header>
      <operate v-if="revocationModal" :type="'revocation'" :operate-data="revocationData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import {videoBankList} from '../rules.js';

  import layoutTree from "../../../common/layoutTree.vue";
  import leftTree from "../../../common/leftTree.vue";

  import add from "./resCaseLibrary_add.vue";
  import edit from "./resCaseLibrary_edit.vue";
  import show from "./resCaseLibrary_view.vue";
  import jurisdiction from "../videoBank/videoBank_set.vue";
  import audit from "../videoBank/audit.vue";
  import modify from './resCaseLibrary_modify.vue';
  import api from "./api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    data() {
      return {
        videoBankList,
        url : api,
        typeName : "",   // 分类名称
        contenHeight : 0,
        viewTypes : '', // 视图类型
        //tree默认项设置
        treeDefaults : {
          getTreeUrl : api.resourceTypeTree.path,
          getDataUrl : '',
          isShowMenus : false,
          isShowSearch : false, //是否显示目录树查询
        },
        fromWhereTree : "user",

        //查询表单
        deleteUrl : api.remove.path,
        //当前tree选中的node id
        deptId: 1,

        // 模态框提示
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
          id:'showId',
          title:'查看'
        },
        jurisdictionSetId:{
          id:'jurisdictionSetId',
          title:'权限设置'
        },
        auditId:{
          id:'auditId',
          title:'批量审核'
        },
        modifyId:{
          id:'modify',
          title:'修改播放次数'
        },
        publishId:{id:'publishId',title:'发布'},
        revocationId:{id:'revocationId',title:'撤销'},

        //批量审核
        auditModal:false,
        //权限设置
        jurisdictionSetModal:false,
        //发布
        publishModal:false,
        //撤销发布
        revocationModal:false,
        //浏览次数修改
        modifyModal:false,
        totalCount:0,
        //发布
        publishData:{
          method:'put',
          url: api.published.path,
        },
        //撤销
        revocationData:{
          method:'put',
          url: api.canceled.path,
        },


        showMoreSearch: false, // 更多筛选
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        tableHeight:0,
        self: this,
        loading:false,
        listTotal:0,
        formValidate: { // 搜索
          "typeId":"",   //分类ID
          "title":"",  //标题模糊查
//          auditStatus:'',
        },
        tableData: [
//          {
//            "id":3,                             //主键ID
//            "typeId":1,                         //资源分类ID
//            "name":"1",                         //视频名称
//            "tags":"1",                         //标签
//            "length":1,                         //时长
//            "size":1,                           //视频大小
//            "count":1,                          //播放次数
//            "remark":"1",                       //简介
//            "fileId":1,                         //视频ID
//            "filePath":"1",                     //视频地址(相对到文件)
//            "logoPath":"1",                     // 封面图
//            "imgsPath":"1",                     //其他图片
//            "likes":1,                          //喜欢
//            "disLikes":3,                       //不喜欢
//            "operatorId":null,                  //上传人ID
//            "operator":'sss',                    // 上传人
//            "createTime":"201",                 //上传时间 Long 时间戳
//            "updateTime":"20121",               // 修改时间 Long 时间戳
//            "auditStatus":"AUDIT_FAILURE",      //发布状态 PUBLISH 已发布 UNPUBLISH 未发布
//            "publishStatus":"UNPUBLISH",        //审核状态
//            "openStatus":"PRIVATE"              //公开状态
//          },
        ],

        //当前科室详情
        depDetails:{
          "id":"",
          "name":"",
          "parentId":"",
          "parentName":"",
          "managerId":"",
          "managerName":"",
          "operator":"",
          "createTime":""
        },

        //初始化加载页面信息
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.listPage.path,
            params:{
            }
          }
        },


      }
    },
    methods: {

      //初始化请求列表数据
      init() {
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          //url:this.listUrl,
          params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
        }

        //this.setTableData();
      },

      /************************* 搜索逻辑 *********************************/
      search() {
        this.setTableData();
      },

      // 获取筛选按钮图标
      getSearchBtnIcon() {
        return this.showMoreSearch ? 'arrow-up' : 'arrow-down'
      },

      // 显示更多筛选
      openMoreSearch() {
        this.showMoreSearch = !this.showMoreSearch;
        this.$nextTick(() => {
          if (this.showMoreSearch) {
            this.tableHeight = this.dynamicHt - this.$refs.showMoreSearch.offsetHeight;
          } else {
            this.tableHeight = this.dynamicHt;
          }
        })
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


      //初始化加载列表数据
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
        this.postParamToServer(this.listMessTitle);
      },
      //向服务器发送数据
      postParamToServer(options){
        if(this.deptId!=""){
          options["ajaxParams"]["params"]["typeId"] = this.deptId;
        }
        this.ajax(options);
      },
      //通过get请求列表数据
      updateListData(responseData){
        if(!responseData.data)return;
        this.tableData = this.addIndex(responseData.data);
        if(!responseData.totalCount) return;
        this.totalCount = responseData.totalCount;
      },

      /*--点击--添加--按钮--*/
      add(){
        if(this.deptId==""){
          this.errorMess("请选择左侧目录节点!");
          return;
        }
        this.operailityData = {parentName:this.depDetails.name,parentId:this.deptId,types:api.types};
        this.openModel('add') ;
      },
      /*--点击--删除--按钮--*/
      remove(index){
        if(!this.isSelected()) return;
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].publishStatus=='PUBLISH'){
            this.errorMess('不能删除已发布的');
            return ;
          }
        }
        this.operailityData = this.multipleSelection;
        this.openModel('remove') ;
      },

      /*
       * 点击--查看--按钮
       * @param row Object  当前行数据对象
       * */
      show(row){
        this.operailityData = row;
        this.showModal = true;
      },


      /*
       * 点击--修改--按钮
       * @param row Object  当前行数据对象
       * */
      edit(row){
        row["parentName"] = this.depDetails.name;
        row["parentId"] = this.deptId;
        this.operailityData = row;
        this.openModel('edit');
      },
      //修改浏览次数
      modify(row){
        row["parentName"] = this.depDetails.name;
        row["parentId"] = this.deptId;
        this.operailityData = row;
        this.modifyModal = true;
      },


      /*
       * 点击--批量审核--按钮
       * @param row Object  当前行数据对象
       * */
      audit(row){
        if(!this.isSelected()) return;
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].auditStatus!='NOT_AUDIT' || this.multipleSelection[i].publishStatus=='PUBLISH'){
            this.errorMess('只能对未发布并待审核的数据进行审核');
            return ;
          }
        }
        this.operailityData = this.multipleSelection;
        this.openModel('audit');
      },


      /*
       * 点击--权限设置--按钮
       * @param row Object  当前行数据对象
       * */
      jurisdictionSet(row){
        if(!this.isSelected()) return;
        this.operailityData = this.multipleSelection;
        this.openModel('jurisdictionSet');
      },


      /*--点击--发布--按钮--*/
      publish(){
        if(!this.isSelected()) return;
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].publishStatus == 'PUBLISH' || this.multipleSelection[i].auditStatus != 'AUDIT_SUCCESS'){
            this.errorMess('只能对审核通过并未发布的数据进行发布');
            return ;
          }
        }
        this.operailityData = this.multipleSelection;
        this.openModel('publish') ;
      },


      /*--点击--撤销--按钮--*/
      revocation(){
        if(!this.isSelected()) return;
        for(let i=0;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].publishStatus=='UNPUBLISH'){
            this.errorMess('只能对已发布的数据进行撤销');
            return ;
          }
        }
        this.operailityData = this.multipleSelection;
        this.openModel('revocation') ;
      },

      //设置表格及分页的位置
      getContentHeight() {
        this.contenHeight = this.$refs.treeContent.parentNode.parentNode.offsetHeight;
      },


      //设置表格及分页的位置
      setTableDynHeight() {
        this.getContentHeight()
        let tableView = this.$refs.tableView;
        let paginationHt = 100;
        this.dynamicHt = this.contenHeight - tableView.offsetTop - paginationHt;
        this.tableHeight = this.dynamicHt;
      },


      /*
       * 左侧目录树节点click调用父组件方法
       *
       * @param obj {} 当前选中节点的一级数据
       *
       * @param node  {}  整个tree节点所有数据
       *
       * @param  self  {}  当前tree vue实例
       *
       * */
      treeClick(obj, node, self) {
        // 记录视图
        this.viewTypes = obj.types;
        this.setTreeDepId(obj.id,obj);
      },


      /*
       * 删除目录树回调
       *
       * */
      treeRemoveNode() {
        this.deptId = '';
      },


      /*
       *  初始化或者刷新数列表的时候  调用treeClick函数 为deptId赋值
       * */
      treeClickInit(obj) {
        this.treeClick(obj)
      },

      /*
       * 设置当前部门Id
       * */
      setTreeDepId(id,obj) {
        if (id) {
          this.deptId = id;
          this.typeName = obj.name;
        };
        this.setTableData();
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
          //刷新左侧目录树根据不同的情况
          this.$children[0].$children[0].updataTree();
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
    created() {
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.getContentHeight();
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      //当前组件引入的子组件
      layoutTree,
      leftTree,
      add,
      edit,
      show,
      jurisdiction,
      audit,
      modify
    }
  }
</script>
