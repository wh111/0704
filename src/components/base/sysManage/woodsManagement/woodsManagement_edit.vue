<template>

  <div >
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="80px" >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="名称" prop="jdName" >
            <el-input v-model="formValidate.jdName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="培训方向" prop="jdProclass">
            <dictionary-select style="width: 90%" v-if="formValidate.jdProclass!=''" @setSltOptionValue="setSpecialtyOptionValue" :selectOptions="specialtyOptions"></dictionary-select>
          </el-form-item>
        </el-col>

        <el-col :span="9" >
          <el-form-item label="基地主任" prop="jdZrUsername" >
            <el-input :readonly="true" v-model="formValidate.jdZrUsername" @focus="addUser" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1" style="margin: 8px 0 0 10px;">
          <i class="el-icon-plus" style="cursor: pointer;" @click="addUser('director')"></i>
        </el-col >
      </el-row >
      <el-row>
        <el-col :span="19" :offset="1">
        <div class="el-form">
          <el-form-item label=" " prop="jdDep">
            <fieldset>
              <legend style="font-size:16px"> 添加基地科室 <el-button  type="primary" size="mini" @click="addDep" icon="plus"></el-button>&nbsp;&nbsp;</legend>

              <span v-for="(item,index) in formValidate.jdDep" class="userName"><em class="nameText">{{item.depName}}</em><el-button type="danger" @click="removeDep(index)" size="mini" icon="close"></el-button></span>

            </fieldset>
          </el-form-item>
        </div>
        </el-col>
      </el-row>
    </el-form>

    <el-row class="but-space">
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >

    <!--选择人员-->
    <Modal
      width="890"
      v-model="selectUserModal"
      title="新建教学活动"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="closeUserModal"  @setUsers="setUsers" :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>

    <!--添加科室-->
    <Modal
      :mask-closable="false"
      v-model="setDepModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="700">
      <!--<div slot="header"> -->
      <!--</div>-->
      <modal-header slot="header" :content="addDepId"></modal-header>
      <add-dep v-if="setDepModal"  @cancel="cancelSetDep" @filterAddDepData="filterAddDepData" :operaility-data="depInitData"></add-dep>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import addDep from "./selectDep.vue";
  import {
    jdManagement as rules
  } from '../rules'; // 表单验证
  let Util=null;
  export default {
    props:["operailityData"],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //选择人员
        selectUserId:{
          id:"selectUserId",
          title:"选择人员",
        },

        //存储已选择人员的信息
        initUser:[],

        depInitData:[],
        //添加科室
        addDepId:{
          id:'add',
          title:'添加基地科室'},
        setDepModal:false,


        //form表单bind数据
        formValidate: {
          "jdName":"",
          "jdProclass":"",
          "jdZrUsername":"",
          "jdZrUserid":"",
          "jdContent":"",
          "jdDep":[]
        },

        //请求专业数据
        specialtyOptions:{
          multiple:false,    //是否多选
          url: "/dictionary/getByCode/ROTARY_PROCLASS",
          value:'',
        },


        //获取当前基地的详细信息
        getListDetail:{
          ajaxSuccess:"SuccessGetCurrData",
          ajaxParams:{
              url:"/rotaryBasis/BaseManage/get/"+this.operailityData.jdId,
          }
        },


        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:"/rotaryBasis/BaseManage/modify/"+this.operailityData.jdId,
            method:'put',
            jsonString:true
          }
        },
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
        this.ajax(this.getListDetail);

      },





      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        if(!Util.isEmptyObject(data)){
          this.specialtyOptions.value = data["jdProclass"];
          this.formValidate = data;
        }
      },


      /*
       * 设置专业
       * @param val string || number  选中学校的id
       * */
      setSpecialtyOptionValue(val,id){
        //this.formValidate.schoolId = id;
        this.formValidate.jdProclass = val;
      },


      /**
       * 添加组列表---filter添加的数据
       */
      filterAddDepData(data){
        this.formValidate.jdDep = data;
      },


      //添加科室
      addDep(){
        this.depInitData = this.formValidate.jdDep;
        this.openModel('setDep');
      },


      /**
       * 删除已添加的科室
       * @param index {Number}  当前要删除的科室对应的数组索引
       * */
      removeDep(index){
        this.formValidate.jdDep.splice(index,1);
      },


      //添加人员
      addUser(){
        this.initUser=[];
        if(this.formValidate["jdZrUsername"]!="") {
          if(this.formValidate["jdZrUsername"].indexOf(",")>-1){
            let names = this.formValidate["jdZrUsername"].split(",");
            let ids = this.formValidate["jdZrUserid"].split(",");

            for(var i=0;i<names.length;i++){
              if(names[i]!=""){
                this.initUser.push({
                  key:ids[i],
                  label:names[i],
                  description: '人员id---' + ids[i] + '的描述信息',
                  disabled: false
                })
              }
            }
          }else{
            let names = this.formValidate["jdZrUsername"];
            let ids = this.formValidate["jdZrUserid"];
            this.initUser.push({
              key:ids,
              label:names,
              description: '人员id---' + ids + '的描述信息',
              disabled: false
            })
          }

        }
        this.openModel('selectUser');
      },


      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers(users){
        let namesArr = []
        let idsArr = [];
        for(var i=0;i<users.length;i++){
          namesArr.push(users[i].label);
          idsArr.push(users[i].key);
        }
        this.formValidate["jdZrUsername"] = namesArr.join(",");
        this.formValidate["jdZrUserid"] = idsArr.join(",");
        this.closeUserModal();
      },


      //关闭选择人员弹窗
      closeUserModal(){
        this.selectUserModal = false;
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          //console.log(this.editMessTitle.ajaxParams.data);
          //return;
          this.ajax(this.editMessTitle, isLoadingFun)
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
      cancel(){
        this.$emit('cancel','edit');
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      cancelSetDep(options){
        this[options+'Modal'] = false;
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
        delete myData.jdStatus;
        return myData;
      },



    },
    components:{
      addDep
    }
  }
</script>
