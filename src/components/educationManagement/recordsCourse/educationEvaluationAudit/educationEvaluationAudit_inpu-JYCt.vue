<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/9
****--@author   gx
----------------------------------->
<template>
  <div>
    <h1 align="center">进修生月度工作考核</h1>
    <table class="el-table oeawInputTable">
      <tbody>
      <tr>
        <td  align="center">
          <p class="cell">姓名</p>
        </td>
        <td colspan="2">
          <div class="cell">
            {{ formValidate.userName }}
          </div>
        </td>
        <td  align="center" colspan="2">
          <p class="cell">月份</p>
        </td>
        <td colspan="2">
          <div class="cell">
            {{ formValidate.reviewTime }}
          </div>
        </td>
        <td width="100" colspan="1">
          <p class="cell">轮转科室</p>
        </td>
        <td colspan="3">
          <div class="cell">
            {{ formValidate.depName }}
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" rowspan="2" >
          <p class="cell">劳动纪律</p>
        </td>
        <td align="center"  colspan="1">
          <p class="cell">迟到次数</p>
        </td>
        <td align="center"  colspan="1">
          <p class="cell">早退次数</p>
        </td>
        <td align="center"  colspan="2">
          <p class="cell">请假次数</p>
        </td>
        <td align="center"  colspan="2">
          <p class="cell">旷工次数</p>
        </td>
        <td align="center"  colspan="4">
          <p class="cell">其他违反纪律情况</p>
        </td>
      </tr>
      <tr>
        <td colspan="1">
          <div class="cell">
            {{ formValidate.lateArrivalTimes }}
          </div>
        </td>
        <td colspan="1">
          <div class="cell">
            {{ formValidate.leaveEarlyTimes }}
          </div>
        </td>
        <td colspan="2">
          <div class="cell">
            {{ formValidate.askLeaveDays }}
          </div>
        </td>
        <td colspan="2">
          <div class="cell">
            {{ formValidate.minerDays }}
          </div>
        </td>
        <td align="center"  colspan="4">
          <div class="cell">
            {{ formValidate.otherBreachDiscipline }}
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" rowspan="2">
          <p class="cell">医疗质量</p>
        </td>
        <td align="center"  colspan="2">
          <p class="cell">丙级病历</p>
        </td>
        <td align="center"  colspan="2">
          <p class="cell">不合格处方</p>
        </td>
        <td align="center"  colspan="2">
          <p class="cell">严重医疗差错</p>
        </td>
        <td align="center"  colspan="4">
          <p class="cell">医疗事故</p>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <div class="cell">
            {{ formValidate.classRecords }}
          </div>
        </td>
        <td colspan="2">
          <div class="cell">
            {{ formValidate.unqualifiedPrescription }}
          </div>
        </td>
        <td align="center"  colspan="2">
          <div class="cell">
            {{ formValidate.seriousMedicalErrors }}
          </div>
        </td>
        <td align="center"  colspan="4">
          <div class="cell">
            {{ formValidate.medicalAccident }}
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" rowspan="4" >
          <p class="cell">医德医风</p>
        </td>
        <td align="center"  colspan="3">
          <p class="cell">收受红包情况</p>
        </td>
        <td align="center"  colspan="3">
          <p class="cell">收受医药回扣情况</p>
        </td>
        <td align="center"  colspan="1">
          <p class="cell">病人投诉</p>
        </td>
        <td align="center"  colspan="3">
          <p class="cell">对待病人态度</p>
        </td>
      </tr>
      <tr>
        <td colspan="1">
          <p class="cell" align="center">无</p>
        </td>
        <td colspan="2" align="center">
          <p class="cell">有</p>
        </td>
        <td colspan="1">
          <p class="cell" align="center">无</p>
        </td>
        <td colspan="2" align="center">
          <p class="cell">有</p>
        </td>
        <td rowspan="3">
          {{ formValidate.patientComplaints }}
        </td>
        <td colspan="1">
          <p class="cell" align="center">好</p>
        </td>
        <td colspan="1">
          <p class="cell" align="center">中</p>
        </td>
        <td colspan="1">
          <p class="cell" align="center">差</p>
        </td>
      </tr>
      <tr>
        <td rowspan="2" colspan="1">
          <div class="cell" align="center">
            {{ formValidate.hasRedEnvelope === 'N' ? '✔' : '' }}
          </div>
        </td>
        <td colspan="1">
          <p class="cell" align="center">次数</p>
        </td>
        <td colspan="1">
          <p class="cell" align="center">金额</p>
        </td>
        <td rowspan="2" colspan="1">
          <div class="cell" align="center">
            {{ formValidate.hasRebate === 'N' ? '✔' : '' }}
          </div>
        </td>
        <td colspan="1">
          <p class="cell" align="center">次数</p>
        </td>
        <td colspan="1">
          <p class="cell" align="center">金额</p>
        </td>
        <td rowspan="2">
          <div class="cell" align="center">
            {{ formValidate.attitudeTowardPatient === 'GOOD' ? '✔' : '' }}
          </div>
        </td>
        <td rowspan="2">
          <div class="cell" align="center">
            {{ formValidate.attitudeTowardPatient === 'IN' ? '✔' : '' }}
          </div>
        </td>
        <td rowspan="2">
          <div class="cell" align="center">
            {{ formValidate.attitudeTowardPatient === 'BAD' ? '✔' : '' }}
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="1">
          <div class="cell">
            {{ formValidate.redEnvelopeCount }}
          </div>
        </td>
        <td colspan="1">
          <div class="cell">
            {{ formValidate.redEnvelopeAmount }}
          </div>
        </td>
        <td colspan="1">
          <div class="cell">
            {{ formValidate.rebateCount }}
          </div>
        </td>
        <td colspan="1">
          <div class="cell">
            {{ formValidate.rebateAmount }}
          </div>
        </td>
      </tr>
      <tr>
        <td align="center" rowspan="3" >
          <p class="cell">教研室评语</p>
        </td>
        <td rowspan="3" colspan="7" >
          <div class="cell">
            <el-input v-model="formValidate.comments" readonly type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            <p><span>教研室主任签字（盖章）：</span>
              <el-input v-model="formValidate.evaluationUserName" readonly style="width: 300px;"></el-input>
            </p>
          </div>
        </td>
        <td align="center" colspan="3" >
          <p class="cell">考核等级</p>
        </td>
      </tr>
      <tr>
        <td align="center" >
          <p class="cell">优</p>
        </td>
        <td align="center" >
          <p class="cell">良</p>
        </td>
        <td align="center" >
          <p class="cell">差</p>
        </td>
      </tr>
      <tr>
        <td >
          <div class="cell" align="center">
            {{ formValidate.inspectionLevel === 'OPTIMAL' ? '✔' : '' }}
          </div>
        </td>
        <td >
          <div class="cell" align="center">
            {{ formValidate.inspectionLevel === 'GOOD' ? '✔' : '' }}
          </div>
        </td>
        <td >
          <div class="cell" align="center">
            {{ formValidate.inspectionLevel === 'DIFF' ? '✔' : '' }}
          </div>
        </td>
      </tr>
      <tr>
        <td  align="center"  >
          <p class="cell">教育处评语</p>
        </td>
        <td  colspan="10" >
          <div class="cell" style="padding: 20px">

            <el-input v-model="formValidate.jycMess"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            <p><!--<span>教育处签字（盖章）：</span>-->
              <el-input  readonly style="width: 300px;"></el-input>
            </p>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <!-- 操作按钮 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="6" :offset="6" align="center">
        <load-btn @listenSaveEvent="listenSaveEvent" :btnData="saveBtn"></load-btn>
      </el-col>
      <el-col :span="6" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../educationEvaluationQuery/api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      operailityData: {
        type: Object,
        default: () => ({monthlyReviewId: ''})
      },
    },
    data() {
      return {
        hasRedEnvelope: '',
        hasRebate: '',
        depSelectOptions:{}, // 轮转
        formValidate: {
          monthlyReviewId: '',
          userName:'',
          reviewTime: '', // 考核时间
          podId: '', // 轮转ID
          depId: '', // 科室ID
          depName: '', // 科室名称
          lateArrivalTimes: '', // 迟到早退次数
          minerDays: '', // 旷工天数
          otherBreachDiscipline: '', // 其他违反纪律情况
          classRecords: '', // 丙级病历
          unqualifiedPrescription: '', // 不合格处方
          seriousMedicalErrors: '', // 严重医疗差错
          medicalAccident: '', // 医疗事故
          hasRedEnvelope: '', // 有无收受红包情况 N无|Y有
          redEnvelopeCount: '', // 收红包次数
          redEnvelopeAmount: '', // 收受红包金额
          hasRebate: '', // 是否收受医药回扣  N无|Y有
          rebateCount: '', // 收受医药回扣次数
          rebateAmount: '', // 收受医药回扣金额
          patientComplaints: '', // 病人投诉
          attitudeTowardPatient: '', // 对待病人态度 GOOD好|IN中|BAD差
          comments: '', // 评语
          inspectionLevel: 'OPTIMAL', // 考核等级 OPTIMAL优|OOD良|DIFF差
          evaluationUserName:'',
          leaveEarlyTimes:'',
          askLeaveDays:'',
          jycMess:'',  //教育处意见
        },
        //收受红包回扣信息
        ishasRedEnvelope: true,
        ishasRebate: true,
        //保存按钮基本信息
        saveBtn: {
          title: '保存',
          callParEvent: 'listenSaveEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        messTitle: {
          type: 'edit',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.review.path + this.operailityData.monthlyReviewId,
            method: api.review.method
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        //给当前组件注入全局util
        Util = this.$util;

        // 获取轮转科室列表
//        this.getDepSelectOptions()
        this.getEditData()
      },

      getEditData(){
        let opt = {
          ajaxSuccess:"getEditDataSuccess",
          ajaxParams:{
            url:api.get.path + this.operailityData.monthlyReviewId,
            method:api.get.method
          }
        };
        this.ajax(opt)
      },

      getEditDataSuccess(res){
        if(res.data instanceof Object){
          for(let key in this.formValidate){
            if(res.data[key] != null){
              this.formValidate[key] = res.data[key]
            }
          }
        }
      },

      // 获取轮转科室列表
      getDepSelectOptions(){
        let userInfo = this.$store.getters.getUserInfo;
        let identify = userInfo.roleList[0].identify;
        let hasDep = ['SXS','JXS','ZYY','YJS'].indexOf(identify) > -1;
        let opt = {
          ajaxSuccess: res => {
            let temp = {};
            res.data.map(item=>temp[item.depId] = item);
            this.depSelectOptions = temp;
            if (this.operailityData.monthlyReviewId) {
              // 获取编辑数据
              this.getEditData()
            }
          },
          ajaxParams:{
            url: '/rotationProcess/rotaryTable/myRotaryInfo',
            method: 'get',
            params:{
              userId: userInfo.id,
              userType: hasDep && userInfo.roleList[0].identify || '',
            }
          }
        }
        this.ajax(opt)
      },

      //验证表格内容
      checkData() {
        let flag = true;
        return flag;
        let data = {
          'reviewTime': '月份',
          'depName': '科室名称',
          'lateArrivalTimes': '迟到早退次数',
          'minerDays': '旷工次数',
//          'otherBreachDiscipline': '其他违反纪律情况',
          'classRecords': '丙级病历',
//          'unqualifiedPrescription': '不合格处方',
//          'seriousMedicalErrors': '严重医疗差错',
//          'medicalAccident': '医疗事故',
//          'patientComplaints': '病人投诉',
          'attitudeTowardPatient': '对待病人态度'
        };
        let num = {
          'lateArrivalTimes': '迟到早退次数',
          'minerDays': '旷工天数',
        };
//        let isTrue = {
//          'hasRedEnvelope':'有无收受红包情况',
//          'redEnvelopeCount':'收受红包次数',
//          'redEnvelopeAmount':'收受红包金额',
//          'hasRebate': '是否收受医药回扣',
//          'rebateCount':'收受医药回扣次数',
//          'rebateAmount':'收受医药回扣金额',
//        };

        for (let key in data) {
          if (this.formValidate[key] == '') {
            this.errorMess(`"${data[key]}"不能为空！`);
            return false
          }
        }
        for (let key in num) {
          if (isNaN(this.formValidate[key])) {
            this.errorMess(`“${num[key]}”必须为数字`);
            return false
          }
        }
        return flag;
      },
      /*
       * 保存
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSaveEvent(isLoadingFun) {
        let isSubmit = this.checkData();
        if (isSubmit) {
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          let params = this.messTitle.ajaxParams;
          params.data = this.getFormData(this.formValidate);
          this.ajax(this.messTitle, isLoadingFun)
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
      // 取消
      cancel() {
        this.$emit('cancel', this.messTitle.type)
      },
      // 日期格式化处理
      changeReviewTime(val){
        this.formValidate.reviewTime = val
      },
      // 更换科室
      changeDep(val){
        this.formValidate.podId = this.depSelectOptions[val].podId;
        this.formValidate.depName = this.depSelectOptions[val].depName;
      },
      // 清除输入框的值
      clearInputVal(ckeck,...keys){
        if(this.formValidate[ckeck] === 'Y'){
          keys.map(item=>this.formValidate[item]='')
        }
      },
      // 设置选框的值
      changeCheckBoxVal(key){
        this.formValidate[key] = 'Y'
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
    },
    watch: {}
  }

</script>

<style lang="scss">
  .oeawInputTable {
    margin-top: 20px;
    overflow: auto;
    border: none;
    &:before, &:after {
      height: 0;
    }
    tr, td {
      border: 1px solid #bfcbd9;
    }
    .el-input__inner, .el-textarea__inner {
      border: none;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    .jxTimeInput.el-date-editor.el-input {
      width: 130px;
    }
    .upFileBox {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
</style>

