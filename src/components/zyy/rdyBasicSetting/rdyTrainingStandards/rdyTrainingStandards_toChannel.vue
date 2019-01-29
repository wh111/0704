
<template>
  <div >

      <el-row class="but-space">
        <el-col :span="3" :offset="2">
          <Icon style="font-size: 50px"  type="arrow-down-a" />
        </el-col>
        <el-col :span="16" >
        <p>填写导入培训细则信息表</p></br>
          <a :href="http"><el-button size="mini" type="primary">下载模板<i class="ivu-icon ivu-icon-arrow-down-a"></i></el-button></a>
        </el-col>
      </el-row>
      <el-row class="but-space">
        <el-col :span="3" :offset="2">
          <Icon style="font-size: 50px"  type="upload" />
        </el-col>
        <el-col :span="16" >
           <p>上传填好的培训细则表 ( 仅支持.xls/.xlsx格式)</p></br>
          <xlsx @on-select-file="handleSelectedFile" :row="1">上传</xlsx>

        </el-col>
      </el-row>
    <el-row class="but-space">
      <el-col :span="18" :offset="5">
        <p>本次已导入记录数 : {{totalNumber}}条</p>
      </el-col>
    </el-row>

      <el-row  class="but-space">
        <el-col :span="10" :offset="10">
          <el-button  @click="success">完成</el-button>
          <el-button  @click="cancel">取消</el-button>
        </el-col>
      </el-row>

    <!--导入-->
    <Modal
      :mask-closable="false"
      close-on-click-modal="false"
      width="1100"
      v-model="toChannelModal"
      title="对话框标题"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="toChannelId" ></modal-header>
      <to-channel v-if="toChannelModal" :headerData="headerData" :id="id" :treeRoad="treeRoad" @cancel="closeChannel"  :url="url.uploadExcel.path"  @success="subHandelEvent" :data="convertedData" :format="format"></to-channel>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import toChannel from '../../../common/toChannel_base-handsontable.vue'
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url','id','treeRoad'],
    data (){
      return{
        active:0,
        //保存按钮基本信息
        headerData:["培训标准名称", "是否住院医师", "细则类型",  "基地名称","学历", "培训方向", "培训方法", "培训标准简介", "培训目标", "教学、科研能力培训","轮转科室", "轮转目的", "培训周期", "是否必须轮转", "任选其几", "任选分组号", "阶段号", "阶段名称", "考核指标", "指标类型", "显示类型", "要求级别", "分类", "掌握程度", "3年要求数量", "2年要求数量", "1年要求数量", ],

        //导入条件
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        toChannelId:{id:'toChannelId',title:'培训细则'},
        convertedData:{},
        format :{
          "培训标准名称":"rtName",
          "是否住院医师":"rtModelType",
          "细则类型":"rtrulesType",
          "基地名称":"jdName",
          "学历":"rtSchlength",
          "培训方向":"rtProclass",
          "培训方法":"rtMethod",
          "掌握程度":"deMasterDegree",


          "培训标准简介":"rtIntroduce",
          "培训目标":"rtTarget",
          "教学、科研能力培训":"rtChechRea",
          "轮转科室":"cdepName",
          "轮转目的":"depsetPurpose",
          "培训周期":"rtTs",
          "是否必须轮转":"isMustRotaryDep",
          "任选其几":"depRandomNum",
          "任选分组号":"depGroupNo",
          "阶段号":"depPhaseNum",
          "阶段名称":"depPhase",
          "考核指标":"deName",
          "指标类型":"deDetype",
          "显示类型":"deShowtype",
          "要求级别":"deLeveltype",
          "分类":"deType",
          "3年要求数量":"deCountBasic",
          "2年要求数量":"deCountBasicSecond",
          "1年要求数量":"deCountBasicFirst",
      },
//        extra:[   //额外的，不在列表里的数据
//          {
//              status:'NORMAL'
//          }
//        ],


        //记录总条数
        toChannelModal:false,
        //form表单bind数据
        formValidate: {
          name:'',
          identify:null,
          remark:'',
          type:[]
        },
        totalNumber:0,
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
//        addMessTitle:{
//          type:'add',
//          successTitle:'添加成功!',
//          errorTitle:'添加失败!',
//          ajaxSuccess:'ajaxSuccess',
//          ajaxError:'ajaxError',
//          ajaxParams:{
//            url:'/role/add',
//            method:'post'
//          }
//        },
        //table
        dynamicHt:100,
        tableData1:[{l:'1'},{l:'1'}],
        http:'',
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        let http = this.$store.getters.getEnvPath.http;
        this.http = http+ 'static/template/培训细则模板.xls'
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      success(){
        this.$emit('show','toChannel',`导入${this.totalNumber}条数据`);
      },


      cancel(){
        this.$emit('cancel','toChannel');
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
      //下一步
      next(){
        this.active = this.active+1
      },
      load(){
        this.active = 0
      },


      closeChannel(){
        this.toChannelModal = false;
      },
      //点击上传获取文件回调函数
      handleSelectedFile(convertedData){
        if(convertedData.body==0){
          this.errorMess('导入数据为空，请重新选择数据');
          return;
        }
        this.convertedData = convertedData;
        this.toChannelModal = true
      },


      //导入成功回调函数
      subHandelEvent(data){
         this.closeChannel()
        this.totalNumber += data.length ;
      },


    },
    components:{
      toChannel
    }
  }
</script>
