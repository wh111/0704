<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="queryAssessment" class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="姓名:" prop="name" >
            <span>{{formValidate.name}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="性别:" prop="sex">
              {{formValidate.sex | typeText}}
          </el-form-item>
        </el-col >
        <el-col :offset="2">
          <el-form-item label="电话:" prop="phone" >
            <span>{{formValidate.phone}}</span>
          </el-form-item>
        </el-col>
        <el-col :offset="2">
          <el-form-item label="bia:" prop="studentId">
            <span>{{formValidate.studentId}}</span>
          </el-form-item>
        </el-col >



        <el-col :span="8" :offset="2">
          <el-form-item label="考核成绩:" prop="score">
            <el-input v-model="formValidate.score"></el-input>
          </el-form-item>
        </el-col >

        <el-col :span="16" :offset="2">
          <el-form-item label="考核结果:" prop="conclusion">
            <el-radio-group v-model="formValidate.conclusion">
              <el-radio label="1" >优</el-radio>
              <el-radio label="2" >良</el-radio>
              <el-radio label="3" >中</el-radio>
              <el-radio label="4" >差</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col >

      </el-row >

      <el-row >
          <el-col :span="6" :offset="6" align="center">
            <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          </el-col>
          <el-col :span="6" align="center">
            <el-button @click="cancel">取消</el-button>
          </el-col>
      </el-row >
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api'
  //当前组件引入全局的util
  let Util = null;
  //注入组件输入的规则
  import { queryAssessment } from '../rules';
  export default {
    props: ['operailityData'],
    data() {
      return {
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        formValidate: {
          "id":"",
          "score":"",
          "conclusion":"1",
          "userId":"",
          "name":"",
          "studentId":"",
          "boundary":"",
          "phone":"",
          "specialtyCode":"",
          "specialtyName":"",
          "createTime":"",
          "sex":''
        },
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.examinationAdd.path,
            method: api.examinationAdd.method
          }
        },
        queryAssessment
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.formValidate = this.operailityData;
        console.log(this.formValidate)
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
//          if(this.formValidate.conclusion = '优'){
//            this.formValidate.conclusion = 1;
//          }else if(this.formValidate.conclusion = '良'){
//            this.formValidate.conclusion = 2;
//          }else if(this.formValidate.conclusion = '中'){
//            this.formValidate.conclusion = 3;
//          }else if(this.formValidate.conclusion = '差'){
//            this.formValidate.conclusion = 4;
//          };
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = {
              userId:this.formValidate.userId,
              userName:this.formValidate.name,
              score:this.formValidate.score,
              conclusion:this.formValidate.conclusion
            }
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
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 取消当前弹窗
       * */
      resetForm() {
        // this.$emit('cancel', this.addMessTitle.type);
        this.$refs[formName].resetFields()
      },
      cancel (){
        this.$emit('cancel','add');
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    },
    mounted () {

    },
    components: {}
  }
</script>
