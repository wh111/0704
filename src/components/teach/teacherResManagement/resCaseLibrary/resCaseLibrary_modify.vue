<template>
  <div>
    <el-form :model="formValidate" :rules="resCaseLibrary" ref="formValidate" label-width="90px">

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="名称:" prop="title">
            <el-input :disabled="true" v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="标签:" prop="tags">
            <el-input :disabled="true" v-model="formValidate.tags" placeholder='多个标签用","号分隔'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="分类:" prop="typeId">
            <el-input :disabled="true" v-model="type.typeName" @focus="typeClick" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="浏览次数:" prop="viewNum">
            <el-input v-model="formValidate.viewNum" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="大小:" prop="size">
            {{formValidate.size| formatSize}}
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="简介:" prop="brief">
            <el-input :disabled="true" type="textarea"  v-model="formValidate.brief" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row v-if="!unFile">
        <el-col :span="16" :offset="2">
          <el-form-item label="资源文件:" prop="fileId">
            <up-file-new :noFirstCallBack="true" :uploadFiles="Files" :show="true" :unSize="true" :length="1" :accept="'doc|docx|xls|xlsx|ppt|pptx|pdf'" @setUploadFiles="expenseFileEvent"></up-file-new>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="!unLogo">
        <el-col :span="16" :offset="2">
          <el-form-item label="封面:" prop="logo">
            <img style="width:140px;height:120px;" v-for="item in logo" :src="item.url" alt="">
            <!--<img-wall  :onlyOnePic="true" :fileList="logo"  @upladSuccess="expenseLogoEvent"></img-wall>-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col :span="10" :offset="10">
        <div >
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>

    <!--增加弹窗-->
    <Modal
      :mask-closable="false"
      v-model="typeModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="400">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="typeId"></modal-header>
      <div style="height:500px;">
        <div style="height:450px;">
          <left-tree  slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" :treeOptions="treeDefaults":fromWhereTreeType="fromWhereTree"></left-tree>
        </div>
        </br>
        <el-row>
          <el-col :span="16" :offset="2">
            <div style="margin-left: 100px">
              <load-btn @listenSubEvent="treeSubEvent" :btnData="treeBtn"></load-btn>
              <el-button @click="typeModal = false">取消</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!---->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import {resCaseLibrary} from '../rules'
  import upFileNew from '../../../common/uploadFileNew.vue';

  import api from "./api.js";
  /*--引入--照片墙--*/
  import imgWall from '../../../common/uploadPhotoWallNew.vue';
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:['operailityData','fromWhereTree','unImgs','unLogo','unFile','url','name','id'],
    data() {
      return {
        resCaseLibrary,
        contenHeight: 0,
        viewTypes: '', // 视图类型
        //tree默认项设置
        treeDefaults: {
          getTreeUrl: this.url.resourceTypeTree.path,
          getDataUrl: '',
          isShowMenus: false,
          isShowSearch: false, //是否显示目录树查询
        },

        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        treeBtn:{title:'保存',callParEvent:'listenSubEvent'},
        typeName:this.name,
        type:{
          typeName:this.name,   //资源分类名称
          updateTypeName:this.name,    //随时更新的资源分类名称
        },
        formValidate:{
          typeId:this.id,  //资源分类ID
          title:'',         //视频名称
          tags:'',         //标签
          length:'',       //时长
          viewNum:'',        //播放次数
          brief:'',       //简介
          fileId:'',       //视频ID
          size:'',
          logo:'',
        },
        logo:[],
        Files:[],
        typeId:{
          id:'typeId',
          title:'资源分类'
        },

        getLogoFile:[],
        fileList:[], //保存地址和简介
        fileUrl:[], //用来记录地址所属的位置的
        getFileList:[], // 获取到的数据列表

        deptId:'',
        typeModal:false,
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'modify',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {

            url: this.url.modify.path + this.operailityData.id,
            method: 'put',
            data: {},
          },
        },
        //获取数据
        getMessTitle:{
          ajaxSuccess:'getListData',
          ajaxParams:{
            url:this.url.get.path+this.operailityData.id,  //向后台请求数据的地址

          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.getMessTitle);
      },


      //获取get
      getListData(res){
        let env = this.$store.getters.getEnvPath;
        let http = env['http'];
        let k=1;
        let data = res.data;
        if(!data) return;

        if(data.fileId){ // 视频
          this.Files = [{
            fileId:data.fileId,
            fileName :data.fileName ,
          }]
        }
        if(data.logo){
          this.logo = [
            {
              url : http + data.logo,
            }
          ];
        }

        data.size = data.fileSize;
        this.formValidate = this.getFormValidate(this.formValidate,data);
      },


      //点击树的回调函数
      treeSubEvent(){
        this.type.typeName = this.type.updateTypeName;
        this.formValidate.typeId = this.deptId;
        this.typeModal = false;
      },

      /*
       * 保存或上报按钮会调用这个公共函数
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        if(!isLoadingFun) isLoadingFun=function(){};
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          isLoadingFun(true);
          this.editMessTitle.ajaxParams.data = this.formValidate;
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },


      /*
       *  初始化或者刷新数列表的时候  调用treeClick函数 为deptId赋值
       * */
      treeClickInit(obj) {
        this.treeClick(obj)
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
      treeClick(obj, node, self) {
        // 记录视图
        this.viewTypes = obj.types;
        this.setTreeDepId(obj.id,obj);
      },


      /*
       * 设置当前部门Id
       * */
      setTreeDepId(id,obj) {
        if (id) {
          this.deptId = id;
          this.type.updateTypeName = obj.name;
        }
      },

      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.editMessTitle.type);
      },


      //上传资源文件
      expenseFileEvent(ids,file){
        let fileList = this.fileList;
        let fileUrl = this.fileUrl;
        let temFileList = [];
        let temFileUrl = [];
        for(let i=0;i<file.length;i++){
          let uid = file[i].uid
          let  obj = {}
          if(file[i].response){
            let data = file[i].response.data;
            let url = data.relativePathFile;
            let index = fileUrl.indexOf(uid);

            if(~index){
              obj={
                img:url,
                remark:fileList[index].remark,
              }
            }else {
              obj={
                img:url,
                remark:'',
              }
            }
            temFileList.push(obj);
            temFileUrl.push(uid)

          }else {
            obj={
              img:'',
              remark:'',
            }
            temFileList.push(obj);
            temFileUrl.push(uid)
          }
        }

        this.fileList = temFileList;
        this.fileUrl = temFileUrl;


      },

      //封面图
      expenseLogoEvent(file){
        this.formValidate.fileId = file[0].src;
      },

      //点击分类
      typeClick(){
        this.typeModal = true;
      },

      //上传文档文件
      expenseFileEvent(ids,srcObj,file){
        if(file.length==1){
          this.formValidate.size = file[0].size;
        }else {
          this.formValidate.size = 0
        }
        this.formValidate.fileId = ids ;
      },
      //封面图
      expenseLogoEvent(obj,len,arr){
        if(obj){
          this.formValidate.logo = obj.path;
        }else {
          this.formValidate.logo = '';
        }

      },

    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {imgWall,upFileNew}
  }
</script>
