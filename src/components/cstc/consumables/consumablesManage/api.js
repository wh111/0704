const thisFile = 'consumables';
const api = {
  list: { // 耗材列表
    path: thisFile + '/list',
    method: 'get'
  },
  get: { // 获取
    path: thisFile + '/get',
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify',
    method: 'put'
  },
  add: { // 添加
    path: thisFile + '/add',
    method: 'post'
  },
  excelImport: { // 导入易耗品入库信息-数据入库
    path: thisFile + '/excelImport/save',
    method: 'post'
  },
  noPageList: { // 耗材列表(不含分页)
    path: thisFile + '/noPageList',
    method: 'get'
  },
  delete: thisFile + '/remove', // 删除一条或多条耗材类型
};

export default api
