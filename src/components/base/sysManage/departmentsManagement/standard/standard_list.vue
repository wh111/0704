<!--科室管理-->
<!--标准科室管理-->

<template>
  <div id="standard" ref="standard" class="modal">
      <div class="add-remove">
        <el-button v-show="flag" class="but-col"  @click="trigger(false)"  type="primary">科室信息</el-button>
        <el-button v-show="flag" class="but-col" @click="trigger(true)" type="primary">下级科室列表</el-button>
      </div>
      <div class="add-remove">
        <el-row  >
          <el-col :span="5" :offset="1">
            <el-button  class="but-col"  @click="add"  type="primary">添加</el-button>
          </el-col>
          <el-col :span="10" :offset="2">
            <div class="listUpArea-searchWrapper">
              <!--右侧查询-->
              <el-form ref="formValidate" :rules="rules" :inline="true" :model="formValidate" class="form-inline lose-margin" label-width="60px" >
                <div class="listUpArea-searchLeft">
                  <input class="hidden">
                  <el-form-item  prop="name">
                    <el-input placeholder="请输入内容" v-model="formValidate.name">
                      <div slot="prepend">标准科室名称</div>
                      <el-button @click="searchEvent" :btnData="searchData" slot="append" icon="search"></el-button>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="listUpArea-moreSearch">
                  <!--<el-button @click="showMoreSearch" type="text">高级查询</el-button>-->
                </div>
              </el-form>
            </div>
          </el-col>
        </el-row >
      </div>
      <div v-if="isShowMoreSearch" class="listUpArea-moreSearchBox"></div>
      <div
        id="myTable1"
        ref="myTable1"
      >
        <el-table
          v-show="flag1"
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="序号"
            prop="index"
            width="70">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
          >
            <template scope="scope">
              <el-button
                size="small"
                type="warning"
                @click="edit(scope.$index, scope.row)">修改
              </el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            label="科室名称"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin: 10px;">
        <div style="float: right;">

          <el-pagination
            v-show="flag1"
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
          :width="500">
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
          title="对话框标题"
          class-name="vertical-center-modal"
          :width="500">
          <!--<div slot="header"> -->
          <!--</div>-->
          <modal-header slot="header" :content="addId"></modal-header>
          <add v-if="addModal"  @cancel="cancel" @add="subCallback" ></add>
          <div slot="footer"></div>
        </Modal>
      </div>

  </div>
</template>

<script >
  /*当前组件必要引入*/
  import {nosocomialList as rules } from '../../rules'

  //引入--修改--组件
  import edit from "./standard_edit.vue";
  //引入--查看--组件
  import show from "./standard_view.vue";
  //引入--添加--组件
  import add from "./standardl_add.vue";

  //当前组件引入全局的util
  let Util=null;
  let store = null;
  export default{
    props:['parentFlag'],
    data() {
      return {
        rules,
        flag:false,
        flag1:true,
        //查询表单
        deleteUrl:'',
        formValidate: {
          name: '',
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

        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData1: [
//          {
//            "id":1000,
//            "name":"内科"
//          },
//          {
//            "id":1000,
//            "name":"内科"
//          }
        ],
        loading:false,
        listTotal:0,

        //初始化加载页面信息
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'/criterion/dept/list',
            params:{
              name:"",
              sortby:"",
              order:"",
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
          curPage: 1,pageSize: Util.pageInitPrams.pageSize
        }

        this.setTableData();
      },


      //切换科室信息
      //切换下级科室信息
      trigger(flag){
        this.flag1 = flag
      },


      //设置表格及分页的位置
      setTableDynHeight2(){
        let standard = this.$refs.standard;
        let parHt = standard.parentNode.offsetHeight;
        let myTable1 = this.$refs.myTable1;
        let paginationHt = 42;
        this.dynamicHt = parHt - myTable1.offsetTop - paginationHt;
      },


      //通过get请求列表数据并渲染表格数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        data = this.addIndex(data);
        this.tableData1= data;
          this.listTotal = responseData.data.length || 0;
      },


      //初始化加载列表数据
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
        this.postParamToServer(this.listMessTitle);
      },


      //向服务器发送数据
      postParamToServer(options){
        if(this.deptId!=""){
          options["ajaxParams"]["params"]["deptId"] = this.deptId;
        }
        this.ajax(options);
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
            this.$Message.error('查询输入有误!');
          }
        })
        return flag
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
      //tree
      treeClick(obj,node,self){
        //出现切换按钮
        this.flag = true;
        this.clickId = obj.id
        this.targetKeys2=[9]
        store = node.store ;
        this.tableData1 = obj.children;

      },
    },
    created(){
      this.init();
    },

    mounted(){
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight2();
        //为窗体绑定改变大小事件
        let Event = Util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight2);
      })
    },
    components:{
      //当前组件引入的子组件
      edit,add,show
    },
    watch:{
      parentFlag(){
        this.flag = false;
      }
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

