const thisFile = 'reserve/device/set';
const api = {
  set: { // 设备预约设置（设备预约设置提交时调用）
    path: thisFile,
    method: 'post'
  },
  list: { // 获取设备及设备预约设置列表（设备预约设置列表加载时调用）
    path: thisFile + '/list',
    method: 'get'
  },
  selectList: { // 预约房间选择设备列表（预约房间选设备时调用）
    path: thisFile + '/select/list',
    method: 'get'
  },
  get: { // 查看设备预约设置详情（查看设备预约设置详情、设置单个设备预约情况加载时调用）
    path: thisFile + '/get/', // { deviceTypeId }
    method: 'get'
  },
  teachCourseTime: { // 活动时间段获取
    path: '/teachCourseTime/list',
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除
};

export default api
