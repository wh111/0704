<template>
  <!-- 新建申请 -->
  <div>
    <el-row>
      <el-col :span="12">
        <div class="bpaColorBox">
          <span class="optional">可预约</span>
          <span class="tenancyEnds">已约满</span>
          <span class="NO">未开放</span>
          <span class="select">已预约</span>
        </div>
      </el-col>
      <el-col :span="12" align="right">
        <el-date-picker v-model="selDay" type="date" placeholder="选择日期" @change="getDaysForServer"></el-date-picker>
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
              <!-- 过期的时间段 -->
              <p v-if="isObsolete(tableBody.timeSetList[index].courseTime)" class="NO" title="未开放">X</p>
              <!-- 已经被预约了 -->
              <p v-else-if="isOccupy(roomIndex,index)" class="tenancyEnds" title="已约满">满</p>
              <!-- 进行时间排序 -->
              <p v-else-if="isTimeOrder(index)" class="NO" title="未开放">X</p>
              <!-- 当前预约 -->
              <p v-else-if="isReservation(roomIndex,index)" class="select" title="已预约" @click="initSelectTime(false)">约</p>
              <!-- <p v-else-if="selRoomIndex === roomIndex && selTimeSlotIndex === index" class="select" title="已预约" @click="initSelectTime(false)">约</p> -->
              <!-- 系统数据 -->
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
              <el-tooltip class="item" effect="light" placement="bottom-start">
                <div slot="content" style="max-width:200px;">
                  <p>设备名称：{{ deviceList[index].deviceTypeName }}</p>
                  <p>设备数量：{{ deviceList[index].deviceNum || 0 }}</p>
                  <p>设备简介：{{ deviceList[index].describes || '暂无简介' }}</p>
                </div>
                <el-button>{{ deviceList[index].deviceTypeName }}</el-button>
              </el-tooltip>
              <span class="bpkdTitle">数量：</span>
              <el-input style="width:200px;" v-model="item.reserveNum" :placeholder="'1-'+deviceList[index].deviceNum+'之间'"></el-input>
            </div>
          </div>
          <el-button type="primary" @click="selectDevice">选择模型</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <div align="center" style="margin-top:20px;">
      <el-button type="success" @click="subData">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>

    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="selectDeviceModal" class-name="vertical-center-modal" :loading="true" :width="900">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" :timeData="{'date':formValidate.openTime.date,reserveTimeSetId:formValidate.openTime.timeSetId}" :select="selectDeviceId" @cancel="cancel" @select="selectDeviceCall"></select-device>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  // import selectDevice from '../../../cstc/bespeakClass/bespeakClass_selectDevice'; // 选择设备
  import selectDevice from '../../../cstc/device/device_select'; // 选择设备
  export default {
    /**
     * selectData [日期_房间id_时间段id] 已经选择的时间数组
     * timeOrder 布尔值 是否进行时间顺序处理（所选的时间必须大于已选的时间）
     */
    props: ['selectData', 'timeOrder'],
    data() {
      return {
        self: this,
        // 临时数据
        reservePoject: "", // 项目
        activeName: "", // 日期视图
        selRoomIndex: -1, // 房间
        selTimeSlotIndex: -1, // 时间段
        selDay: '', // 日期
        // 展示数据
        timeSlot: [], // 时间段
        days: [], // 日期
        projectData: {}, // 可预约项目
        tableBody: [], // 房间预约
        deviceList: [], // 设备
        showData: {}, // 原数据
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
            timeSetId: "", // 时间段id
          },
          deviceList: [ // 设备列表
            // {
            //   derviceTypeId: "", // 设备id
            //   reserveNum: "", // 设备数量
            // }
          ],
        },
        initUser: [],
        selectDeviceId: [],
        // 模态窗
        selectDeviceModal: false,
        selectRoomModal: false,
        selectUserModal: false,
        contentHeader: {
          selectDeviceId: {
            id: 'selectDeviceId',
            title: '选择设备'
          },
          selectUserId: {
            id: "selectUserId",
            title: "选择人员"
          }
        },
      }
    },
    methods: {
      init() {
        /* 加载日期数据 */
        this.getDaysForServer();
      },
      /************************************* 数据获取 **********************************/
      // 获取日期
      getDaysForServer(selDate) {
        let date = this.conductDate(selDate || new Date(), 'yyyy-MM-dd');
        this.ajax({
          ajaxSuccess: res => {
            this.days = res.data;
            if (res.data.length) {
              this.activeName = date;
              this.selDay = date;
              this.selectDay(date); // 指定日期
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
      // 获取项目日期对应的房间信息
      getRoomInfoByDay() {
        this.ajax({
          ajaxSuccess: res => {
            this.tableBody = res.data || {};
            if (res.data.timeSetList.length) {
              this.timeSlot = res.data.timeSetList;
            }
            if (this.selDay != this.formValidate.openTime.date) { // 不是同一天不进行预约状态选择
              return
            }
            // 时间段
            for (let i in res.data.timeSetList) {
              if (this.formValidate.openTime.timeSetId === res.data.timeSetList[i].timeSetId) {
                this.selTimeSlotIndex = +i;
                break;
              }
            }
            // 房间
            for (let j in res.data.roomList) {
              if (this.formValidate.reservePojectRoom.roomId === res.data.roomList[j].roomId) {
                this.selRoomIndex = +j;
                break;
              }
            }
          },
          ajaxParams: {
            url: api.timeList.path,
            method: api.timeList.method,
            params: {
              date: this.formValidate.openTime.date
            }
          }
        })
      },
      /************************************* 数据选择 **********************************/
      // 选择日期
      selectDay(date) {
        // let data = this.selDay === date ? this.showData : null;
        this.formValidate.openTime.date = date;
        // this.initSelectTime(data);
        this.initSelectTime();
        this.getRoomInfoByDay();
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
        this.formValidate.openTime.time = this.tableBody.timeSetList[timeSlotIndex].courseTime;
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
        this.$emit('select', this.formValidate)
      },
      // 取消
      close() {
        this.$emit('cancel', 'selectTime')
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
            derviceTypeId: item.id,
            reserveNum: "",
            deviceTypeName: item.deviceTypeName,
          })
        })
        this.formValidate.deviceList = temp;
        this.deviceList = res;
        this.cancel('selectDevice')
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
      initSelectTime(obj) {
        this.selRoomIndex = -1;
        this.selTimeSlotIndex = -1;
        if (obj) {
          this.formValidate.reservePojectRoom.roomId = obj.roomId;
          this.formValidate.reservePojectRoom.roomNum = obj.roomNum;
          this.formValidate.openTime.timeSetId = obj.timeSetId;
          this.formValidate.openTime.timeSetId = obj.time;
        } else {
          this.formValidate.reservePojectRoom.roomId = '';
          this.formValidate.reservePojectRoom.roomNum = '';
          this.formValidate.openTime.timeSetId = '';
          this.formValidate.openTime.time = '';
          this.formValidate.deviceList.length = 0;
          this.selectDeviceId.length = 0;
        }
      },
      // 检测是否可提交
      checkSub() {
        if (!this.formValidate.openTime.date) {
          this.errorMess('请选择日期');
          return false
        }
        if (!this.formValidate.openTime.timeSetId) {
          this.errorMess('请选择时间段');
          return false
        }
        if (!this.formValidate.timeModel) {
          // if (!this.formValidate.deviceList.length) {
          //   this.errorMess('请选择预约项目所需设备');
          //   return false
          // }
          if (!this.formValidate.reservePojectRoom.roomId) {
            this.errorMess('请选择房间');
            return false
          }
          for (let i in this.formValidate.deviceList) {
            let num = this.formValidate.deviceList[i].reserveNum;
            if (!this.deviceList[i].deviceNum) {
              this.errorMess(`设备“${this.deviceList[i].deviceTypeName}”数量不足，不能预约`);
              return false
            }
            if (isNaN(num) || num < 1 || num > this.deviceList[i].deviceNum) {
              this.errorMess(`设备“${this.deviceList[i].deviceTypeName}”预约数量最少为1，最多为${this.deviceList[i].deviceNum}`);
              return false
            }
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
