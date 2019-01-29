<!--咨询管理-->
<!--栏目管理-->


<template>
    <layout-tree>
      <left-tree slot="left" @setCurrSltNodeId="setTreeId" :currentKey="formValidate.parentId" @tree-click="treeClick" :treeOptions="treeDefaults" ></left-tree>

      <div slot="right" id="content" ref="nosocomial" class="table-content ">
        <el-form  :model="formValidate" ref="formValidate" :rules="columnManagementList"  inline label-width="90px" class="demo-ruleForm">
          <el-row >
            <el-col :span="10" >
              <el-button  class="but-col"  @click="add"  type="primary">添加子栏目</el-button>
              <el-button  class="but-col"  @click="remove"  type="primary">删除</el-button>

            </el-col>
            <el-col :span="14"  align="right">
              <el-form-item label="栏目名称:" prop="name">
                <el-input v-model="formValidate.name" placeholder="输入栏目名称搜索">
                  <el-button @click="searchEvent" slot="append" icon="search"></el-button>
                </el-input>
              </el-form-item>
              <el-button :icon="searchMore ? 'arrow-down' : 'arrow-up'" @click="showSearchMore">高级查询</el-button>
            </el-col>
          </el-row>

          <div v-show="searchMore" ref="searchMore">

            <!--<el-form-item  label="父栏目名称:" prop="parentName">-->
              <!--<el-input v-model="formValidate.parentName" placeholder="输入父栏目名称搜索">-->
              <!--</el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="栏目顺序:"  prop="moduleOrder">
              <el-input v-model="formValidate.moduleOrder" placeholder="输入栏目顺序搜索">
              </el-input>
            </el-form-item>
            <el-form-item label="url:" prop="moduleUrl">
              <el-input v-model="formValidate.moduleUrl" placeholder="输入url搜索">
              </el-input>
            </el-form-item>

            <el-form-item label="是否显示:" >
              <el-select filterable  v-model="formValidate.isDisplay" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option :label="'是'" value="1"></el-option>
                <el-option :label="'否'" value="0"></el-option>
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
            width="200">
            <template scope="scope">
              <el-button
                size="small"
                type="info"
                @click="show(scope.row)">查看
              </el-button>
              <el-button
                size="small"
                type="warning"
                @click="edit( scope.row)">修改
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            prop="moduleUrl"
            label="URL"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="moduleOrder"
            label="排列顺序"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="isDisplay"
            label="是否显示"
            show-overflow-tooltip>
            <template scope="scope">
              {{scope.row.isDisplay==1?'是':'否'}}
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
          <edit v-if="editModal"   @cancel="cancel"  @edit="subCallback"  :operaility-data="operailityData" :url="url"></edit>
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
          <add v-if="addModal" :isRoot="isShow"  @cancel="cancel" @add="subCallback" :operaility-data="parent" :url="url"></add>
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
          :width="800"
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
          <remove v-if="removeModal" :deleteUrl="deleteUrl" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
          <div slot="footer"></div>
        </Modal>
        <!---->
        <!---->
      </div>

      </div>
    </layout-tree>
</template>

<script >
  import {columnManagementList} from '../rules'
  /*当前组件必要引入*/
  import url from '../app'
  //引入--修改--组件
  import edit from "./columnManagement_edit.vue";
  //引入--查看--组件
  import show from "./columnManagement_view.vue";
  //引入--添加--组件
  import add from "./columnManagement_add.vue";

  //当前组件引入全局的util
  let Util=null;
  let store = null;
  export default{

    data() {
      return {
        columnManagementList,
        url:url,
        isRoot:0,
        isShow:'',
        //查询表单

        //tree默认项设置
        treeDefaults:{
          getTreeUrl:url.treeList,
          isShowMenus:false,
          defaultProps:{
            children: 'childList',
          },
        },


        deleteUrl : url.moduleRemove,
        formValidate: {
          parentId: '',       //父栏目id
          name: '',       //栏目名称
          parentName: '',       //父栏目名称
          moduleUrl: '',       //url
          moduleOrder: '',       //栏目顺序
          isDisplay: '',       //是否显示
        },
        parent:'',
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
        auditId:{
          id:'auditId',
          title:'审核'
        },
        showId:{
          id:'auditId',
          title:'查看'
        },

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [
//          {
//            "id":"1",
//            "name":"栏目名称",
//            "moduleUrl":"**/**/**.action",
//            "moduleOrder":"1",
//            "isDisplay":"1"
//          }
        ],
        loading:false,
        searchMore:false,
        totalCount:0,
        listMessTitle:{
          ajaxSuccess:'listDataSuccess',
          ajaxParams:{
            url:url.moduleList,
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

      //通过get请求列表数据
      listDataSuccess(res,m,loading){
        this.tableData = this.addIndex(res.data);
        this.totalCount = res.totalCount;
      },


      setTableData(isLoading){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
        this.ajax(this.listMessTitle,isLoading)
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
      /*--点击--添加--按钮--
      * 只允许添加二级
      * */

      add(){
          if(!this.parent) {
            this.$message.error('请选择父节点') ;
              return;
          }
        //如果是一级节点则返回，只添加二级节点
        if(this.isRoot>=2) {
            this.$message.error('不能添加子栏目') ;
            return;
        }
        if(this.isRoot==1){
          this.isShow = false;
        }else {
          this.isShow = true;
        }
        this.openModel('add') ;
      },
      /*--点击--删除--按钮--*/
      remove(){
          if(!this.isSelected()) return;
          this.operailityData = this.multipleSelection;
          this.openModel('remove')
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


      //tree
      treeClick(obj,node,self){
        this.clickId = obj.id
        store = node.store ;
        this.setTreeId(obj.id,obj);
        this.setTableData();
        this.isRoot = node.parent.level;
      },

      //设置treeid
      setTreeId(id,data){
        if(this.parent == ""){
          this.parent = data;
          this.formValidate.parentId = id
          this.setTableData();
        }else{
          this.parent = data;
          this.formValidate.parentId = id

        }



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
      edit,add,show,
    },
  }
</script>

