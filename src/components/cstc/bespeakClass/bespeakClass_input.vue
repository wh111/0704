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
                    <el-tag type="success" class="bpUserItem" :closable="true"
                            v-for="(item,index) in formValidate.userList" @close="removeUser(index)" :key="item.userId">
                      {{ item.userName }}
                    </el-tag>
                    <el-button type="info" size="small" style="margin-left:10px;" @click="selectUser">选择人员</el-button>
                  </template>
                </div>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!--<el-col :span="8">-->
        <!--<el-form-item label="可预约数量：" prop="roomBearingCapacity">-->
        <!--<el-input v-model="formValidate.roomBearingCapacity"></el-input>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="8">
          <el-form-item label="最低开课人数：" prop="minNum">
            <el-input v-model="formValidate.minNum"></el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item label="课程内容：" prop="summary">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容"
                      v-model="formValidate.summary">
            </el-input>
          </el-form-item>
        </el-col>

        <el-col>
          <el-form-item>
            <el-checkbox v-model="formValidate.timeModel" true-label="SPECIFIC" false-label=""
                         @change="changeTimeModel">不自主选择房间、只描述要求
            </el-checkbox>
          </el-form-item>
        </el-col>

        <template v-if="formValidate.timeModel === 'SPECIFIC'">
          <el-col>
            <el-form-item label="预约日期：">
              <el-date-picker style="width:200px;" v-model="formValidate.openTime.date" :editable="false" type="date"
                              placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="预约时间段：">
              <time-quantum :index="0" :range="range2" :data="autoTime2" style="margin-top: 2px;"></time-quantum>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="所需场地描述：">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容"
                        v-model="formValidate.roomRquirement">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="所需设备描述：">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容"
                        v-model="formValidate.deviceRquirement">
              </el-input>
            </el-form-item>
          </el-col>

        </template>

      </el-form>
    </el-row>

    <template v-if="formValidate.timeModel !== 'SPECIFIC'">
      <el-row style="margin-bottom: 16px;">
        <!-- 全天候才显示 -->
        <el-col align="right">
          <span>快速选择：</span>
          <el-date-picker v-if="showSelectDay" v-model="pickerSelectDay" type="date" placeholder="选择日期"
                          :picker-options="pickerOptions" @change="getAllDay" :editable="false" clearable
                          style="margin-top: 5px;"></el-date-picker>
          <el-date-picker v-else v-model="pickerSelectDay" type="date" placeholder="选择日期"
                          :picker-options="pickerOptions" @change="getDaysForServer" :editable="false" clearable
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
            <!-- <el-tab-pane v-for="(item,index) in rooms" :key="index" -->
            <!-- :name="index+''"> -->
            <!-- <el-tooltip slot="label" effect="light" placement="top-start" @mouseleave="roomMouseleave()"> -->
            <!-- <div slot="content"> -->
            <!-- <room-view v-if="roomViewShowModal" :that="this" isShowLoading="true" :id="item.roomId"></room-view> -->
            <!-- </div> -->
            <!--<span slot="label" @mouseleave="roomMouseleave()" @mouseenter="roomMouseenter(item)">{{item.roomNum}}</span>-->
            <!-- <span @mouseenter="roomMouseenter(item)" >{{item.roomNum}}</span> -->
            <!-- </el-tooltip> -->
            <!--<span slot="label">{{item.roomNum}}</span>-->
            <!-- </el-tab-pane> -->

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
      <!-- <div style="background:#ff0000;">
      <el-popover

        v-show="roomViewShowModal"
        ref="popover1"
        placement="right-end"
        title="房间信息"
        width="500"
        trigger="click">
        <roomView v-if="roomViewShowModal" isShowLoading="true" :id="todoId"></roomView>
      </el-popover>
      </div> -->
      <br>
      <!-- 选择设备 -->
      <el-row>
        <el-form>
          <el-col>
            <el-form-item label="设备预约：">
              <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in roomDevice"
                      :closable="true"
                      :close-transition="false"
                      @close="handleClose('room',index)"
              >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
              </el-tag>
              <el-tag class="brsdItem" :key="item.id" v-for="(item,index) in otherDevice"
                      :closable="true"
                      :close-transition="false"
                      @close="handleClose('other',index)"
              >{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}
              </el-tag>
              <el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('room')">+选择设备</el-tag>
            </el-form-item>
          </el-col>
          <!--<el-col>-->
          <!--<el-form-item label="设备库：">-->
          <!--<el-tag class="brsdItem" :key="item.id" v-for="(item,index) in otherDevice"-->
          <!--:closable="true"-->
          <!--:close-transition="false"-->
          <!--@close="handleClose('other',index)"-->
          <!--&gt;{{ item.deviceTypeName + '(' + item.deviceIdentifier + ')' }}-->
          <!--</el-tag>-->
          <!--<el-tag class="brsdSelBtn brsdItem" type="primary" @click.native="selectDevice('other')">+选择设备</el-tag>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
        </el-form>
      </el-row>
    </template>

    <div align="center" style="margin-top:20px;">
      <el-button type="success" @click="subData('UNREPORTED')">保存</el-button>
      <el-button type="primary" @click="subData('PENDING')">上报</el-button>
      <el-button @click="close">取消</el-button>
    </div>

    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="selectDeviceModal" class-name="vertical-center-modal" :loading="true"
           :width="900">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" @select="selectDeviceCall" @cancel="cancel"
                     :url="selectDeviceUrl" :selectDeviceType="selectDeviceType" :select="roomDeviceId.concat(otherDeviceId)"></select-device>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="roomViewShowModal" class-name="vertical-center-modal" :loading="true"
           :width="500">
      <modal-header slot="header" :parent="self" :content="contentHeader.roomViewId"></modal-header>
      <roomView v-if="roomViewShowModal" isShowLoading="true" :id="todoId"></roomView>

      <div slot="footer"></div>
    </Modal>
    <!--选择授课老师-->
    <Modal :mask-closable="false" width="890" v-model="selectTeacherModal" title="添加人员"
           class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectTeacherId"></modal-header>
      <select-user v-if="selectTeacherModal" :isOnlyOne="true" @cancel="cancel('selectTeacher')"
                   @setUsers="selectTeacherCall" :initUser="selectTeacherData"></select-user>
      <div slot="footer"></div>
    </Modal>
    <!--选择人员-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" title="添加人员" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="cancel" @setUsers="selectUserCall"
                   :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  import roomView from '../room/roomManage/roomManage_view'; // 房间查看
  import selectUser from '../../common/selectUser'; // 选择人员
  import selectDevice from '../bespeakSetting/room/device_select.vue'; // 选择设备
  // 时间段插件
  import timeQuantum from '../../common/timeQuantum.vue';
  import {
    bespeakClass as rules
  } from '../rules'; // 验证规则
  export default {
    props: ['operailityData'],
    data () {
      return {
        rules,
        self: this,
        hoverRoomId: '',
        // 临时数据
        reservePoject: '', // 项目
        activeName: '', // 日期视图
        activeRoomName: '',
        selRoomIndex: -1, // 房间
        selTimeSlotIndex: -1, // 时间段
        selDay: '', // 日期
        // 展示数据
        roomViewShowModal: false,
        dateChange: true,
        showSelectDay: false, // 是否显示日期选框
        pickerSelectDay: '', // 选择的日期
//        timeSlot: [], // 时间段
        days: [], // 日期
        rooms: [], // 房间
        times: [], // 时间
        todoId: '',//查看房间的id
        projectData: {}, // 可预约项目
        tableBody: [], // 房间预约
        deviceList: [], // 设备
        showData: {}, // 原数据
        selectTeacherData: [],
        // 提交数据
        formValidate: {
          id: '',
          name: '', // 预约名称
          lecturer: '', // 授课人
          lecturerId: '',
          minNum: '', // 最低开课人数
          summary: '', // 预约内容
          timeModel: '', // 开放时间类型
          userType: 'ALL', // 开放预约对象类型
          roleId: '', // 角色id
          isCourse: 'YES', // 是否是课程
          userIds: '', // 预约人id字符串，多个id以逗号分隔
          roomRquirement: '', // 房间描述
          deviceRquirement: '', // 设备描述
          roomBearingCapacity: '', // 承载量
          reservePojectRoom: { // 预约房间对象
            roomId: '', // 房间id
            roomNum: '', // 房间号
            bearingCapacity: '' // 承载量
          },
          openTime: { // 开放时间对象
            reserveSetType: 'PROJECT', // 预约设置类型
            date: '', // 日期
            startTime: '', // 开始时间
            endTime: '' // 结束时间
          },
          deviceList: [ // 设备列表
            // {
            //   derviceId: "", // 设备id
            //   reserveNum: "", // 设备数量
            // }
          ],
          userList: [], // 人员列表
          status: '' // 预约状态 UNREPORTED|待上报 START|待使用
        },
        initUser: [],
        selectDeviceId: [],
        // 模态窗
        selectDeviceModal: false,
        selectRoomModal: false,
        selectUserModal: false,
        selectTeacherModal: false,
        contentHeader: {
          selectDeviceId: {
            id: 'selectDeviceId',
            title: '选择设备'
          },
          selectUserId: {
            id: 'selectUserId',
            title: '选择人员'
          },
          selectTeacherId: {
            id: 'selectTeacherId',
            title: '选择授课老师'
          },
          roomViewId: {
            id: 'roomViewId',
            title: '房间信息'
          }
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        // 编辑类型
        editType: 'add',
        timeSlot: '', // 选择的时间段
        // 自定义时间段
        range: [],
        autoTime: {
          start: '',
          end: '',
          time: ''
        },
        range2: [],
        autoTime2: {
          start: '',
          end: '',
          time: ''
        },
        autoSetTime: false,
        isFirst: false,
        roomDeviceId: [],
        otherDeviceId: [],
        roomDevice: [], // 房间内的设备
        otherDevice: [], // 房间外的设备
        selectDeviceUrl: '',
        selectDeviceType: '' // room|other

      };
    },
    methods: {
      init () {
        if (this.operailityData) {
          this.editType = 'edit';
          this.getShowData();
        } else {
          this.getDaysForServer();
          let userInfo = this.$store.getters.getUserInfo;
          this.selectTeacherData.push({
            key: userInfo.id,
            label: userInfo.name,
            description: '人员id---' + userInfo.id + '的描述信息',
            disabled: false
          });
          this.formValidate.lecturer = userInfo.name;
          this.formValidate.lecturerId = userInfo.id;
        }
      },

      //鼠标移入房间
      roomMouseenter (item) {
        this.hoverRoomId = item.roomId;
        console.log('移入：' + item.roomId);
//        this.roomViewShowModal = true;
        // this.$refs.popover1.handleMouseEnter('popover1')//隐藏通知弹出层
      },

      //鼠标移出房间号
      roomMouseleave () {
        this.hoverRoomId = '';
        console.log('移除');
        // this.$refs.popover1.handleMouseLeave('popover1')//隐藏通知弹出层
//        this.roomViewShowModal = false;
      },
      // 获取数据成功
      getShowDataSuccess (res) {
        this.showData = res.data;
        /* 赋值 */
        let formData = ['id', 'name', 'lecturer', 'minNum', 'summary', 'timeModel', 'userType', 'roleId', 'status',
          'userIds', 'roomRquirement', 'deviceRquirement'
        ];
        let roomData = this.formValidate.reservePojectRoom;
        let openTime = this.formValidate.openTime;
        let userList = this.formValidate.userList;
        /* 基本属性 */
        formData.map(key => this.formValidate[key] = res.data[key] || '');
        /* 房间 */
        this.formValidate.roomBearingCapacity = res.data.reservePojectRoom.bearingCapacity;
        Object.keys(roomData).map(key => roomData[key] = res.data.reservePojectRoom[key] || '');
        // 日期及时间
        Object.keys(openTime).map(key => openTime[key] = res.data.reserveOpenTimeDto[key] || '');

        // 显示数据
        this.deviceList = res.data.reservePojectDeviceList;
        /* 人员 */
        res.data.userList.map(item => userList.push({
          userId: item.userId,
          userName: item.userName
        }));

        this.selectTeacherData.push({
          key: res.data.lecturerId,
          label: res.data.lecturer,
          description: '人员id---' + res.data.lecturerId + '的描述信息',
          disabled: false
        });
        this.isFirst = true;
        /* 加载日期数据 */
        this.getDaysForServer();
      },
      // 改变时间类型
      changeTimeModel () {
        if (this.formValidate.timeModel) { // 不自主选择房间
          this.clearDateData();
        } else {
          this.clearRquirement();
          this.getDaysForServer();
        }
      },
      // 清除时间段
      clearTimeSlot () {
        this.timeSlot = '';
        this.autoSetTime = false;
        this.range = [];
        this.autoTime = {
          start: '',
          end: '',
          time: ''
        };
        this.range2 = [];
        this.autoTime2 = {
          start: '',
          end: '',
          time: ''
        };
      },
      // 清除日期
      clearDateData () {
        this.days = [];
        this.clearTimeSlot();
        this.clearRoomData();
        this.clearTimeData();
      },
      // 清除时间
      clearTimeData () {
        this.times = [];
        this.clearTimeSlot();
      },
      // 清除房间
      clearRoomData () {
        this.rooms = [];
        this.activeRoomName = '0';
        this.formValidate.reservePojectRoom.roomId = '';
        this.formValidate.reservePojectRoom.roomNum = '';
        this.clearDeviceData();
      },
      // 清除设备数据
      clearDeviceData () {
        this.roomDeviceId = [];
        this.otherDeviceId = [];
        this.roomDevice = []; // 房间内的设备
        this.otherDevice = []; // 房间外的设备
      },
      // 清除描述数据
      clearRquirement () {
        this.formValidate.roomRquirement = '';
        this.formValidate.deviceRquirement = '';
      },
      // 移除设备
      handleClose (type, index) {
        this[type + 'Device'].splice(index, 1);
        this[type + 'DeviceId'].splice(index, 1);
      },
      /*********************************************** 数据获取 ***********************************/
      // 获取当前登录用户所能申请的项目列表
      getShowData () {
        this.ajax({
          ajaxSuccess: 'getShowDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        });
      },
      // 获取日期
      getDaysForServer (day) {
        let date = this.conductDate(day || new Date(), 'yyyy-MM-dd');
        // todo 这里日期取值方式不对
        let userSelDate = this.editType === 'edit' ? this.showData.reserveOpenTimeDto.date : date;
        let beforeDay = new Date(date).getTime() > new Date(userSelDate).getTime(); // 预约日期已经无效
        this.clearDateData();
        this.ajax({
          ajaxSuccess: res => {
            this.days = res.data;
            this.showSelectDay = false;
            if (!res.data.length) {
              this.getAllDay();
            } else {
              userSelDate = this.editType === 'edit' ? userSelDate : res.data[0];
              this.activeName = userSelDate;
              this.selDay = userSelDate;
              this.selectDay(userSelDate); // 指定日期
            }

            if (beforeDay) { // 把原预约日期添加在有效日期前面
              this.days.unshift(userSelDate);
            }
          },
          ajaxParams: {
            url: api.dateList.path,
            method: api.dateList.method,
            params: {
              date
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
        this.selDay = this.days[0];
        this.selectDay(this.days[0]); // 指定日期
      },
      // 获取项目下的所有房间
      getRoomListByDate () {
        this.clearRoomData();
        let opt = {
          ajaxSuccess: res => {
            this.activeRoomName = '0';
            if (res.data && res.data.length) {
              this.rooms = res.data;
              if (this.isFirst) {
                res.data.map((item, index) => {
                  if (this.showData.reservePojectRoom.roomNum == item.roomNum) {
                    this.activeRoomName = index + '';
                  }
                });
                this.isFirst = false;
              }
              this.getTimeListByRoom();
              if (this.editType === 'edit') {
                /* 设备 */
                ((this.showData.deviceList instanceof Array) && this.showData.deviceList || []).map(item => {
                  if (item.inRoom) {
                    this.roomDeviceId.push(item.deviceId);
                    this.roomDevice.push(item);
                  } else {
                    this.otherDeviceId.push(item.deviceId);
                    this.otherDevice.push(item);
                  }
                });
              }
            }
          },
//          ajaxError: () => this.errorMess('获取数据失败，请重试...'),
          ajaxParams: {
            url: api.roomList.path,
            method: api.roomList.method,
            params: {
              date: this.formValidate.openTime.date
            }
          }
        };
        this.ajax(opt);
      },
      // 获取项目下指定日期对应的房间的可预约时间段
      getTimeListByRoom () {
        this.formValidate.reservePojectRoom.roomId = this.rooms[this.activeRoomName].roomId;
        this.formValidate.reservePojectRoom.roomNum = this.rooms[this.activeRoomName].roomNum;


        this.clearTimeData();
        let opt = {
          ajaxSuccess: res => {
            if (res.data && res.data.length) {
              this.times = res.data;
            } else { // 自己选择时间段
              if (this.editType === 'edit') {
                if (this.showData.timeModel) {
                  this.autoTime2.start = this.showData.reserveOpenTimeDto.startTime;
                  this.autoTime2.end = this.showData.reserveOpenTimeDto.endTime;
                } else if (this.times == 0) {
                  this.autoTime.start = this.showData.reserveOpenTimeDto.startTime;
                  this.autoTime.end = this.showData.reserveOpenTimeDto.endTime;
                }
              }
              this.autoSetTime = true;
            }
            if (this.editType === 'edit' && this.times != 0) {
              this.timeSlot = this.formValidate.openTime.startTime + '-' + this.formValidate.openTime.endTime;
            }
            this.formValidate.openTime.startTime = '';
            this.formValidate.openTime.endTime = '';
          },
//          ajaxError: () => this.errorMess('获取数据失败'),
          ajaxParams: {
            url: api.timeList.path,
            method: api.timeList.method,
            params: {
              date: this.formValidate.openTime.date,
              roomId: this.formValidate.reservePojectRoom.roomId
            }
          }
        };
        this.ajax(opt);
      },
      /************************************* 数据选择 **********************************/
      // 选择日期
      selectDay (date) {
        this.formValidate.openTime.date = date;
        this.getRoomListByDate();
      },
      // 房间选择
      handleRoomClick () {
        this.getTimeListByRoom();
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
        this.dateChange = false;
        this.selectDay(this.activeName);
        this.$nextTick(function () {
          this.dateChange = true;
        });
      },
      /**
       * 选择时间段
       * roomInfo 房间信息
       * roomIndex 房间索引
       * timeSlotIndex 时间段索引
       * timeSlotType 时间段状态
       * */
      selectThisTime (roomInfo, roomIndex, timeSlotIndex, timeSlotType) {
        if (timeSlotType === 'tenancyEnds' || timeSlotType === 'NO') { // 未开放和已约满
          return;
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
      subData (status) {
        if(this.formValidate.timeModel === 'SPECIFIC'){
          this.formValidate.openTime.date=this.conductDate(this.formValidate.openTime.date)
        }
        if (!this.checkSub()) {
          return;
        }
        let msg = status === 'PENDING' ? '上报' : '保存';
        let userIds = [];
        let data = this.$util._.defaultsDeep({}, this.formValidate);

        data.status = status;
        data.userList.map(item => userIds.push(item.userId));
        data.userIds = userIds.join(',');
        data.reservePojectRoom.bearingCapacity = data.roomBearingCapacity;
        data.deviceList = [];

        this.roomDeviceId.map(derviceId => {
          data.deviceList.push({
            derviceId,
            inRoom: 1
          });
        });

        this.otherDeviceId.map(derviceId => {
          data.deviceList.push({
            derviceId,
            inRoom: 0
          });
        });
        if (this.checkSub()) {
          this.ajax({
            type: this.editType,
            successTitle: `${msg}成功`,
            errorTitle: `${msg}失败`,
            ajaxParams: {
              jsonString: true,
              url: api[this.editType].path + (this.editType === 'edit' ? this.showData.id : ''),
              method: api[this.editType].method,
              data
            }
          });
        }
      },
      // 取消
      close () {
        this.$emit('cancel', this.editType);
      },

      lecturerChange (val) {
        this.formValidate.lecturerId = '';
      },
      //选择老师弹窗
      choiceTeacher () {
        this.selectTeacherModal = true;
      },
      //选择授课老师回调
      selectTeacherCall (res) {
        this.selectTeacherData = res;
        if (res == 0) res[0] = {};
        this.formValidate.lecturerId = res[0].key;
        this.formValidate.lecturer = res[0].label;
        this.selectTeacherModal = false;
      },
      // 选择设备
      selectDevice (type) {
        if (this.formValidate.reservePojectRoom.roomId) {
          this.selectDeviceUrl = api[type].path + this.formValidate.reservePojectRoom.roomId;
          this.selectDeviceType = type;
          this.openModel('selectDevice');
        } else {
          this.showMess('请选择预约房间');
        }

      },

      // 选择设备回调
      selectDeviceCall (arr) {
        this.roomDeviceId = [];
        this.roomDevice = [];
        this.otherDeviceId = [];
        this.otherDevice = [];
        (arr || []).map(item => {
          let deviceType = item.inRoom ? 'room' : 'other';
          this[deviceType + 'DeviceId'].push(item.id);
          this[deviceType + 'Device'].push(item);
        });
        this.cancel('selectDevice');
      },
//      // 选择设备模型
//      selectDeviceCall(res) {
//        let temp = [];
//        this.selectDeviceId.length = 0;
//        res.map(item => {
//          this.selectDeviceId.push(item.id);
//          temp.push({
//            derviceId: item.id,
//            deviceIdentifier: item.deviceIdentifier,
//            reserveNum: ""
//          })
//        })
//        this.formValidate.deviceList = temp;
//        this.deviceList = res;
//        this.cancel('selectDevice')
//      },

      // 选择人员
      selectUser () {
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
            });
          }
        }
        this.openModel('selectUser');
      },

      // 选择人员回调
      selectUserCall (res) {
        this.formValidate.userList.length = 0;
        this.$util._.forEach(res, val => {
          this.formValidate.userList.push({
            userId: val.key,
            userName: val.label
          });
        });
        this.cancel('selectUser');
      },

      // 删除人员
      removeUser (index) {
        this.formValidate.userList.splice(index, 1);
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
//      initSelectTime(obj) {
//        this.selRoomIndex = -1;
//        this.selTimeSlotIndex = -1;
//        if (obj) {
//          this.formValidate.reservePojectRoom.roomId = obj.reservePojectRoom.roomId;
//          this.formValidate.reservePojectRoom.roomNum = obj.reservePojectRoom.roomNum;
//          this.formValidate.openTime.timeSetId = obj.reserveOpenTimeDto.timeSetId;
//        } else {
//          this.formValidate.reservePojectRoom.roomId = '';
//          this.formValidate.reservePojectRoom.roomNum = '';
//          this.formValidate.openTime.timeSetId = '';
//          this.formValidate.deviceList.length = 0;
//          this.selectDeviceId.length = 0;
//        }
//      },
      // 检测是否可提交
      checkSub () {
        if (!this.submitForm('formValidate')) {
          return false;
        }

//        if (this.formValidate.minNum < 1 || +this.formValidate.minNum > +this.formValidate.roomBearingCapacity) {
//          this.errorMess('最低开课人数为1且不能超过可预约数量');
//          return false
//        }

        if (!this.formValidate.openTime.date) {
          this.errorMess('请选择预约项目日期');
          return false;
        }
        if (!this.timeSlot) {
          let time = this.autoTime2.time.split('-');
          let time1 = this.autoTime.time.split('-');
          if (this.formValidate.timeModel && time[0] && time[1]) {
            this.formValidate.openTime.startTime = time[0];
            this.formValidate.openTime.endTime = time[1];
          } else if (!this.formValidate.timeModel && time1[0] && time1[1]) {
            this.formValidate.openTime.startTime = time1[0];
            this.formValidate.openTime.endTime = time1[1];
          } else {
            this.errorMess('请选择预约项目时间段');
            return false;
          }
        } else {
          let time = this.timeSlot.split('-');
          if (!time[0]) {
            this.errorMess('请选择预约项目时间段');
            return;
          }
          this.formValidate.openTime.startTime = time[0];
          this.formValidate.openTime.endTime = time[1];
        }
        if (!this.formValidate.timeModel) {
          // if (!this.formValidate.deviceList.length) {
          //   this.errorMess('请选择预约项目所需设备');
          //   return false
          // }
          if (!this.formValidate.reservePojectRoom.roomId) {
            this.errorMess('请选择预约项目房间');
            return false;
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
        return true;
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
      /********************************* 模态窗 **********************/
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      },
      // 模态窗关闭
      cancel (options) {
        this[options + 'Modal'] = false;
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
    components: {
      selectUser,
      selectDevice,
      timeQuantum,
      roomView
    },
    created () {
      this.init();
    }
  };

</script>

<style lang="scss">
  /* 新建申请 */
  body .el-popover {
    top: 0 !important;
  }

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
