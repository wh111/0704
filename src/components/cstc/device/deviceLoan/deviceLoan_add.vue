<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="100px">
      <el-row>

        <el-col :span="8" :offset="2">
          <el-form-item label="设备名称：" prop="deviceTypeId" required>
            <el-select v-model="selectIndex" filterable placeholder="请选择" @change="selectDeviceTypeId">
              <el-option v-for="(item,index) in selectObj" :key="index" :label="item.deviceTypeName" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="设备编号：" prop="deviceId" required>
            <template v-if="selectObj[selectIndex]">
              <el-select v-model="selectTypeIndex" filterable placeholder="请选择" @change="selectDeviceId">
                <el-option v-for="(item,cIndex) in selectObj[selectIndex].deviceList" :key="item.value" :label="item.deviceIdentifier" :value="cIndex">
                </el-option>
              </el-select>
            </template>
            <p v-else style="line-height:40px;">请先选择设备</p>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="借用人：" prop="borrower" required>
            <el-input v-model="formValidate.borrower"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="用途：" prop="purpose" required>
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入借用设备的用途" v-model="formValidate.purpose"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="配件：" prop="parts">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入配件" v-model="formValidate.parts"></el-input>
          </el-form-item>
        </el-col>

        <date-group :dateGroup="{text:'',startDate:formValidate.borrowTime,endDate:formValidate.returnTime}">
          <el-col :span="8" :offset="2" name="start">
            <el-form-item label="借出日期：" prop="borrowTime" required>
              <el-date-picker v-model="formValidate.borrowTime" :editable="false" type="datetime" placeholder="选择日期" :picker-options="pickerOptions0"
                @change="handleStartTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="2" name="end">
            <el-form-item label="归还日期：" prop="returnTime">
              <el-date-picker v-model="formValidate.returnTime" :editable="false" type="datetime" placeholder="选择日期" :picker-options="pickerOptions1"
                @change="handleEndTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </date-group>

        <el-col :span="18" :offset="2">
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="formValidate.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col :span="6" :offset="6" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="6" align="center">
        <el-button @click="resetForm('formValidate')">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  import {
    deviceLoan as rules
  } from '../../rules'; // 表单验证规则

  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      depId: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        rules,
        selectIndex: '', // 选中的设备名称索引
        selectTypeIndex: '', // 选中的设备类型索引
        selectObj: [], // 选择设备
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        countDate: 0,
        //form表单bind数据
        formValidate: {
          // depId: '', // 部门id
          deviceId: '', // 设备id （需要进行联动查询接口）
          deviceTypeId: '', // 设备编号id （无）
          borrower: '', // 借用人
          purpose: '', // 用途
          borrowTime: '', // 借出时间
          returnTime: '', // 归还时间
          parts: '', // 配件
          remark: '', // 备注
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method
          }
        },
        pickerOptions: {}
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
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
          if (!(this.selectObj[this.selectIndex].deviceList && this.selectObj[this.selectIndex].deviceList[this.selectTypeIndex])) {
            this.errorMess('所选的设备编号与设备不对应，请重新选择');
            return
          }
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.addMessTitle.ajaxParams.data;
          // let selectData = this.selectObj[this.selectIndex].deviceList[this.selectTypeIndex];
          // data.deviceId = selectData.id;
          // data.deviceTypeId = selectData.deviceTypeId;
          data.depId = this.depId;
          data.borrowTime = this.conductDate(data.borrowTime, 'yyyy-MM-dd HH:mm:ss');
          data.returnTime = this.conductDate(data.returnTime, 'yyyy-MM-dd HH:mm:ss');
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
       * 重置当前表单
       * */
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.selectIndex = ''; // 选中的设备名称索引
        this.selectTypeIndex = ''; // 选中的设备类型索引
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /**
       * 获取选择设备列表
       * */
      getSelectData() {
        this.ajax({
          ajaxSuccess: 'getSelectDataSuccess',
          ajaxParams: {
            url: api.select.path,
            method: api.select.method,
            params: {
//              depId: this.depId
              depId: -1
            }
          }
        });
      },
      /**
       * 初始化选择列表
       * */
      getSelectDataSuccess(res) {
        this.selectObj = res.data
      },
      // 设置设备编号id
      selectDeviceId(val) {
        if (this.selectObj[this.selectIndex].deviceList) {
          this.formValidate.deviceId = this.selectObj[this.selectIndex].deviceList[val].id
        } else {
          this.formValidate.deviceId = null
        }
      },
      // 设置设备id
      selectDeviceTypeId(val) {
        this.formValidate.deviceTypeId = this.selectObj[val] && this.selectObj[val].id
      },
      // 归还时间
      borrowTime(time) {
        let beginDateVal = this.formValidate.borrowTime;
        if (beginDateVal) {
          return time.getTime() < beginDateVal;
        }
        return true
      },
      /*
       * 组件初始化入口
       * */
      init() {
        this.getSelectData()
      }
    }
  }

</script>

<style lang="scss">
  .editForm {
    .el-date-editor.el-input {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
  }

</style>
