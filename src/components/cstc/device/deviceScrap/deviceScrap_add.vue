<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" label-width="124px" :rules="rules">
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
          <el-form-item label="报废时间：" prop="scrapTime" required>
            <el-date-picker v-model="formValidate.scrapTime" :editable="false" type="datetime" placeholder="选择报废日期">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="报废原因：" prop="scrapReason">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入报废原因" v-model="formValidate.scrapReason"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="处理方式：" prop="handleWay">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入处理方式" v-model="formValidate.handleWay"></el-input>
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
  import selectDeviceApi from '../api'; // 选择设备API
  import {
    deviceScrap as rules
  } from '../../rules'; // 表单验证规则
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      urlParams: { // api对象
        type: Object,
        required: true
      },
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
          deviceTypeId: '',
          scrapReason: '', // 报废原因
          scrapTime: '', // 报废时间
          handleWay: '', // 处理方式
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.urlParams.path,
            method: this.urlParams.method
          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      this.init()
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
          data.scrapTime = this.conductDate(data.scrapTime, 'yyyy-MM-dd HH:mm:ss');
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
            url: selectDeviceApi.select.path,
            method: selectDeviceApi.select.method,
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
        this.formValidate.deviceTypeId = this.selectObj[val].id
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
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
