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
        <td align="center"  colspan="3">
          <p class="cell">迟到早退次数</p>
        </td>
        <td align="center"  colspan="3">
          <p class="cell">旷工次数</p>
        </td>
        <td align="center"  colspan="4">
          <p class="cell">其他违反纪律情况</p>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <div class="cell">
            {{ formValidate.lateArrivalTimes }}
          </div>
        </td>
        <td colspan="3">
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
          <p class="cell">评语</p>
        </td>
        <td rowspan="4" colspan="7" >
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
        <td rowspan="2">
          <div class="cell" align="center">
            {{ formValidate.inspectionLevel === 'GOOD' ? '✔' : '' }}
          </div>
        </td>
        <td rowspan="2">
          <div class="cell" align="center">
            {{ formValidate.inspectionLevel === 'IN' ? '✔' : '' }}
          </div>
        </td>
        <td rowspan="2">
          <div class="cell" align="center">
            {{ formValidate.inspectionLevel === 'BAD' ? '✔' : '' }}
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
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
          inspectionLevel: '', // 考核等级 GOOD好|IN中|BAD差
          evaluationUserName:'',
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        //给当前组件注入全局util
        Util = this.$util;

        // 获取轮转科室列表
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
    },
    created() {
      this.init();
    },
    mounted() {
    },
    filters:{
      attitudeTowardPatient(val){
        let opt = {
          GOOD:"好",
          IN:"中",
          BAD:"差"
        };
        return opt[val] || val
      }
    },
    components: {},
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

