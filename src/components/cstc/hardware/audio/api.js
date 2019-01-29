const thisFile = 'loudspeaker/box';
const api = {
  intercomStop: { // 停止直播（停止直播）
    path: thisFile + '/debug/intercom/stop',
    method: 'post'
  },
  intercomStart: { // 开始直播（发起直播）
    path: thisFile + '/debug/intercom/start/', //{boxIds}
    method: 'post'
  },
  volume: { // 设置网络音箱音量（增大音量、减小音量、设置音量时调用）
    path: thisFile + '/debug/volume/', // {id}
    method: 'post'
  },
  taskRemove: thisFile + '/debug/task/remove', // {ids},// 删除一条或多条广播任务（删除广播任务提交时调用）
  taskStop: { // 停止广播任务（停止广播任务时调用）
    path: thisFile + '/debug/task/stop/', // {id}
    method: 'put'
  },
  taskExecuting: { // 执行广播任务（执行广播任务时调用）
    path: thisFile + '/debug/task/executing/', // {id}
    method: 'put'
  },

  debuglist: { // 获取网络音箱调试列表（调试音箱获取房间内音箱时调用）
    path: thisFile + '/debug/list',
    method: 'get'
  },

  taskAdd: { // 新建广播任务（新建广播任务提交时调用）
    path: thisFile + '/debug/task/add',
    method: 'post'
  },
  taskList: { // 广播调试任务列表（调试加载广播任务列表时调用）
    path: thisFile + '/debug/task/list',
    method: 'get'
  },

  get: { // 获取网络音箱（修改网络音箱加载时调用）
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  list: { // 获取网络音箱列表
    path: thisFile + '/list',
    method: 'get'
  },
  modify: { // 修改网络音箱（修改网络音箱提交时调用）
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  add: { // 添加网络音箱（添加网络音箱提交时调用）
    path: thisFile + '/add',
    method: 'post'
  },

  roomList: { // 音箱调试房间列表（调试音箱加载设备所在位置列表时调用）
    path: 'room/all/list',
    method: 'get'
  },

  getFilePath: { // 获取广播服务器音频文件列表
    path: thisFile + '/debug/task/file/list',
    method: 'get'
  },

  delete: thisFile + '/remove', // 删除
};

export default api
