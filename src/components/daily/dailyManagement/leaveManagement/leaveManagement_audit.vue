<template>

  <div class="leaveManagement-show">
    <div>
      <el-form label-width="100px">
        <el-row>
          <el-col :span="6" :offset="2">
            <el-form-item label="姓名:">
              {{getUserData.name}}
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="性别:">
              {{getUserData.sex | typeText}}
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="学号:">
              {{getUserData.codeNumber}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2">
            <el-form-item label="年级:">
              {{getUserData.grade }}
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="移动电话:">
              {{getUserData.mobile}}
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="学院:">
              {{getUserData.schoolName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="2">
            <el-form-item label="专业:">
              {{getUserData.specialty}}
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item label="现实习单位:">
              安徽医科大学
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="科室:">
              {{data.depName}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="18" :offset="2">
          <p class="center"><span class="name">请假事由</span><span>{{converterLeaveType(data.leaveType)}}</span></p>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="18" :offset="2">
          <p class="center">
            <span class="name">请假时间</span>
            <span style="padding-right: 25px">
              {{data.beginDate}}到{{data.endDate}}
            </span>
            共<span class="border">{{data.timeLength}}</span>天
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <div class="center">
            <span class="shiy-text">事由说明</span>
            <div class="shiy">{{data.explains}}</div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--<div class="shxx">-->
    <div>
      <el-row style="margin: 10px 0">
        <el-col :span="18" :offset="2">
          <img :src="data.hisProcess.base64Img" alt="" style="max-width:100%">
        </el-col>
      </el-row>
      <!--审核历史-->
      <el-table
        v-if="data.hisProcess.listHisTaskLog && data.hisProcess.listHisTaskLog!=0"
        align="center"
        :height="200"
        :data="data.hisProcess.listHisTaskLog"
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
          prop="spUserName"
          label="审核人"
          width="200">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="审核时间"
          width="300">
        </el-table-column>
        <el-table-column
          prop="mess"
          label="审核意见"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="审核状态"
        >
          <template scope="scope">
            {{ scope.row.status }}
          </template>
        </el-table-column>
      </el-table>

      <el-form v-if="data.hisProcess.hasSp" :model="formValidate" ref="formValidate" :rules="rules.leaveManagement"
               label-width="80px">
        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="审核结果" prop="status">
              <el-radio-group v-model="formValidate.status">
                <el-radio v-for="(item,index) in data.hisProcess.commentTypes" :key="index" :label="item"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="18" :offset="2">
            <el-form-item label="审核意见" prop="content">
              <el-input type="textarea" v-model="formValidate.content" :rows="6" resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row v-if="data.hisProcess.hasSp">
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  let Util = null;
  import api from '../myLeave/api';
  import rules from '../rules.js';

  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        options: [{
          value: '0',
          label: '待审核'
        }, {
          value: '1',
          label: '审核通过'
        }, {
          value: '2',
          label: '未审核'
        }],
        getUserData: {},
        formValidate: {
          id: this.operailityData.id,
          status: '',
          content: '',
        },
        data:
          {
            "explains": "",
            "applicantName": "",
            "applicantId": "",
            "depName": "",
            "timeLength": "",
            "leaveType": "",
            "createTime": "",
            "depId": "",
            "id": '',
            "beginData": "",
            "endData": "",
            "fileList": [],
            "status": "WSB",
            auditInfo: '',
            hisProcess: {
              listHisTaskLog: [],
            },// 审核流程:
          }
        ,
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        auditMessTitle: {
          type: 'audit',
          successTitle: '审核成功',
          errorTitle: '审核失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: 'workflow/leaveComplete/',
            method: 'post',
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'leave/get/' + this.operailityData.id,
          }
        },
        //当前组件默认请求(Task)数据时,ajax处理的 基础信息设置(已办理事项）
        taskMessTitle: {
          ajaxSuccess: 'SuccessGetTask',
          ajaxParams: {
            url: 'workflow/gethistoryTask/' + this.operailityData.id,
          }
        },
        userMessTitle: {
          ajaxSuccess: 'SuccessGetUser',
          ajaxParams: {
            url: api.basic.path
          }
        },

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
        let data = responseData.data;
        if (data.hisProcess.commentTypes) {
          this.formValidate.status = data.hisProcess.commentTypes[0]
        } else {
          data.hisProcess.commentTypes = [];
        }
        this.data = data;
        this.userMessTitle.ajaxParams.url += data.applicantId;
        this.ajax(this.userMessTitle);
        this.auditMessTitle.ajaxParams.url += data.hisProcess.taskId;
      },


      SuccessGetTask(responseData) {

        this.data.tasks = responseData.data;
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
        myData.type = data.type.join(",");
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);

//        this.ajax(this.taskMessTitle);
      },

      //转换
      converterLeaveType(leaveType) {
        switch (leaveType) {
          case 'SHI' :
            leaveType = '事假';
            break;
          case 'BING' :
            leaveType = '病假';
            break;
          case 'SANG' :
            leaveType = '丧假';
            break;
          case 'CHAN' :
            leaveType = '产假';
            break;
          case 'TAN' :
            leaveType = '探亲假';
            break;
          case 'HUN' :
            leaveType = '婚假';
            break;
          case 'OTHER' :
            leaveType = '其他';
            break;

        }
        return leaveType
      },
      //转换请假条状态
      converterStatus(status) {
        switch (status) {
          case 'WSB' :
            status = '未上报';
            break;
          case 'DSH' :
            status = '审核中(待审)';
            break;
          case 'TG' :
            status = '通过';
            break;
          case 'BTG' :
            status = '不通过';
            break;
          case 'BH' :
            status = '驳回修改';
            break;
        }
        return status
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data, data1) {
        let arr = Array.prototype.slice.call(arguments).reverse();
        arr.unshift({})
        let myData = Util._.defaultsDeep.apply(null, arr);
        return myData;
      },
    }

  }
</script>
