const file = 'roomReserve';
const api = {
  myList: {//获取当前登陆人的预约房间列表
    path: file + '/my/list',
    method: 'get'
  },
  list: {//获取预约房间列表(只返回已上报,和审核通过的数据)
    path: file + '/list',
    method: 'get'
  },
  get: {//根据ID获取详情
    path: file + '/get/',
    method: 'get'
  },
  edit: {//修改
    path: file + '/modify/',
    method: 'put'
  },
  modifyStatus: { //修改预约房间状态
    path: file + '/status/modify/',
    method: 'put'
  },
  add: {//添加
    path: file + '/add',
    method: 'post'
  },
  removes: {//删除
    path: file + '/removes',
    method: 'delete'
  },
  exportExcel: {//导出
    path: '/api/' + file + '/exportExcel',
    method: 'get'
  },

  /******************************* 基本数据 *************************************/
  dateList: { // 获取房间开放日期列表（获取房间开放日期列表时调用）
    path: 'reserve/room/date/list',
    method: 'get'
  },
  timeList: { // 房间时间段选择列表
    path: 'reserve/room/time/select/list',
    method: 'get'
  },
  roomList: { // 获取预约项目房间列表
    path: 'reserve/room/select/list',
    method: 'get'
  },
  dateGet: { // 房间时间段选择列表（预约房间查询房间预约情况时调用）
    path: 'reserve/room/time/select/list',
    method: 'get'
  },
  /********************************** 使用类型 ********************************************/
  getAffairType: { // 获取技能中心事项类型
    path: 'affair/getAffairType',
    method: 'get'
  },
  /********************************** 设备 ********************************************/
  room: { // 房间内的设备
    path: 'reserve/poject/room/device/list?roomId=', // {roomId}
    method: 'get'
  },
  other: { // 房间外的设备
    path: 'reserve/room/no/device/', // {roomId}
    method: 'get'
  },
  /********************************** 设备 ********************************************/
  selectRoomList: { // 房间列表
    path: 'reserve/room/set/list',
    method: 'get'
  },
  /********************************** 房间 ********************************************/
  reserveRoomDateList: { // 根据日期区间查询房间开放日期
    path: 'reserve/room/set/date/list',
    method: 'get'
  }
};
export default api;
