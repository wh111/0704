<!--
****--@file     roomReserve_input
****--@date     2018/7/20 10:42
****--@author   YC
****--@describe 预约房间-编辑
-->
<template>
  <div>
    <el-form label-width="100px" :model="formValidate" ref="formValidate" :rules="rules">
      <el-row>
        <el-col>
          <el-form-item label="预约名称：" prop="name">
            <el-input v-model="formValidate.name" placeholder="请输入预约名称" :disabled="from==='admin'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="预约人：" prop="applicantName">
            <el-input v-model="formValidate.applicantName" :disabled="from==='admin'" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="使用类型：" prop="useType">
            <el-select style="width: 100%" v-model="formValidate.useType" placeholder="请选择" :disabled="from==='admin'">
              <el-option v-for="item in useTypeOption" :key="item.value" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注：" prop="comments">
            <el-input v-model="formValidate.comments" type="textarea" :disabled="from==='admin'" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-table align="center" :context="self" :data="selectTableData" tooltip-effect="dark">
        <el-table-column label="预约日期" prop="date" show-overflow-tooltip></el-table-column>
        <el-table-column label="预约房间" prop="roomNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="预约时间" prop="startTime" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.startTime }}-{{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="预约设备" prop="deviceList" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.deviceList | getArrText('deviceTypeName') }}
          </template>
        </el-table-column>
        <el-table-column label="预约状态" prop="state" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.state ? scope.row.state : getReservaState(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="80" align="center">
          <template scope="scope">
            <el-button type="danger" size="small" @click="removeTimeSlot(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <br>

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
        <el-col>
          <el-col :span="2">
            <p class="bpaTitleText">预约房间：</p>
          </el-col>
          <el-col :span="19">
            <el-tabs v-if="rooms" v-model="activeRoomName" @tab-click="handleRoomClick('')">
              <el-tab-pane v-for="(item,index) in rooms" :key="index"
                           :name="item.roomId+''">
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
            <span class="bpaTitleText" v-else>请选择房间</span>
          </el-col>
          <el-col :span="3" align="right">
            <el-button type="info" @click="selectRoom">选择房间</el-button>
          </el-col>
        </el-col>
        <el-col :span="2">
          <p class="bpaTitleText">时间预约：</p>
        </el-col>
        <el-col :span="22">
          <template v-if="times instanceof Object">
            <el-checkbox-group v-model="selectTimeSlot" class="bpaTimeSelectBox" @change="changeTimeSlot">
              <el-col v-for="(item,index) in times" :key="index">
                <el-col :span="4">
                  <el-checkbox class="bpaTimeSelectItem" :label="index" :disabled="item.status=='tenancyEnds'">
                    {{ index }}
                  </el-checkbox>
                </el-col>
                <el-col :span="20" v-if="selectTimeSlot.includes(index) && selectData[activeName][activeRoomName].timeSlot[index]">
                  <span class="bpaTitleText">设备：</span>
                  <el-tag class="brsdItem" :key="item.id" v-for="(item,rIndex) in selectData[activeName][activeRoomName].timeSlot[index].roomDevice"
                          :closable="true" :close-transition="false" @close="handleClose('room',index,rIndex)">
                    {{ item.deviceTypeName }}
                  </el-tag>
                  <el-tag class="brsdItem" :key="item.id" v-for="(item,oIndex) in selectData[activeName][activeRoomName].timeSlot[index].otherDevice"
                          :closable="true" :close-transition="false" @close="handleClose('other',index,oIndex)">
                    {{ item.deviceTypeName }}
                  </el-tag>
                  <el-button type="info" @click="selectDevice(index,'room')">选择设备</el-button>
                </el-col>

              </el-col>
            </el-checkbox-group>
          </template>
          <!--<template v-else-if="autoSetTime">-->
          <!--<template v-for="(item,index) in autoTime">-->
          <!--<el-col>-->
          <!--<el-col :span="6">-->
          <!--<time-quantum :key="index" :index="index" :range="range" :data="item" style="margin-top: 2px;"></time-quantum>-->
          <!--</el-col>-->
          <!--<el-col :span="16">-->
          <!--1-->
          <!--</el-col>-->
          <!--<el-col :span="2" align="right">-->
          <!--<el-button v-if="index===autoTime.length-1" @click="addAutoTimeSlot">添加</el-button>-->
          <!--<el-button v-else type="danger" @click="delAutoTimeSlot(index)">删除</el-button>-->
          <!--</el-col>-->
          <!--</el-col>-->
          <!--</template>-->
          <!--</template>-->
          <span class="bpaTitleText" v-else>{{ times === null ? '请选择房间' : (times === -1 ? '加载中...' : '没有设置时间段，不允许预约') }}</span>
        </el-col>
      </el-row>

      <br>
    </el-form>

    <div align="center" style="margin-top:20px;">
      <template v-if="from==='admin'">
        <el-button type="success" @click="subData('ADOPT')">通过</el-button>
        <el-button type="primary" @click="subData('REJECT')">驳回</el-button>
      </template>
      <template v-else>
        <el-button type="success" @click="subData('UNREPORTED')">保存</el-button>
        <el-button type="primary" @click="subData('REPORTED')">上报</el-button>
      </template>
      <el-button @click="close('')">取消</el-button>
    </div>

    <!-- 模态框 选择房间 -->
    <Modal :mask-closable="false" v-model="selectRoomModal" class-name="vertical-center-modal" :loading="true"
           :width="800">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" :urlParams="api.roomList" :select="selectRoomId"
                   :postData="{date:activeName}" @cancel="cancel" @select="selectRoomCall"></select-room>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 选择设备 -->
    <Modal :mask-closable="false" v-model="selectDeviceModal" class-name="vertical-center-modal" :loading="true"
           :width="900">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectDeviceId"></modal-header>
      <select-device v-if="selectDeviceModal" @select="selectDeviceCall" @cancel="cancel"
                     :url="selectDeviceUrl" :selectDeviceType="selectDeviceType" :select="selectDeivceId"></select-device>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  .bpaTitleText {
    line-height: 42px;
    font-size: 14px;
  }

  .bpaTimeSelectItem {
    line-height: 42px;
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import { getSaveData, getEditData } from './formatData';
  import { roomReserve as rules } from '../rules';
  import selectRoom from '../../common/selectRoom'; // 选择房间
  import roomView from '../room/roomManage/roomManage_view'; // 房间查看
  import timeQuantum from '../../common/timeQuantum.vue';   // 时间段插件
  import selectDevice from '../bespeakSetting/room/device_select.vue'; // 选择设备

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'roomReserveInput',
    props: ['operailityData', 'from'],
    data () {
      return {
        api,
        rules,
        self: this,
        formValidate: {
          'roomReserveId': '',
          'name': '', // 预约名称
          'useType': '', // 使用类型
          'comments': '', // 备注
          'applicantId': '', // 申请人id
          'applicantName': '', // 申请人姓名
          'status': '' // 状态
//          'roomReserveDetailsList': [ // 房间预约详情列表
//            {
//              'roomId': '', // 房间id
//              'roomNum': '', // 房间号
//              'date': '', // 预约日期
//              'startTime': '', // 开始时间
//              'endTime': '', // 结束时间
//              'deviceList': [ // 设备列表
//                {
//                  'deviceTypeId': '', // 设备类型id
//                  'deviceId': '', // 设备id
//                  'inRoom': '' // 是否房间内
//                }
//              ]
//            }
//          ]
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },

        useTypeOption: [], // 使用类型

        selectDeviceUrl: '',
        selectDeviceType: '',
        hoverRoomId: '',
        // 临时数据
        activeName: '', // 日期视图
        activeRoomName: '', // 房间号选项
        activeTimeSlot: '', // 选择设备时绑定的时间段
        selectTimeSlot: [], // 选择的时间段
        // 展示数据
        autoSetTime: false,
        selectRoomModal: false,
        roomViewShowModal: false,
        selectDeviceModal: false,
        showSelectDay: false, // 是否显示日期选框

        pickerSelectDay: '', // 选择的日期
        days: [], // 日期
        rooms: null, // 房间
        times: null, // 时间
        range: [], // 时间范围
        autoTime: [{start: '', end: '', time: ''}], // 自定义时间段
        selectRoomId: [], // 选择房间id

        roomDeviceId: [], // 房间内的设备
        otherDeviceId: [], // 房间外的设备
        // 编辑类型
        editType: 'add',

        contentHeader: {
          selectRoomId: {
            id: 'selectRoomId',
            title: '选择可预约房间'
          },
          selectDeviceId: {
            id: 'selectDeviceId',
            title: '选择设备'
          }
        },

        reservaStateCache: {}, // 预约状态缓存
        selectData: null // 已选择的数据
      };
    },
    computed: {
      selectDeivceId () { // 选中设备的id
        let timeSlot = this.selectData[this.activeName][this.activeRoomName].timeSlot[this.activeTimeSlot];
        return timeSlot.roomDeviceId.concat(timeSlot.otherDeviceId);
      },
      selectTableData () {
        return getSaveData(this.selectData);
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getUseOption();
        if (this.operailityData) {
          this.editType = 'edit';
          this.getShowData();
        } else {
          this.getDaysForServer();
          let userInfo = this.$store.getters.getUserInfo;
          this.formValidate.applicantName = userInfo.name;
          this.formValidate.applicantId = userInfo.id;
        }
      },
      /************************************* 按钮事件 **********************************/
      // 日期选择
      handleClick () {
        this.clearRoomData();
        this.getSelectRoom();
      },
      //鼠标移入房间
      roomMouseenter (item) {
        this.hoverRoomId = item.roomId;
      },

      //鼠标移出房间号
      roomMouseleave () {
        this.hoverRoomId = '';
      },

      // 选择房间
      selectRoom () {
        if (this.activeName == 0) {
          this.errorMess('请先选择需要预约的日期');
          return false;
        }
        this.openModel('selectRoom');
      },

      // 房间选择
      handleRoomClick (roomId, setData = true) {
        if (roomId) {
          this.activeRoomName = roomId.toString();
        }
        console.log(roomId);
        setData && this.setSelectDataByRoom();
        this.getTimeListByRoom();
      },

      // 选择设备
      selectDevice (slot, type) {
        this.selectDeviceUrl = api[type].path + this.activeRoomName;
        this.selectDeviceType = type;
        this.activeTimeSlot = slot;
        this.openModel('selectDevice');
      },
      // 选择设备回调
      selectDeviceCall (arr) {
        let device = {
          roomDeviceId: [],
          roomDevice: [],
          otherDeviceId: [],
          otherDevice: []
        };
        (arr || []).map(item => {
          let deviceType = item.inRoom ? 'room' : 'other';
          item.deviceId = item.id || item.deviceId;
          device[deviceType + 'DeviceId'].push(item.deviceId);
          device[deviceType + 'Device'].push(item);
        });

        for (let key in device) {
          this.selectData[this.activeName][this.activeRoomName].timeSlot[this.activeTimeSlot][key] = device[key];
        }

        this.cancel('selectDevice');
      },

      // 移除设备
      handleClose (type, slot, index) {
        this.selectData[this.activeName][this.activeRoomName].timeSlot[slot][type + 'Device'].splice(index, 1);
        this.selectData[this.activeName][this.activeRoomName].timeSlot[slot][type + 'DeviceId'].splice(index, 1);
      },

      // 添加自定义时间段
      // addAutoTimeSlot () {
      //   this.autoTime.push({start: '', end: '', time: ''});
      // },
      // 删除自定义时间段
      // delAutoTimeSlot (index) {
      //   this.autoTime.splice(index, 1);
      // },

      // 选择时间段
      changeTimeSlot (val) {
        let timeSlot = {};
        let selTimeSlot = this.selectData[this.activeName][this.activeRoomName].timeSlot;
        (val || []).map(slot => {
          // 如果原来有数据就保留，否则就创建新数据
          timeSlot[slot] = Util._.defaultsDeep({}, selTimeSlot[slot] || this.times[slot]);
          if (!selTimeSlot[slot]) { // 时间段对应关系
            timeSlot[slot].otherDevice = []; // 房间外的设备
            timeSlot[slot].roomDevice = []; // 房间内的设备
            timeSlot[slot].otherDeviceId = []; // 房间外的设备
            timeSlot[slot].roomDeviceId = []; // 房间内的设备
            timeSlot[slot].state = ''; // 预约状态
          }
        });
        this.selectData[this.activeName][this.activeRoomName].timeSlot = timeSlot;
        console.log(this.selectData[this.activeName][this.activeRoomName].timeSlot);
      },

      // 删除时间段
      removeTimeSlot (obj) {
        let {date, roomId, startTime, endTime} = obj;
        let data = Util._.defaultsDeep({}, this.selectData);
        let slot = this.getTimeSlotString({startTime, endTime});
        if (this.activeName === date && this.activeRoomName === roomId) { // 相同天删除指定的房间
          let delIndex = this.selectTimeSlot.indexOf(slot);
          if (!!~delIndex) { // 删除时间段
            this.selectTimeSlot.splice(delIndex, 1);
          }
        }
        delete data[date][roomId].timeSlot[slot];
        this.selectData = data;
      },
      /************************************* 弹窗回调 **********************************/
      // 选择房间
      selectRoomCall (res) {
        let data = {};
        let selectRoomId = [];
        (res || []).map(item => {
          item.roomId = item.roomId || item.id;
          data[item.roomId] = item;
          selectRoomId.push(item.roomId);
        });
        selectRoomId.sort((a, b) => a - b);
        console.log(data);
        this.rooms = data;
        this.selectRoomId = selectRoomId;
        if (!this.activeRoomName) {
          this.handleRoomClick(selectRoomId.length ? selectRoomId[0].toString() : '');
        }
        this.cancel('selectRoom');
      },
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
      },
      // 取消编辑
      close (msg) {
        this.$emit(this.editType, this.editType, msg ? msg + '成功！' : null);
      },
      /************************************* 数据转换 **********************************/
      // 设置选择数据
      setSelectDataByRoom () {
        let seldata = Util._.defaultsDeep({}, this.selectData);
        if (!seldata[this.activeName]) { // 当前日期是否已经选择过房间
          seldata[this.activeName] = {};
        }
        if (!seldata[this.activeName][this.activeRoomName]) {
          // 记录指定日期的预约房间信息
          seldata[this.activeName][this.activeRoomName] = Util._.defaultsDeep({}, this.rooms[this.activeRoomName]);
          // 记录该房间的开放日期
          seldata[this.activeName][this.activeRoomName].timeSlot = {};
          this.selectData = seldata;
        }
        console.log('初始化选择数据', seldata);
      },
      // 通过选择数据还原时间段
      getTimeSlotBySelectData () {
        console.log('开始获取时间段数据');
        let timeSlot = this.selectData[this.activeName][this.activeRoomName].timeSlot;
        let timeSlotArr = Object.keys(timeSlot);
        let selectTimeSlot = [];
        console.log(selectTimeSlot);
        timeSlotArr.map(slot => this.times[slot] && selectTimeSlot.push(slot.toString()));
        this.selectTimeSlot = selectTimeSlot;
      },
      // 获取时间段
      getTimeSlotString (obj) {
        return (obj.startTime + '-' + obj.endTime).toString();
      },
      // 检测是否可提交
      checkSub () {
        return this.submitForm('formValidate');
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
      // 获取查看数据成功
      getShowDataSuccess (res) {
        let data = {
          roomReserveDetailsList: []
        };
        if (res.data instanceof Object) {
          data = res.data;
        }
        Object.keys(this.formValidate).map(key => this.formValidate[key] = data[key]);
        this.selectData = getEditData(data.roomReserveDetailsList);
        this.getDaysForServer();
      },

      // 从原数据中获取选择的房间数据
      getSelectRoom () {
        let rooms = null;
        let selectRoomId = [];
        console.log(this.activeName);
        if (this.selectData && this.selectData[this.activeName]) {
          let roomObj = Util._.defaultsDeep({}, this.selectData[this.activeName]);
          rooms = {};
          for (let roomId in roomObj) {
            rooms[roomId] = {roomId, roomNum: roomObj[roomId].roomNum};
            selectRoomId.push(Number(roomId));
          }
        }
        this.rooms = rooms;
        this.selectRoomId = selectRoomId;
        if (selectRoomId.length) {
//          this.activeRoomName = selectRoomId[0].toString();
//          this.getTimeListByRoom();
          this.handleRoomClick(selectRoomId[0], false);
        }
      },
      /************************************* 获取数据 **********************************/
      // 获取编辑数据
      getShowData () {
        this.ajax({
          ajaxSuccess: 'getShowDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.roomReserveId,
            method: api.get.method
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
//        this.activeName = this.days[0];
      },
      // 获取日期
      getDaysForServer (day) {
        let date = this.conductDate(day || new Date(), 'yyyy-MM-dd');
        this.clearDateData();
        this.ajax({
          ajaxSuccess: res => {
            if (!res.data.length) {
              this.getAllDay();
            } else {
              this.days = res.data;
              this.showSelectDay = false;
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
      // 获取项目下指定日期对应的房间的可预约时间段
      getTimeListByRoom () {
        this.clearTimeData();
        let opt = {
          ajaxSuccess: res => {
            let times = null;
            if (res.data && res.data.length) {
              times = {};
              res.data.map(item => times[this.getTimeSlotString(item)] = item);
              this.times = times;
              console.log(times);
              this.getTimeSlotBySelectData();
//              this.autoSetTime = false;
            } else { // 自己选择时间段
//              this.autoSetTime = true;
              this.times = 0;
            }
          },
          ajaxParams: {
            url: api.timeList.path,
            method: api.timeList.method,
            params: {
              date: this.activeName,
              roomId: this.activeRoomName,
              roomReserveId: this.operailityData ? this.operailityData.roomReserveId : ''
            }
          }
        };
        this.times = -1;
        this.ajax(opt);
      },
      // 获取使用类型
      getUseOption () {
        let opt = {
          ajaxSuccess: res => this.useTypeOption = res.data || [],
          ajaxParams: {
            url: api.getAffairType.path,
            method: api.getAffairType.method
          }
        };
        this.ajax(opt);
      },
      // 提交数据
      subData (status) {
        if (!this.checkSub()) {
          return;
        }
        let msg = status === 'PENDING' ? '上报' : '保存';
        let data = this.$util._.defaultsDeep({}, this.formValidate);
        let roomReserveDetailsList = Util._.defaultsDeep([], this.selectTableData);
        data.status = status;
        if (!roomReserveDetailsList.length) {
          this.errorMess('至少预约一个房间才能' + msg);
          return false;
        }
        data.roomReserveDetailsList = roomReserveDetailsList;
        let opt = {
          ajaxSuccess: 'close',
          ajaxParams: {
            jsonString: true,
            url: api[this.editType].path + (this.editType === 'edit' ? this.operailityData.roomReserveId : ''),
            method: api[this.editType].method,
            data
          }
        };
        this.ajax(opt);
      },
      // 获取房间指定日期和时间段内是否可以预约
      getReservaState (obj) {
        let {date, roomId, startTime, endTime, state} = obj;
        let key = date + '_' + roomId + '_' + startTime + '_' + endTime;
        if (this.reservaStateCache[key] === undefined && !state) { // 防止触发多个人相同请求
          this.reservaStateCache[key] = 0;
          this.ajax({
            ajaxLoading: false,
            ajaxSuccess: res => {
              let str = res.data === 'optional' ? '可预约' : '被占用';
              obj.state = str;
              this.reservaStateCache[key] = str;
            },
            ajaxParams: {
              url: 'reserve/room/time/select/inspect',
              params: {date, roomId, startTime, endTime}
            }
          });
        } else {
          obj.state = this.reservaStateCache[key] || '加载中...';
        }
      },
      /************************************* 清除数据 **********************************/
      // 清除日期
      clearDateData () {
        this.days = [];
        this.clearRoomData();
      },
      // 清除房间
      clearRoomData () {
        this.rooms = null;
        this.activeRoomName = '';
        this.clearTimeData();
      },
      // 清除时间
      clearTimeData () {
        this.times = null;
        this.range = [];
        this.autoSetTime = [{start: '', end: '', time: ''}];
        this.selectTimeSlot.length = 0;
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      selectRoom, roomView, timeQuantum, selectDevice
    }
  };

</script>
