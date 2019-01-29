<!----------------------------------
****--医学图谱-添加目录树节点(normCourseTree_add)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div >
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" :rules="studyTree" label-width="110px" >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="名称：" prop="name" >
            <el-input v-model="formValidate.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="10" >
          <el-form-item label="管理员：" prop="parentId" >
            <el-input readonly v-model="formValidate.managerName" @focus="addUser" placeholder="请输选择"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="创建人：">
            {{userInfo.name}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间：">
            {{currCreateDate}}
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="10" :offset="10">
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
      <select-user v-if="selectUserModal" @cancel="closeUserModal"  @setUsers="setUsers" :initUser="users" :isOnlyOne="true"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import api from "../api.js";
  import {studyTree} from "../rules";
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        studyTree,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //选择人员
        selectUserId:{
          id:"selectUserId",
          title:"选择人员",
          usersData:''
        },
        //存储已选择人员的信息
        users:[],
        userNames:"",

        //当前创建时间
        currCreateDate:this.conductDate(new Date(),"yyyy-MM-dd HH:mm:ss"),

        //form表单bind数据
        formValidate: {
          name:'',
          parentId:this.operailityData.parentId,
          managerId:'',
          managerName:'',
          types:this.operailityData["types"],
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.treeAdd.path,
            method:'post',
            data:{}
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
    computed:{
      userInfo(){
        let info = this.$store.getters.getUserInfo || {};
        return info;
      }
    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
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
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          //console.log(this.addMessTitle.ajaxParams.data);
          //return;
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
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){

      },


      //添加人员
      addUser(){
        this.openModel('selectUser');
      },



      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers(users){
        if(users==0){
          this.users = [];
          this.formValidate.managerId = '';
          this.formValidate.managerName = '';
        }else {
          this.users = users;
          this.formValidate.managerId = this.users[0].key;
          this.formValidate.managerName = this.users[0].label;
        }

        /*let tempArr = [];
        for(var i=0,item;i<this.users.length;i++){
          item = this.users[i];
          tempArr.push(item.label);
          this.formValidate.managerId.push({
            id:item.key,
            name:item.label,
          })
        }
        this.userNames = tempArr.join(",");*/
        this.closeUserModal();
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','add');
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



    }
  }
</script>

