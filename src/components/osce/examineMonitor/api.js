const thisFile = 'scene'
const api = {
  list: { // 获取监控考核列表（考核监控获取考核场次列表时调用）
    path: thisFile + '/monitor/list',
    method: 'get'
  },
  monitorGet: { // 获取考核场次详情（获取单场考核详情时，同步场次信息时调用）
    path: thisFile + '/monitor/get/',
    method: 'get'
  },
  roomGet: { // 获取房间内容考核详情（单击考站获取详情时调用）
    path: thisFile + '/station/room/get/',
    method: 'get'
  },
  examUserGet: { // 获取房间内考生详情（考站内获取考生详情时，获取上一人，下一人时调用[考核监控，考核评分公用]）
    path: thisFile + '/station/room/examUser/get',
    method: 'get'
  },
  examUserList: { // 获取当前考站考核人员列表（获取考站人员列表时调用）
    // path: thisFile + '/teacher/examUser/List',
    path: thisFile + '/station/teacher/examUser/list',
    method: 'get'
  },
  teacherGet: { // 获取房间内容考核教师评分详情（单击考站获取教师评分详情时，刷新评分详情时调用【考核监控，考核评分公用】）
    path: thisFile + '/station/room/teacher/get/',
    method: 'get'
  },
  modifyStatus: { // 修改场次状态（发布场次或撤销发布时，开始考核或结束考核时调用）
    path: thisFile + '/modifyStatus/',
    method: 'put'
  },
  control: { // 暂停或恢复考核（考核监控暂停或恢复考核时调用）
    path: thisFile + '/control/',
    method: 'put'
  },
  set: {
    path: thisFile + '/monitor/set/', // 设置默认考核场次
    method: 'post'
  },
  stationGet: {
    path: thisFile + '/teacher/station/get', // 获取老师信息
    method: 'get'
  },
  paperGet: {
    path: thisFile + '/station/room/paper/get', // 获取试卷信息（理论考核）
    method: 'get'
  },
  getServerTime: {  // 服务器时间
    path: '/nowTime',
    method: 'get'
  },
  recoveryBroadcast: { // 重启考核广播任务
    path: '/scene/recoveryBroadcast/',
    method: 'put'
  }
}

export default api

