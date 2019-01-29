
<!--填写基本信息-->
<!--选择评价表-->

<template>
  <div id="content"  ref="content">
    <!--表格数据-->
    <el-row >
      <el-col :span="20"  :offset="1">
        <el-form ref="formValidate" inline label-width="100px" class="demo-ruleForm">
          <el-form-item  prop="title">
            <el-input   v-model="formValidate.name" placeholder="输入姓名搜索">
            </el-input>
          </el-form-item>
          <!--<el-form-item  prop="title">-->
          <!--<el-input   v-model="formValidate.userName" placeholder="输入类型搜索">-->

          <!--</el-input>-->
          <!--</el-form-item>-->
          <el-button @click="searchEvent"   icon="search"></el-button>
        </el-form>
      </el-col>
    </el-row>
    <div
      id="myTable"
      ref="myTable">
      <el-radio-group style="display: block" v-model="tempRadio" @change="radioChange">
        <el-table
          :height="400"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">

            <el-table-column
              align="center"
              width="65">
              <template scope="scope">
                <el-radio   :label="scope.row.id" > {{' ' }} </el-radio>
              </template>
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              align="center"
              width="65">
            </el-table-column>
            <el-table-column
              label="操作"
              width="80">
              <template scope="scope">
                <el-button
                  size="small"
                  @click="show(scope.row)">预-览</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="名称"
              prop="name">
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="类型 "
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="score"
              label="总分"
              width="120">
              <template scope="scope">
                {{scope.row.score/100}}
              </template>
            </el-table-column>
        </el-table>
      </el-radio-group>

    </div>
    <br>
     <div style="height:30px;">
      <div style="float: right; ">

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

    <el-row >
      <el-col :span="10"  :offset="11">
        <el-button  @click="baseInfo">确定</el-button>
        <!--<el-button  @click="$emit('lost') ">上一步</el-button>-->
      </el-col>

    </el-row>
    <!--&lt;!&ndash;查看教学活动&ndash;&gt;-->
    <!--<Modal-->
      <!--height="200"-->
      <!--v-model="showModal"-->
      <!--title="查看教学活动"-->
      <!--class-name="vertical-center-modal"-->
      <!--:width="960"-->
      <!--:loading="loading">-->
      <!--<modal-header slot="header" :content="viewId"></modal-header>-->
      <!--<show v-if="showModal" :url="url" :operaility-data="operailityData"></show>-->
      <!--<div slot="footer"></div>-->
    <!--</Modal>-->
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
      <show v-if="showModal" :unShowStyle="true" @cancel="cancel" :url="url" :operaility-data="operailityData"   @add="subCallback" ></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style>
</style>
<script>
  /*引入 --查看*/
  import show from '../../../evaluationManagement/evaluationManagement_view.vue'

  /*当前组件必要引入*/
  //引入--新建教学活动--组件
  let Util=null;
  export default {
      props:['url','tempId'],
    data() {
      return {
        //查询项
        tempRadio:this.tempId,
        publishModal:false, //评价
        /*--按钮button--*/
        publishId:{id:'publishId',title:'发布'},

        //请求的列表数据
        formValidate:{
          typeId:'',
          name:"",
          order:'',
          sortby:'',
        },
        tempData:'',
        //表格数据
        loading:false,
        tableData: [],
        operailityData:'',
        multipleSelection: [],
        /*--按钮button--*/
        addId:{id:'add',title:'添加'},
        editId:{id:'edit',title:'修改'},
        viewId:{id:'view',title:'查看'},
        removeId:{id:'remove',title:'删除'},
        totalCount:0,

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateList',
          ajaxParams: {
            url: this.url.templateQuery,
            params: {},
          }
        },


      }
    },
    created(){
      this.init();
    },
    methods:{
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.myPages =  Util.pageInitPrams;

        this.queryQptions = {
          curPage: 1,pageSize: Util.pageInitPrams.pageSize,
        };

        this.setTableData()

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
      },
      setTableData(){
        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.queryQptions,this.formValidate);
        this.ajax(this.listMessTitle);
      },



      /*--点击--查看--按钮--*/
      show(data){
        this.operailityData = data;
        this.openModel('show');

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

      baseInfo(){
          this.$emit('selectTemp',this.tempData)
      },

      radioChange(id){
          for(let i=0;i<this.tableData.length;i++){
              if(this.tableData[i].id==id){
                this.tempData = this.tableData[i]
              }
          }

      },



    },
    mounted(){
    },
    components:{
      show
    }
  };
</script>

