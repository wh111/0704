<template>


  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules.roomMess"  class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="大楼名称:" prop="buildId" >
            <el-select
              v-model.number="formValidate.buildId"
              placeholder="选择或输入匹配搜索">
              <select-option :unAll="true" :type="'allBuild'"></select-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="房间类别:" prop="sex" >
            <el-select v-model="formValidate.sex" placeholder="请选择活动区域">
              <el-option label="男宿舍" value="BOY"></el-option>
              <el-option label="女宿舍" value="GIRL"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="房间号:" prop="no" >
            <el-input v-model.number="formValidate.no"  min="0" type="number" placeholder="请输入" @blur="no"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="床位数:" prop="bedNum" >
            <el-input v-model.number="formValidate.bedNum"  min="0" type="number" placeholder="请输入" @blur="bedNum"></el-input>
          </el-form-item>
        </el-col>
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
          buildId:'',
          sex:'',        //房间性别
          no:'',          //房间编号
          bedNum:'',       //床位数
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
            url:this.url.roomModify+this.operailityData.id,
            method:'put',
            data:{}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.roomGet+this.operailityData.id,
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
        data.sex = data.sex.toUpperCase();
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

      no(){
        let val = Math.abs(parseInt(this.formValidate.no));
        if(typeof val !='number'||val!=val||!val){
          this.formValidate.no = 1;
          return
        }
        this.formValidate.no =val;
      },
      bedNum(){
        let val =Math.abs(parseInt(this.formValidate.bedNum)) ;
        if(typeof val !='number'||val!=val ||!val){
          this.formValidate.bedNum = 1;
          return
        }
        this.formValidate.bedNum =val;
      }
    }
  }
</script>
<style>
  .date{
    line-height: 25px;
  }
  .date .countDate{
    display: inline-block;
    width:70px;
    text-align: center;
    border-bottom: 1px solid;
  }
</style>
