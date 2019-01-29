<!--菜单管理-->
<!--业务字典-->


<template>
  <layout-tree>
    <content-tree slot="left" @setCurrSltNodeId="setTreeId"  @tree-click="treeClick" :treeOptions="treeDefaults" ></content-tree>

    <div slot="right" id="content" ref="nosocomial" class="table-content ">
      <!--右侧查询-->
      <el-form  :model="formValidate" ref="formValidate" :rules="contentManagementList"   inline label-width="90px" class="demo-ruleForm">
        <el-row >
          <el-col :span="10" >
            <el-button  class="but-col"  @click="add"  type="primary">添加</el-button>
            <el-button  class="but-col"   @click="publish"  type="primary">发布</el-button>
            <el-button  class="but-col"    @click="revocation" type="primary">撤销</el-button>
            <el-button  class="but-col"  @click="remove"  type="primary">删除</el-button>
          </el-col>
          <el-col :span="14"  align="right">
            <el-form-item  prop="title">
              <el-input v-model="formValidate.title" placeholder="输入标题搜索">
                <el-button @click="searchEvent" slot="append" icon="search"></el-button>
              </el-input>
            </el-form-item>
            <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
          </el-col>
        </el-row>

        <div v-show="searchMore" ref="searchMore">

          <el-form-item label="内容类型:" prop="contentType">
            <el-select filterable  v-model="formValidate.contentType" placeholder="请选择">
              <el-option label="全部" value="">全部</el-option>
              <el-option label="普通" :value="'ORDINARY'"> </el-option>
              <el-option label="多媒体" :value="'MULTIMEDIA'"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item  label="置顶顺序:" prop="newsOrder">
            <el-input v-model="formValidate.newsOrder" placeholder="输入置顶顺序搜索">
            </el-input>
          </el-form-item>

          <el-form-item label="发布时间:" prop="publishTime" >
            <el-date-picker
              v-model="formValidate.publishTime"
              type="date"
              :editable="false"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="发布状态:" >
            <el-select filterable  v-model="formValidate.publishStatus" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option :label="'未发布'" :value="'UNPUBLISH'"></el-option>
              <el-option :label="'已发布'" :value="'PUBLISH'"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="info" @click="searchEvent">查询</el-button>

        </div>
      </el-form>

      <div
        id="nosocomialTable"
        ref="nosocomialTable">
        <el-table
          align="center"
          :height="dynamicHt"
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
            width="200"
            show-overflow-tooltip
          >
            <template scope="scope">
              <el-button
                size="small"
                type="info"
                @click="show(scope.row)">查看
              </el-button>
              <el-button
                size="small"
                type="warning"
                :disabled="scope.row.publishStatus == 'PUBLISH'"
                @click="edit(scope.row)">修改
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            align="center"
            show-overflow-tooltip

           >
          </el-table-column>
          <el-table-column
            prop="contentType"
            label="类型"
            width="200"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.contentType == 'ORDINARY'?'普通':scope.row.contentType == 'MULTIMEDIA'?'多媒体':scope.row.contentType}}
            </template>
          </el-table-column>
          <el-table-column
            prop="newsOrder"
            label="置顶顺序"
            width="200"

            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="publishDate"
            label="发布时间"
            width="200"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="publishStatus"
            label="发布状态"
            width="200"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.publishStatus == 'PUBLISH'?'已发布':scope.row.publishStatus == 'UNPUBLISH'?'未发布':scope.row.publishStatus}}
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
        <!--修改弹窗-->
        <Modal
          :mask-closable="false"
          v-model="editModal"
          height="200"
          title="对话框标题"
          class-name="vertical-center-modal"
          :width="1100">
          <!--<div slot="header"> -->
          <!--</div>-->
          <modal-header slot="header" :content="editId"></modal-header>
          <edit v-if="editModal"   @cancel="cancel"  @edit="subCallback"  :operaility-data="operailityData"  :url="url"> </edit>
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
          <add v-if="addModal"  @cancel="cancel" @add="subCallback"  :url="url"></add>
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
          :width="1000"
        >
          <modal-header slot="header" :parent="self" :content="showId"></modal-header>
          <show v-if="showModal"  @cancel="cancel"   :operaility-data="operailityData" :url="url"></show>
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
          <remove v-if="removeModal" :deleteUrl="url.columnReomve" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
          <div slot="footer"></div>
        </Modal>
        <!---->
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
          <operate v-if="publishModal" :type="'publish'"  :operateData="publishData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
          <div slot="footer"></div>
        </Modal>
        <!---->
        <!---->
        <!--撤销弹窗-->
        <Modal
          close-on-click-modal="false"
          height="200"
          v-model="revocationModal"
          title="对话框标题"
          class-name="vertical-center-modal"
          :width="500">
          <modal-header slot="header" :content="revocationId"></modal-header>
          <operate v-if="revocationModal" :type="'revocation'"  :operateData="revocationData" @operate="subCallback" @cancel="cancel" :operaility-data="operailityData"></operate>
          <div slot="footer"></div>
        </Modal>
      </div>
    </div>
  </layout-tree>

