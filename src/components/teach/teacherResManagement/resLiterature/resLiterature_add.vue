<!----------------------------------
****--新建-视频(resCaseLibrary_add)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->

<template>
  <div>
    <el-form :model="formValidate" :rules="resLiterature" ref="formValidate" label-width="90px">

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="名称:" prop="title">
            <el-input  v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="标签:" prop="tags">
            <el-input v-model="formValidate.tags" placeholder='多个标签用","号分隔'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="分类:" prop="typeId">
            <el-input v-model="type.typeName" @focus="typeClick" readonly></el-input>
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
            <el-input type="textarea"  v-model="formValidate.brief" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="!unFile">
        <el-col :span="16" :offset="2">
          <el-form-item label="资源文件:" prop="fileId">
            <up-file-new :unSize="true" :length="1" :accept="'doc|docx|xls|xlsx|ppt|pptx|pdf'" @setUploadFiles="expenseFileEvent"></up-file-new>
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
        <left-tree  slot="left" @setCurrSltNodeId="setTreeDepId" @tree-click="treeClick" :treeOptions="treeDefaults" :fromWhereTreeType="fromWhereTree"></left-tree>
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
  import {resLiterature} from '../rules'

  import upFileNew from '../../../common/uploadFileNew.vue'

  import api from "./api.js";
  /*--引入--照片墙--*/
  import imgWall from '../../../common/uploadPhotoWall.vue'
  //当前组件引入全局的util
  let Util = null;
  export default{
  props:['fromWhereTree','unImgs','unLogo','unFile','name','id','url'],
  data() {
      return {
        resLiterature,
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
          viewNum:'0',        //播放次数
          brief:'',       //简介
          fileId:'',       //视频ID
          size:'',
        },

        typeId:{
          id:'typeId',
          title:'资源分类'
        },
        deptId:'',
          typeModal:false,
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.add.path,
            method: 'post',
            data: {

            },
          }
        },


      }
    },
    methods: {
      //初始化请求列表数据
      init(){

      },

      //点击数的回调函数
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
        if(isSubmit){
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.formValidate;
          this.ajax(this.addMessTitle, isLoadingFun)
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
        this.$emit('cancel',this.addMessTitle.type);
      },


      //上传文档文件
      expenseFileEvent(ids,srcObj,file){
        if(file.length==1){
          this.formValidate.size = file[0].size
        }else {
          this.formValidate.size = 0
        }
        this.formValidate.fileId = ids ;
      },


      //点击分类
      typeClick(){
        this.typeModal = true;
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
