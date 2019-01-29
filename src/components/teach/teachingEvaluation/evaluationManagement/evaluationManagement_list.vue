<template>
  <div class="table-content" >
    <layout-tree>
      <div  slot="left" class="container ">
        <el-button type="primary" @click="typeAdd">新建</el-button>
        <el-button type="primary" @click="typeEdit">修改</el-button>
        <el-button type="danger" @click="typeRemove">删除</el-button>
        <el-tree
          style="position: absolute;top: 50px;bottom: 0px;width: 100%"
          highlight-current
          :data="treeData"
          node-key="id"
          ref="tree"
          :current-node-key="treeOperailityData.id"
          :render-content="renderContent"
          @node-click="nodeClick"
          :props="defaultProps">
        </el-tree>
      </div>
      <div ref="content" slot="right">
        <el-form  ref="formValidate" :model="formValidate"  :rules="evaluationManagementList" inline label-width="100px">
          <el-row style="margin-bottom:0">
            <!--列表操作按钮-->
            <br>
            <el-col :span="7" :offset="1">
              <el-button  class="but-col" @click="add" type="primary">添加</el-button>
              <el-button  class="but-col" @click="remove" type="primary">删除</el-button>
              <!--todo 目前没有接口 8/31-->
              <!--<el-button   type="primary">导出word</el-button>-->
              <!--<el-button  type="primary">导入</el-button>-->
            </el-col>
            <!--搜索项-->
            <el-col :span="15"  align="right">
              <el-form-item   prop="name">
                <el-input   v-model="formValidate.name" placeholder="输入名称搜索">
                  <el-button @click="searchEvent"  slot="append"  icon="search"></el-button>
                </el-input>
              </el-form-item>
              <!--<el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">筛选</el-button>-->
            </el-col>
          </el-row>
          <br>
          <!--高级搜索项-->
          <div v-if="searchMore" ref="searchMore">
            <el-form-item label="生源类型" prop="userType" >
              <el-select filterable  v-model="formValidate.userType" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="实习生" value="SXS"></el-option>
                <el-option label="研究生" value="YJS"></el-option>
                <el-option label="住院医" value="ZYY"></el-option>
                <el-option label="进修生" value="JXS"></el-option>
              </el-select>
            </el-form-item>

            <el-button type="info" @click="searchEvent">查询</el-button>

          </div>
        </el-form>


        <div
          id="myTable"
          ref="myTable">
          <el-table
            :data="tableData"
            border
            :height="dynamicHt"

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
              align="center"
              width="65">
            </el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template scope="scope">
                <el-button size="small"  @click="show(scope.row)">查看</el-button>
                <el-button size="small"  :disabled="scope.row.id<0" @click="edit(scope.row)">修改</el-button>
                <el-button size="small"  @click="copy(scope.row)">复制</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="名称"
              prop="name">
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="类型"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="score"
              label="总分">
              <template scope="scope">
                {{scope.row.score/100}}
              </template>
            </el-table-column>

          </el-table>
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

      </div>
    </layout-tree>
    <!--修改类型弹窗-->
    <div>
      <Modal
        :mask-closable="false"
        v-model="editTypeModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="600">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="editTypeId"></modal-header>
        <edit-type v-if="editTypeModal"   @cancel="cancel" :url="url"  @editType="treeSubCallback" :operaility-data="treeOperailityData"></edit-type>
        <div slot="footer"></div>
      </Modal>
      <!---->
      <!--新建类型弹窗-->
      <Modal
        :mask-closable="false"
        v-model="addTypeModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="600">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="addTypeId"></modal-header>
        <add-type v-if="addTypeModal"  @cancel="cancel" :url="url" @addType="treeSubCallback" ></add-type>
        <div slot="footer"></div>
      </Modal>
      <!--删除类型弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="removeTypeModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="500">
        <modal-header slot="header" :content="removeTypeId"></modal-header>
        <remove v-if="removeTypeModal" :delete-url="url.templateTypeRemove" @remove="removeTypeCallback" @cancel="cancel('removeType');" :operaility-data="[treeOperailityData]"></remove>

        <div slot="footer"></div>
      </Modal>

      <!--新建右侧评分模板弹窗-->
      <Modal
        :mask-closable="false"
        v-model="addModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="1000">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="addId"></modal-header>
        <add v-if="addModal"  @cancel="cancel" :url="url" :operaility-data="treeOperailityData"   @add="subCallback" ></add>
        <div slot="footer"></div>
      </Modal>
      <!--修改右侧评分模板弹窗-->
      <Modal
        :mask-closable="false"
        v-model="editModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="1000">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="editId"></modal-header>
        <edit v-if="editModal"  @cancel="cancel" :url="url" :operaility-data="operailityData"   @edit="subCallback" ></edit>
        <div slot="footer"></div>
      </Modal>
      <!--复制右侧评分模板弹窗-->
      <Modal
        :mask-closable="false"
        v-model="copyModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="1000">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="copyId"></modal-header>
        <copy v-if="copyModal"  @cancel="cancel" :url="url" :operaility-data="operailityData"   @copy="subCallback" ></copy>
        <div slot="footer"></div>
      </Modal>
      <!--查看右侧评分模板弹窗-->
      <Modal
        :mask-closable="false"
        v-model="showModal"
        height="200"
        title="对话框标题"
        class-name="vertical-center-modal"
        :width="1000">
        <!--<div slot="header"> -->
        <!--</div>-->
        <modal-header slot="header" :content="viewId"></modal-header>
        <show v-if="showModal"  @cancel="cancel" :url="url" :operaility-data="operailityData"   @add="subCallback" ></show>
        <div slot="footer"></div>
      </Modal>
      <!--删除右侧弹窗-->
      <Modal
        close-on-click-modal="false"
        height="200"
        v-model="removeModal"
        title="对话框标题"
        class-name="vertical-center-modal"
        :loading="loading"
        :width="500">
        <modal-header slot="header" :content="removeId"></modal-header>
        <remove v-if="removeModal" :delete-url="url.templateRemove" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>
