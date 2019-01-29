let thisFile = 'card/reader';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post'
  },
  get: { // 获取
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  edit: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  delete: thisFile + '/remove', // 删除
  /***************** 房间列表 *******************/
  roomList: { // 获取所有房间列表
    path: 'room/all/list',
    method: 'get'
  },
};

export default api;
