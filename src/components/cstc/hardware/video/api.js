const thisFile = 'video/camera';
const api = {
  list: { // 获取摄像机列表（加载摄像机列表时调用）
    path: thisFile + '/list',
    method: 'get'
  },
  get: { // 获取摄像机信息（修改摄像机加载时，调试摄像机加载时调用）
    path: thisFile + '/get/', //{id}
    method: 'get'
  },
  modify: { // 修改摄像机（修改摄像机提交时调用）
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  add: { // 添加摄像机（添加摄像机提交时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  /***************** 房间列表 *******************/
  roomList: { // 获取所有房间列表
    path: 'room/all/list',
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除
};

export default api
