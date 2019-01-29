<template>

  <div class="showWrapper">
    <el-form class="demo-form-inline" ref="formValidate" :model="formValidate" :rules="rules" label-width="100px">
      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名:" class="feildFontweight">
            {{data.name}}
          </el-form-item>
        </el-col>
        <el-col :span="10" >
          <el-form-item label="性别:" class="feildFontweight">
            {{operailityData.gender}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="电话号码:" class="feildFontweight">
            {{operailityData.phone}}
          </el-form-item>
        </el-col>

        <el-col :span="10" >
          <el-form-item label="邮箱:" class="feildFontweight">
            {{operailityData.email}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="专业:" class="feildFontweight">
            {{operailityData.major}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <img v-if="data.doctorCertificateUrl&&data.doctorCertificateUrl!=0" v-for="(item,index) in data.doctorCertificateUrl" :src="http+item" style="width: 200px;height:150px;margin: 5px">
          <img v-else  style="width: 200px;height:150px;margin: 5px">
        </el-col>
      </el-row >

      <br>
      <el-table
        v-if="data.reviewInfoList && data.reviewInfoList[0]"
        align="center"
        :height="200"
        :data="data.reviewInfoList"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createUserName"
          label="审核人"
          width="200">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="审核时间"
          width="300">
        </el-table-column>
        <el-table-column
          prop="reviewMess"
          label="审核意见"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="spState"
          label="审核状态"
        >
          <template scope="scope">
            {{ scope.row.spState | typeText}}
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="审核结果:" prop="disState" >
            <el-radio-group v-model="formValidate.state">
              <el-radio class="radio"  label="PASS">通过</el-radio>
              <el-radio class="radio"  label="NO_PASS">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="审核意见:" prop="mess">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.mess"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>
    <el-row >
      <el-col :span="24" style="text-align: center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  import {completionOfTheInspection as rules} from '../rules.js'
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        "data":{
//          "id":1,
//          "remark":"员工宿舍大楼"
        },

        formValidate:{
          state:'PASS',
          mess:'',
        },
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: this.url.getExamInfoByUserId.path + this.operailityData.userId,
          },
        },
        //当前组件提交(audit)数据时,ajax处理的 基础信息设置
        auditMessTitle: {
          type: 'audit',
          successTitle: '审核成功',
          errorTitle: '审核失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: this.url.modifyOneState.path + this.operailityData.userId,
            method: 'put',
            data: {}
          }
        },
        http:'/server',
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      let env = this.$store.getters.getEnvPath;
      this.http = env['http'];
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
          this.auditMessTitle.ajaxParams.data = this.formValidate;
          this.ajax(this.auditMessTitle, isLoadingFun)
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
        this.data = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','audit');
      },

      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