</template>

<script >
  import {contentManagementList} from '../rules'
  import contentTree from '../contentManagement/leftTree.vue'

  /*当前组件必要引入*/
  import url from '../app'
  //引入--修改--组件
  import edit from "./contentManagement_edit.vue";
  //引入--查看--组件
  import show from "./contentManagement_view.vue";
  //引入--添加--组件
  import add from "./contentManagement_add.vue";

  //当前组件引入全局的util
  let Util=null;
  let store = null;
  export default{

    data() {
      return {
        contentManagementList,
        url:url,
        //tree默认项设置
        treeDefaults:{
          getTreeUrl:url.treeList,
          isShowMenus:false,
          defaultProps:{
            children: 'childList',
          },
        },
        //发布
        publishData:{
            url:url.columnModifyStatus,
            data:{
              publishStatus:'PUBLISH'
            }
        },
        publishModal:false,
        revocationModal:false,
        searchMore:false,
        //撤销
        revocationData:{
            url:url.columnModifyStatus,
            data:{
              publishStatus:'UNPUBLISH'
            }
        },
        isRoot:true,
        //查询表单
        formValidate: {
          moduleId: '',       //栏目id
          title: '',   // 标题
          contentType: '',   // 内容类型
          newsOrder: '',   // 置顶顺序
          publishTime : '',   // 发布时间
          publishStatus: '',   // 发布状态
        },
        searchData:{title:'提交',callParEvent:'searchEvent'},
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
        auditId:{
          id:'auditId',
          title:'审核'
        },
        showId:{
          id:'auditId',
          title:'查看'
        },
        publishId:{
          id:'publishId',
          title:'发布'
        },
        revocationId:{
          id:'revocationId',
          title:'撤销'
        },
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
//          {
//            "id":"1",
//            "title":"标题",
//            "contentType":"ORDINARY",
//            "newsOrder":"1",
//            "publishTime":"2016-01-02",
//            "publishStatus":"PUBLISH"
//          }
        ],
        loading:false,
        totalCount:0,
        listMessTitle:{
          ajaxSuccess:'listDataSuccess',
          ajaxParams:{
            url:url.columnList,
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

//        this.setTableData();
      },

      //设置表格及分页的位置
      setTableDynHeight(){
        let nosocomial = this.$refs.nosocomial;
        let parHt = nosocomial.parentNode.offsetHeight;
        let nosocomialTable = this.$refs.nosocomialTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - nosocomialTable.offsetTop - paginationHt;
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


      //列表获取成功
      listDataSuccess(res){
          this.tableData =this.addIndex(res.data) ;
          this.totalCount = res.totalCount;
      },
      //通过get请求列表数据
      setTableData(isLoading){
         let formValidate =  this.formDate(this.getFormData(this.formValidate),['publishTime']);
          this.listMessTitle.ajaxParams.params = Object.assign( this.listMessTitle.ajaxParams.params,this.queryQptions,formValidate);

        this.ajax(this.listMessTitle,isLoading)
      },
      //搜索监听回调


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
      /*--点击--添加--按钮--
       * 只允许添加二级
       * */

      add(){
        this.openModel('add') ;
      },
      /*--点击--删除--按钮--*/
      remove(){
          if(!this.isSelected()) return;
          this.operailityData = this.multipleSelection;
        for(let i=0 ;i<this.multipleSelection.length;i++){
          if(this.multipleSelection[i].publishStatus=='PUBLISH'){
            this.showMess('只能对未发布进行删除');
            return false;
          }
        }
          this.openModel('remove')
      },

      /*--点击--撤销--按钮--*/
      revocation(){
          if(!this.isSelected(true)) return;
          for(let i=0 ;i<this.multipleSelection.length;i++){
            if(this.multipleSelection[i].publishStatus=='UNPUBLISH'){
              this.showMess('只能对已发布进行撤销');
              return false;
            }
          }
          this.operailityData = this.multipleSelection;
          this.openModel('revocation')
      },

      /*--点击--发布--按钮--*/
      publish(){
          if(!this.isSelected(true)) return;
          for(let i=0 ;i<this.multipleSelection.length;i++){
            if(this.multipleSelection[i].publishStatus=='PUBLISH'){
                this.showMess('只能对未发布进行发布');
              return false;
            }
          }
          this.operailityData = this.multipleSelection;
          this.openModel('publish')
      },



      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data){
        this.operailityData = data;
        this.showModal = true;
      },
      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(data){
          this.operailityData = data;
          this.openModel('edit')
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


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },


      //tree
      treeClick(obj,node,self){

        this.clickId = obj.id
        store = node.store ;
        this.setTreeId(obj.id,obj);
        this.setTableData();
        this.isRoot = node.parent.level==2;
        this.tableData1 = obj.children;

      },

      //设置treeid
      setTreeId(id,data){
          this.formValidate.moduleId = id;
          this.setTableData();
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
      edit,add,show,contentTree
    },
  }
</script>