<script>
  import {evaluationManagementList} from '../../rules'
  /*当前组件必要引入*/
  import url from '../app'
  /*引入 --新建类型*/
  import addType from './evaluationManagement_addType.vue'

  /*引入 --新建类型*/
  import editType from './evaluationManagement_editType.vue'

  /*引入 --新建*/
  import add from './evaluationManagement_add.vue'
  /*引入 --复制*/
  import copy from './evaluationManagement_copy.vue'
  /*引入 --修改*/
  import edit from './evaluationManagement_edit.vue'
  /*引入 --查看*/
  import show from './evaluationManagement_view.vue'


  let Util=null;
  export default {
    data() {
      return {
        evaluationManagementList,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        formValidate:{
          typeId:'',
          name:"",
          order:'',
          sortby:'',
        },
      //查询项
        url:url,
        treeOperailityData:{},
        searchMore:false, //评价
        publishModal:false, //评价
        /*--按钮button--*/
        publishId:{id:'publishId',title:'发布'},
        //表格数据
        loading:false,
        tableData: [],
        selectTreeData:[],
        dynamicHt:100,
        totalCount:0,
        operailityData:'',
        multipleSelection: [],

        addTypeModal:false,
        editTypeModal:false,
        copyModal:false,
        removeTypeModal:false,
        /*--按钮button--*/
        addId:{id:'add',title:'添加'},
        addTypeId:{id:'addTypeId',title:'添加类型'},
        editTypeId:{id:'editTypeId',title:'修改类型'},
        removeTypeId:{id:'removeTypeId',title:'删除类型'},
        editId:{id:'edit',title:'修改'},
        viewId:{id:'view',title:'查看'},
        removeId:{id:'remove',title:'删除'},
        copyId:{id:'copyId',title:'复制'},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateList',
            ajaxParams: {
            url: url.templateQuery,
              params: {},
          }
        },

        treeMessTitle: {
          ajaxSuccess: 'treeList',
          ajaxParams: {
            url: url.templateTypeQuery,
            params: {},
          }
        },
      };

    },
    created(){
      this.init()
    },
    methods:{
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        }
        this.ajax(this.treeMessTitle)

      },


      //获取tree的数据
      treeList(res){
          let data = res.data;
          if(!data||data==0){
            this.treeOperailityData ={};
            this.treeData=[]
            return;
          }
          this.treeData = data;
        this.treeOperailityData = data[0];
        this.setTableData();

      },
      //点击查询按钮调用
      onSubmitSearch(){
//        console.log(this.getFormData(this.formSearch))
        //查询成功后 this.setTableData()
      },
      //表格数据
      //设置表格及分页的位置
      setTableDynHeight(){
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
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
            this.$Message.error('输入有误，请修改');
          }
        })
        return flag
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
      /*
       * 更新列表数据
       * @param JSON 后台返回的data
       */
      updateList(responseData){
        let data = responseData.data;
        if(!data) return;
        this.tableData = data;
        this.totalCount = responseData.totalCount || 0;
      },
      setTableData(){
          this.formValidate.typeId = this.treeOperailityData.id;
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
        this.ajax(this.listMessTitle);
      },



      /*--点击--添加--按钮--*/
      add(){
          if(this.treeOperailityData.id==null){
              this.showMess('请选择评分表类型');
              return;
          }
        this.openModel('add');
      },
      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(data){
        this.operailityData = data;
        this.operailityData.treeName = this.treeOperailityData.name;
        this.openModel('edit')
      },
      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      copy(data){
        this.operailityData = data;
        this.operailityData.treeName = this.treeOperailityData.name;
        this.openModel('copy')
      },
      /*--点击--查看--按钮--*/
      show(data){
        this.operailityData = data;
        this.operailityData.treeName = this.treeOperailityData.name;
        this.openModel('show');

      },
      /*--点击--发布--按钮--*/
      publish(data){
        this.operailityData = data;
        this.openModel('publish');

      },
      /*--点击--删除--按钮--*/
      remove(){
        if(!this.isSelected()) return;
        for (let i=0;i<this.multipleSelection.length;i++){
          let item = this.multipleSelection[i];
          if(item.id<0){
            this.errorMess('系统内置的评价表不能删除');
            return;
          }
        }
        this.operailityData = this.multipleSelection;
        this.openModel('remove') ;
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

      //左侧类型事件
      typeAdd(){
          this.openModel('addType')
      },
      typeEdit(){
        if(this.treeOperailityData.id==null){
          this.showMess('请选择评分表类型');
          return;
        }
          this.openModel('editType')
      },
      typeRemove(){
          if(this.treeOperailityData.type){
              this.errorMess('系统内置的评价表不能删除');
              return;
          }
          this.openModel('removeType')
      },

      //获取到选择的node对象
      getNode(flag){
          let tempArr = this.$refs.tree.getCheckedNodes();
          if(flag){
              if(tempArr.length>1){
                  this.showMess('只能选择一条数据');
                return false
              }else if(tempArr.length==0){
                this.showMess('至少选择一条数据');
                return false
              }

          }
        return tempArr
      },


      nodeClick(obj){
        if(this.treeOperailityData.id == obj.id)return;
        this.treeOperailityData = obj ;
        this.setTableData();
      },

      //tree操作的回调函数
      treeSubCallback(target,title,updata){
        this.cancel(target);
        if(title){
          this.successMess(title);
        }
        if(!updata){
          this.ajax(this.treeMessTitle);
        }
      },

      removeTypeCallback(target,title,updata){
        this.cancel('removeType');
        this.successMess(title);
        if(!updata){
          this.ajax(this.treeMessTitle);
        }
      },

      removeTypecancel(){


      },

      //渲染数节点
      renderContent(h, { node, data, store }){
        let icon;
        if(data.type){
          icon  =  <span style="color:red ">{node.label}</span>
        }else {
          icon  =  <span >{node.label}</span>
        }
        return (
          icon
       );
     },
      // 高级搜索按钮展开搜索表单并重新计算表格高度
      showSearchMore() {
        this.searchMore = !this.searchMore;
        this.$nextTick(function () {
          this.setTableDynHeight()
        })
      },


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
      addType,editType,add,edit,show,copy
    }
  };
</script>
