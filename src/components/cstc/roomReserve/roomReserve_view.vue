<!--
****--@file     roomReserve_view
****--@date     2018/7/20 10:42
****--@author   YC
****--@describe 预约房间-查看
-->
<template>
  <div>
    <el-form label-width="100px" ref="formValidate">
      <el-row>
        <el-col>
          <el-form-item label="预约名称：" prop="name">
            {{ formValidate.name }}
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="预约人：" prop="applicantName">
            {{ formValidate.applicantName }}
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="使用类型：" prop="useType">
            {{ formValidate.useType | userType(useTypeOption) }}
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="预约人数：" prop="useType">
            {{ formValidate.reserveNumber }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注：" prop="comments">
            {{ formValidate.comments }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="状态：">{{ formValidate.status | roomReserve }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 短期 -->
    <template v-if="formValidate.reserveDateType==='SHORTTERM'">
      <el-table align="center" :context="self" :data="selectTableData" tooltip-effect="dark">
        <el-table-column label="预约日期" prop="date" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.date | formatDate('yyyy-MM-dd') }}
          </template>
        </el-table-column>
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
      </el-table>
    </template>
    <!-- 长期预约 -->
    <template v-if="formValidate.reserveDateType==='LONGTERM'">
      <el-row class="roomReserveDataSlotBox show" v-show="dataSlotArrGroupByMonth">
        <ul class="rrdsbInfo">
          <li><b>图例说明</b></li>
          <li>
            <span class="rrdsbidItem icon"></span>
            <span>可预约</span>
            <span class="rrdsbidItem icon select"></span>
            <span>已预约</span>
            <span class="rrdsbidItem icon disabled"></span>
            <span>不可预约</span>
          </li>
        </ul>
        <el-table
          border
          ref="dayTabel"
          :data="selectDayTableData"
          class="rrdsbTable"
          style="width: 100%">
          <template v-if="dataSlotArrGroupByMonth">
            <el-table-column prop="roomNum" label="房间号" width="170" fixed="left" key="roomNum" show-overflow-tooltip>
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
                <span>{{ [...selectData[scope.row.roomId].device.roomDevice,...selectData[scope.row.roomId].device.otherDevice] | getArrText('deviceTypeName') }}</span>
              </template>
              <span v-else>未选择设备</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </template>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import { getLongTermEditData } from './formatData';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'roomReserveView',
    props: ['operailityData'],
    data () {
      return {
        self: this,
        useTypeOption: {},
        selectTableData: [],
        formValidate: {
          'roomReserveId': '',
          'name': '', // 预约名称
          'useType': '', // 使用类型
          'comments': '', // 备注
          'applicantId': '', // 申请人id
          'applicantName': '', // 申请人姓名
          'reserveDateType': '', // 	预约时间类型 （SHORTTERM 短期|LONGTERM	长期）
          'status': '',// 状态
          reserveNumber: '',
        },

        dateSlot: { // 日期区间（）
          start: '',
          end: ''
        },
        selectData: null, // 已选择的数据
        selectDayTableData: [], // 日期表格
        dataSlotArrGroupByMonth: null, // 表格头部（按月份划分）
        selectDeviceRoomArr: [], // 选择过日期的房间
        selectRoomId: []
      };
    },
    computed: {
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
      },
      // 获取使用类型
      getUseOption () {
        let opt = {
          ajaxSuccess: res => {
            if (!res.data.length) {
              return;
            }
            res.data.map(item => {
              this.useTypeOption[item.code] = item;
            });
            this.getShowData();
          },
          ajaxParams: {
            url: api.getAffairType.path,
            method: api.getAffairType.method
          }
        };
        this.ajax(opt);
      },
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
      // 获取查看数据成功
      getShowDataSuccess (res) {
        let data = {
          roomReserveDetailsList: []
        };
        if (res.data instanceof Object) {
          data = res.data;
        }
        Object.keys(this.formValidate).map(key => this.formValidate[key] = data[key]);
        if (res.data.reserveDateType === 'SHORTTERM') {
          this.selectTableData = data.roomReserveDetailsList;
        } else {
          let editRes = getLongTermEditData(data);
          this.selectData = editRes.res;
          this.rooms = editRes.rooms;
          this.selectRoomId = Object.keys(editRes.rooms);
          this.selectDayTableData = editRes.selectDayTableData;
          this.dateSlot = editRes.dateSlot;
        }
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
      },
      // 转换预约 数据
      reserveRoomDateList (res) {
        let tableData = this.$util._.defaultsDeep([], this.selectDayTableData);
        let roomIndex = {};
        let tempData = [];
        tableData.map((roomItem, index) => roomIndex[roomItem.roomId] = index);
        (res.data || []).map(item => {
          let roomItem = roomIndex[item.roomId] !== undefined ? tableData[roomIndex[item.roomId]] : item;
          this.dataSlotArr.map(day => {
            let flag = '';
            if (item.timeModel !== 'ALL') { // 指定开放日期，不在指定日期内的都是不允许选择的
              flag = (item.dateList || []).includes(day) ? flag : 'disabled';
            }
            // 存在禁选日期则直接禁选
            flag = item.dateList.includes(day) ? 'disabled' : flag;
            !roomItem[day] && (roomItem[day] = flag);
          });
          tempData.push(roomItem);
        });
        this.selectDayTableData = tempData;
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    filters: {
      userType (val, self) {
        return self[val] && self[val].name || val;
      }
    },
    watch: {
      ['dateSlot.end'] () {
        this.getDisSelectDayByRoom();
      },
      ['dataSlotArr'] () {
        this.dataSlotArrGroupByMonthCall();
      },
      ['selectDayTableData'] () {
        this.getSelectDeviceRoomArr();
      }
    },
    components: {}
  };

</script>
