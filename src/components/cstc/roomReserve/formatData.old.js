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

  Object.keys(data).map(date => { // 日期
    Object.keys(data[date]).map(roomId => { // 房间信息
      Object.keys(data[date][roomId].timeSlot).map(slot => { // 时间段
        let timeSlot = slot.split('-'); // 分割时间段
        let item = {date, roomId, roomNum: data[date][roomId].roomNum, deviceList: [], startTime: timeSlot[0], endTime: timeSlot[1], state: ''};
        data[date][roomId].timeSlot[slot].roomDevice.map(deviceItem => { // 房间内设备
          let {deviceTypeName, deviceTypeId, deviceId, inRoom} = deviceItem;
          item.deviceList.push({deviceTypeName, deviceTypeId, deviceId, inRoom});
        });
        data[date][roomId].timeSlot[slot].otherDevice.map(deviceItem => { // 房间外设备
          let {deviceTypeName, deviceTypeId, deviceId, inRoom} = deviceItem;
          item.deviceList.push({deviceTypeName, deviceTypeId, deviceId, inRoom});
        });
        res.push(item);
      });
    });
  });
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
  arr.map(data => {
    let date = formatDate(data.date, 'yyyy-MM-dd');
    let {roomId, roomNum, startTime, endTime, deviceList} = data;
    if (!res[date]) { // 日期
      res[date] = {};
    }
    if (!res[date][data.roomId]) { // 房间
      res[date][data.roomId] = {roomId, roomNum, timeSlot: {}};
    }
    if (!res[date][data.roomId].timeSlot[startTime + '-' + endTime]) { // 时间段
      res[date][data.roomId].timeSlot[startTime + '-' + endTime] = {startTime, endTime, otherDevice: [], otherDeviceId: [], roomDevice: [], roomDeviceId: [], state: ''};
    }

    deviceList.map(device => { // 设备
      let {deviceTypeName = '', deviceTypeId, deviceId, inRoom} = device;
      res[date][data.roomId].timeSlot[startTime + '-' + endTime][(inRoom ? 'room' : 'other') + 'Device'].push({deviceTypeName, deviceTypeId, deviceId, inRoom});
      res[date][data.roomId].timeSlot[startTime + '-' + endTime][(inRoom ? 'room' : 'other') + 'DeviceId'].push(deviceId);
    });
  });
  console.log(res);
  return res;
}

export { getSaveData, getEditData };
