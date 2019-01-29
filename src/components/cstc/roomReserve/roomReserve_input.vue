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
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="预约人：" prop="applicantName">
            <el-input v-model="formValidate.applicantName" :disabled="from==='admin'" readonly>
              <el-button slot="append" icon="plus" @click="selectUser" v-if="from!=='admin'"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用类型：" prop="useType">
            <el-select style="width: 100%" v-model="formValidate.useType" placeholder="请选择" :disabled="from==='admin'">
              <el-option v-for="item in useTypeOption" :key="item.value" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预约时间类型：" prop="reserveDateType" label-width="140px">
            <!--<el-select style="width: 100%" v-model="formValidate.reserveDateType" placeholder="请选择" :disabled="from==='admin'">-->
            <!--<el-option v-for="item in useTypeOption" :key="item.value" :label="item.name" :value="item.code"></el-option>-->
            <!--</el-select>-->
            <el-radio-group v-model="formValidate.reserveDateType" :disabled="!!selectRoomId.length || !!formValidate.roomReserveId || from==='admin'">
              <el-radio v-for="(item,index) in reserveOption" v-if="item.value" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="预约人数：" prop="reserveNumber">
            <el-input v-model="formValidate.reserveNumber">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="备注：" prop="comments">
            <el-input v-model="formValidate.comments" type="textarea" :disabled="from==='admin'" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 短期 -->
      <template v-if="formValidate.reserveDateType === 'SHORTTERM'">
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

        <el-row>
          <el-col>
            <el-col :span="2">
              <p class="bpaTitleText">预约房间：</p>
            </el-col>
            <el-col :span="19">
              <el-tabs v-if="selectRoomId.length" v-model="activeRoomName" @tab-click="handleRoomClick('')">
                <el-tab-pane v-for="(item,index) in selectData" :key="index"
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

          <el-col>
            <!-- 全天候才显示 -->
            <el-col align="right" v-if="activeRoomName">
              <span>选择开始日期：</span>
              <el-date-picker v-if="showSelectDay" v-model="pickerSelectDay" type="date" placeholder="选择日期"
                              :picker-options="pickerOptionsAllDay" @change="getAllDay" :editable="false" clearable
                              style="margin-top: 5px;"></el-date-picker>
              <el-date-picker v-else v-model="pickerSelectDay" type="date" placeholder="选择日期"
                              :picker-options="pickerOptionsAllDay" @change="getDaysForServer" :editable="false" clearable
                              style="margin-top: 5px;"></el-date-picker>
            </el-col>
          </el-col>

          <el-col :span="2">
            <p class="bpaTitleText">日期预约：</p>
          </el-col>
          <el-col :span="22">
            <el-checkbox-group v-model="selectAllDate" @change="selectAllDateChange">
              <el-tabs v-if="days.length" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="(item,index) in days" :key="index" :label="item" :name="item+''">
                  <template slot="label">
                    <div @click.stop.prevent="selectDate(item)" style="display: inline-block;">
                      <el-checkbox :label="item"><span></span></el-checkbox>
                    </div>
                    <span :style="{color:Object.keys(selectData[activeRoomName].date[item].timeSlot).length ? '#13ce66' : ''}">{{ item }}</span>
                  </template>
                </el-tab-pane>
              </el-tabs>
              <span class="bpaTitleText" v-else>请选择日期</span>
            </el-checkbox-group>
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
                  <el-col :span="20" v-if="selectTimeSlot.includes(index) && selectData[activeRoomName].date[activeName].timeSlot[index]">
                    <span class="bpaTitleText">设备：</span>
                    <el-tag class="brsdItem" :key="item.id" v-for="(item,rIndex) in selectData[activeRoomName].date[activeName].timeSlot[index].roomDevice"
                            :closable="true" :close-transition="false" @close="handleClose('room',index,rIndex)">
                      {{ item.deviceTypeName }}
                    </el-tag>
                    <el-tag class="brsdItem" :key="item.id" v-for="(item,oIndex) in selectData[activeRoomName].date[activeName].timeSlot[index].otherDevice"
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
      </template>
      <!-- 长期 -->
      <template v-else>
        <el-row>
          <el-col>
            <date-group :sDate="dateSlot.start" :eDate="dateSlot.end">
              <el-col :span="10">
                <el-form-item label="开始日期：">
                  <el-date-picker style="width: 100%" name="start" v-model="dateSlot.start" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions0"
                                  @change="handleStartTimeCall"></el-date-picker>
                  <!--<el-date-picker style="width: 100%" name="start" v-model="dateSlot.start" :editable="false" type="date" placeholder="选择日期"-->
                  <!--@change="handleStartTime"></el-date-picker>-->
                </el-form-item>
              </el-col>

              <el-col :span="10" :offset="4">
                <el-form-item label="结束日期：">
                  <el-date-picker style="width: 100%" name="end" v-model="dateSlot.end" :editable="false" type="date" placeholder="选择日期" :picker-options="pickerOptions1"
                                  @change="handleEndTimeCall"></el-date-picker>
                  <!--<el-date-picker style="width: 100%" name="end" v-model="dateSlot.end" :editable="false" type="date" placeholder="选择日期"-->
                  <!--@change="handleEndTime"></el-date-picker>-->
                </el-form-item>
              </el-col>
            </date-group>
          </el-col>

          <el-col>
            <el-form-item label="房间：">
              <el-tag class="crrRoomTagItem" v-for="(room,index) in selectData" :key="index" :closable="true" type="info" @close="removeRoom(index)">
                {{room.roomNum}}
              </el-tag>
              <el-button type="info" @click="selectRoom">选择房间</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="roomReserveDataSlotBox" @click.native="selectRoomDataSlot" v-show="dataSlotArrGroupByMonth">
          <ul class="rrdsbInfo">
            <li><b>操作说明</b></li>
            <li>1.请先选择开始、结束日期以及房间之后再操作此表格；</li>
            <li>2.同一房间内跨天选择可进行日期区间的快速选择；</li>
            <li>3.全选/取消全选将对所有房间的所有日期进行选择操作；</li>
            <li>4.点击单个日期方框可进行选择和取消选择操作。</li>
            <li><b>图例说明</b></li>
            <li>
              <span class="rrdsbidItem icon"></span>
              <span>可选择</span>
              <span class="rrdsbidItem icon select"></span>
              <span>已选择</span>
              <span class="rrdsbidItem icon disabled"></span>
              <span>不可选择</span>
            </li>
          </ul>
          <el-table
            border
            ref="dayTabel"
            :data="selectDayTableData"
            @selection-change="handleSelectionChange"
            class="rrdsbTable"
            style="width: 100%">
            <template v-if="dataSlotArrGroupByMonth">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column prop="roomNum" label="房间号" width="120" fixed="left" key="roomNum" show-overflow-tooltip>
                <template scope="scope">
                  <span class="rrdsbiRoom">{{ scope.row.roomNum }}</span>
                </template>
              </el-table-column>
              <el-table-column v-for="(item,index) in dataSlotArrGroupByMonth" header-align="center" align="center" :label="index" :key="index">
                <el-table-column min-width="40px" v-for="dayObj in item" :key="dayObj.dayStr"
                                 :prop="dayObj.dayStr" :label="dayObj.day" align="center">
                  <template scope="scope">
                <span class="rrdsbidItem"
                      :data-info="scope.row.roomId+'_'+scope.$index+'_'+dayObj.dayStr"
                      :class="[scope.row[dayObj.dayStr]]"
                ></span>
                  </template>
                </el-table-column>
              </el-table-column>
            </template>
          </el-table>
          <!-- 设备 -->
          <el-table
            :data="selectDeviceRoomArr"
            border
            style="width: 100%">
            <el-table-column prop="roomNum" label="房间号" width="170" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备">
              <template scope="scope">
                <template v-if="selectData[scope.row.roomId].device.otherDevice.length || selectData[scope.row.roomId].device.roomDevice.length">
                  <!--<span>{{ [...selectData[scope.row.roomId].device.roomDevice,...selectData[scope.row.roomId].device.otherDevice] | getArrText('deviceTypeName') }}</span>-->

                  <el-tag class="rrdsbDeviceItem" v-for="(device,index) in selectData[scope.row.roomId].device.roomDevice" :key="device.deviceId" :closable="true"
                          :close-transition="false" type="primary"
                          @close="handleCloseLong(scope.row.roomId,'room',index)">
                    {{ device.deviceTypeName }}
                  </el-tag>
                  <el-tag class="rrdsbDeviceItem" v-for="(device,index) in selectData[scope.row.roomId].device.otherDevice" :key="device.deviceId" :closable="true"
                          :close-transition="false" type="primary"
                          @close="handleCloseLong(scope.row.roomId,'other',index)">
                    {{ device.deviceTypeName }}
                  </el-tag>
                </template>
                <span v-else>未选择设备</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="110px" align="center">
              <template scope="scope">
                <el-button type="primary" size="small" @click="selectDeviceLong(scope.row.roomId,'room')">选择设备</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </template>
      <br>
    </el-form>

    <div align="center" style="margin-top:20px;">
      <template v-if="from==='admin'">
        <el-button type="success" @click="subData('ADOPT')">通过</el-button>
        <el-button type="primary" @click="subData('REJECT')">驳回</el-button>
      </template>
      <template v-else>
        <template v-if="from==='adminAdd'">
          <el-button type="success" @click="subData('ADOPT')">保存</el-button>
        </template>
        <template v-else>
          <el-button type="success" @click="subData('UNREPORTED')">保存</el-button>
          <el-button type="primary" @click="subData('REPORTED')">上报</el-button>
        </template>
      </template>
      <el-button @click="close('')">取消</el-button>
    </div>

    <!-- 模态框 选择房间 -->
    <Modal :mask-closable="false" v-model="selectRoomModal" class-name="vertical-center-modal" :loading="true"
           :width="1000">
      <modal-header slot="header" :parent="self" :content="contentHeader.selectRoomId"></modal-header>
      <select-room v-if="selectRoomModal" :select="selectRoomId" @cancel="cancel" @select="selectRoomCall"></select-room>
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
    <!--选择人员-->
    <Modal width="890" v-model="selectUserModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="contentHeader.selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="cancel('selectUser')" @setUsers="selectUserCall"
                   :initUser="applicantUser"></select-user>
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

  .crrRoomTagItem {
    margin: 5px;
  }

  .roomReserveDataSlotBox {
    border: 1px solid #ccc;
    &.show {
      .rrdsbidItem {
        cursor: default !important;
      }
    }
    .rrdsbTable {
      .el-table__header thead tr:nth-child(2) .cell {
        padding: 0;
      }
      tbody .cell {
        padding: 0;
      }
    }
    .rrdsbItem {
      &:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }
    }
    .rrdsbiRoom {
      padding: 0 18px;
    }
    .rrdsbidItem {
      width: 100%;
      height: 34px;
      display: inline-block;
      margin: 2px;
      background-color: #ccc;
      &.disabled {
        background-color: red;
      }
      &:not(.disabled) {
        cursor: pointer;
      }
      &.select {
        background-color: green;
      }
    }
    .rrdsbInfo {
      padding: 10px 18px;
      line-height: 24px;
      b {
        padding-top: 10px;
      }
      .rrdsbidItem {
        width: 20px;
        height: 20px;
      }
    }
    .rrdsbDeviceItem {
      margin: 4px;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import { getSaveData, getEditData, getLongTermSaveData, getLongTermEditData } from './formatData';
  import { roomReserve as rules } from '../rules';
  import selectRoom from './roomReserve_selectRoom'; // 选择房间
  import reserveOption from './reserveOption'; // 预约时间类型
  import roomView from '../room/roomManage/roomManage_view'; // 房间查看
  import timeQuantum from '../../common/timeQuantum.vue';   // 时间段插件
  import selectUser from '../../common/selectUser';   // 时间段插件
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
        now: '', // 系统日期
        self: this,
        reserveOption,
        formValidate: {
          'roomReserveId': '',
          'name': '', // 预约名称
          'useType': '', // 使用类型
          'comments': '', // 备注
          'applicantId': '', // 申请人id
          'applicantName': '', // 申请人姓名
          'reserveDateType': 'LONGTERM', // 	预约时间类型 （SHORTTERM 短期|LONGTERM	长期）
          'status': '', // 状态
          reserveNumber: '',
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
        pickerOptionsAllDay: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },

        dateSlot: { // 日期区间（）
          start: '',
          end: ''
        },
        applicantUser: [], // 预约人

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
        selectUserModal: false,
        showSelectDay: false, // 是否显示日期选框

        selectAllDate: [],
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
          },
          selectUserId: {
            id: 'selectUserId',
            title: '选择预约人'
          }
        },

        reservaStateCache: {}, // 预约状态缓存
        selectData: null, // 已选择的数据
        selectDayTableData: [], // 日期表格
        dataSlotArrGroupByMonth: null, // 表格头部（按月份划分）
        quickSelectDataSlot: [], // 快速选择日期区间
        selectTableRoomId: [], // 记录表格中全选的房间id
        selectDeviceRoomArr: [], // 选择过日期的房间
        isClickDaySelect: false // 点击日期控制全选
      };
    },
    computed: {
      selectDeivceId () { // 选中设备的id
        let timeSlot = {roomDeviceId: [], otherDeviceId: []};
        if (this.formValidate.reserveDateType === 'LONGTERM') { // 长期预约
          timeSlot = this.selectData[this.activeRoomName].device;
        } else { // 短期预约
          timeSlot = this.selectData[this.activeRoomName].date[this.activeName].timeSlot[this.activeTimeSlot];
        }
        return timeSlot.roomDeviceId.concat(timeSlot.otherDeviceId);
      },
      selectTableData () {
        return getSaveData(this.selectData);
      },
      dataSlotArr () {
        let days = [];
        let {start, end} = this.dateSlot;
        let day = 0; // 相差多少天
        let startTime;
        if (start && end) {
          startTime = new Date(start);
          day = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (24 * 3600 * 1000));
          '1'.repeat(1 + day).split('').map((_, i) => days.push(this.conductDate(new Date(start).setDate(startTime.getDate() + i))));
          console.log(days, day);
        }
        return days;
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getUseOption();
        this.getNowTime();
        if (this.operailityData) {
          this.editType = 'edit';
          this.getShowData();
        } else {
//          this.getDaysForServer();
          let userInfo = this.$store.getters.getUserInfo;
          this.formValidate.applicantName = userInfo.name;
          this.formValidate.applicantId = userInfo.id;
        }
      },
      /************************************* 按钮事件 **********************************/
      handleStartTimeCall (d) {
        this.handleStartTime(d);
        this.getDisSelectDayByRoom();
      },
      handleEndTimeCall (d) {
        this.handleEndTime(d);
        this.getDisSelectDayByRoom();
      },
      // 日期选择表格
      handleSelectionChange (table) {
        console.log(`允许选择表格操作回调：${this.isClickDaySelect}`);
        if (this.isClickDaySelect) {
          return false;
        }
        let oldSelectTableRoomId = this.selectTableRoomId;
        let selectTableRoomId = [];
        // 先全选
        table.map(item => {
          selectTableRoomId.push(Number(item.roomId));
          this.dataSlotArr.map(day => !item[day] && (item[day] = 'select'));
        });
        // 原来全选的此次未全选的
        this.selectDayTableData.map(tableItem => {
          let roomId = Number(tableItem.roomId);
          if (oldSelectTableRoomId.includes(roomId) && !selectTableRoomId.includes(roomId)) {
            // 取消全选
            this.dataSlotArr.map(day => tableItem[day] === 'select' && (tableItem[day] = ''));
          }
        });
        this.selectTableRoomId = selectTableRoomId;
        // 同步更新设备表格
        this.getSelectDeviceRoomArr();
        console.log(table);
      },
      // 选择房间预约日期（事件委托）
      selectRoomDataSlot (e) {
        let {dataset, className} = e.target;
        // 不是日期的点击或者该日期被禁选的都不进行处理
        if (!~className.indexOf('rrdsbidItem') || !!~className.indexOf('icon') || !!~className.indexOf('disabled')) {
          return false;
        }
        let {info} = dataset;
        info = info.split('_');
        let tag = !~className.indexOf('select') ? 'select' : '';
        let quickSelect = this.$util._.defaultsDeep([], this.quickSelectDataSlot);
        // 同步变更表格中此天对应的状态
        this.selectDayTableData[info[1]][info[2]] = tag;
        if (tag) {
          // 如果是选项的同一个房间的日期，就把此次选择的日期加入到快速选择区间
          if (quickSelect.length && Number(quickSelect[0][0]) === Number(info[0])) {
            quickSelect.push(info);
          } else { // 记录为下一次快速选择的初始值
            quickSelect = [info];
          }
        } else { // 取消选择
          quickSelect = []; // 清除快速选择区间
        }
        this.quickSelectDataSlot = quickSelect;
        console.log(dataset, className);
        // 满足快速选择就进行快速选择
        quickSelect.length === 2 && this.quickSelectDataSlotCall();
        // 此房间的日期是否都选择
        this.tableRoomDaySelectAllStatus(info);
        // 同步更新设备表格
        this.getSelectDeviceRoomArr();
      },
      // 选择预约人
      selectUser () {
        let user = [];
        let {applicantName: label, applicantId: key} = this.formValidate;
        key && (user[0] = {label, key});
        this.applicantUser = user;
        this.openModel('selectUser');
      },
      // 移除房间
      removeRoom (roomId) {
        let roomData = this.$util._.defaultsDeep({}, this.selectData);
        let rooms = this.$util._.defaultsDeep({}, this.rooms);
        delete roomData[roomId];
        delete rooms[roomId];
        this.selectRoomId = Object.keys(roomData || {}).map(roomId => Number(roomId));
        this.selectData = roomData;
        // 同步删除表格中的数据
        for (let i = 0; i < this.selectDayTableData.length; i++) {
          if (Number(this.selectDayTableData[i].roomId) === Number(roomId)) {
            this.selectDayTableData.splice(i, 1);
            break;
          }
        }
        console.log('删除房间：' + roomId, this.selectDayTableData);
        // 清除房间日期快速选择
        this.quickSelectDataSlot = [];
        this.rooms = rooms;
      },
      // 日期选择
      handleClick () {
//        this.clearRoomData();
//        this.getSelectRoom();
        console.log('日期选择');
        this.getTimeListByRoom();
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
//        if (this.activeName == 0) {
//          this.errorMess('请先选择需要预约的日期');
//          return false;
//        }
        this.openModel('selectRoom');
      },

      // 房间选择
      handleRoomClick (roomId, setData = true) {
        if (roomId) {
          this.activeRoomName = roomId.toString();
        }
        this.clearDateData();
        console.log(roomId);
//        setData && this.setSelectDataByRoom();
//        this.getTimeListByRoom();
        this.getDaysForServer();
      },

      // 长期预约时选择设备
      selectDeviceLong (roomId, type) {
        this.activeRoomName = roomId;
        this.selectDevice('', type);
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
          if (this.formValidate.reserveDateType === 'LONGTERM') { // 长期预约
            this.selectData[this.activeRoomName].device[key] = device[key];
          } else { // 短期预约
            this.selectData[this.activeRoomName].date[this.activeName].timeSlot[this.activeTimeSlot][key] = device[key];
          }
        }

        this.cancel('selectDevice');
      },

      // 长期预约移除设备
      handleCloseLong (roomId, type, index) {
        this.activeRoomName = roomId;
        this.handleClose(type, '', index);
      },

      // 移除设备
      handleClose (type, slot, index) {
        let device;
        if (this.formValidate.reserveDateType === 'LONGTERM') { // 长期预约
          device = this.selectData[this.activeRoomName].device;
        } else {
          device = this.selectData[this.activeRoomName].date[this.activeName].timeSlot[slot];
        }
        device[type + 'Device'].splice(index, 1);
        device[type + 'DeviceId'].splice(index, 1);
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
        let date = this.activeName;
        let selTimeSlot = this.selectData[this.activeRoomName].date[date].timeSlot;
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
        console.log(timeSlot);
        this.selectData[this.activeRoomName].date[date].timeSlot = timeSlot;
        this.selectAllDateByTimeSlot();
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
        delete data[roomId].date[date].timeSlot[slot];
        this.selectData = data;
        this.selectAllDateByTimeSlot(date);
      },

      // 此天不是全选的
      selectAllDateByTimeSlot (day) {
        let date = day || this.activeName;
        let dateIndex = this.selectAllDate.indexOf(date);
        let timeLen = Object.keys(this.times || {}).length;
        let dateTimeSlotLen = Object.keys(this.selectData[this.activeRoomName].date[date].timeSlot).length;
        if (timeLen === dateTimeSlotLen) { // 全选
          // 选择此天
          !~dateIndex && this.selectAllDate.push(date);
        } else { // 取消选择此天
          !!~dateIndex && this.selectAllDate.splice(dateIndex, 1);
        }
      },

      // 选择日期
      selectAllDateChange () {
        console.log('切换日期');
      },

      // 选择框选择日期
      selectDate (date) {
        let hasIndex = this.selectAllDate.indexOf(date);
        let isThisdate = this.activeName === date;
        !isThisdate && (this.activeName = date);
        // 有就删除、没有就追加
        if (!~hasIndex) {
          this.selectAllDate.push(date);
          this.selectTimeSlotCall();
        } else {
          this.selectAllDate.splice(hasIndex, 1);
          this.selectTimeSlotCall(date);
        }
        if (!isThisdate) {
          this.handleClick();
        }
        console.log(date);
      },

      // 选择时间段
      selectTimeSlotCall (day) {
        let date = day || this.activeName;
        let allTimeSlot = this.$util._.defaultsDeep([], this.selectTimeSlot);
        if (day) { // 清除这天的时间段
          allTimeSlot = [];
        } else {
          let hasDay = !!~this.selectAllDate.indexOf(date);
          Object.keys(this.times).map(slot => {
            if (hasDay) {
              // 排除不可选择的
              !~this.selectTimeSlot.indexOf(slot) && this.times[slot].status === 'optional' && allTimeSlot.push(slot);
            }
          });
        }
        this.selectTimeSlot = allTimeSlot;
        this.changeTimeSlot(allTimeSlot);
      },
      /************************************* 弹窗回调 **********************************/
      // 选择人员
      selectUserCall (users) {
        this.applicantUser = users;
        this.formValidate.applicantName = users[0].label;
        this.formValidate.applicantId = users[0].key;
        this.cancel('selectUser');
      },
      // 选择房间
      selectRoomCall (res) {
        let data = this.$util._.defaultsDeep({}, this.rooms || {});
        let selectData = this.$util._.defaultsDeep({}, this.selectData || {});
        let selectRoomId = [];
        (res || []).map(item => {
          item.roomId = item.roomId || item.id;
          if (!data[item.roomId]) {
            let {roomId, roomName, roomNum} = item;
            data[item.roomId] = {roomName, roomNum, roomId};
            selectData[item.roomId] = {roomName, roomNum, roomId, date: {}};
            if (this.formValidate.reserveDateType === 'LONGTERM') { // 预约时间类型为长期的时候
              selectData[item.roomId].device = { // 设备提出来与房间关联
                roomDevice: [],
                roomDeviceId: [],
                otherDevice: [],
                otherDeviceId: []
              };
            }
          }
        });
        selectRoomId = Object.keys(data).map(roomId => Number(roomId));
        selectRoomId.sort((a, b) => a - b);
        console.log(data);
        this.rooms = data;
        this.selectData = selectData;
        console.log(selectData);
        console.log(selectRoomId);
        this.selectRoomId = selectRoomId;
        // 长期预约的才获取房间预约日期
        if (this.formValidate.reserveDateType === 'LONGTERM') {
          this.getDisSelectDayByRoom();
        } else if (!this.activeRoomName) {
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

        this.$emit(this.editType,this.editType,msg ? msg + '成功！' : null);
      },
      /************************************* 数据转换 **********************************/
      // 获取选择过日期的房间
      getSelectDeviceRoomArr () {
        let arr = [];
        this.selectDayTableData.map(roomItem => {
          let {roomId, roomNum} = roomItem;
          let hasSelect = this.dataSlotArr.some(day => roomItem[day] === 'select');
          hasSelect && arr.push({roomId, roomNum});
        });
        console.log('重新计算了');
        this.selectDeviceRoomArr = arr;
      },
      // 根据表格中的日期选择数量来判断表格的全选状态
      tableRoomDaySelectAllStatus (infoArr) {
        let row = this.selectDayTableData[infoArr[1]];
        let roomId = Number(infoArr[0]);
        let unSelRowAll = this.dataSlotArr.some(day => !row[day]);
        let selectAllIndex = this.selectTableRoomId.indexOf(roomId);
        this.isClickDaySelect = true;
        this.$nextTick(function () {
          if (!unSelRowAll && !~selectAllIndex) { // 全选
            this.selectRoomDayTable(roomId, row);
          } else if (unSelRowAll && !!~selectAllIndex) { // 取消全选
            this.selectTableRoomId.splice(selectAllIndex, 1);
            this.$refs.dayTabel.toggleRowSelection(row);
            console.log(`取消选择id ${roomId}`);
          }
          this.isClickDaySelect = false;

        });
        console.log('未全选：' + unSelRowAll);
        console.log(infoArr);
      },
      // 选择房间表格
      selectRoomDayTable (roomId, row) {
        this.selectTableRoomId.push(Number(roomId));
        this.$refs.dayTabel.toggleRowSelection(row);
        console.log(`选择房间id ${roomId}`);
      },
      // 设置选择数据
      setSelectDataByRoom () {
        let seldata = Util._.defaultsDeep({}, this.selectData);
        if (!seldata[this.activeRoomName]) { // 当前日期是否已经选择过房间
          seldata[this.activeRoomName] = {};
        }
        if (!seldata[this.activeRoomName][this.activeName]) {
          // 记录指定日期的预约房间信息
          seldata[this.activeRoomName][this.activeName] = Util._.defaultsDeep({}, this.days[this.activeName]);
          // 记录该房间的开放日期
          seldata[this.activeRoomName][this.activeName].timeSlot = {};
          this.selectData = seldata;
        }
        console.log('初始化选择数据', seldata);
      },
      // 通过选择数据还原时间段
      getTimeSlotBySelectData () {
        console.log('开始获取时间段数据');
        let timeSlot = this.selectData[this.activeRoomName].date[this.activeName].timeSlot;
        let timeSlotArr = Object.keys(timeSlot);
        let selectTimeSlot = [];
        timeSlotArr.map(slot => this.times[slot] && selectTimeSlot.push(slot.toString()));
        console.log(selectTimeSlot);
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
          maxDate: '',
          minDate: '',
          roomReserveDetailsList: []
        };
        if (res.data instanceof Object) {
          data = res.data;
        }
        let editRes = res.data.reserveDateType === 'SHORTTERM' ? getEditData(data.roomReserveDetailsList) : getLongTermEditData(data);
        let roomIds = (Object.keys(editRes.rooms || {}).map(id => Number(id))).sort((a, b) => a - b);
        Object.keys(this.formValidate).map(key => this.formValidate[key] = data[key]);
        this.selectData = editRes.res;
        this.rooms = editRes.rooms;
        if (res.data.reserveDateType === 'SHORTTERM') { // 短期预约
          this.handleRoomClick(roomIds[0] || '');
//        this.getDaysForServer();
        }
        if (res.data.reserveDateType === 'LONGTERM') { // 长期预约
//          this.selectTableRoomId = editRes.selectAllDayRoomIds;
          this.selectDayTableData = editRes.selectDayTableData;
          this.dateSlot = editRes.dateSlot;
          this.selectRoomId = roomIds;
        }
      },

      // 从原数据中获取选择的房间数据
      getSelectRoom () {
        return '';
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
      // 设置房间的日期数据
      setRoomDateData () {
        let selectData = this.$util._.defaultsDeep({}, this.selectData);
        let roomId = this.activeRoomName;
        this.activeName = this.days[0];
        // 记录此房间下的日期
        this.days.map(date => {
          if (!selectData[roomId].date[date]) {
            selectData[roomId].date[date] = {
              date, timeSlot: {}
            };
          }
        });
        this.selectData = selectData;
        console.log(selectData);
        this.handleClick();
      },
      // 根据月份划分日期
      dataSlotArrGroupByMonthCall () {
        let data = {};
        this.dataSlotArrGroupByMonth = null;
        this.dataSlotArr.map(day => {
          let splitArr = day.split('-');
          if (!data[splitArr[0] + '-' + splitArr[1]]) { // 按月份划分
            data[splitArr[0] + '-' + splitArr[1]] = [];
          }
          data[splitArr[0] + '-' + splitArr[1]].push({dayStr: day, day: splitArr[2]});
        });
        this.$nextTick(function () {
          this.dataSlotArrGroupByMonth = data;
        });
      },
      // 快速选择
      quickSelectDataSlotCall () {
        let quickSelect = this.quickSelectDataSlot;
        if (quickSelect.length !== 2) {
          return false;
        }
        // 进行日期排序让日期区间正常排列
        quickSelect.sort((a, b) => a[2] > b[2]);
        let quickSelectData = this.selectDayTableData[quickSelect[0][1]];
        // 提取在快速选择区间内符合的日期键（只记录还能选择的日期）
        let quickSelectDay = Object.keys(quickSelectData).filter(key => /\d{4}-\d{2}-\d{2}/.test(key) && key > quickSelect[0][2] && key < quickSelect[1][2] && quickSelectData[key] === '');
        // 全部选择
        quickSelectDay.map(day => quickSelectData[day] = 'select');
        console.log(quickSelect, quickSelectDay);
        this.quickSelectDataSlot = [];
      },
      // 转换预约 数据
      reserveRoomDateList (res) {
        let tableData = this.$util._.defaultsDeep([], this.selectDayTableData);
        let roomIndex = {};
        let tempData = [];
        this.selectTableRoomId = [];
        tableData.map((roomItem, index) => roomIndex[roomItem.roomId] = index);
        (res.data || []).map((item, index) => {
          let roomItem = item;
          this.dataSlotArr.map(day => {
            // 提取原来选择的
            let flag = (roomIndex[item.roomId] !== undefined) && tableData[roomIndex[item.roomId]][day] || '';
            if ((item.timeModel || '').toUpperCase() !== 'ALL') { // 指定开放日期，不在指定日期内的都是不允许选择的
              flag = (item.openDateList || []).includes(day) ? (flag || '') : 'disabled';
            }
            // 存在禁选日期则直接禁选
            flag = item.dateList.includes(day) ? 'disabled' : flag;
            !roomItem[day] && (roomItem[day] = flag);
          });
          roomIndex[item.roomId] = index;
          tempData.push(roomItem);
        });
        this.selectDayTableData = tempData;
        // 全选
        Object.keys(roomIndex).map(roomId => this.tableRoomDaySelectAllStatus([roomId, roomIndex[roomId]]));
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
        this.clearDateData();
        for (let i = 0; i < 5; i++) {
          this.days.push(this.conductDate(new Date(now + (i * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd'));
        }
        this.showSelectDay = true;
//        this.activeName = this.days[0];
        this.setRoomDateData();
      },
      // 获取日期
      getDaysForServer (day) {
        let date = this.conductDate(day || new Date(), 'yyyy-MM-dd');
        let roomId = this.activeRoomName;
        this.clearDateData();
        this.ajax({
          ajaxSuccess: res => {
            if (!res.data.length) {
              this.getAllDay();
            } else {
              this.days = res.data;
              this.showSelectDay = false;
            }
            this.setRoomDateData();
          },
          ajaxParams: {
            url: api.dateList.path,
            method: api.dateList.method,
            params: {
              date,
              roomId
            }
          }
        });
      },
      // 获取项目下指定日期对应的房间的可预约时间段
      getTimeListByRoom () {
        this.clearTimeData();
        let date = this.activeName;
        let opt = {
          ajaxSuccess: res => {
            let times = null;
            if (res.data && res.data.length) {
              times = {};
              res.data.map(item => {
                let slot = this.getTimeSlotString(item);
                times[slot] = item;
              });
              this.times = times;
              this.getTimeSlotBySelectData();
              // 选择当前天数的时间段
              this.selectTimeSlotCall();
              console.log(times);
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
      // 获取系统当前日期
      getNowTime () {
        let opt = {
          ajaxSuccess: res => {
            // 顶多能预约半年（6个月）
            this.initStartEndTime(new Date(res.data));
            let start = res.data;
            let end = new Date().setMonth(new Date(res.data).getMonth() + 1);
            if (this.editType === 'add') {
              this.dateSlot = {start, end};
            }
          },
          ajaxParams: {
            url: '/nowTime'
          }
        };
        this.ajax(opt);
      },
      // 提交数据
      subData (status) {
        if (!this.checkSub()) {
          return;
        }
        let msg = {
          ADOPT: '通过',
          REJECT: '驳回',
          PENDING: '上报',
          UNREPORTED: '保存'
        };
        let data = this.$util._.defaultsDeep({}, this.formValidate);
        let roomReserveDetailsList = this.formValidate.reserveDateType === 'LONGTERM' ? getLongTermSaveData(this.selectDayTableData, this.selectData, this.dateSlot) : Util._.defaultsDeep([], this.selectTableData);
        data.status = status;
        if (!roomReserveDetailsList.length) {
          this.errorMess('至少预约一个房间才能' + msg[status]);
          return false;
        }
        data.roomReserveDetailsList = roomReserveDetailsList;
        let opt = {
          ajaxSuccess: () => {console.log(msg[status]); this.close(msg[status])},
          ajaxParams: {
            jsonString: true,
            url: api[this.editType].path + (this.editType === 'edit' ? this.operailityData.roomReserveId : ''),
            method: api[this.editType].method,
            data
          }
        };
        console.log(data);
        this.ajax(opt);
      },
      // 获取房间指定日期和时间段内是否可以预约
      getReservaState (obj) {
        let {date, roomId, startTime, endTime, state} = obj;
        let key = roomId + '_' + date + '_' + startTime + '_' + endTime;
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
      // 获取房间禁选日期
      getDisSelectDayByRoom () {
        let {start: startDate, end: endDate} = this.dateSlot;
        let roomIds = this.selectRoomId.join(',');
        if (!(startDate && endDate && roomIds)) {
          return false;
        }
        startDate = this.conductDate(startDate);
        endDate = this.conductDate(endDate);
        let opt = {
          ajaxSuccess: 'reserveRoomDateList',
          ajaxParams: {
            url: api.reserveRoomDateList.path,
            method: api.reserveRoomDateList.method,
            params: {
              startDate, endDate, roomIds, roomReserveId: this.formValidate.roomReserveId || ''
            }
          }
        };
        this.ajax(opt);
//        this.reserveRoomDateList();
      },
      /************************************* 清除数据 **********************************/
      // 清除日期
      clearDateData () {
        this.activeName = '';
        this.days = [];
        this.selectAllDate = [];
        this.clearTimeData();
      },
      // 清除房间
      clearRoomData () {
        this.rooms = null;
        this.activeRoomName = '';
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
    watch: {
//      ['dateSlot.start'] () {
//        this.getDisSelectDayByRoom();
//      },
//      ['dateSlot.end'] () {
//        this.getDisSelectDayByRoom();
//      },
      ['dataSlotArr'] () {
        this.dataSlotArrGroupByMonthCall();
      },
      ['selectDayTableData'] () {
        this.getSelectDeviceRoomArr();
      }
    },
    components: {
      selectRoom, roomView, timeQuantum, selectDevice
    }
  };

</script>
