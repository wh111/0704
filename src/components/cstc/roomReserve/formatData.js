import _ from 'lodash';
import { formatDate } from '../../../libs/date';

/**
 * 获取保存数据
 * @param obj
 * @returns {Array}
 */
function getSaveData (obj) {
  let res = [];
  let data = _.defaultsDeep({}, obj);
  Object.keys(data).map(roomId => {
    Object.keys(data[roomId].date).map(date => {
      Object.keys(data[roomId].date[date].timeSlot).map(slot => { // 时间段
        let timeSlot = slot.split('-'); // 分割时间段
        let item = {date, roomId, roomNum: data[roomId].roomNum, deviceList: [], startTime: timeSlot[0], endTime: timeSlot[1], state: ''};
        data[roomId].date[date].timeSlot[slot].roomDevice.map(deviceItem => { // 房间内设备
          let {deviceTypeName, deviceTypeId, deviceId, inRoom} = deviceItem;
          item.deviceList.push({deviceTypeName, deviceTypeId, deviceId, inRoom});
        });
        data[roomId].date[date].timeSlot[slot].otherDevice.map(deviceItem => { // 房间外设备
          let {deviceTypeName, deviceTypeId, deviceId, inRoom} = deviceItem;
          item.deviceList.push({deviceTypeName, deviceTypeId, deviceId, inRoom});
        });
        res.push(item);
      });
    });
  });

  // 根据日期进行排序
  res.sort(item => item.date > item.date);

  console.log(res);

  return res;
}

/**
 * 获取编辑数据
 * @param arr
 * @returns {{}}
 */
function getEditData (arr) {
  let res = {};
  let rooms = {};
  arr.map(data => {
    let date = formatDate(data.date, 'yyyy-MM-dd');
    let {roomId, roomNum, startTime, endTime, deviceList} = data;
    if (!res[roomId]) { // 房间
      res[roomId] = {roomId, roomNum, date: {}};
      rooms[roomId] = {roomId, roomNum};
    }
    if (!res[roomId].date[date]) { // 日期
      res[roomId].date[date] = {date, timeSlot: {}};
    }
    if (!res[roomId].date[date].timeSlot[startTime + '-' + endTime]) { // 时间段
      res[roomId].date[date].timeSlot[startTime + '-' + endTime] = {startTime, endTime, otherDevice: [], otherDeviceId: [], roomDevice: [], roomDeviceId: [], state: ''};
    }

    deviceList.map(device => { // 设备
      let {deviceTypeName = '', deviceTypeId, deviceId, inRoom} = device;
      res[roomId].date[date].timeSlot[startTime + '-' + endTime][(inRoom ? 'room' : 'other') + 'Device'].push({deviceTypeName, deviceTypeId, deviceId, inRoom});
      res[roomId].date[date].timeSlot[startTime + '-' + endTime][(inRoom ? 'room' : 'other') + 'DeviceId'].push(deviceId);
    });
  });
  console.log(res);
  return {res, rooms};
}

/**
 * 获取长期预约时间类型的保存数据
 * @param tableArr
 * @returns {Array}
 */
