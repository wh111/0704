<template>
  <!-- 新建申请 -->
  <div>
    <el-row>
      <el-col align="right">
        <el-date-picker style="width:200px;" v-model="formValidate.openTime.date" :editable="false" type="date"
                        placeholder="选择日期" v-if="showSelectDay" @change="getDaysForServer"></el-date-picker>
      </el-col>
      <el-col :span="2">
        <p class="bpaTitleText">日期预约：</p>
      </el-col>
      <el-col :span="22">
        <el-tabs v-if="days.length" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item,index) in days" :key="index" :label="item" :name="item+''"></el-tab-pane>
        </el-tabs>
        <span class="bpaTitleText" v-else>-</span>
      </el-col>
      <el-col :span="2">
        <p class="bpaTitleText">房间预约：</p>
      </el-col>
      <el-col :span="22">
        <el-tabs v-if="rooms.length" v-model="activeRoomName" @tab-click="handleRoomClick">
          <el-tab-pane v-for="(item,index) in rooms" :key="index" :label="item.roomNum"
                       :name="index+''"></el-tab-pane>
        </el-tabs>
        <span class="bpaTitleText" v-else>-</span>
      </el-col>
      <el-col :span="2">
        <p class="bpaTitleText">时间预约：</p>
      </el-col>
      <el-col :span="22">
        <template v-if="times.length">
          <el-radio-group v-model="timeSlot" class="bpaTimeSelectBox">
            <el-col :span="6" v-for="(item,index) in times" :key="index">
              <el-radio class="bpaTimeSelectItem" :label="item.startTime + '-' + item.endTime"
                        :disabled="item.status=='tenancyEnds'">
                {{ item.startTime }}-{{ item.endTime }}
              </el-radio>
            </el-col>
          </el-radio-group>
        </template>
        <template v-else-if="autoSetTime">
          <time-quantum :index="0" :range="range" :data="autoTime" style="margin-top: 2px;"></time-quantum>
        </template>
        <span class="bpaTitleText" v-else>-</span>
      </el-col>
    </el-row>
    <br>
    <!-- 选择设备 -->
    <el-row>
      <el-form>
        <el-col>
          <el-form-item label="房间中的设备：">
            <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in roomDevice"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose('room',index)"
            >
              {{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
            </el-tag>
            <el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('room')">+选择设备</el-tag>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="设备库：">
            <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in otherDevice"
                    :closable="true"
                    :close-transition="false"
                    @close="handleClose('other',index)"
            >
              {{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
              所需数量：
              <el-input @blur="changeReserveNum(index,item)" v-model="item.reserveNum" size="mini" style="width: 40px;margin-top: -2px;"></el-input>
            </el-tag>
            <el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('other')">+选择设备</el-tag>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>

    <div align="center" style="margin-top:20px;">
      <el-button type="success" @click="subData">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>

    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="selectDeviceModal" class-name="vertical-center-modal" :loading="true"
           :width="900">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" @select="selectDeviceCall" @cancel="cancel"
                     :select="selectDeviceType == 'room' ? roomDeviceId : otherDeviceId "
                     :url="selectDeviceUrl" :selectDeviceType="selectDeviceType"></select-device>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<style lang="scss">
  .bpaTitleText {
    line-height: 42px;
    font-size: 14px;
  }

  .bpaTimeSelectBox {
    display: block;
  }

  .bpaTimeSelectItem {
    line-height: 42px;
  }

  .brsdItem {
    margin-bottom: 10px;
    margin-right: 10px;
  }

  .brsdSelBtn {
    cursor: pointer;
  }
</style>

<script>
  import api from './api';
  // import selectDevice from '../../../cstc/bespeakClass/bespeakClass_selectDevice'; // 选择设备
  import selectDevice from '../../../cstc/bespeakSetting/room/device_select.vue'; // 选择设备
  export default {
    /**
     * selectData [日期_结束时间_房间id] 已经选择的时间数组
     * timeOrder 布尔值 是否进行时间顺序处理（所选的时间必须大于已选的时间）
     */
    props: ['selectData', 'timeOrder'],
    data() {
      return {
        self: this,
        // 临时数据
        activeName: "", // 日期视图
        activeRoomName: '',
        selDay: '', // 日期
        timeSlot: '', // 时间段
        // 展示数据
        days: [], // 日期
        rooms: [], // 房间
        times: [], // 时间
        // 提交数据
        formValidate: {
          roomBearingCapacity: "", // 承载量
          reservePojectRoom: { // 预约房间对象
            roomId: "", // 房间id
            roomNum: "", // 房间号
            // bearingCapacity: "", // 承载量
          },
          openTime: { // 开放时间对象
            date: "", // 日期
            time: "", // 时间
          },
          deviceList: [ // 设备列表
            // {
            //   derviceTypeId: "", // 设备id
            //   reserveNum: "", // 设备数量
            // }
          ],
        },
        // 模态窗
        selectDeviceModal: false,
        contentHeader: {
          selectDeviceId: {
            id: 'selectDeviceId',
            title: '选择设备'
          },
        },
        // 自定义时间段
        range: [],
        autoTime: {
          start: '',
          end: '',
          time: ''
        },
        showSelectDay: false,
        autoSetTime: false,

        roomDeviceId: [],
        otherDeviceId: [],
        roomDevice: {}, // 房间内的设备
        otherDevice: {}, // 房间外的设备
        selectDeviceUrl: "",
        selectDeviceType: "", // room|other
      }
    },
    methods: {
      init() {
        /* 加载日期数据 */
        this.getDaysForServer();
      },
      //失去焦点事件
      changeReserveNum(index,item){
          this.roomDevice[index] = item;
          console.log(this.roomDevice[index],index,item)
      },
      // 清除时间段
      clearTimeSlot() {
        this.timeSlot = '';
        this.autoSetTime = false;
        this.range = [];
        this.autoTime = {
          start: '',
          end: '',
          time: ''
        };
      },
      // 清除日期
      clearDateData() {
        this.days = [];
        this.clearTimeSlot();
        this.clearRoomData();
        this.clearTimeData();
      },
      // 清除时间
      clearTimeData() {
        this.times = [];
        this.clearTimeSlot();
      },
      // 清除房间
      clearRoomData() {
        this.rooms = [];
        this.activeRoomName = '0';
        this.formValidate.reservePojectRoom.roomId = '';
        this.formValidate.reservePojectRoom.roomNum = '';
        this.clearDeviceData()
      },
      // 清除设备数据
      clearDeviceData() {
        this.roomDeviceId = [];
        this.otherDeviceId = [];
        this.roomDevice = []; // 房间内的设备
        this.otherDevice = []; // 房间外的设备
      },
      /************************************* 数据获取 **********************************/
      // 获取日期
      getDaysForServer(selDate) {
        let date = this.conductDate(selDate || new Date(), 'yyyy-MM-dd');
        this.ajax({
          ajaxSuccess: res => {
            this.showSelectDay = false;
            this.days = res.data;
            if (res.data.length) {
              this.activeName = date;
              this.selDay = date;
              this.selectDay(date); // 指定日期
            } else {
              this.getAllDay(selDate)
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
      getAllDay(day) {
        let now = (day ? new Date(day) : new Date()).getTime();
        this.days.length = 0;
        for (let i = 0; i < 5; i++) {
          this.days.push(this.conductDate(new Date(now + (i * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd'))
        }
        this.showSelectDay = true;
        this.activeName = this.days[0];
        this.selDay = this.days[0];
        this.selectDay(this.days[0]); // 指定日期
      },
      // 获取项目日期对应的房间信息
      getRoomListByDate() {
        this.ajax({
          ajaxSuccess: res => {
            this.activeRoomName = '0';
            if (res.data && res.data.length) {
              this.rooms = res.data;
              this.getTimeListByRoom();
            }
          },
          ajaxParams: {
            url: api.roomList.path,
            method: api.roomList.method,
            params: {
              date: this.formValidate.openTime.date
            }
          }
        })
      },
      // 获取项目下指定日期对应的房间的可预约时间段
      getTimeListByRoom() {
        this.formValidate.reservePojectRoom.roomId = this.rooms[this.activeRoomName].roomId;
        this.formValidate.reservePojectRoom.roomNum = this.rooms[this.activeRoomName].roomNum;
        this.formValidate.roomBearingCapacity = this.rooms[this.activeRoomName].bearingCapacity || 0;
        this.clearTimeData();
        let opt = {
          ajaxSuccess: res => {
            if (res.data && res.data.length) {
              let timesData = this.$util._.sortBy(res.data, 'startTime');
              this.times = timesData;
            } else { // 自己选择时间段
              this.autoSetTime = true;
            }
          },
          ajaxError: () => this.errorMess('获取数据失败'),
          ajaxParams: {
            url: api.timeList.path,
            method: api.timeList.method,
            params: {
              date: this.formValidate.openTime.date,
              roomId: this.formValidate.reservePojectRoom.roomId,
            },
          }
        };
        this.ajax(opt)
      },
      /************************************* 数据选择 **********************************/
      // 选择日期
      selectDay(date) {
        this.formValidate.openTime.date = date;
        this.getRoomListByDate();
      },
      // 房间选择
      handleRoomClick() {
        this.getTimeListByRoom()
      },
      /************************************* 时间有效性判断 ****************************/
      // 时间段在当前时间内是否已过期
      isObsolete(dataItem) {
        let selectTime = new Date(this.activeName + ' ' + dataItem.split('-')[0]).getTime();
        let now = new Date().getTime();
        return now > selectTime
      },
      // 是否被占用(当前时间段在该房间的指定日期被之前的课程预约了)
      isOccupy(roomIndex, timeIndex) {
        if (this.selectData && this.selectData.length) {
          // 日期-房间id-时间段id
          let str = this.activeName + '_' + this.tableBody.roomList[roomIndex].roomId + '_' + this.tableBody.timeSetList[timeIndex].timeSetId;
          return this.selectData.indexOf(str) > -1
        }
        return false
      },
      // 进行时间排序处理
      isTimeOrder(timeIndex) {
        if (this.timeOrder && this.selectData && this.selectData.length) {
          let lastData = this.selectData[this.selectData.length - 1].split('_');
          let lastTime = new Date(lastData[0]); // 日期
          let thisTime = new Date(this.activeName); // 选中的日期
          // 日期的时间戳 + 时间段id 进行大小比较（时间段的id递增）得到时间段是否保持在所选时间大于已选时间
          return (lastTime + lastData[2] + 1) > (thisTime + this.tableBody.timeSetList[timeIndex].timeSetId)
        }
        return false
      },
      // 刚刚预约了
      isReservation(roomIndex, timeIndex) {
        if (this.selRoomIndex === roomIndex && this.selTimeSlotIndex === timeIndex) {
          return true
        }
        return false
      },
      /************************************* 按钮事件 **********************************/
      // 日期选择
      handleClick() {
        this.selectDay(this.activeName)
      },
      // 提交数据
      subData() {
        if (!this.checkSub()) {
          return
        }
        let data = this.$util._.defaultsDeep({}, this.formValidate);
        for (let item in this.roomDevice) {
          data.deviceList.push({
            derviceId: this.roomDevice[item].id,
            reserveNum: this.roomDevice[item].reserveNum,
            deviceTypeName: this.roomDevice[item].deviceTypeName,
            deviceIdentifier: this.roomDevice[item].deviceIdentifier,
            inRoom: 1,
          })
        }
        for (let item in this.otherDevice) {
          data.deviceList.push({
            derviceId: this.otherDevice[item].id,
            reserveNum: this.otherDevice[item].reserveNum,
            deviceTypeName: this.otherDevice[item].deviceTypeName,
            deviceIdentifier: this.otherDevice[item].deviceIdentifier,
            inRoom: 1,
          })
        }

        this.$emit('select', data)
      },
      // 取消
      close() {
        this.$emit('cancel', 'selectTime')
      },
      // 选择设备
      selectDevice(type) {
        if (this.formValidate.reservePojectRoom.roomId) {
          this.selectDeviceUrl = api[type].path + this.formValidate.reservePojectRoom.roomId;
          this.selectDeviceType = type;
          this.openModel('selectDevice')
        } else {
          this.showMess('请选择预约房间')
        }

      },

      // 选择设备回调
      selectDeviceCall(arr) {
        (arr || []).map(item => {
          if (this.selectDeviceType == 'room') {
            if (this.roomDeviceId.indexOf(item.id) == -1) {
              this.roomDeviceId.push(item.id)
              item.reserveNum = 1;
              this.roomDevice[item.id] = item;
            }
          } else {
            if (this.otherDeviceId.indexOf(item.id) == -1) {
              this.otherDeviceId.push(item.id);
              this.otherDevice[item.id] = item
            }
          }
        })
        this.cancel('selectDevice')
      },

      // 移除设备
      handleClose(type, index) {
        let data = this.$util._.defaultsDeep({}, this[type + 'Device']);
        let id = this[type + 'DeviceId'].indexOf(index);
        delete data[index];
        this[type + 'DeviceId'].splice(id, 1);
        this[type + 'Device'] = data
      },
      /************************************* 其他 **************************************/
      // 检测是否可提交
      checkSub() {
        if (!this.formValidate.openTime.date) {
          this.errorMess('请选择日期');
          return false
        }
        if (!this.formValidate.reservePojectRoom.roomId) {
          this.errorMess('请选择房间');
          return false
        }
        if (!(this.timeSlot || this.autoTime.time)) {
          this.errorMess('请选择时间段');
          return false
        } else {
          this.formValidate.openTime.time = this.timeSlot || this.autoTime.time
        }

        for (let item in this.roomDevice) {
            console.log(this.roomDevice[item]);
          if(!/^\d+$/.test(this.roomDevice[item].reserveNum)){
            this.errorMess('房间中的设备所需数量必须是整数');
            return false
          }
        }
        for (let item in this.otherDevice) {
          if(!/^\d+$/.test(this.otherDevice[item].reserveNum)){
            this.errorMess('设备库中的设备所需数量必须是整数');
            return false
          }
        }
        return true
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
    components: {
      selectDevice
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 新建申请 */

  .el-table th > div.bpatHeader {
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
      & ~ .bpProjectItem {
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
