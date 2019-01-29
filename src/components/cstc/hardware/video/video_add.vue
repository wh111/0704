<template>
  <div class="editForm">
    <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="110px">

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="品牌：" prop="brand">
            <el-select v-model="formValidate.brand" placeholder="请选择" @change="changeBrand">
              <el-option v-for="item in brand" v-if="item.value!==''" :key="item.value" :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2" v-if="formValidate.brand != 'MCU'">
          <el-form-item label="设备组ID：" prop="modelNum" v-if="formValidate.brand == 'MCU'">
            <el-input v-model="formValidate.modelNum" placeholder="请输入设备组ID"></el-input>
          </el-form-item>
          <el-form-item label="产品型号：" prop="modelNum" v-else>
            <el-input v-model="formValidate.modelNum" placeholder="请输入产品型号"></el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="设备名称：" prop="ip" v-if="formValidate.brand == 'MCU'">
              <el-input v-model="formValidate.ip" placeholder="请输入设备名称"></el-input>
            </el-form-item>
            <el-form-item label="设备IP：" prop="ip" v-else>
              <el-input v-model="formValidate.ip" placeholder="请输入IP地址"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2">
            <el-form-item prop="isConsole">
              <el-checkbox v-model="formValidate.isConsole" true-label="YES" false-label="NO">是否带有云平台</el-checkbox>
            </el-form-item>
          </el-col>
        </el-col>

        <template v-if="formValidate.brand != 'MCU'">
          <el-col :span="8" :offset="2">
            <el-form-item label="登录名：" prop="loginName">
              <el-input v-model="formValidate.loginName" placeholder="请输入云平台登录名"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2">
            <el-form-item label="登录密码：" prop="password">
              <el-input v-model="formValidate.password" placeholder="请输入云平台登录密码"></el-input>
            </el-form-item>
          </el-col>
        </template>

        <el-col :span="8" :offset="2">
          <!--<el-form-item label="所在域编号：" prop="nvrIp" v-if="formValidate.brand == 'MCU'">-->
            <!--<el-input v-model="formValidate.nvrIp" placeholder="所在域编号"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="所在NVR：" prop="nvrIp" v-if="formValidate.brand != 'MCU'">
            <el-input v-model="formValidate.nvrIp" placeholder="请输入所在NVR"></el-input>
          </el-form-item>
        </el-col>

        <!--<el-col :span="8" :offset="2">-->
          <!--<el-form-item label="所用通道：" prop="port">-->
            <!--<el-input v-model="formValidate.port" placeholder="请输入所用通道"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->

        <!-- <el-col :span="3" :offset="1">
          <el-button @click="testService">连接测试</el-button>
        </el-col> -->

        <el-col>
          <el-col :span="8" :offset="2">
            <el-form-item label="设备位置：" prop="locationType">
              <el-radio class="radio" v-model="formValidate.locationType" :label="item.value" v-if="item.value !== ''"
                        v-for="item in locationType" :key="item.value">{{ item.label }}
              </el-radio>
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2" v-if="formValidate.locationType === 'ROOM'">
            <el-form-item label="房间号：" prop="roomId" required>
              <el-select v-model="selectRoomId" placeholder="请选择">
                <el-option v-for="item in roomSelectList" :key="item.id" :value="item.id"
                           :label="item.roomNum"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2" v-if="formValidate.locationType === 'OTHER'">
            <el-form-item label="" prop="orther" labelWidth="0">
              <el-input v-model="formValidate.orther" :maxlength="25" placeholder="请输入所在位置"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="18" :offset="2">
          <el-form-item label="设备简介：" prop="describes">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="formValidate.describes"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <el-row>
      <el-col :span="4" :offset="8" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="4" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;

  import {
    video as rules
  } from '../../rules';

  import api from './api';
  import brand from './brand'; // 品牌
  import locationType from '../locationType'; // 所在位置

  export default {
    data() {
      return {
        rules,
        brand,
        locationType,
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //form表单bind数据
        formValidate: {
          brand: '', // 品牌
          modelNum: '', // 产品型号
          ip: '', // 设备ip
          isConsole: 'YES', // 是否有云台
          loginName: '', // 登录名
          password: '', // 密码
          nvrIp: '', // 所在nvrIp
          port: '', //通道号
          locationType: 'ROOM', //所在位置
          roomId: '', // 房间id
          roomNum: '', // 房间号
          orther: '', // 其他
          describes: '', // 简介
        },
        // 房间列表
        roomSelectList: {},
        selectRoomId: '',
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
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        selectRoomMessTitle: {
          errorTitle: '获取房间失败!',
          ajaxSuccess: 'successGetRoomData',
          ajaxParams: {
            url: api.roomList.path,
            method: api.roomList.method,
            params: {}
          }
        }
      }
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate") && this.checkData();
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      changeBrand(val) {
        if (val == 'MCU') {
          this.rules.ip = {
            required: true,
            message: '此项不能为空',
          }
        } else {
          this.rules.ip = [{
            required: true,
            message: '此项不能为空',
          }, function (rule, value, callback) {
            //检验位的检测
            // 0.0.0.0 - 255.255.255.255
            if (!(/^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/.test(value))) {
              callback(new Error('IP地址不正确'));
            }
            callback();
          }]
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
      // 检测数据是否合法
      checkData() {
        let data = this.formValidate;
        let selRoom = this.selectRoomId;
        if (data.locationType === 'ROOM') {
          if (!this.selectRoomId) {
            this.errorMess('必选选择房间')
            return false
          } else {
            data.roomId = selRoom;
            data.roomNum = this.roomSelectList[selRoom].roomNum;
          }
        }
        return true
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
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
       * 获取选择的房间
       * */
      successGetRoomData(res) {
        let obj = {};
        (res.data || []).map(item => obj[item.id] = item);
        this.roomSelectList = obj
      },
      /**
       * 连接测试
       */
      testService() {
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //console.log(this.selectRoomMessTitle)
        this.ajax(this.selectRoomMessTitle);
      },
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    },
    mounted() {
      //暂时没有初始化,预留初始化入口
    },
  }

</script>
<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
