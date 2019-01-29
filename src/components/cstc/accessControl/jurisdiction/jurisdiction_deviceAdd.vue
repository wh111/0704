<template>
  <div class="jurisdictionEdit">
    <el-row>
      <el-col :span="12" style="width:48%;">
        <el-transfer filterable :filter-method="device.filterMethod" filter-placeholder="请输入门禁名称" v-model="selectDevice" :data="device.data" :titles="device.titles"></el-transfer>
      </el-col>
      <el-col :span="12" style="width:48%;float:right;">
        <el-transfer filterable :filter-method="user.filterMethod" filter-placeholder="请输入人员名称" v-model="selectUser" :data="user.data" :titles="user.titles"></el-transfer>
      </el-col>
      <el-form>
        <el-col>
          <el-form-item label="授权期限：" style="margin-top:20px;">
            <date-group :dateGroup="{text:'',startDate:formValidate.startDate,endDate:formValidate.endDate}">
              <el-date-picker name="start" v-model="formValidate.startDate" :editable="false" type="date" placeholder="开始日期" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
              <span> 至 </span>
              <el-date-picker name="end" v-model="formValidate.endDate" :editable="false" type="date" placeholder="截止日期" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
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
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from "./api";
  export default {
    data() {
      return {
        device: {
          data: [], // 选择的数据源
          titles: ['可选门禁', '已选门禁'], // 标题
          filterMethod(query, item) { // 筛选
            return item.label.indexOf(query) > -1;
          }
        },
        user: {
          data: [], // 选择的数据源
          titles: ['可选人员', '已选人员'], // 标题
          filterMethod(query, item) { // 筛选
            return item.label.indexOf(query) > -1;
          }
        },
        selectUser: [], // 已选择的人员
        selectDevice: [], // 已选择的设备
        formValidate: {
          accessDoorIds: "", // 门禁id字符串
          userList: [], // 授权对象集合
          startDate: "", // 开始日期
          endDate: "", //  结束日期
          accessDoorJurisdictionTimeList: [{
            startTime: "",
            endTime: ""
          }] // 授权时段集合
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '授权成功!',
          errorTitle: '授权失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
            url: api.addList.path,
            method: api.addList.method,
          }
        }
      }
    },
    methods: {
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
      // 检测数据是否可提交
      checkData() {
        if (this.selectDevice.length < 1) {
          this.errorMess('请至少选择一个门禁')
          return false
        }
        if (this.selectUser.length < 1) {
          this.errorMess('请至少选择一个人员')
          return false
        }
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

        let userList = [];
        this.selectUser.map(item => {
          let userItem = this.user.data[item];
          userList.push({
            userId: userItem.userId,
            userName: userItem.label,
            cardNumber: userItem.num
          })
        });
        this.formValidate.accessDoorIds = this.selectDevice.join(',');
        this.formValidate.userList = userList;
        return true;
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      },
      /*************************** 获取数据 *****************************/
      // 获取选择设备列表
      getDeviceList() {
        let selectDevice = [];
        let opt = {
          ajaxSuccess: res => {
            if (res.data instanceof Array) {
              res.data.map(item => selectDevice.push({
                label: item.doorName,
                key: item.id,
                num: item.doorNum,
              }))
              this.device.data = selectDevice;
            }
          },
          ajaxParams: {
            url: api.doorList.path,
            method: api.doorList.method
          }
        };
        this.ajax(opt)
      },
      // 获取选择设备列表
      getUserList() {
        let selectUser = [];
        let opt = {
          ajaxSuccess: res => {
            if (res.data instanceof Array) {
              res.data.map((item, index) => selectUser.push({
                label: item.userName,
                userId: item.userId,
                key: index,
                num: item.cardNum,
              }))
              this.user.data = selectUser;
            }
          },
          ajaxParams: {
            url: api.userList.path,
            method: api.userList.method
          }
        };
        this.ajax(opt)
      },
    },
    created() {
      this.getDeviceList();
      this.getUserList();
    },
  }

</script>

<style>
  .ajTimeSlot {
    margin-bottom: 10px;
  }

  .jurisdictionEdit .el-transfer-panel__list.is-filterable {
    height: 178px;
  }

</style>
