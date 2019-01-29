<template>

  <div>
    <el-form  :model="formValidate" ref="formValidate" :rules="columnManagement"  class="demo-form-inline" label-width="110px" >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="名称" prop="name" >
            <el-input v-model="formValidate.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="10" :offset="2">
          <el-form-item label="父栏目" prop="identify">
            {{formValidate.parentName}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="排列顺序" prop="moduleOrder" >
            <el-input v-model="formValidate.moduleOrder"  min="0" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="是否显示" prop="isDisplay">
            <el-radio-group @change="isDisplayChange" v-model.number="formValidate.isDisplay">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row v-if="formValidate.isHome">
        <el-col :span="20" :offset="2">
          <el-form-item label="是否首页展示显示:" prop="isHome">
            <el-radio-group  v-model="formValidate.isHome">
              <el-radio :disabled="formValidate.isDisplay==0" :label="'YES'">是</el-radio>
              <el-radio :disabled="formValidate.isDisplay==0" :label="'NO'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="是否为功能:" prop="isFunc">
            <el-radio-group  v-model="formValidate.isFunc">
              <el-radio   label="YES">是</el-radio>
              <el-radio label="NO">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="是否图片新闻:" prop="isPictureNews">
            <el-radio-group  v-model="formValidate.isPictureNews">
              <el-radio   label="YES">是</el-radio>
              <el-radio label="NO">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="url" prop="moduleUrl">
            <el-input v-model="formValidate.moduleUrl" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="栏目简介" prop="remark">
            <el-input
              type="textarea"
              :rows="5"
              resize="none"
              placeholder="请输入内容"
              v-model="formValidate.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="10" :offset="2">
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
  import {columnManagement} from '../rules'
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url','isRoot'],
    data (){
      return{
        columnManagement,
    //form表单bind数据
        formValidate: {
        },

        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
            type:'edit',
            successTitle:'修改成功',
            errorTitle:'修改失败',
            ajaxSuccess:'ajaxSuccess',
            ajaxParams:{
              url:this.url.moduleModify+this.operailityData.id,
              method:'put',
            }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.moduleGet+this.operailityData.id,
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
          let  formValidate = this.getFormData(this.formValidate);
          formValidate.isDisplay =  formValidate.isDisplay+'';
          this.editMessTitle.ajaxParams.data = formValidate
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
          this.formValidate =responseData.data;
        this.isDisplayChange(this.formValidate.isDisplay)
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
      //是否显示修改
      isDisplayChange(val){
        if(val==0){
            if(this.formValidate.isHome){
              this.formValidate.isHome = 'NO';
            }
        }
      }
    }
  }
</script>
