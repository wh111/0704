<!--
****--结业申请
****--@date     2017/7/3
****--@author   gx
-->
<template>
  <div class="graduationAppraisalBox">
    <div class="graduationAppraisal">
      <h2 class="graduationAppraisalTitle">毕业实习总鉴定</h2>
      <div class="gaMain">
        <div class="gaSubject">{{ identify | projectText }}：
          <p>{{ showData.practiceSubject }}</p>
        </div>
        <div class="gaTimes">
          <div class="gaSumTime">共缺时间：<span>{{ showData.absenceDays ||0 }}</span>天</div>
          <div class="gaTimeItem">
            <p>其中病假<span>{{ showData.sickDays ||0 }}</span>天；</p>
            <p>其中事假<span>{{ showData.personalDays  ||0}}</span>天；</p>
            <p>其中旷实习<span>{{ showData.minerDays  ||0}}</span>天</p>
          </div>
        </div>
        <div class="gaContent">
          <p class="gacTitle">附件：</p>
          <div v-if="fileShow">
            <upload-file v-if="isWrite"  :uploadFiles="showData.fileList"  @setUploadFiles="expenseFileEvent"></upload-file>
            <upload-file v-else  :uploadFiles="showData.fileList" :show="true"></upload-file>
          </div>
          <!--<p class="gacSignature">本人签名：</p>-->
          <!--<p class="gacDay">-->
          <!--<span>年</span>-->
          <!--<span>月</span>-->
          <!--<span>日</span>-->
          <!--</p>-->
        </div>
        <div class="gaContent">
          <p class="gacTitle">自我鉴定：</p>
          <el-form v-if="isWrite" ref="formValidate" :model="showData" :rules="rules"  label-width="0">
            <el-form-item  prop="selfComment" >
              <el-input  type="textarea" :autosize="{ minRows: 4}" v-model="showData.selfComment"></el-input>

            </el-form-item>
          </el-form>
          <el-input v-else type="textarea" :autosize="{ minRows: 4}" readonly v-model="showData.selfComment"></el-input>
          <!--<p class="gacSignature">本人签名：</p>-->
          <!--<p class="gacDay">-->
            <!--<span>年</span>-->
            <!--<span>月</span>-->
            <!--<span>日</span>-->
          <!--</p>-->
        </div>
        <div class="gaTimes" v-if="['EDU_NOT_REPORT','EDU_REPORT','NO_PASS'].includes(showData.state)">
          <div class="gaSubject">状态：
            <p>{{state(showData.state) }}</p>
          </div>
        </div>
      </div>
    </div>
    <el-row  v-if="isWrite" style="padding:20px 0;" >
      <el-col :span="6" :offset="6" align="center">
        <!--<load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>-->
        <el-button type="success" @click="save">保存</el-button>
      </el-col>
      <el-col :span="6" align="center">
        <el-button  type="info" @click="report">上报</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import {applicationOfCompletion as rules} from '../../rules'
  //当前组件引入全局的util
  let Util = null;
  import api from './api';
  export default {
    data() {
      return {
        rules,
        identify:"", // 用户角色
        isWrite:false,
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        fileShow:false,
        fileList:[],
        showData: {
          "practiceSubject": "-",
          "absenceDays": '-',
          "sickDays": '-',
          "personalDays": '-',
          "minerDays": '-',
          "selfComment": "",
          fileList:[],
          fileIds:'',
          state:'',
        },
        czType:'',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.identify = this.$store.state.userInfo.studentTypes;
        this.getInfo();
      },
      // 获取结业资料
      getInfo() {
        this.fileShow = false;
        this.ajax({
          ajaxSuccess: res => {
            // res.data = {
            //   "appraisalId": 123,
            //   "practiceSubject": "实习科目",
            //   "absenceDays": 123,
            //   "sickDays": 1,
            //   "personalDays": 12,
            //   "minerDays": 123,
            //   "selfComment": "自我鉴定",
            //   "fileList": [{
            //     "id": 1,
            //     "fileName": "123",
            //     "fileType": "txt",
            //     "fileUrl": "www.baidu.com"
            //   }]
            // };
            if(!res.data||res.data==0){
              this.showMess('当前登录人无结业鉴定');
              return;
            }
            if(['EDU_NOT_REPORT','EDU_REPORT'].includes(res.data.state)){
              this.isWrite = false;
            }else {
              this.isWrite = true;
            }
            this.fileShow = true;
            this.showData = res.data;
          },
          ajaxParams: {
            url: api.userGet.path
          }
        })
      },


      //保存
      save(){
        this.czType = 'BC';
        this.listenSubEvent()

      },


      //上报
      report(){
        this.czType = 'SB';
        this.listenSubEvent();
      },

      // 保存
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if(!isSubmit)return;
        if (!this.showData.appraisalId) {
          return
        }
        this.ajax({
          successTitle: '提交成功!',
          errorTitle: '提交失败!',
          ajaxSuccess: () => this.getInfo(),
          ajaxError: 'ajaxError',
          ajaxParams: {
            url:!this.showData.selfComment? api.userSubmit.path+this.showData.appraisalId :api.userAdd.path + this.showData.appraisalId,
            method: api.userAdd.method,
            data: {
              comment: this.showData.selfComment,
              czType: this.czType,
              fileIds: this.showData.fileIds,
          }
          }
        }, isLoadingFun)
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

      expenseFileEvent(ids){
        this.showData.fileIds = ids;
      },

      state(type){
        let obj = {
          'USER_NOT_REPORT':'未上报',
          'EDU_NOT_REPORT':'待审核',
          'EDU_REPORT':'通过',
          'NO_PASS':'未通过',
        }
        return obj[type]||type;
      },
    },
    created() {
      this.init();
    },
    mounted() {},
    components: {},
    filters:{
      projectText(val){
        let text = {
          SXS:"实习专业",
          JXS:"进修科目",
          ZYY:"培训方向",
          YJS:"培训方向",
        }
        return text[val] || '科目'
      },
    },
  }

</script>

<style lang="scss">
  @import'../../../../assets/ambuf/css/graduationAppraisal_v1.0/content';

</style>
