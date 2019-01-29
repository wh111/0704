<!----------------------------------
****--@name     值班费配置
****--@role     ${*}
****--@date     2018/1/19
****--@author   gx
----------------------------------->
<template>
  <div class="dutyFeeAll-root">
    值班费设置
    <el-form ref="form" :rules="rules" :model="form" label-width="130px">
      <el-form-item label="夜班" prop="night_shift_duty_fee">
        <el-input style="width: 100px" v-model="form.night_shift_duty_fee"></el-input>
        元/次
      </el-form-item>

      <el-form-item label="节假日" prop="holiday_season_duty_fee">
        <el-input style="width: 100px" v-model="form.holiday_season_duty_fee"></el-input>
        元/次
      </el-form-item>
      <el-form-item label="其他：" prop="other_duty_fee">
        <el-input style="width: 100px" v-model="form.other_duty_fee"></el-input>
        元/次
      </el-form-item>
      <!--<el-form-item label="时间：" prop="startDate" style="float: left;">-->
      <!--<el-date-picker v-model="form.startDate"-->
      <!--type="date"-->
      <!--:editable="false"-->
      <!--placeholder="选择日期"-->
      <!--:picker-options="pickerOptions0">-->
      <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <!--<span style="line-height: 35px;font-size: 16px;float: left;padding: 0 10px">到</span>-->

      <!--<el-form-item lable-width="0px" prop="endDate" style="float: left;margin-left: -125px">-->
      <!--<el-date-picker-->
      <!--v-model="form.endDate"-->
      <!--align="right"-->
      <!--type="date"-->
      <!--:editable="false"-->
      <!--placeholder="选择日期"-->

      <!--:picker-options="pickerOptions1">-->
      <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <el-form-item label="高温补贴时间：">
        <date-group :dateGroup="{text:'',startDate:form.startDate,endDate:form.endDate}">
          <el-date-picker name="start" v-model="form.startDate" :editable="false" type="date" placeholder="选择日期"
                          :picker-options="pickerOptions0"
                          @change="handleStartTime"></el-date-picker>
          <span>-</span>
          <el-date-picker name="end" v-model="form.endDate" :editable="false" type="date" placeholder="选择日期"
                          :picker-options="pickerOptions1"
                          @change="handleEndTime"></el-date-picker>
        </date-group>
      </el-form-item>
      <div style="clear: both"></div>
      <el-form-item label="高温补贴金额：" prop="high_temperature_allowance_fee">
        <el-input style="width: 100px" v-model="form.high_temperature_allowance_fee"></el-input>
        元
      </el-form-item>

    </el-form>
    <el-button class="sub" type="primary" @click="submit">{{ 'submit' | sysLan}}</el-button>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  import {makeQuestion as rules} from './rule'

  let Util = null;
  export default {
    data() {
      return {
        form: {
          night_shift_duty_fee: '',
          holiday_season_duty_fee: '',
          other_duty_fee: '',
          high_temperature_allowance_time: '',
          high_temperature_allowance_fee: '',
          startDate: '',
          endDate: ''
        },
        config: ['night_shift_duty_fee', 'holiday_season_duty_fee', 'other_duty_fee', 'high_temperature_allowance_time', 'high_temperature_allowance_fee',],
        formId: [],
        num: 1,
        rules,
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        for (var i = 0; i < this.config.length; i++) {
          this.ajax({
            ajaxSuccess: this.getNightSuccess(this.config[i]),
            ajaxParams: {
              //baseURL:'PUBLIC',
              url: '/rotaryConfig/getByKey/' + this.config[i] + '-ZYY',
              method: 'get',

            },
          })

        }

      },
      getNightSuccess(key) {
        return (res) => {

          if (key == 'night_shift_duty_fee') {
            this.form.night_shift_duty_fee = res.data.configValue;
            this.formId[0] = res.data.configId;
          } else if (key == 'holiday_season_duty_fee') {
            this.form.holiday_season_duty_fee = res.data.configValue;
            this.formId[1] = res.data.configId;
          } else if (key == 'other_duty_fee') {
            this.form.other_duty_fee = res.data.configValue;
            this.formId[2] = res.data.configId;
          } else if (key == 'high_temperature_allowance_fee') {
            this.form.high_temperature_allowance_fee = res.data.configValue;
            this.formId[3] = res.data.configId;
          } else if (key == 'high_temperature_allowance_time') {
            this.form.high_temperature_allowance_time = res.data.configValue;
            if (res.data.configValue) {
              this.form.startDate = res.data.configValue.split('@')[0]
              this.form.endDate = res.data.configValue.split('@')[1]
            }

            this.formId[4] = res.data.configId;
            console.log(res.data)
          }

        }
      },
      submit() {
        var id = '';
        for (var i = 0; i < this.config.length; i++) {
          if (this.config[i] == 'night_shift_duty_fee') {
            var m = this.form.night_shift_duty_fee;
            id = this.formId[0]
          } else if (this.config[i] == 'holiday_season_duty_fee') {
            var m = this.form.holiday_season_duty_fee;
            id = this.formId[1]
          } else if (this.config[i] == 'other_duty_fee') {
            var m = this.form.other_duty_fee;
            id = this.formId[2]
          } else if (this.config[i] == 'high_temperature_allowance_fee') {
            var m = this.form.high_temperature_allowance_fee;
            id = this.formId[3]
          } else if (this.config[i] == 'high_temperature_allowance_time') {
            //params.borrowerStartTime = this.conductDate(params.borrowerStartTime, 'yyyy-MM-dd');
            var m = this.conductDate(this.form.startDate, 'yyyy-MM-dd') + '@' + this.conductDate(this.form.endDate, 'yyyy-MM-dd');
            id = this.formId[4]
          }
          this.ajax({
            error: () => {
            },
            ajaxSuccess: this.setNightSuccess,
            ajaxParams: {
              //baseURL:'PUBLIC',
              url: '/rotaryConfig/modify/' + id,
              method: 'put',
              data: {
                configValue: m,
                remark: '',
              }
            },
          })

        }
      },
      setNightSuccess() {
        this.num++;
        if (this.num == 6) {

          this.$message.success('提交修改成功');
        }
      }

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }
</script>
<style lang="scss">
  .dutyFeeAll-root {
    .sub {
      color: #fff;
      margin-left: 130px;
    }
  }
</style>
