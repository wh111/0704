<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules.myLeave" class="demo-form-inline"
             label-width="100px">
      <el-row>
        <el-col :span="6" :offset="2">
          <el-form-item label="姓名:">
            {{getUserData.name}}
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="现所在科室:" prop="podId">
            <el-select filterable v-model="formValidate.podId" placeholder="请选择">
              <el-option v-for="item in optionData" :key="item.id" :label="item.label"
                         :value="item.podId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="请假事由">
            <el-radio-group v-model="formValidate.leaveType">
              <el-radio :label="'SHI'">事假</el-radio>
              <el-radio :label="'BING'">病假</el-radio>
              <el-radio :label="'SANG'">丧假</el-radio>
              <el-radio :label="'CHAN'">产假</el-radio>
              <el-radio :label="'TAN'">探亲假</el-radio>
              <el-radio :label="'HUN'">婚假</el-radio>
              <el-radio :label="'OTHER'">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="13" :offset="2">
          <date-group :sDate="formValidate.beginDate" :eDate="formValidate.endDate" style="display:inline-block;">
            <el-form-item style="display: inline-block;" label="请假时间" prop="beginDate">
              <el-date-picker
                v-model="formValidate.beginDate"
                name="start"
                type="date"
                :editable="false"
                placeholder="选择日期"
                :picker-options="pickerOptions0"
                @change="handleStartTime"
              >
              </el-date-picker>
            </el-form-item>
            到
            <el-form-item style="display: inline-block;" label-width="0" prop="endDate">
              <el-date-picker
                v-model="formValidate.endDate"
                name="end"
                align="right"
                type="date"
                :editable="false"
                placeholder="选择日期"
                :picker-options="pickerOptions1"
                @change="handleEndTime">
              </el-date-picker>
            </el-form-item>
          </date-group>
        </el-col>
        <el-col :span="4" :offset="1">
          <p class="date">共<span class="countDate">{{length || 0}}</span>天</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="事由说明" prop="name">
            <el-input type="textarea" v-model="formValidate.explains" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import api from './api'

  let Util = null;
  export default {
    props: ['operailityData', 'rules'],
    data() {
      let userInfo = this.$store.getters.getUserInfo;
      return {
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        options: [{
          value: '10',
          label: '呼吸科'
        }, {
          value: '1',
          label: '审核通过'
        }, {
          value: '2',
          label: '未审核'
        }],
        getUserData: {},
        formValidate: {
          depId: '',
          applicantId: userInfo.id,
          leaveType: 'BING', //默认为事假
          beginDate: '',
          endDate: '',
          timeLength: '',
          explains: '',
          status: 'WSB',
          podId: '',
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: 'leave/add',
            method: 'post'
          }
        },
        userMessTitle: {
          ajaxSuccess: 'SuccessGetUser',
          ajaxParams: {
            url: api.basic.path + userInfo.id,
          }
        },
        userType: '',
        optionData: [],
        optionObj: {},
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '' //向后台请求数据的地址
          }
        },
        depMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'leave/get/' + this.operailityData.id, //向后台请求数据的地址
          }
        },
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: 'leave/modify/' + this.operailityData.id, //向后台请求数据的地址
            method: 'put'
          }
        },


      }
    },
    created() {
      let userInfo = this.$store.getters.getUserInfo;
      let userId = this.userId = userInfo.id;
      let userType = this.userType = userInfo.studentTypes;
      this.listMessTitle.ajaxParams.url = api.userRotaryDeptlistTree + userType + '-' + userInfo.id;
//      let getUser = {
//        'SXS': 'getSXS',
//        'BKS': 'getBKS',
//        'YJS': 'getYJS',
//        'ZYY': 'getZYY',
//        'JXS': 'getJXS',
//      }
//      let url = api[getUser[userType] || 'basic'].path;
//      this.userMessTitle.ajaxParams.url = url + userId;
//            this.ajax(this.userMessTitle)
//            this.ajax(this.listMessTitle)
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {//判断日期
      handleStartTime(val) {
        var todayDate = new Date();
        var m = [];
        m[2] = todayDate.getDate();
        m[1] = todayDate.getMonth() + 1;
        m[0] = todayDate.getYear() + 1900;
        if (m[1] < 10) {
          m[1] = "0" + m[1];
        }
        if (m[2] < 10) {
          m[2] = "0" + m[2];
        }
        if (val) {
          if (Number(val.split('-').toString().replace(/,/g, '')) < Number(m.toString().replace(/,/g, ''))) {
            this.formValidate.beginDate = '';
          }
        }

      },
      handleEndTime(val) {
        let formValidate = this.formDate(this.getFormData(this.formValidate), ['beginDate', 'endDate'], this.yearMonthData);
        if (val && this.formValidate.beginDate) {
          if (Number(val.replace(/\-/g, '')) < Number(formValidate.beginDate.replace(/\-/g, ''))) {
            this.formValidate.endDate = '';
            return false;
          }
        }
      },
      //获取科室成功
      updateListData(res) {
        let data = res.data;
        if (!data) return;
        let obj = {};
        let depObj = {};//depId对应着podId
        data = this.getQTBObj(res.data);
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.arrangeDepState == 'P') {
            data.splice(i, 1);
            i--;
          } else {
            obj[item.podId] = item;
            depObj[item.depId] = item.podId;
          }
        }
        console.log(data);
        this.depObj = depObj
        this.optionObj = obj;
        this.optionData = data
      },

      // 处理科室数据结构（三级以下）
      getQTBObj(arr, res, depth = -1) {
        depth++;
        let t = res || [];
        if (arr && arr.length) {
          arr.map(item => {
            item.label = '　'.repeat(depth) + item.depName + '(' + (item.beginTime || '') + ')';
            t.push(item);
            if (item.childList) {
              return t.concat(this.getQTBObj(item.childList, t, depth))
            }
          })
        }
        return t
      },

      //获取人员
      SuccessGetUser(res) {
        this.getUserData = res.data || {}
      },
      /*
      * 点击提交按钮 监听是否提交数据
      * @param isLoadingFun boolean  form表单验证是否通过
      * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let formValidate = this.formDate(this.getFormData(this.formValidate), ['beginDate', 'endDate'], this.yearMonthData);
          if (this.optionObj[formValidate.podId]) {
            formValidate.depId = this.optionObj[formValidate.podId].depId;//通过podId获取depId
          }
          this.editMessTitle.ajaxParams.data = formValidate;
          this.ajax(this.editMessTitle, isLoadingFun)
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
        //responseData.data.podId = responseData.data.depId;
        // responseData.data.depId = '';
        let data = responseData.data;
        data.endDate = this.parseDate(data.endDate);
        data.beginDate = this.parseDate(data.beginDate);
        this.formValidate = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'edit');
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
        Util = this.$util;
        this.ajax(this.listMessTitle);
        this.ajax(this.userMessTitle);
        this.ajax(this.depMessTitle);
        // 设置可选择时间区间
        this.initStartEndTime(new Date())
      },
    },
    computed: {
      //计算总共多少天
      length() {
        if (!this.formValidate.endDate || !this.formValidate.beginDate) return 0;
        let length = this.formValidate.timeLength = ~~((this.deformatterDate(this.formValidate.endDate) - this.deformatterDate(this.formValidate.beginDate)) / 86400000 + 1);
        return length
      }

    }

  }
</script>
