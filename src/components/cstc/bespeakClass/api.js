const thisFile = 'reserve/poject/room';
const api = {
  list: { // 预约项目列表（加载预约项目列表时调用）
    path: thisFile + '/list',
    method: 'get'
  },
  get: { // 查看预约项目详情（查看预约项目详情时、修改预约项目加载时调用）
    path: thisFile + '/get/', // { id } 预约项目id
    method: 'get'
  },
  edit: { // 修改预约项目（修改预约项目保存时调用）
    path: thisFile + '/modify/', // { id } 预约项目id
    method: 'put'
  },
  add: { // 新建预约项目（新建预约项目保存时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  report: { // 上报预约（上报预约时调用）
    path: thisFile + '/report',
    method: 'put'
  },
  delete: thisFile + '/remove', // 删除

  /******************************* 基本数据 *************************************/
  dateList: { // 获取房间开放日期列表（获取房间开放日期列表时调用）
    path: 'reserve/room/date/list',
    method: 'get'
  },
  timeList:{ // 房间时间段选择列表
    path: 'reserve/room/time/select/list',
    method: 'get'
  },
  roomList:{ // 获取预约项目房间列表
    path: 'reserve/room/select/list',
    method: 'get'
  },
  teachCourseTime: { // 时间段获取
    path: 'teachCourseTime/list',
    method: 'get'
  },
  dateGet: { // 房间时间段选择列表（预约房间查询房间预约情况时调用）
    path: 'reserve/room/time/select/list',
    method: 'get'
  },
  submit: { // 房间评价提交接口
    path: 'reserve/poject/room/evaluate/submit',
    method: 'POST'
  },
  download: { // 下载视频（预约课程视频下载时调用）
    path: 'reserve/poject/room/video/download/',//{id}
    method: 'get'
  },

  /********************************** 设备 ********************************************/
  select: { // 获取选择设备列表
    // path: 'reserve/device/select/list',
    // method: 'get'

    path: 'reserve/poject/room/device/list',
    method: 'get'
  },
  tree: { // 部门树
    path: '/dept/tree',
    method: 'get'
  },
  room:{ // 房间内的设备
    path: 'reserve/poject/room/device/list?roomId=', // {roomId}
    method: 'get'
  },
  other:{ // 房间外的设备
    path: 'reserve/room/no/device/', // {roomId}
    method: 'get'
  },
};

export default api
