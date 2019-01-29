<template>
  <!-- 新建申请 -->
  <div>
    <el-form>
      <fieldset>
        <legend>&nbsp;&nbsp;可选项目&nbsp;&nbsp;</legend>
        <el-radio-group v-model="reservePoject" @change="selectProject" class="baProBox">
          <el-radio v-for="item in projectData" :key="item.reservePojectId" :label="item">{{ item.name }}
          </el-radio>
        </el-radio-group>
      </fieldset>
    </el-form>

    <el-row style="margin-bottom: 10px;">
      <el-col align="right">
        <el-date-picker v-if="showSelectDay" v-model="pickerSelectDay" type="date" placeholder="选择日期"
                        :picker-options="pickerOptions" @change="getAllDay"
                        style="margin-top: 5px;"></el-date-picker>
      </el-col>
    </el-row>
    <el-row>
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
          <el-tab-pane v-for="(item,index) in rooms" :key="index"
                       :name="index+''">
              <!--<span slot="label" @click="roomMouseenter(item)">{{item.roomNum}}</span>-->
            <template slot="label">
              <el-tooltip v-if="hoverRoomId===item.roomId" effect="light" placement="left" :open-delay="600">
                <template slot="content">
                  <room-view style="width: 500px;" isShowLoading="true" :id="item.roomId" :that="self"></room-view>
                </template>
                <span>{{item.roomNum}}</span>
              </el-tooltip>
              <span v-else @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter(item)">{{item.roomNum}}</span>
            </template>
          </el-tab-pane>
        </el-tabs>
        <!--<el-tabs v-if="rooms.length" v-model="activeRoomName" @tab-click="handleRoomClick">-->
        <!--<el-tab-pane v-for="(item,index) in rooms" :key="index" :label="item.roomNum" :name="index+''">-->
        <!--<span slot="label" @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter(item)"-->
        <!--v-popover:popover1>{{item.roomNum}}</span>-->
        <!--</el-tab-pane>-->
        <!--</el-tabs>-->
        <!--<span class="bpaTitleText" v-else>-</span>-->
      </el-col>
      <el-col :span="2">
        <p class="bpaTitleText">时间预约：</p>
      </el-col>
      <!--<el-popover-->
      <!--v-if="dateChange"-->
      <!--v-show="roomViewShow"-->
      <!--ref="popover1"-->
      <!--placement="right-end"-->
      <!--title="房间信息"-->
      <!--width="500"-->
      <!--trigger="hover">-->
      <!--<roomView v-if="roomViewShow" isShowLoading="true" :id="todoId"></roomView>-->
      <!--</el-popover>-->
      <br>
      <el-col :span="22">
        <template v-if="times.length">
          <el-radio-group v-model="formValidate.timeSlot" class="bpaTimeSelectBox">
            <el-col :span="6" v-for="(item,index) in times" :key="index">
              <el-radio class="bpaTimeSelectItem" :label="item.startTime + '-' + item.endTime" :disabled="item.status=='tenancyEnds'">
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

    <div align="center" style="margin-top:20px;">
      <el-button type="success" @click="subData('UNREPORTED')">保存</el-button>
      <el-button type="primary" @click="subData('START')">上报</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="roomViewShowModal" class-name="vertical-center-modal" :loading="true"
           :width="500">
      <modal-header slot="header" :parent="self" :content="roomViewId"></modal-header>
      <roomView v-if="roomViewShowModal" isShowLoading="true" :id="todoId"></roomView>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  // 时间段插件
  import timeQuantum from '../../common/timeQuantum.vue';
  import roomView from '../room/roomManage/roomManage_view'; // 房间查看
  export default {
    props: ['operailityData'],
    data () {
      return {
        self: this,
        // 临时数据
        reservePoject: '', // 项目
        activeName: '', // 日期视图
        activeRoomName: '0', // 房间
        selRoomIndex: -1, // 房间
        selTimeSlotIndex: -1, // 时间段
        selDay: '', // 日期
        selRoom: '', // 选中的房间
        selReserveProjectId: '', // 原选中的项目id
        // 展示数据
        showSelectDay: false, // 是否显示日期选框
        autoSetTime: false, // 是否自定义时间段
        pickerSelectDay: '', // 选择的日期
        roomViewShowModal: false,
        dateChange: true,
        days: [], // 日期
        rooms: [], // 房间
        times: [], // 时间
        projectData: [], // 可预约项目
        tableBody: [], // 房间预约
        // 提交数据
        formValidate: {
          id: '',
          reserveProjectId: '', // 预约项目id
          reserveProjectName: '', // 预约项目名称
          roomId: '', // 房间id
          roomNum: '', // 房间号
          reserveDate: '', // 预约日期
          timeSlot: '', // 预约时间段
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          status: '' // 预约状态 UNREPORTED|待上报 START|待使用
        },
        // 原数据
        showData: {},
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        // 自定义时间段
        range: [],
        autoTime: {
          start: '',
          end: '',
          time: ''
        },
        // 编辑方式
        editType: 'add',
        // 展示数据
        roomViewShow: false,
        todoId: '',//查看房间的id
        roomViewId: {
          id: 'roomViewId',
          title: '房间信息'
        },
        hoverRoomId: ''
      };
    },
    methods: {
      init () {
        if (this.operailityData) {
          this.getProject();
          this.editType = 'edit';
        } else {
          this.getProjectList();

        }
      },
      //鼠标移入房间
      roomMouseenter (item) {
        this.hoverRoomId = item.roomId;
//        this.todoId = item.roomId;
//        this.roomViewShowModal = true;
//                this.$refs.popover1.handleMouseEnter('popover1')//隐藏通知弹出层
      },

      //鼠标移出房间号
      roomMouseleave () {
        this.hoverRoomId = '';
//                this.$refs.popover1.handleMouseLeave('popover1')//隐藏通知弹出层
//                this.roomViewShow = false;
      },
      /*********************************************** 数据获取 ***********************************/
      // 获取当前登录用户所能申请的项目列表
      getProject () {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data;
            this.selDay = res.data.reserveDate;
            this.formValidate.id = this.showData.id;
            this.formValidate.reserveProjectId = res.data.reserveProjectId;
            this.formValidate.startTime = res.data.startTime;
            this.formValidate.endTime = res.data.endTime;
            this.projectData[0] = {
              name: res.data.reservePojectName,
              reservePojectId: res.data.reserveProjectId
            };
            this.selReserveProjectId = res.data.reserveProjectId;
            this.getProjectList();
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        });
      },
      // 获取当前登录用户所能申请的项目列表
      getProjectList () {
        this.ajax({
          ajaxSuccess: res => {
            if (this.operailityData) {
              this.projectData = this.projectData.concat(res.data.length && res.data || []);
            } else {
              this.projectData = res.data || [];
            }
            // 默认选中第一个
            this.reservePoject = this.projectData[0];
          },
          ajaxParams: {
            url: api.myList.path,
            method: api.myList.method
          }
        });
      },
      // 获取日期
      getDaysForServer () {
        this.ajax({
          ajaxSuccess: res => {
            if (res.data == 'ALL') res.data = [];
            this.days = res.data || [];
            this.showSelectDay = false;
            if (!this.days.length) {
              this.getAllDay();
            }

            if (this.selReserveProjectId === this.formValidate.reserveProjectId) { // 如果是预约项目则进行数据还原（日期、房间、时间段）
              for (let i in res.data) {
                if (this.showData.reserveDate === res.data[i]) {
                  this.activeName = res.data[i];
                  this.selectDay(res.data[i]); // 指定日期
                  break;
                }
              }
            } else {
              this.activeName = this.days[0];
              this.selectDay(this.days[0]); // 指定日期
            }
          },
          ajaxParams: {
            url: api.dateList.path,
            method: api.dateList.method,
            params: {
              reserveProjectId: this.formValidate.reserveProjectId
            }
          }
        });
      },
      /**
       * 计算全天候的日期
       * 指定日期后的五天日期
       * */
      getAllDay (day) {
        let now = (day ? new Date(day) : new Date()).getTime();
        this.days.length = 0;
        for (let i = 0; i < 5; i++) {
          this.days.push(this.conductDate(new Date(now + (i * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd'));
        }
        this.showSelectDay = true;
        this.activeName = this.days[0];
        this.selectDay(this.days[0]); // 指定日期
      },
      // 获取项目日期对应的房间信息
      getRoomInfoByDay () {
        this.ajax({
          ajaxSuccess: res => {
            this.tableBody = res.data || {};
            // 不是同一项目的同一天不进行预约状态选择
            if (this.selReserveProjectId != this.formValidate.reserveProjectId || this.selDay != this.formValidate.reserveDate) {
              return;
            }
            // 时间段
            for (let i in res.data.timeSetList) {
              if (this.showData.timeSetId === res.data.timeSetList[i].timeSetId) {
                this.selTimeSlotIndex = +i;
                break;
              }
            }
            // 房间
            for (let j in res.data.roomList) {
              if (this.showData.roomId === res.data.roomList[j].roomId) {
                this.selRoomIndex = +j;
                break;
              }
            }
          },
          ajaxParams: {
            url: api.dateGet.path,
            method: api.dateGet.method,
            params: {
              date: this.formValidate.reserveDate,
              reserveProjectId: this.formValidate.reserveProjectId
            }
          }
        });
      },
      // 获取项目下的所有房间
      getRoomListByProject () {
        let opt = {
          ajaxSuccess: res => {
            this.activeRoomName = '0';
            if (res.data && res.data.length) {
              this.rooms = res.data;
              this.getTimeListByRoom();
            } else {
              this.initSelectTime();
              this.rooms = [];
              this.formValidate.roomId = '';
              this.formValidate.roomNum = '';
            }
          },
          ajaxError: () => this.errorMess('获取数据失败，请重试...'),
          ajaxParams: {
            url: api.roomList.path,
            method: api.roomList.method,
            params: {
              reserveProjectId: this.formValidate.reserveProjectId
            }
          }
        };
        this.ajax(opt);
      },
      // 获取项目下指定日期对应的房间的可预约时间段
      getTimeListByRoom () {
        this.formValidate.roomId = this.rooms[this.activeRoomName].roomId;
        this.formValidate.roomNum = this.rooms[this.activeRoomName].roomNum;
        this.initSelectTime();
        let opt = {
          ajaxSuccess: res => {
            if (this.editType === 'edit') {
              this.formValidate.timeSlot = this.formValidate.startTime + '-' + this.formValidate.endTime;
            }
            if (res.data && res.data.length) {
              this.times = res.data;
            } else { // 自己选择时间段
              if (this.editType === 'edit') {
                this.autoTime.start = this.showData.startTime;
                this.autoTime.end = this.showData.endTime;
              }
              setTimeout(() => this.autoSetTime = true, 50);
            }
          },
          ajaxError: () => this.errorMess('获取数据失败'),
          ajaxParams: {
            url: api.timeList.path,
            method: api.timeList.method,
            params: {
              date: this.formValidate.reserveDate,
              reserveProjectId: this.formValidate.reserveProjectId,
              roomId: this.formValidate.roomId
            }
          }
        };
        this.ajax(opt);
      },
      /************************************* 数据选择 **********************************/
      // 选择项目
      selectProject (data) {
        this.formValidate.reserveProjectId = data.reservePojectId;
        this.formValidate.reserveProjectName = data.name;
        // 加载项目的日期
        this.getDaysForServer();
      },
      // 选择日期
      selectDay (date) {
        let data = this.selDay === date ? this.showData : null;
        this.formValidate.reserveDate = date;
//        this.initSelectTime(data);
        this.getRoomListByProject();
//        this.getRoomInfoByDay();
      },
      // 时间段在今天是否已过期
      isObsolete (dataItem) {
        let selectTime = new Date(this.activeName + ' ' + dataItem.split('-')[0]).getTime();
        let now = new Date().getTime();
        return now > selectTime;
      },
      /************************************* 按钮事件 **********************************/
      // 日期选择
      handleClick () {
        this.selectDay(this.activeName);
      },
      // 房间选择
      handleRoomClick () {
        this.getTimeListByRoom();
      },
      /**
       * 选择时间段
       * roomInfo 房间信息
       * roomIndex 房间索引
       * timeSlotIndex 时间段索引
       * timeSlotType 时间段状态
       * isSelf 预约满之前是否是自己已预约的
       * */
      selectThisTime (roomInfo, roomIndex, timeSlotIndex, timeSlotType, isSelf) {
        if ((timeSlotType === 'tenancyEnds' && !isSelf) || timeSlotType === 'NO') { // 未开放和已约满
          return;
        }
        this.formValidate.roomId = roomInfo.roomId;
        this.formValidate.roomNum = roomInfo.roomNum;
        this.selRoomIndex = roomIndex;
        this.selTimeSlotIndex = timeSlotIndex;
      },
      // 提交数据
      subData (status) {
        let msg = status === 'START' ? '上报' : '保存';
        this.formValidate.status = status;
        if (this.checkSub()) {
          this.ajax({
            type: this.editType,
            successTitle: `${msg}成功`,
            errorTitle: `${msg}失败`,
            ajaxParams: {
              url: api[this.editType].path + (this.editType === 'edit' ? this.showData.id : ''),
              method: api[this.editType].method,
              data: this.$util._.defaultsDeep({}, this.formValidate)
            }
          });
        }
      },
      // 取消
      cancel () {
        this.$emit('cancel', this.editType);
      },
      /************************************* 其他 **************************************/
      // 获取提示
      getTitle (val) {
        let type = {
          optional: '可预约',
          tenancyEnds: '已约满',
          NO: '未开放'
        };
        return type[val] || val;
      },
      // 初始化预约数据
      initSelectTime () {
        this.times = [];
        this.formValidate.timeSlot = '';
        this.autoSetTime = false;
        this.autoTime = {
          start: '',
          end: '',
          time: ''
        };
      },
      // 检测是否可提交
      checkSub () {
        if (!this.formValidate.reserveProjectId) {
          this.errorMess('请选择预约项目');
          return false;
        }
        if (!this.formValidate.reserveDate) {
          this.errorMess('请选择预约项目日期');
          return false;
        }
        if (!this.formValidate.roomId) {
          this.errorMess('请选择预约项目房间');
          return false;
        }
        if (!this.formValidate.timeSlot) {
          this.errorMess('请选择预约项目时间段');
          return false;
        } else {
          let time = this.formValidate.timeSlot.split('-');
          this.formValidate.startTime = time[0];
          this.formValidate.endTime = time[1];
        }
        return true;
      }
    },
    filters: {
      // 可预约简写
      dataListType (val) {
        let type = {
          optional: '预',
          tenancyEnds: '满',
          NO: 'X'
        };
        return type[val] || val;
      }
    },
    created () {
      this.init();
    },
    components: {
      timeQuantum,
      roomView
    }
  };

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

  .baProBox {
    .el-radio {
      margin: 8px;
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

</style>
