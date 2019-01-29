<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="roomUsageFrom" label-width="100px">

      <el-row>
        <el-col>
          <el-form-item label="已选择人员：" prop="roomId">
            {{name}}
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="面试时间：" prop="interviewTime">
            <el-date-picker v-model="formValidate.interviewTime" align="right" type="datetime" :editable="false"
                            placeholder="选择面试时间" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="面试地点：" prop="address">
            <el-input v-model="formValidate.address" type="textarea" :autosize="{ minRows: 1, maxRows: 6}"
                      placeholder="请填写面试地点"></el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="备注：" prop="remarks">
            <el-input v-model="formValidate.remarks" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </el-col>

        <el-col align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="resetForm('formValidate')">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import { arrangeInterviews as rules } from '../rules';
  import api                            from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      operailityData: {
        type: Array
      }
    },
    data () {
      return {
        rules,
        name: '',//用户名
        formValidate: {
          ids: '',//用户id
          interviewTime: '',//面试时间
          address: '',//面试地点
          remarks: ''//备注
        },
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < new Date().getTime();
          }
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.interview.path,
            method: api.interview.method
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let idArr = [];
        Util = this.$util;
        for (let i = 0; i < this.operailityData.length; i++) {
          this.name += this.operailityData[i].name;
          idArr.push(this.operailityData[i].id);
        }
        this.formValidate.ids = idArr.join(',');
        console.log(this.formValidate.ids);
      },
      //转换时间格式
      // handleStartTime(value) {
      //   this.formValidate.startTime = value;
      // },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          let data = Util._.defaultsDeep({}, this.formValidate);
          data.interviewTime = this.conductDate(data.interviewTime, 'yyyy-MM-dd HH:mm:ss');
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = data;
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /*
       * 重置当前表单
       * */
      resetForm (formName) {
        // this.$emit('cancel', this.addMessTitle.type);
        this.$refs[formName].resetFields();
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', this.addMessTitle.type);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };
</script>
