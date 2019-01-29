const thisFile = 'reserve/poject/room';
const api = {
  list: { // 获取预约申请列表（加载预约申请列表时调用）
    path: thisFile + '/listSp',
    method: 'get'
  },
  get: { // 获取预约详情（查看预约详情时、修改预约加载时调用）
    path: thisFile + '/get/', // { id }
    method: 'get'
  },
  approval: { // 审批房间预约（审批房间预约提交时调用）
    path: thisFile + '/approval/', // {id}
    method: 'put'
  },
  room: { // 房间内的设备
    path: '/reserve/room/device/list/', // {roomId}
    method: 'get'
  },
  other: { // 房间外的设备
    path: 'reserve/room/no/device/', // {roomId}
    method: 'get'
  },
  inspect: { // 房间时间段监测是否占用
    path: 'reserve/room/time/select/inspect',
    method: 'get'
  },
  delete: thisFile + '/removes' // 删除
};

export default api;
