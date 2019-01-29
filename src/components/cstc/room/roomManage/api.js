const thisFile = '/room';
const api = {
  list: { // 列表数据
    path: thisFile + '/list',
    method: 'get'
  },
  get: { // 获取
    path: thisFile + '/get/',
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify/',
    method: 'put'
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post'
  },
  select: { // 获取选择房间列表
    path: thisFile + '/select/list',
    method: 'get'
  },
  all: { // 获取所有房间列表
    path: thisFile + '/all/list',
    method: 'get'
  },
  getAffairType:{ // 房间类型
    path: thisFile + '/getAffairType',
    method:"get"
  },
  down: { // 资源下载
    path: '/api/file/download/', // { fileId }
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除
};

export default api
