<template>
  <div>
    <el-row>
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="120px">
        <el-col :span="10" :offset="1">
          <el-form-item label="门禁名称：" prop="doorName">
            <el-input v-model="formValidate.doorName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="门禁编号：" prop="doorNum">
            <el-select v-model="formValidate.doorNum" placeholder="请选择">
              <el-option v-for="item in 4" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="控制器SN：" prop="accessSn">
            <el-input v-model="formValidate.accessSn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="控制器IP：" prop="accessIp">
            <el-input v-model="formValidate.accessIp"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="设备所在位置：" prop="locationType">
            <el-radio class="radio" v-model="formValidate.locationType" label="ROOM">房间</el-radio>
            <el-radio class="radio" v-model="formValidate.locationType" label="ORTHER">其他</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="房间号：" prop="roomId" v-if="formValidate.locationType === 'ROOM'">
            <el-select v-model="roomSelIndex" placeholder="请选择" @change="changeSelRoom">
              <el-option v-for="(item,index) in roomList" :key="item.id" :label="item.roomNum" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else label-width="0">
            <el-input v-model="formValidate.orther"></el-input>
          </el-form-item>
        </el-col>
        <el-col align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  let Util = null;
  import api from "./api";
  import typeOption from "./typeOption";
  import {
    accessControlDevice as rules
  } from "../../rules";
  export default {
    data() {
      return {
        rules,
        roomList: [],
        typeOption,
        roomSelIndex: '',
        formValidate: {
          doorName: "", // 门禁名称
          doorNum: "", // 门禁编号
          accessSn: "", // 控制器SN
          accessIp: "", // 控制器IP
          locationType: "ROOM", // 设备所在位置类型
          roomId: "", // 房间id
          roomNum: "", // 房间号
          orther: "", // 其他
        },
        //保存按钮基本信息
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
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
      }
    },
    methods: {
      // 初始化
      init() {
        Util = this.$util;
        this.getSelectRoom();
      },
      // 获取选择房间
      getSelectRoom() {
        this.ajax({
          ajaxSuccess: res => this.roomList = res.data,
          ajaxParams: {
            url: api.roomList.path
          }
        })
      },
      // 选择房间
      changeSelRoom(val) {
        let selRoom = this.roomList[this.roomSelIndex];
        this.formValidate.roomId = selRoom.id;
        this.formValidate.roomNum = selRoom.roomNum;
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
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
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
    },
    created() {
      this.init()
    },
  }

</script>

<style>


</style>
