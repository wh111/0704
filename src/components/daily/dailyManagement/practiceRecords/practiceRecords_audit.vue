<template>

  <div class="leaveManagement-show practiceRecords-view view">
    <p class="headline">{{ hospitalName }}奖惩记录登记表</p>
    <el-row>
      <el-col :span="9" :offset="2">
        <p class="center"><span class="name">姓名:</span><span>{{data.userName}}</span></p>
      </el-col>
      <el-col :span="9">
        <p class="center"><span class="name">科室:</span><span>{{data.deptName}}</span></p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="9" :offset="2">
        <p class="center">
          <span class="name">发生时间:</span>
          <span>{{data.occurrenceTime}}</span>
        </p>
      </el-col>
      <el-col :span="9">
        <p class="center">
          <span class="name">奖惩类型:</span> {{data.rewardAndPunishmentType==1? '惩罚' : '奖励'}}
        </p>
      </el-col>
    </el-row>

    <el-row class="division">
      <el-col :span="18" :offset="2">
        <div class="center">
          <span class="shiy-text">事项描述:</span>
          <div class="shiy">{{data.rewardAndPunishmentDescribe}}</div>
        </div>
      </el-col>
    </el-row>

    <el-form ref="formValidate" :rules="rules" :model="formValidate" class="demo-form-inline" label-width="90px">
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="教育处意见:" prop="opinion">
            <el-input v-model="formValidate.opinion" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="处理办法:" prop="treatmentMethod">
            <el-input v-model="formValidate.treatmentMethod" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>



      <el-row class="lose-margin2">
        <el-col :span="18" :offset="2">
          <el-form-item label="审核结果:">
            <el-radio-group v-model="formValidate.rewardAndPunishmentStatus">
              <el-radio :label="'TG'">通过</el-radio>
              <el-radio :label="'BTG'">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="lose-margin2">
        <el-col :span="18" :offset="2">
          <el-form-item label="审核意见:" prop="approvalOpinion">
            <el-input v-model="formValidate.approvalOpinion" type="textarea" :rows="6" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  //当前组件引入全局的util
  import {practiceRecords as rules} from '../rules'

  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        hospitalName: this.$store.state.envPath.hospitalName,
        //提交的表单
        formValidate: {
          id: '2', //id
          rewardAndPunishmentStatus: 'TG', //奖惩记录状态
          opinion: '', //教育处意见
          treatmentMethod: '', //处理办法
          approvalOpinion: '' //审批意见
        },
        //获取的数据
        "data": {
          "id": '',
          "userId": "",
          "depId": "",
          "deptName": "",
          "rewardAndPunishmentType": "",
          "rewardAndPunishmentDescribe": "",
          "opinion": "",
          "treatmentMethod": "",
          "rewardAndPunishmentStatus": "",
          "approvalOpinion": "",
          "fileList": []
        },
        //保存按钮基本信息
        loadBtn: {
          title: '通过',
          callParEvent: 'listenSubEvent'
        },
        show: {},
        radio: '',

        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        auditMessTitle: {
          type: 'audit',
          successTitle: '修改成功',
          errorTitle: '修改失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: 'rewardAndPunishment/modifyStatus/approval/' + this.operailityData.id,
            method: 'put',
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'rewardAndPunishment/get/' + this.operailityData.id,
          }
        }
      }
    },
    watch: {

    },
    computed: {
      countDate() {
        if (!this.show.beginTime) return
        let beginTime = this.show.beginTime;
        let endTime = this.show.endTime;
        beginTime = Date.parse(new Date(beginTime))
        endTime = Date.parse(new Date(endTime))
        if (endTime + 1 < beginTime) return;
        let time = endTime - beginTime;
        var time2 = time / 86400000 + 1;
        return time2
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {

        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.auditMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.auditMessTitle, isLoadingFun)
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
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        this.data = responseData.data;

      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'audit');
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
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },


      //从获取的Res中挑选出需要的名值对
      getFormValidate(data, res) {
        let length = arguments.length;
        var arr = Array.prototype.slice.call(arguments, 2);

        if (length < 2) return data
        var obj = {}
        this.$util._.forEach(data, function (val, key) {
          obj[key] = res[key] || '';
        })

        if (length >= 3) obj = this.getFormValidate.apply(this, [].concat(obj, arr));
        return obj

      }

    }


  }

</script>
<style rel="stylesheet/scss" lang="scss">
  .leaveManagement-show {
    font: 14px 'Microsoft YaHei ';
    .qjxx {
      padding: 30px 0 65px;
      margin-bottom: 84px;
    }
    .center {

      line-height: 50px;
    }

    .date {
      line-height: 25px;
    }
    .date .countDate {
      display: inline-block;
      width: 70px;
      text-align: center;
      border-bottom: 1px solid #E3E8EE;
    }
    .fieldset {
      margin-top: 50px;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
    }
    .fieldset-text {
      font-size: 16px;
      font-weight: bold;
      color: #373d41;
    }

    .name {
      width: 85px;
    }
    .border {
      display: inline-block;
      width: 40px;
      height: 25px;
      padding: 0 5px;
      text-align: center;
      border-bottom: 1px solid #373d41;
      line-height: 25px;
    }
    .shiy-text {
      float: left;
    }
    .shiy {
      padding: 5px;
      margin: 10px 0 0 85px;
      height: 200px;
      border: 1px solid #E3E8EE;
      line-height: 16px;
    }
    .step {
      margin-bottom: 30px;
    }
    .btn {
      text-align: right;
    }
    .shxx {
      padding: 30px 0 35px;
      margin-bottom: 40px;
    }
    .audit-wrap {}
  }

  .audit-wrap {

    .el-form-item__label {
      text-align: left;
      font: bold 18px 'Microsoft YaHei';
      color: #277dfe;
    }
    .el-form-item__content {
      line-height: 46px;
    }
    .number {
      padding: 0 10px 0 28px;
      font: 30px 'Microsoft YaHei';
      color: #ffba27;
    }
    .btn {
      margin-top: 30px;
    }
    .btn2 {
      font: 14px 'Microsoft YaHei';
    }
  }

</style>
