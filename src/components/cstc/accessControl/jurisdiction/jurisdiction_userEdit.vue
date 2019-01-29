<template>
  <div>
    <el-row>
      <el-form>
        <el-col :span="18">
          <el-col :span="12">
            <el-form-item label="姓名：">
              {{ formValidate.userName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门：">
              {{ formValidate.depName }}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="卡号：">
              {{ formValidate.cardNumber }}
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="6">
          <img :src="getPhotoPath(formValidate.userPhoto)" class="cajuPhoto">
        </el-col>
        <el-col>
          <el-form-item label="授权期限：" style="margin-top:20px;">
            <date-group :dateGroup="{text:'',startDate:formValidate.startDate,endDate:formValidate.endDate}">
              <el-date-picker name="start" v-model="formValidate.startDate" :editable="false" type="date" placeholder="开始日期" :picker-options="pickerOptions0"
                @change="handleStartTime"></el-date-picker>
              <span> 至 </span>
              <el-date-picker name="end" v-model="formValidate.endDate" :editable="false" type="date" placeholder="截止日期" :picker-options="pickerOptions1"
                @change="handleEndTime"></el-date-picker>
            </date-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="刷卡时段：">
            <el-col :span="20">
              <template v-for="(item,index) in formValidate.accessDoorJurisdictionTimeList">
                <div :key="index" class="ajTimeSlot">
                  <el-time-select placeholder="起始时间" v-model="item.startTime" :picker-options="{start:'06:00',step: '00:05', end: '24:00' }">
                  </el-time-select>
                  <span> 至 </span>
                  <el-time-select placeholder="结束时间" v-model="item.endTime" :picker-options="{start: item.startTime,step: '00:05', end: '24:00',}">
                  </el-time-select>
                  <el-button type="danger" @click="delTime(index)" :disabled="formValidate.accessDoorJurisdictionTimeList.length === 1">删除</el-button>
                  <el-button type="success" @click="addTime" v-if="index === formValidate.accessDoorJurisdictionTimeList.length - 1">添加</el-button>
                </div>
              </template>
            </el-col>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from "./api";
  export default {
    props: ['operailityData'],
    data() {
      return {
        formValidate: {
          "id": "",
          "accessDoorId": "",
          "userId": "",
          "userName": "",
          "cardNumber": "",
          "userPhoto": "",
          "depName": "",
          "startDate": "",
          "endDate": "",
          "createrId": "",
          "createrName": "",
          "createTime": "",
          "accessDoorJurisdictionTimeList": []
        },
        //保存按钮基本信息
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.modify.path + this.operailityData.id,
            method: api.modify.method,
          }
        }
      }
    },
    methods: {
      init() {
        this.getUserInfo()
      },
      // 取消
      cancel() {
        this.$emit('cancel', 'add')
      },
      // 添加时间段
      addTime() {
        this.formValidate.accessDoorJurisdictionTimeList.push({
          startTime: "",
          endTime: ""
        })
      },
      // 删除时间段
      delTime(index) {
        this.formValidate.accessDoorJurisdictionTimeList.splice(index, 1)
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if (this.checkData()) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.addMessTitle.ajaxParams.data;
          data.startDate = this.conductDate(data.startDate, 'yyyy-MM-dd');
          data.endDate = this.conductDate(data.endDate, 'yyyy-MM-dd');
          this.ajax(this.addMessTitle, isLoadingFun)
          // console.log(this.addMessTitle.ajaxParams.data)
        }
      },
      // 获取头像地址
      getPhotoPath(path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png'
      },
      // 获取数据
      getUserInfo() {
        let opt = {
          ajaxSuccess: res => {
            this.formValidate = res.data
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },
      // 检测数据是否可提交
      checkData() {
        if (!this.formValidate.startDate) {
          this.errorMess('开始日期必须填写')
          return false
        }
        if (!this.formValidate.endDate) {
          this.errorMess('结束日期必须填写')
          return false
        }
        for (let list = this.formValidate.accessDoorJurisdictionTimeList, item, i = 0, l = list.length; i < l; i++) {
          if (!list[i].startTime || !list[i].endTime) {
            let msg = `第${i+1}个刷卡时间段`;
            let type = !list[i].startTime ? '开始' : '结束';
            this.errorMess(msg + type + '时间必须填写');
            return false
          }
        }
        return true;
      },
    },
    created() {
      this.init()
    }
  }

</script>

<style>
  .cajuPhoto {
    width: 116px;
    height: 116px;
  }

</style>
