const file = 'physicianExam';
const api = {
  list: {//列表
    path: file + '/monitor/list',
    method: 'get'
  },
  get: {//根据ID获取详情
    path: 'physicianExam/get/',
    method: 'get'
  },
  modifyStatus: {//修改场次状态
    path: file + '/modify/status/',
    method: 'put'
  },
  suspend: {//暂停某一阶段的状态
    path: file + '/suspend/',
    method: 'post'
  },
  setDefault: {//设置默认考核
    path: file + '/setDefault/exam/',
    method: 'put'
  },
  settingTime:{ // 设置二阶段与三阶段之间的换站时间
    path: file + '/time/setting/',
    method: 'put'
  },
  recoveryBroadcast:{ // 重启考核广播任务
    path: file + '/recoveryBroadcast/',
    method: 'put'
  },
}
export default api;
