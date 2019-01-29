<template>
  <!-- 新建申请 -->
  <div>
    <el-row>
      <el-form label-width="130px" :model="formValidate" ref="formValidate" :rules="rules">
        <el-col>
          <el-form-item label="课程名称：" prop="name">
            <el-input v-model="formValidate.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="授课老师：">
            <el-input v-model="formValidate.lecturer" style="width:200px;" @change="lecturerChange"></el-input>
            <el-button type="info" @click="choiceTeacher">选择授课老师</el-button>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="授课对象：">
            <el-radio-group v-model="formValidate.userType">
              <div class="bpProjectBox">
                <div class="bpProjectItem">
                  <el-radio label="ALL">全体人员</el-radio>
                </div>
                <div class="bpProjectItem">
                  <el-radio label="ZYY">住院医</el-radio>
                  <el-radio label="JXS">进修生</el-radio>
                  <el-radio label="SXS">实习生</el-radio>
                  <el-radio label="YJS">研究生</el-radio>
                  <el-radio label="DJLS">带教老师</el-radio>
                </div>
                <div class="bpProjectItem">
                  <el-radio label="SPECIFIC">特定人员</el-radio>
                  <template v-if="formValidate.userType === 'SPECIFIC'">
                    <el-tag type="success" class="bpUserItem" :closable="true" v-for="(item,index) in formValidate.userList" @close="removeUser(index)" :key="item.userId">{{ item.userName }}</el-tag>
                    <el-button type="info" size="small" style="margin-left:10px;" @click="selectUser">选择人员</el-button>
                  </template>
                </div>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="可预约数量：" prop="roomBearingCapacity">
            <el-input v-model="formValidate.roomBearingCapacity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="8">
          <el-form-item label="最低开课人数：" prop="minNum">
            <el-input v-model="formValidate.minNum"></el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="课程内容：" prop="summary">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.summary">
            </el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-checkbox v-model="formValidate.timeModel" true-label="SPECIFIC" false-label="" @change="initSelectTime(false)">不自主选择房间、只描述要求</el-checkbox>
          </el-form-item>
        </el-col>

        <template v-if="formValidate.timeModel === 'SPECIFIC'">
          <el-col>
            <el-form-item label="预约日期：">
              <el-date-picker style="width:200px;" v-model="formValidate.openTime.date" :editable="false" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="预约时间段：">
              <el-radio-group v-model="formValidate.openTime.timeSetId">
                <el-radio v-for="item in timeSlot" :label="item.timeSetId" :key="item.timeSetId">{{ item.courseTime }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="所需场地描述：">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.roomRquirement">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="所需设备描述：">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.deviceRquirement">
              </el-input>
            </el-form-item>
          </el-col>

        </template>

      </el-form>
    </el-row>

    <template v-if="formValidate.timeModel !== 'SPECIFIC'">
      <el-row>
        <el-col :span="16">
          <div class="bpaColorBox">
            <span class="optional">可预约</span>
            <span class="tenancyEnds">已约满</span>
            <span class="NO">未开放</span>
            <span class="select">已预约</span>
          </div>
        </el-col>
        <!-- 全天候才显示 -->
        <el-col :span="8" align="right">
          <el-date-picker v-if="showSelectDay" v-model="pickerSelectDay" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change="getAllDay" style="margin-top: 5px;"> </el-date-picker>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item,index) in days" :key="index" :label="item" :name="item+''"></el-tab-pane>
      </el-tabs>
      <table class="el-table el-table--border" style="margin-bottom:20px;">
        <thead>
          <tr>
            <th class="is-leaf">
              <div class="cell bpatHeader">
                预约
              </div>
            </th>
            <th class="is-leaf" v-for="item in tableBody.timeSetList" :key="item.timeSetId">
              <div class="cell">{{ item.courseTime }}</div>
            </th>
          </tr>
        </thead>
        <tbody class="bpaBody">
          <tr class="el-table__row" v-for="(roomItem,roomIndex) in tableBody.roomList" :key="roomItem.roomId">
            <td>
              <div class="cell">{{ roomItem.roomNum }}</div>
            </td>
            <td v-for="(dataItem,index) in roomItem.dataList" :key="roomItem.roomId + '-' + index" align="center">
              <div class="cell">
                <p v-if="isObsolete(tableBody.timeSetList[index].courseTime)" class="NO" title="未开放">X</p>
                <p v-else-if="selRoomIndex === roomIndex && selTimeSlotIndex === index" class="select" title="已预约" @click="initSelectTime(false)">约</p>
                <p v-else :class="dataItem" :title="getTitle(dataItem)" @click="selectThisTime(roomItem,roomIndex,index,dataItem)">{{ dataItem | dataListType }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 选择设备 -->
      <el-col>
        <el-form :inline="true" label-width="80px;">
          <el-form-item label="选择设备：">
            <div class="bpkdBox">
              <div v-for="(item,index) in formValidate.deviceList" :key="index" class="bpkdItem">
                <!--<el-tooltip class="item" effect="light" placement="bottom-start">-->
                  <!--<div slot="content" style="max-width:200px;">-->
                    <!--<p>设备名称：{{ deviceList[index].deviceTypeName }}</p>-->
                    <!--<p>开放数量：{{ deviceList[index].openNum || 0 }}</p>-->
                    <!--<p>设备简介：{{ deviceList[index].describes || '暂无简介' }}</p>-->
                  <!--</div>-->
                  <el-button type="text">{{ deviceList[index].deviceTypeName + '(' + deviceList[index].deviceIdentifier + ')' }}</el-button>
                <!--</el-tooltip>-->
                <!--<span class="bpkdTitle">数量：</span>-->
                <!--<el-input style="width:200px;" v-model="item.reserveNum" :placeholder="'1-'+deviceList[index].openNum+'之间'"></el-input>-->
              </div>
            </div>
            <el-button type="primary" @click="selectDevice">选择模型</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </template>

    <div align="center" style="margin-top:20px;">
      <el-button type="success" @click="subData('UNREPORTED')">保存</el-button>
      <el-button type="primary" @click="subData('START')">上报</el-button>
      <el-button @click="close">取消</el-button>
    </div>

    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="selectDeviceModal" class-name="vertical-center-modal" :loading="true" :width="900">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" :roomId="formValidate.reservePojectRoom.roomId" :select="selectDeviceId" @cancel="cancel" @select="selectDeviceCall"></select-device>
      <div slot="footer"></div>
    </Modal>
    <!--选择授课老师-->
    <Modal :mask-closable="false" width="890" v-model="selectTeacherModal" title="添加人员" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectTeacherId"></modal-header>
      <select-user v-if="selectTeacherModal" :isOnlyOne="true" @cancel="cancel('selectTeacher')" @setUsers="selectTeacherCall" :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--选择人员-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" title="添加人员" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="cancel" @setUsers="selectUserCall" :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  import selectUser from '../../common/selectUser'; // 选择人员
  import selectDevice from './bespeakClass_selectDevice'; // 选择设备
  import {
    bespeakClass as rules
  } from '../rules'; // 验证规则
  export default {
    data() {
      return {
        rules,
        self: this,
        // 临时数据
        reservePoject: "", // 项目
        activeName: "", // 日期视图
        selRoomIndex: -1, // 房间
        selTimeSlotIndex: -1, // 时间段
        // 展示数据
        showSelectDay: false, // 是否显示日期选框
        pickerSelectDay: '', // 选择的日期
        timeSlot: [], // 时间段
        days: [], // 日期
        projectData: {}, // 可预约项目
        tableBody: [], // 房间预约
        deviceList: [], // 设备

        // 提交数据
        formValidate: {
          name: "", // 预约名称
          lecturer: "", // 授课人
          lecturerId:"",
          minNum: "", // 最低开课人数
          summary: "", // 预约内容
          timeModel: "", // 开放时间类型
          userType: 'ALL', // 开放预约对象类型
          roleId: "", // 角色id
          isCourse: 'YES', // 是否是课程
          userIds: "", // 预约人id字符串，多个id以逗号分隔
          roomRquirement: "", // 房间描述
          deviceRquirement: "", // 设备描述
          roomBearingCapacity: "", // 承载量
          reservePojectRoom: { // 预约房间对象
            roomId: "", // 房间id
            roomNum: "", // 房间号
            bearingCapacity: "", // 承载量
          },
          openTime: { // 开放时间对象
            reserveSetType: "PROJECT", // 预约设置类型
            date: "", // 日期
            timeSetId: "", // 时间段id
          },
          deviceList: [ // 设备列表
            // {
            //   derviceId: "", // 设备id
            //   reserveNum: "", // 设备数量
            // }
          ],
          userList: [], // 人员列表
          status: "", // 预约状态 UNREPORTED|待上报 START|待使用
        },
        initUser: [],
        selectRoomId: [],
        roomList: [], // 已选房间
        selectDeviceId: [],
        // deviceList: [], // 已选设备
        // 模态窗
        selectDeviceModal: false,
        selectRoomModal: false,
        selectUserModal: false,
        selectTeacherModal:false,
        contentHeader: {
          selectDeviceId: {
            id: 'selectDeviceId',
            title: '选择设备'
          },
          selectUserId: {
            id: "selectUserId",
            title: "选择人员"
          },
          selectTeacherId: {
            id: "selectTeacherId",
            title: "选择授课老师"
          }
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      }
    },
    methods: {
      init() {
        this.formValidate.lecturer = this.$store.state.userInfo.name;
        this.formValidate.lecturerId = this.$store.state.userInfo.id;
        this.getDaysForServer();
      },
      /*********************************************** 数据获取 ***********************************/
      // 获取日期
      getDaysForServer() {
        let date = this.conductDate(new Date(), 'yyyy-MM-dd');
        this.ajax({
          ajaxSuccess: res => {
            this.days = res.data || [];
            this.showSelectDay = false;
            if (!res.data.length) {
              this.getAllDay()
            }else{
              this.activeName = this.days[0];
              this.selectDay(this.days[0]); // 指定日期
            }
          },
          ajaxParams: {
            url: api.dateList.path,
            method: api.dateList.method,
            params: {
              date
            }
          }
        })
      },
      /**
       * 计算全天候的日期
       * 指定日期后的五天日期
       * */
      getAllDay(day){
        let now = (day ? new Date(day) : new Date()).getTime();
        this.days.length = 0;
        for(let i=0;i<5;i++){
          this.days.push(this.conductDate(new Date(now + (i * 24*60*60*1000)),'yyyy-MM-dd'))
        }
        this.showSelectDay = true;
        this.activeName = this.days[0];
        this.selectDay(this.days[0]); // 指定日期
      },
      // 获取项目日期对应的房间信息
      getRoomInfoByDay() {
        this.ajax({
          ajaxSuccess: res => {
            this.tableBody = res.data || {};
            if (res.data.timeSetList.length) {
              this.timeSlot = res.data.timeSetList;
              // 时间段是否已过期
              // this.timeSlot.map(item=>)
              // for(let tsItem in )
              // 根据日期设置当前时间以前的时间段为不开放
              // this.days.roomItem.map((roomItem,roomIndex) => {
              // roomItem.dataList.map((timeItem, index) => {
              //   let startTime = timeItem.split('-')[0];
              //   console.log(startTime)
              // })
              // })
            }
          },
          ajaxParams: {
            url: api.dateGet.path,
            method: api.dateGet.method,
            params: {
              date: this.formValidate.openTime.date
            }
          }
        })
      },
      /************************************* 数据选择 **********************************/
      // 选择日期
      selectDay(date) {
        this.formValidate.openTime.date = date;
        this.initSelectTime();
        this.getRoomInfoByDay();
      },
      /************************************* 按钮事件 **********************************/
      // 日期选择
      handleClick() {
        this.selectDay(this.activeName)
      },
      /**
       * 选择时间段
       * roomInfo 房间信息
       * roomIndex 房间索引
       * timeSlotIndex 时间段索引
       * timeSlotType 时间段状态
       * */
      selectThisTime(roomInfo, roomIndex, timeSlotIndex, timeSlotType) {
        if (timeSlotType === 'tenancyEnds' || timeSlotType === 'NO') { // 未开放和已约满
          return
        }
        this.formValidate.reservePojectRoom.roomId = roomInfo.roomId;
        this.formValidate.reservePojectRoom.roomNum = roomInfo.roomNum;
        this.formValidate.openTime.timeSetId = this.tableBody.timeSetList[timeSlotIndex].timeSetId;
        this.selRoomIndex = roomIndex;
        this.selTimeSlotIndex = timeSlotIndex;
        // 清除原来的设备信息
        this.formValidate.deviceList.length = 0;
        this.selectDeviceId.length = 0;
        this.deviceList.length = 0;
      },
      // 提交数据
      subData(status) {
        if (!this.checkSub()) {
          return
        }
        let msg = status === 'START' ? '上报' : '保存';
        let userIds = [];
        this.formValidate.status = status;
        this.formValidate.userList.map(item => userIds.push(item.userId));
        this.formValidate.userIds = userIds.join(',');
        this.formValidate.reservePojectRoom.bearingCapacity = this.formValidate.roomBearingCapacity;

        this.ajax({
          type: 'add',
          successTitle: `${msg}成功`,
          errorTitle: `${msg}失败`,
          ajaxParams: {
            jsonString: true,
            url: api.add.path,
            method: api.add.method,
            data: this.$util._.defaultsDeep({}, this.formValidate)
          }
        })
      },
      // 取消
      close() {
        this.$emit('cancel', 'add')
      },
      // 选择设备模型
      selectDevice() {
        if (this.formValidate.openTime.date && this.formValidate.openTime.timeSetId) {
          this.openModel('selectDevice')
        } else {
          this.showMess('请选择日期和时间段')
        }
      },

      // 选择设备模型
      selectDeviceCall(res) {
        let temp = [];
        this.selectDeviceId.length = 0;
        res.map(item => {
          this.selectDeviceId.push(item.id);
          temp.push({
            derviceId: item.id,
            reserveNum: ""
          })
        })
        this.formValidate.deviceList = temp;
        this.deviceList = res;
        this.cancel('selectDevice')
      },

      // 选择人员
      selectUser() {
        let userList = this.formValidate.userList;
        this.initUser.length = 0;
        if (userList.length > 0) {
          for (var i = 0, item; i < userList.length; i++) {
            item = userList[i];
            this.initUser.push({
              key: item.userId,
              label: item.userName,
              description: '人员id---' + item.userId + '的描述信息',
              disabled: false
            })
          }
        }
        this.openModel('selectUser');
      },
      lecturerChange(val){
//        this.formValidate.lecturer = val;
        this.formValidate.lecturerId = '';
      },
      //选择老师弹窗
      choiceTeacher(){
        this.selectTeacherModal = true;
      },
      //选择授课老师回调
      selectTeacherCall(res){
        this.formValidate.lecturerId = res[0].key;
        this.formValidate.lecturer = res[0].label;
        this.selectTeacherModal = false;
      },
      // 选择人员回调
      selectUserCall(res) {
        console.log(res);
        this.formValidate.userList.length = 0;
        this.$util._.forEach(res, val => {
          this.formValidate.userList.push({
            userId: val.key,
            userName: val.label,
          })
        })
        this.cancel('selectUser');
      },

      // 删除人员
      removeUser(index) {
        this.formValidate.userList.splice(index, 1)
      },

      /************************************* 其他 **************************************/
      // 获取提示
      getTitle(val) {
        let type = {
          optional: "可预约",
          tenancyEnds: "已约满",
          NO: "未开放"
        }
        return type[val] || val
      },
      // 初始化预约数据
      initSelectTime() {
        this.selRoomIndex = -1;
        this.selTimeSlotIndex = -1;
        this.formValidate.reservePojectRoom.roomId = "";
        this.formValidate.reservePojectRoom.roomNum = ""
        this.formValidate.openTime.timeSetId = "";
        this.formValidate.deviceList.length = 0;
        this.selectDeviceId.length = 0;
      },
      // 时间段在今天是否已过期
      isObsolete(dataItem) {
        let selectTime = new Date(this.activeName + ' ' + dataItem.split('-')[0]).getTime();
        let now = new Date().getTime();
        return now > selectTime
      },
      // 检测是否可提交
      checkSub() {
        if (!this.submitForm('formValidate')) {
          return false
        }

        if (this.formValidate.minNum < 1 || this.formValidate.minNum > this.formValidate.roomBearingCapacity) {
          this.errorMess('最低开课人数为1且不能超过可预约数量');
          return false
        }

        if (!this.formValidate.openTime.date) {
          this.errorMess('请选择预约项目日期');
          return false
        }
        if (!this.formValidate.openTime.timeSetId) {
          this.errorMess('请选择预约项目时间段');
          return false
        }

        if (!this.formValidate.timeModel) {
          // if (!this.formValidate.deviceList.length) {
          //   this.errorMess('请选择预约项目所需设备');
          //   return false
          // }
          if (!this.formValidate.reservePojectRoom.roomId) {
            this.errorMess('请选择预约项目房间');
            return false
          }
//          for (let i in this.formValidate.deviceList) {
//            let num = this.formValidate.deviceList[i].reserveNum;
//            if (!this.deviceList[i].openNum) {
//              this.errorMess(`设备“${this.deviceList[i].deviceTypeName}”数量不足，不能预约`);
//              return false
//            }
//            if (isNaN(num) || num < 1 || num > this.deviceList[i].openNum) {
//              this.errorMess(`设备“${this.deviceList[i].deviceTypeName}”预约数量最少为1，最多为${this.deviceList[i].openNum}`);
//              return false
//            }
//          }
        }
        return true
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
      /********************************* 模态窗 **********************/
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      // 模态窗关闭
      cancel(options) {
        this[options + 'Modal'] = false;
      },
    },
    filters: {
      // 可预约简写
      dataListType(val) {
        let type = {
          optional: "预",
          tenancyEnds: "满",
          NO: "X"
        }
        return type[val] || val
      }
    },
    components: {
      selectUser,
      selectDevice
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 新建申请 */

  .el-table th>div.bpatHeader {
    height: 100px;
    width: 100px;
    text-align: center;
    line-height: 100px;
    background: url(~@/assets/ambuf/images/tHeadBg.png) top left 100% no-repeat;
    background-size: 100%;
    position: relative;
    &::before {
      content: '时间';
      line-height: 1;
      position: absolute;
      right: 10px;
      top: 10px;
    }
    &::after {
      content: '房间';
      line-height: 1;
      position: absolute;
      left: 10px;
      bottom: 10px;
    }
  }

  .bpaBody {
    .NO {
      background-color: #c6c6c6;
    }
    .select {
      background-color: #fb882a;
    }
    .optional {
      background-color: #34ff3e;
    }
    .tenancyEnds {
      background-color: #fa0017;
    }
    .el-table__row {
      p {
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        border: 1px solid #dfe6ec;
        border-radius: 12px;
        cursor: pointer;
      }
    }
  }

  .bpaColorBox {
    padding: 16px 0 10px 0;
    span {
      position: relative;
      margin-right: 20px;
      line-height: 20px;
      font-size: 14px;
      &::before {
        content: '　';
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 5px;
      }
    }
    .NO::before {
      background-color: #c6c6c6;
    }
    .select::before {
      background-color: #fb882a;
    }
    .optional::before {
      background-color: #34ff3e;
    }
    .tenancyEnds::before {
      background-color: #fa0017;
    }
  }

  .bpProjectBox {
    display: inline-block; // padding-top: 10px;
    .bpProjectItem {
      height: 36px;
      line-height: 36px;
      .el-input {
        width: 250px;
        margin-left: 20px;
        display: inline-block;
      }
      &~.bpProjectItem {
        margin-top: 16px;
      }
    }
    .bpUserItem {
      margin-left: 6px;
      margin-top: -9px;
    }
  }

  .bpkdBox {
    .bpkdItem {
      margin-bottom: 16px;
    }
    .bpkdTitle {
      margin-left: 10px;
    }
  }

</style>
