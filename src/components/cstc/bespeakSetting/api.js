const thisFile = 'reserve/poject/room';
const api = {
  list: { // 审批房间预约（审批房间预约提交时调用）
    path: thisFile + '/list',
    method: 'get'
  },
  approval: { // 审批房间预约（审批房间预约提交时调用）
    path: thisFile + '/approval/', // {id} 预约项目id
    method: 'put'
  },
  get: { // 获取
    path: thisFile + '/get/', // {id} 预约项目id
    method: 'get'
  },
  modify: { // 修改预约房间申请（修改申请提交时调用）
    path: thisFile + '/modify/', // {id} 预约项目id
    method: 'put'
  },
  add: { // 新建房间申请（新建申请提交时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  start: { // 开课（项目开课时调用）
    path: thisFile + '/start/',
    method: 'put'
  },
  report: { // 修改预约项目状态（上报房间预约时调用）
    path: thisFile + '/report/', // {id} 预约项目id
    method: 'put'
  },
  delete: thisFile + '/removes', // 删除
};

export default api
