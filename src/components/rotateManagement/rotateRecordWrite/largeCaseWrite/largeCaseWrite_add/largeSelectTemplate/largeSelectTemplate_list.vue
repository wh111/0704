<!--档案审核-->
<template>
  <div id="content" ref="content" class="modal">
    <el-form  ref="formValidate" inline label-width="100px">
     <el-row style="margin-bottom:0">
	  <!--列表操作按钮-->
        <el-col :span="10" >


        </el-col>
		<!--搜索项-->
        <el-col :span="14"  align="right">
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

    <!--列表数据-->
    <div>
      <!--表格数据-->
      <div
        id="myTable"
        ref="myTable">
        <el-radio-group style="display: block" v-model="tempRadio" @change="radioChange">
          <el-table
            :height="400"
            :data="tableData"
            border
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column
              align="center"
              width="65">
              <template scope="scope">
                <el-radio   :label="scope.row.cid" > {{' ' }} </el-radio>
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
              align="center"
              width="150">
              <template scope="scope">
                <el-button size="small" @click="show(scope.row)">预-览</el-button>
                <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名"
              prop="cname">
            </el-table-column>
            <el-table-column
              prop="depName"
              label="科室"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="czyNo"
              label="住院号">
            </el-table-column>
            <el-table-column
              prop="cbedNo"
              label="床号">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建日期">
            </el-table-column>
          </el-table>
        </el-radio-group>

      </div>
    </div>
    <div style="text-align: center;padding: 10px">
      <el-button  @click="confirmGetTemplate">确定</el-button>
      <el-button  @click="cancelList">取消</el-button>
    </div>


    <!--删除弹窗-->
    <Modal
      :mask-closable="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="loading"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove  v-if="removeModal" :delete-url="url.bigCasesDeleteTemplate" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal
	 :mask-closable="false"
      width="1000"
      v-model="showModal"
      title="查看档案管理弹窗"
      class-name="vertical-center-modal"
      :loading="loading">
      <modal-header slot="header" :content="viewId"></modal-header>
      <show v-if="showModal" @cancel="cancel" @show="subCallback"  :url="url" :formValidate="getTemplateData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //引入--查看--组件
  import show from "./largeSelectTemplate_view.vue";
  //当前组件引入全局的util
  let Util=null;
  export default{
    props:['url'],
    data() {
      return {
        //查询表单
        formValidate: {
          name: '',       //大楼名称模糊检索
          sortby: '',//排序列
          order: ''     //升序、降序
        },
        tempData:{},
        tempRadio:'',
        operailityData:'',
        multipleSelection: [],
        dynamicHt: 100,
        self: this,
        tableData: [],
		 searchMore: false,
        loading:false,
        totalCount:0,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:this.url.templateList,
            params:{}
          }
        },


        getTemplateData:{},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        getTemplateTitle:{
          ajaxSuccess:'getTemplateSuccess',
          ajaxParams:{
            url:this.url.getTemplate,
          }
        },


        /*--按钮button--*/
        addId:{id:'addId',title:'新建'},
        editId:{id:'editId',title:'修改'},
        removeId:{id:'removeId',title:'删除'},
        viewId:{id:'viewId',title:'查看'},

      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        //ajax请求参数设置
        this.setTableData();
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
        if(!responseData.data)return;
        this.tableData = responseData.data;
      },
      setTableData(){
//        this.listMessTitle.ajaxParams.params = Object.assign(this.listMessTitle.ajaxParams.params,this.formValidate);
        this.ajax(this.listMessTitle);
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
        this.$refs[name].validate((valid) =>{
          if (valid) {
            flag =true;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
        return flag
      },


      /*--点击--添加--按钮--*/
      add(){
        this.openModel("add");
      },


      //获取模板数据
      getTemplate(){

      },

      //确定
      confirmGetTemplate(){
        if(!this.tempRadio){
          this.errorMess('请选择一条数据');
          return;
        }

        let getTemplateTitle={
          ajaxSuccess:(res)=>{
            let data = res.data;
            if(!data){ this.errorMess('获取内容有误')}
            this.$emit('selectTemp',data)
          },
          ajaxParams:{
            url:this.url.getTemplate+this.tempRadio,
          }
        }
        this.ajax( getTemplateTitle);


      },


      /*--点击--修改--按钮--*/
      edit(data){
        this.operailityData = data;
        this.openModel("edit");
      },


      /*--点击--删除--按钮--*/
      remove(item){
        item.id = item.cid;
        this.operailityData = [item];
        this.openModel('remove') ;
      },


      /*
       * 点击--查看--按钮
       * @param index string|number  当前行索引
       * */
      show(data){
        this.operailityData = data
        let getTemplateTitle={
          ajaxSuccess:(res)=>{
            let data = res.data;
            if(!data){
              this.errorMess('获取内容有误');
              return;
            }
            this.getTemplateData = data;
            this.openModel("show");
          },
          ajaxParams:{
            url:this.url.getTemplate+this.operailityData.cid,
          }
        }

        this.ajax( getTemplateTitle);

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

      //选择的数据
      radioChange(id){
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].cid==id){
            this.tempData = this.tableData[i]
          }
        }
      },

      //list cancel
      cancelList(){
        this.$emit('templateCancel');

      },

    },
    created(){
      this.init();
    },
    mounted(){
    },
    components:{
      //当前组件引入的子组件
      show
    }
  }
</script>
