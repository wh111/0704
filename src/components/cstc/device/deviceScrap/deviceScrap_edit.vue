<template>
  <!-- 修改报废记录 -->
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" label-width="124px" :rules="rules">
      <el-row>

        <el-col :span="8" :offset="2">
          <el-form-item label="设备名称：" required>
            <!--<el-select v-model="selectIndex" filterable placeholder="请选择" @change="selectDeviceTypeId">
              <el-option v-for="(item,index) in selectObj" :key="index" :label="item.deviceTypeName" :value="index">
              </el-option>
            </el-select>-->
            {{ formValidate.deviceTypeName }}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="设备编号：" required>
            <!--<template v-if="selectObj[selectIndex]">
              <el-select v-model="selectTypeIndex" filterable placeholder="请选择" @change="selectDeviceId">
                <el-option v-for="(item,cIndex) in selectObj[selectIndex].deviceList" :key="item.value" :label="item.deviceIdentifier" :value="cIndex">
                </el-option>
              </el-select>
            </template>
            <p v-else style="line-height:40px;">请先选择设备</p>-->
            {{ formValidate.deviceIdentifier }}
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
      id: {
        type: [Number, String],
        required: true
      },
      urlParams: { // 编辑
        type: Object,
        required: true
      },
      getUrlParams: { // 获取房间信息
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
          // "id": "1",
          deviceId: "",
          deviceTypeId: "",
          deviceTypeName: "",
          deviceIdentifier: "",
          scrapTime: "",
          scrapReason: "",
          handleWay: ""
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.urlParams.path + '/' + this.id,
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
          // if (!(this.selectObj[this.selectIndex].deviceList && this.selectObj[this.selectIndex].deviceList[this.selectTypeIndex])) {
          //   this.errorMess('所选的设备编号与设备不对应，请重新选择');
          //   return
          // }
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.editMessTitle.ajaxParams.data;
          // let selectData = this.selectObj[this.selectIndex].deviceList[this.selectTypeIndex];
          // data.deviceId = selectData.id;
          data.scrapTime = this.conductDate(data.scrapTime, 'yyyy-MM-dd HH:mm:ss');
          // data.deviceTypeId = selectData.deviceTypeId;
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
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer() {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: `${this.getUrlParams.path}/${this.id}`,
            method: this.getUrlParams.method
          }
        })
      },
      getDataSuccess(res) {
        this.formValidate = res.data // 初始化编辑数据
        // this.getSelectDataIndex();
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
              depId: this.depId
            }
          }
        });
      },
      /**
       * 初始化选择列表
       * */
      getSelectDataSuccess(res) {
        this.selectObj = res.data;
        this.getDataForServer()
      },
      // 初始化选择
      getSelectDataIndex() {
        let did = this.formValidate.deviceId; // 设备id
        let dtid = this.formValidate.deviceTypeId; // 设备类型id
        this.selectObj.map((item, index) => {
          if (item.id === dtid) {
            this.selectIndex = index;
            item.deviceList.map((cItem, cIndex) => {
              if (cItem.id === did) {
                this.selectTypeIndex = cIndex;
                console.log(this.selectIndex, this.selectTypeIndex);
                return;
              }
            })
          }
        })
        // for (var item in this.selectObj) {
        //   if (this.selectObj[item].id === dtid) {
        //     this.selectTypeIndex = (+item);
        //     for (var cItem in this.selectObj[item].deviceList) {
        //       if (this.selectObj[item].deviceList[cItem].id === did) {
        //         this.selectIndex = (+cItem);
        //         return;
        //       }
        //     }
        //   }
        // }
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
        this.getDataForServer()
        // this.getSelectData()
      }
    }
  }

</script>

<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
