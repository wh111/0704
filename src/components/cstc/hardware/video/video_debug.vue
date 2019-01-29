<template>
  <div class="editForm">
    <p style="color: #FF0000" v-if="formValidate.brand=='DAHUA'">注：登录前请您确认是否安装插件。下载：
      <!--<el-button @click="downLoad" type="text">海康插件下载</el-button>-->
      <el-button type="text">大华插件下载</el-button>
    </p>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="110px">

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="品牌：" prop="brand">
            <el-select v-model="formValidate.brand" placeholder="请选择" @change="brandChange">
              <el-option v-for="item in brand" v-if="item.value!==''" :key="item.value" :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2" v-if="formValidate.brand != 'MCU'">
          <el-form-item label="设备名称：" prop="modelNum" v-if="formValidate.brand == 'MCU'">
            <el-input v-model="formValidate.modelNum" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item label="产品型号：" prop="modelNum" v-else>
            <el-input v-model="formValidate.modelNum" placeholder="请输入产品型号"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="设备PUID：" prop="ip" v-if="formValidate.brand == 'MCU'">
            <el-input v-model="formValidate.ip" placeholder="请输入设备PUID"></el-input>
          </el-form-item>
          <el-form-item label="设备IP：" prop="ip" v-else>
            <el-input v-model="formValidate.ip" placeholder="请输入IP地址"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item prop="isConsole" style="height: 37.5px;">
            <el-checkbox v-model="formValidate.isConsole" true-label="YES" false-label="NO">是否带有云平台</el-checkbox>
          </el-form-item>
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
          <el-form-item label="所在NVR：" prop="nvrIp" v-if="formValidate.brand !== 'MCU'">
            <el-input v-model="formValidate.nvrIp" placeholder="请输入所在NVR"></el-input>
          </el-form-item>
        </el-col>

        <!--<el-col :span="8" :offset="2">-->
        <!--<el-form-item label="所用通道：" prop="port">-->
        <!--<el-input v-model="formValidate.port" placeholder="请输入所用通道"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->

        <el-col :span="3" :offset="7">
          <el-button @click="loginService">登录</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!--<hk-video v-if="isShowVideo&&formValidate.brand==='HIKVISION'" width="500" height="360" :count="count"-->
    <!--:isShowRight="formValidate.isConsole=='YES'?true:false" :ip="formValidate.ip" :port="formValidate.port"-->
    <!--:nvrIp="formValidate.nvrIp" :loginName="formValidate.loginName"-->
    <!--:password="formValidate.password"></hk-video>-->
    <!--<videojsLive v-if="isShowVideo&&formValidate.brand==='DAHUA'" liveUrl="http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8" ></videojsLive>-->

    <hk-video v-if="isShowVideo&&formValidate.brand==='HIKVISION'" :configData="formValidate"
              :showConsole="formValidate.isConsole == 'YES'" :count="count" :onlyPlayer="formValidate.isConsole == 'YES'"></hk-video>
    <mcu-video v-if="isShowVideo&&formValidate.brand==='MCU'" :configData="formValidate"
               :showConsole="formValidate.isConsole == 'YES'" :count="count" :onlyPlayer="formValidate.isConsole == 'YES'"></mcu-video>

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
  import videojsLive from '../../../common/videojsLive.vue';//直播列表
  import {
    video as rules
  } from '../../rules';

  import brand from './brand'; // 品牌
  import api from './api';
  import hkVideo from './player/hikvision';
  import mcuVideo from './player/mcu';

  export default {
    props: ['operailityData'],
    data () {
      return {
        rules,
        brand,
        //保存按钮基本信息
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        // rtsp://admin:admin12345@192.168.1.2:554/h264/ch1/main/av_stream
        //form表单bind数据
        formValidate: {
//          brand: 'HIKVISION', // 品牌
//          modelNum: 'HIKVISION', // 产品型号
//          ip: '192.168.1.2', // 设备ip
//          isConsole: 'YES', // 是否有云台
//          loginName: 'admin', // 登录名
//          password: 'admin12345', // 密码
//          nvrIp: '192.168.1.64', // 所在nvrIp
//          port: '80', //通道号
        },
        // 房间列表
        roomSelectList: [],
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'debugVideo',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
//          ajaxSuccess: 'saveSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modify.path + this.operailityData.id,
            method: api.modify.method
          }
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        getMessTitle: {
          errorTitle: '获取数据失败!',
          ajaxSuccess: 'getDataForServer',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        },
        isShowVideo: false,
        count: 0
      };
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun);
        }
        //this.showMess("暂不可保存调试信息!");
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
      saveSuccess (res) {
        this.successMess('保存成功!');
        this.$emit('edit');
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', this.editMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      downLoad () {
        window.open('/static/video/hikvision/WebComponents.exe');
      },

      /**
       * 获取房间数据
       * */
      getDataForServer (res) {
        this.formValidate = res.data;
      },

      /**
       * 连接测试
       */
      loginService () {
        if (!this.submitForm('formValidate')) {
          return;
        }
        if (this.isShowVideo) {
          ++this.count;
        } else {
          this.isShowVideo = true;
        }
      },

      //改变品牌
      brandChange (val) {
        this.isShowVideo = false;
        if (val == 'MCU') {
          this.rules.ip = {
            required: true,
            message: '此项不能为空'
          };
        } else {
          this.rules.ip = [{
            required: true,
            message: '此项不能为空'
          }, function (rule, value, callback) {
            //检验位的检测
            // 0.0.0.0 - 255.255.255.255
            if (!(/^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d).(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/.test(value))) {
              callback(new Error('IP地址不正确'));
            }
            callback();
          }];
        }
      },

      /*
       * 组件初始化入口
       * */
      init () {
        this.ajax(this.getMessTitle);
      }
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    },
    mounted () {
      //暂时没有初始化,预留初始化入口
    },
    components: {
      hkVideo, videojsLive, mcuVideo
    }
  };

</script>
<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';
</style>
