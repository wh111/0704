<!--档案查询-->
<template>
  <div style="height: 100%">
    <layout-tree>
      <left-tree slot="left"  @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" @tree-remove-node="treeRemoveNode" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
      <div id="content" ref="content"  slot="right" >
          <el-form ref="formValidate" :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="90px" >
            <el-form-item label="姓名">
              <el-input v-model="formValidate.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="formValidate.sex" placeholder="性别">
                <el-option label="全部" value="all"></el-option>
                <el-option label="男" value="boy"></el-option>
                <el-option label="女" value="girl"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="formValidate.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit('formValidate')">查询</el-button>
            </el-form-item>
          </el-form>
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
                :data="tableData1"
                tooltip-effect="dark"
                highlight-current-row
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  align="center"
                  label="序号"
                  prop="index">
                  <template scope="scope">
                    <span>{{scope.row.index}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="姓名"
                  align="center">
                  <template scope="scope">
                    <el-button size="small" @click="show(scope.$index)" type="text">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sex"
                  label="性别"
                  align="center"
                  show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.sex | typeText }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="mobile"
                  label="手机号"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱"
                  show-overflow-tooltip>
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
          </div>
          <!--查看档案管理弹窗-->
          <Modal
            width="1000"
            v-model="showModal"
            title="查看"
            class-name="vertical-center-modal"
            :loading="loading">
            <modal-header slot="header" :content="viewId"></modal-header>
            <!--<show v-if="showModal" @cancel="cancel" @show="subCallback" :operaility-data="operailityData"></show>-->
            <template v-if="showModal">
              <!-- 本科生查看 -->
              <bks-show v-if="showUserType === 'BKS'" :operaility-data="operailityData" :byFilter="byFilter"></bks-show>
              <!-- 进修生查看 -->
              <jxs-show v-else-if="showUserType === 'JXS'" :operaility-data="operailityData"
                        :byFilter="byFilter"></jxs-show>
              <!-- 实习生查看 -->
              <sxs-show v-else-if="showUserType === 'SXS'" :operaility-data="operailityData"
                        :byFilter="byFilter"></sxs-show>
              <!-- 研究生查看 -->
              <yjs-show v-else-if="showUserType === 'YJS'" :operaility-data="operailityData"
                        :byFilter="byFilter"></yjs-show>
              <!-- 住院医查看 -->
              <zyy-show v-else-if="showUserType === 'ZYY'" :operaility-data="operailityData"
                        :byFilter="byFilter"></zyy-show>
              <!-- 其他人员查看 -->
              <other-show v-else :operaility-data="operailityData" :byFilter="byFilter"></other-show>
            </template>
            <div slot="footer"></div>
          </Modal>
      </div>
    </layout-tree>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //引入--查看--组件
//  import show from "../archivesManagement/archivesManagement_view.vue";
  //引入--查看--组件
  import otherShow from "../../../base/sysManage/departmentStaff/departmentStaff_view.vue"; // 其他人员
  import bksShow from "../../../educationManagement/EnrollEnroll/bksPersonnelManagement/bksPersonnelManagement_view"; // 本科生
  import jxsShow from "../../../educationManagement/EnrollEnroll/jxsPersonnelManagement/jxsPersonnelManagement_view"; // 进修生
  import sxsShow from  '../../../intern/recruitStudent/usersManagement/usersManagement_view.vue'; // 实习生
  import yjsShow from "../../../postgraduate/ptEnrollEnroll/yjsPersonnelManagement/yjsPersonnelManagement_view"; // 研究生
  import zyyShow from  '../../../zyy/rdyEnrollEnroll/rdyPersonnelManagement/rdyPersonnelManagement_view.vue'; // 住院医

  //当前组件引入全局的util
  let Util=null;
  export default {
    data () {
      return {
        byFilter: true, // 进行过滤显示
        showUserType:'PYTH', // 查看用户类型
        //查询
        formValidate: {
          name: '',
          sex: '',
          mobile: ''
        },
        //左侧
        theme1: 'light',
        //默认请求数据
        listUrl:'/role/list?name=&identify=&type=',
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [],
        loading:false,
        listTotal:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'/archives/list',
            params:{}
          }
        },
        /*--按钮button--*/
        viewId:{
          id:'viewId',
          title:'查看'
        },

        //tree默认项设置
        deptId:'',
        treeDefaults:{
          getDataUrl:'',
          isShowMenus:false,
        },
        fromWhereTree:"user",
      }
    },
    created(){
      this.init();
    },
    mounted(){
      //页面dom稳定后调用
      this.$nextTick(function () {
        /*//初始表格高度及分页位置
         this.setTableDynHeight();
         //为窗体绑定改变大小事件
         let Event = Util.events;
         Event.addHandler(window, "resize", this.setTableDynHeight);*/
      })
    },
    methods:{
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          //url:this.listUrl,
          params:{curPage: 1,pageSize: Util.pageInitPrams.pageSize}
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


      //通过get请求列表数据并渲染表格数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        data = this.addIndex(data);
        this.tableData1= data;
        this.listTotal = responseData.totalCount || 0;
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      handleSubmit(formName){
        this.setTableData();
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(index){
        this.operailityData = this.tableData1[index];
        this.openModel('show');
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.listMessTitle.type);
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


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        myData.type = data.type.join(",");
        return myData;
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
      treeClick(obj,node,self){
        /*if(node.isLeaf){  //当前是否为叶子节点
         alert("====")
         }else {

         }*/
        this.setTreeDepId(obj.id);
        this.showTreeList(obj.id);
        this.showUserType = obj.types.toLocaleUpperCase();
      },


      //初始化加载列表数据
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions.params,this.formValidate);
        this.postParamToServer(this.listMessTitle);
      },


      //向服务器发送数据
      postParamToServer(options){
        if(this.deptId!=""){
          options["ajaxParams"]["params"]["deptId"] = this.deptId;
        }
        this.ajax(options);
      },


      /*
       * 删除目录树回调
       *
       * */
      treeRemoveNode(){
        this.setTreeDepId("");
        this.showTreeList("")
      },


      /*
       * 根据部门id查询当前部门的人员信息
       * @param id number 当前部门id
       * */
      showTreeList(id){
        //初始化加载页面信息
        let params = Util._.defaultsDeep({},this.queryQptions,{deptId:id});
        let listMessTitle = Util._.defaultsDeep({},this.listMessTitle);
        listMessTitle.ajaxParams["params"]["deptId"]=id;
        this.postParamToServer(listMessTitle);
      },


      /*
       * 是否选择部门
       * @return flag blooean  是否选择目录树节点
       * */
      isSltedTree(isSltedTreeNode){
        let flag = false;
        if(this.deptId!="" || isSltedTreeNode(this.treeClickInit)){
          flag = true;
        }
        return flag;
      },


      /*
       *  初始化或者刷新数列表的时候  调用treeClick函数 为deptId赋值
       * */
      treeClickInit(obj){
        this.treeClick(obj)
      },


      /*
       * 设置当前部门Id
       * */
      setTreeDepId(id){
        this.deptId = id;
        this.setTableData();
      }

    },
    components:{
      //当前组件引入的子组件
      otherShow,
      bksShow,
      jxsShow,
      zyyShow,
      yjsShow,
      sxsShow,
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
  }
</script>
