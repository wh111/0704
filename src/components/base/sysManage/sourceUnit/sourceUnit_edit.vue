<template>

  <div >
    <el-form ref="formValidate" :model="formValidate" :rules="rules" class="demo-form-inline" label-width="80px" >
      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="单位名称" prop="name" >
            <el-input v-model="formValidate.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="联系人" prop="contacts" >
            <el-input v-model="formValidate.contacts" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" >
          <el-form-item label="联系电话" prop="phone" >
            <el-input v-model="formValidate.phone" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="备注" prop="remark" >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="formValidate.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row >

    </el-form>

    <el-row class="but-space">
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  import {sourceUnit as rules} from '../rules';
  //当前组件引入全局的util
  let Util=null;
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
          id:this.operailityData.id,
          name:'',
          contacts:"",
          phone:'',
          remark:"",
        },


        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxParams:{
            url:'/schools/modify/'+this.operailityData.id,
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
            let rawData = res.data;
            this.formValidate = rawData;
          },
          ajaxParams:{
            url:'/schools/get/'+this.operailityData.id,
          }
        }
        this.ajax(userList);
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
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
        this.$emit('cancel',this.editMessTitle.type);
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
