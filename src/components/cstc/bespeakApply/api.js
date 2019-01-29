const thisFile = 'reserve';
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
    path: thisFile + '/report/',
    method: 'put'
  },
  submit: { // 上报预约（上报预约时调用）
    path: thisFile + '/evaluate/submit',
    method: 'post'
  },
  download: { // 下载视频
    path: 'reserve/video/download/',//{id}
    method: 'get'
  },
  delete: thisFile + '/removes', // 删除

  /******************************* 基本数据 *************************************/
  myList: { // 获取当前登录能预约的项目列表（加载学生能选择预约项目时调用）
    path: 'reserve/project/my/list',
    method: 'get'
  },
  dateList: { // 开放日期列表（获取预约项目开放日期列表时调用）
    path: 'reserve/project/date/list',
    method: 'get'
  },
  timeList:{ // 获取预约项目某一时间的可预约情况
    path: 'reserve/project/time/list',
    method: 'get'
  },
  roomList:{ // 获取预约项目房间列表
    path: 'reserve/project/room/list',
    method: 'get'
  },
  teachCourseTime: { // 时间段获取
    path: 'teachCourseTime/list',
    method: 'get'
  },
  dateGet: { // 获取预约项目某一时间的可预约情况（学生预约项目加载项目可预约详情时调用）
    path: 'reserve/project/date/get',
    method: 'get'
  },
};

export default api
