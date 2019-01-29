<template>

  <div>
    <el-form :model="formValidate" ref="formValidate"  :rules="rules.buildingMess" class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="大楼名称:" prop="name" >
            <el-input v-model="formValidate.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="办公室电话:" prop="phone" >
            <el-input v-model="formValidate.phone" min="0"  placeholder="请输入" @blur="phone"></el-input>
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="16" :offset="2">
          <el-form-item label="地址:" prop="address">
            <el-input v-model="formValidate.address" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="formValidate.remark" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>
    <el-row >
      <el-col :span="16" :offset="2">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url','rules'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //form表单bind数据
        formValidate: {
          name:'',        //楼名
          address:'',     //地址
          phone:'',       //电话
          remark:'',      //备注
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功',
          errorTitle:'修改失败',
          ajaxSuccess:'ajaxSuccess',
          ajaxParams:{
            jsonString:true,       //使用Content-Type: application/json
            url:this.url.buildModify+this.operailityData.id,
            method:'put',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.buildGet+this.operailityData.id,
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
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        if(!data.remark)data.remark = '';
        this.formValidate = this.getFormValidate(this.formValidate,data) ;
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
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },

      phone(){
        let val =this.formValidate.phone;
        val = (val+'').replace(/^[-]|[^(0-9\-)]/gi,'');
        this.formValidate.phone = val;
      }
    }
  }
</script>
