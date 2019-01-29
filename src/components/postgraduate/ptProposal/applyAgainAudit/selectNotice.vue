
<!--填写基本信息-->
<!--选择评价表-->

<template>
  <div id="content"  ref="content">
    <!--表格数据-->
    <el-row >
      <el-col :span="20"  :offset="1">
        <el-form ref="formValidate" inline label-width="100px" class="demo-ruleForm">
          <el-form-item  prop="title">
            <el-input   v-model="formValidate.title" placeholder="输入标题搜索">
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
            label="操作"
            align="center"
            width="80">
            <template scope="scope">
              <el-button size="small" @click="show(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="title"
            label="标题"
            width="200">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="noticeType"
            label="通知类型">
            <template scope="scope">
              {{scope.row.noticeType | typeText}}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="graduateName"
            label="研究生"
            align="center"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="openTime"
            label="通知时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="requirement"
            label="开题要求">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="notice"
            label="开题须知">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="publishStatus"
            label="状态">
            <template scope="scope">
              {{scope.row.publishStatus | casesStatus}}
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
      </el-col>
    </el-row>
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


  </div>
</template>
<style>
</style>
<script>
  /*当前组件必要引入*/
  import show from  '../proposalNotificationExamine/proposalNotificationManager_view.vue'
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
            url: this.url.userList.path,
            params: {},
          }
        },


      }
    },
    created(){
      this.init();
      this.setTableData()
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
        this.totalCount = responseData.totalCount||0;
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

