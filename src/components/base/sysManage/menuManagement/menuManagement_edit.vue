<template>

  <div >
    <el-form ref="formValidate" class="demo-form-inline" label-width="110px" >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="菜单名称：" prop="name" >
            <el-input v-model="formValidate.name"  placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="10" >
          <el-form-item label="菜单代码：" prop="identity" >
            <el-input :disabled="true" v-model="formValidate.identity" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="图标：" prop="icon" >
            <el-input :disabled="true" v-model="formValidate.icon" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="10" >
          <el-form-item label="显示顺序：" prop="sequence" >
            <el-input v-model="formValidate.sequence" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="URL：" prop="url" >
            <el-input :disabled="true" v-model="formValidate.url" placeholder="请输入"></el-input>
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
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //form表单bind数据
        formValidate: {
          "id":this.operailityData.id,
          "name":"",
          "identify":"",
          "icon":"",
          "parentId":this.operailityData.parentId,
          "sequence":"",
          "url":"",
          "remark":"",
        },

        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功',
          errorTitle:'修改失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            url:'/menu/modify/'+this.operailityData.id,
            method:'put',
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'oneDataSuccess',
          ajaxParams:{
            url:'/menu/get/'+this.operailityData.id,
          }
        }
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
        this.ajax(this.listMessTitle);
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
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
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
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      oneDataSuccess(responseData){
        let data = responseData.data;
        this.formValidate = data;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
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
<style>
</style>
