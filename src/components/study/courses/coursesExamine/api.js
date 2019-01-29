const api = {
  list: { // 待审核列表
    path: '/course/query-audit',
    method: 'get',
  },
  submitAudit: { // 提交审核
    path: '/course/submitAudit',
    method: 'post',
  },
  dateList: { // 获取房间开放日期列表（获取房间开放日期列表时调用）
    path: 'reserve/room/date/list',
    method: 'get'
  },
  timeList: { // reserve/room/time/select/list
    path: 'reserve/room/time/select/list',
    method: 'get'
  },
  roomList: { // 根据日期查询房间开放列表
    path: 'reserve/room/select/list',
    method: 'get'
  },
  info: { // 课程-查看
    path: '/course/info/', //{id}
    method: 'get',
  },

  mainInfo: { // 最新课程-查看
    path: '/course/main/info/',
    method: 'get'
  },

  /***************** 设备 *****************/
  room:{ // 房间内的设备
    path: '/reserve/room/device/list/', // {roomId}
    method: 'get'
  },
  other:{ // 房间外的设备
    path: 'reserve/room/no/device/', // {roomId}
    method: 'get'
  },
};

export default api
