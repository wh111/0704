
<!--第一步：填写基本信息-->

<template>
  <div ref="content">
    <el-form  ref="formValidate" :model="formValidate"  :rules="evaluationActivitySetBaseInfo"  label-width="100px" class="demo-ruleForm">
      <el-row >
        <el-col :span="16"  :offset="1">
            <el-form-item  prop="name" label="名称">
              <el-input   v-model="formValidate.name" placeholder="输入姓名搜索">
              </el-input>
            </el-form-item>
        </el-col>

      </el-row>
      <el-row >
        <el-col :span="8"  :offset="1">
            <el-form-item  prop="type" label="类别">
              <el-select v-model="formValidate.type" placeholder="请选择活动区域">
                <el-option
                  v-for="item in typeOptionData"
                  :key="item.parentId"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>


          </el-col>
        <el-col :span="8"  >
            <el-form-item  prop="tempName" label="评价表">
              <el-input   v-model="formValidate.tempName" readonly @focus="selectTemp" placeholder="选择评价表 ">
              </el-input>
            </el-form-item>

        </el-col>

      </el-row>
      <el-row >
        <el-col :span="16"  :offset="1">
          <el-form-item label="用途" prop="remark">
            <el-input type="textarea" v-model="formValidate.remark"></el-input>
          </el-form-item>
          </el-col>

      </el-row>
      </br>
      <el-row >
        <el-col :span="10"  :offset="9">
          <el-button  @click="baseInfo">确认并继续</el-button>
          <!--<el-button  @click="$emit('lost') ">上一步</el-button>-->
        </el-col>

      </el-row>
    </el-form>
    <div>

      <Modal
      :mask-closable="false"
      v-model="selectTempModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="1100">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="selectTempId"></modal-header>
      <temp v-if="selectTempModal" :tempId="formValidate.tempId"  @cancel="cancel" :url="url"  @selectTemp="selectTempCallBack" ></temp>
      <div slot="footer"></div>
      </Modal>




    </div>
  </div>
</template>
<script>
  import {evaluationActivitySetBaseInfo} from '../../../rules'
  /*当前组件必要引入*/
  /*---引入--新建-- */
  import temp from './edit_baseInfo/baseInfo_temp.vue'
  let Util=null;
  export default {
      props:['url','operailityData','update'],
    data() {
      return {
        evaluationActivitySetBaseInfo,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        typeOptionData:[],
        formValidate:{
          name:'',        //活动名称
          type:"",   //类别
          tempId:"",   //评价表ID
          tempName:"",   //评价表名称
          remark:"",   //用途
        },
        //查询项
        /*--按钮button--*/
        //表格数据
        loading:false,
        tableData: [],
        selectTreeData:[],
        dynamicHt:100,
        totalCount:0,
        multipleSelection: [],
        selectTempModal:false,
        /*--按钮button--*/
        selectTempId:{id:'selectTempId',title:'选择评分表'},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateList',
          ajaxParams: {
            url: this.url.activityQuery,
            params: {},
          }
        },

      };

    },
    created(){
      this.setUserInfo();
      this.formValidate = this.getFormValidate(this.formValidate,this.operailityData)
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
      setUserInfo(){
        let options = {
          ajaxSuccess:(res)=>{
            console.log(res)
            this.typeOptionData = res.data.child;
          },
          errorTitle:'获取用户类型失败!',
          ajaxParams:{
            url:'/dictionary/getByCode/ACTIVITY_EVALUATION_TYPE'
          }
        };
       this.ajax(options);
      },

      //点击查询按钮调用
      onSubmitSearch() {
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
        this.totalCount = responseData.totalCount || 0;
      },

      /*
       * 点击--修改角色--按钮
       * @param index string|number  当前行索引
       * */
      edit(data){
        this.operailityData = data;
        this.openModel('edit')
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
      cancel(){
        this.selectTempModal = false;
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

      selectTempCallBack(data){
        if(!data){
          this.cancel();
          return;
        }
        this.formValidate.tempName = data.name;
        this.formValidate.tempId = data.id;
        this.cancel();

      },
      /*
      *   选择评价表
      * */
      selectTemp(){
        this.openModel('selectTemp')
      },

      /*
      *
      * */
      baseInfo(){
//       更新基础数据
//       继续下一步
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          this.$emit('next', this.formValidate);
        }

      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = true;
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            flag= false;
          }
        });

        return flag;
      },
    },
    mounted(){
    },
    components:{
      temp
    },
    watch:{
      update(val){

      },
      operailityData(val){
        this.formValidate = this.getFormValidate(this.formValidate,this.operailityData)
      }
    }
  };
</script>
