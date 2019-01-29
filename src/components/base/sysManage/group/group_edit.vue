<template>

  <div >
    <el-form ref="formValidate"  :rules="rules" :model="formValidate"    class="demo-form-inline" label-width="80px" >

      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="名称" prop="name" >
            <el-input v-model="formValidate.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9" >
          <el-form-item label="描述" prop="remark" >
            <el-input v-model="formValidate.remark" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row :span="18" :offset="2">
        <div class="itemLayout">
          <fieldset>
            <legend style="font-size:16px"> 添加人员 <el-button  type="primary" size="mini" @click="addUser" icon="plus"></el-button>&nbsp;&nbsp;</legend>

            <span v-for="(item,index) in users" class="userName"><em class="nameText">{{item.label}}</em><el-button type="danger" @click="removeUser(index)" size="mini" icon="close"></el-button></span>

          </fieldset>
        </div>
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
      title="添加人员"
      class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="closeSltUser"  @setUsers="setUsers" :initUser="users"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  import {group as rules} from '../rules';
  import selectUser from "../../../common/selectUser.vue"
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //form表单bind数据
        formValidate: {
          "id": this.operailityData.id,
          "name": "",
          "remark": "",
          "userIds": '',
        },

        //选择人员
        selectUserId:{
          id:"selectUserId",
          title:"选择人员",
          usersData:''
        },
        //存储已选择人员的信息
        users:[],

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/groups/modify/'+this.operailityData.id,
            method:'put'
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
      //初始化
      init(){
        let userList = {
          ajaxSuccess:(res)=>{
            let rowData = res.data;
            let users = [];
            let userIds = [];

            this.formValidate["name"] = rowData["name"];
            this.formValidate["remark"] = rowData["remark"];

            if(typeof rowData["userList"]!=""){
              Util._.forEach(rowData["userList"],function (n,key) {
                users.push({
                  key:n.id,
                  label:n.name,
                  description: '人员id---' + n.id + '的描述信息',
                  disabled: false
                })
                userIds.push(n.id)
              })
              this.users = users;
              this.formValidate["userIds"] = userIds.join(",");
            }
          },
          ajaxParams:{
            url:'/groups/get/'+this.operailityData.id,
          }
        }
        this.ajax(userList);
      },


      //添加人员
      addUser(){
        this.openModel('selectUser');
      },


      //删除人员
      removeUser(index){
        this.users.splice(index,1)
      },


      /*
       * 获取选择人员的人员信息并赋值
       * @param users [{id:'',name:''},{}]  已选人员信息
       * */
      setUsers(users){
        this.users = users;
        this.closeSltUser();
      },


      //关闭选择人员弹窗
      closeSltUser(){
        this['selectUserModal'] = false;
      },


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          if(this.users==0){
            this.errorMess('参加人员不能为空');
            return;
          }
          isLoadingFun(true);
          this.editMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle,isLoadingFun)
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
        this.$emit('cancel',"edit");
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        let tempArr = [];
        for(var i=0;i<this.users.length;i++){
          tempArr.push(this.users[i]["key"]);
        }
        myData.userIds = tempArr.join(",");
        return myData;
      },


      /*
       * 监听子组件通讯的方法
       * 作用:ajax请求成功回调,该监听方法在libs/util 中的混合模式下定义回调
       * @param targer string example:"add"、"edit"
       * @param targer string 提示返回的ajax回调返回的信息改信息在对应的子组件中定义
       * 例如:errorTitle、errorTitle
       *editMessTitle:{
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
    },
    components:{
      selectUser
    }
  }
</script>