function getLongTermSaveData (tableArr, roomObj, selectDataSlot) {
  let tableData = _.defaultsDeep([], tableArr);
  let roomData = _.defaultsDeep({}, roomObj);
  let roomsReserveDeta = [];
  let roomDaySLot = {};
  let {start: selectStartDay, end: selectEndDay} = selectDataSlot;
  let allDay = null;

  selectStartDay = formatDate(selectStartDay, 'yyyy-MM-dd');
  selectEndDay = formatDate(selectEndDay, 'yyyy-MM-dd');

  tableData.map(room => {
    let {roomId, roomNum} = room;
    let daySlot = [];
    if (!allDay) {
      allDay = (Object.keys(room).filter(key => /\d{4}-\d{2}-\d{2}/.test(key) && key >= selectStartDay && key <= selectEndDay)).sort();
    }
    if (!roomDaySLot[roomId]) {
      roomDaySLot[roomId] = {roomId, roomNum, deviceList: [], day: []};
    }
    allDay.map(day => { // 时间分段
      if (room[day] === 'select') {
        daySlot.push(day);
      } else {
        if (daySlot.length) {
          roomDaySLot[roomId].day.push(daySlot);
        }
        daySlot = [];
      }
    });
    if (daySlot.length) {
      roomDaySLot[roomId].day.push(daySlot);
    }
    // 提取设备
    ['room', 'other'].map(type => roomData[roomId].device[type + 'Device'].map(device => {
      let {deviceTypeName, deviceTypeId, deviceId, inRoom} = device;
      roomDaySLot[roomId].deviceList.push({deviceTypeName, deviceTypeId, deviceId, inRoom});
    }));
  });
  Object.keys(roomDaySLot).map(roomId => {
    let {roomNum, deviceList} = roomDaySLot[roomId];
    roomDaySLot[roomId].day.map(daySlot => {
      roomsReserveDeta.push({roomId, roomNum, deviceList, startDate: daySlot[0], endDate: daySlot[daySlot.length - 1]});
    });
  });
  console.log(roomDaySLot);
  return roomsReserveDeta;
}

function getLongTermEditData (data) {
  let allDay = [];
  let allRoom = {};

  let res = {};
  let rooms = {};
  let dateSlot = {start: data.minDate, end: data.maxDate};
  let selectDayTableData = [];

  let selectAllDayRoomIds = [];

  let stratDay = new Date(dateSlot.start);
  let dayNum = Math.ceil((new Date(dateSlot.end).getTime() - new Date(dateSlot.start).getTime()) / (24 * 3600 * 1000));
  '1'.repeat(1 + dayNum).split('').map((_, i) => allDay.push(formatDate(new Date(dateSlot.start).setDate(stratDay.getDate() + i))));

  data.roomReserveDetailsList.map(room => {
    let {roomId, roomNum, startDate, endDate, deviceList} = room;
    if (!allRoom[roomId]) {
      allRoom[roomId] = {roomId, roomNum, deviceList, day: []};
      rooms[roomId] = {roomId, roomNum};
      res[roomId] = {
        roomId, roomNum,
        device: { // 设备提出来与房间关联
          roomDevice: [],
          roomDeviceId: [],
          otherDevice: [],
          otherDeviceId: []
        }
      };
      // 提取设备(避免重复，只提取一次)
      (room.deviceList || []).map(device => {
        let {deviceTypeName = '', deviceTypeId, deviceId, inRoom} = device;
        res[roomId].device[(inRoom ? 'room' : 'other') + 'Device'].push({deviceTypeName, deviceTypeId, deviceId, inRoom});
        res[roomId].device[(inRoom ? 'room' : 'other') + 'DeviceId'].push(deviceId);
      });
    }
    // 提取时间段
    allRoom[roomId].day.push({startDate, endDate});
  });

  Object.keys(allRoom).map(roomId => {
    let {roomNum, day} = allRoom[roomId];
    let roomItem = {roomId, roomNum};
    let selectDay = [];
    day.map(daySlot => {
      (allDay.filter(dayStr => dayStr >= daySlot.startDate && dayStr <= daySlot.endDate)).map(dayStr => {
        roomItem[dayStr] = 'select';
        selectDay.push(dayStr);
      });
    });
    // 初始化未选择的房间
    allDay.filter(dayStr => !~selectDay.indexOf(dayStr) && (roomItem[dayStr] = ''));
    // 提取已经全选的房间id
    (!allDay.some(dayStr => !roomItem[dayStr]) && allDay.some(dayStr => roomItem[dayStr] === 'select')) && selectAllDayRoomIds.push(Number(roomId));
    selectDayTableData.push(roomItem);
  });

  console.log({allDay, allRoom, res, rooms, selectDayTableData, dateSlot, selectAllDayRoomIds});
  return {allDay, allRoom, res, rooms, selectDayTableData, dateSlot, selectAllDayRoomIds};
}

export { getSaveData, getEditData, getLongTermSaveData, getLongTermEditData };
