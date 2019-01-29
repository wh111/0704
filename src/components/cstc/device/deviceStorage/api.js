const thisFile = 'device';
const api = {
  list: { // 列表数据
    path: thisFile + '/list',
    method: 'get',
  },
  get: { // 获取
    path: thisFile + '/get',
    method: 'get',
  },
  modify: { // 修改
    path: thisFile + '/modify',
    method: 'put',
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post',
  },
  storage: { // 设备入库
    path: thisFile + '/add',
    method: 'post',
  },
  excelExport: { // 导出设备信息
    path: thisFile + '/excelExport',
    method: 'get',
  },
  excelImportSave: { // 导入设备信息-数据入库
    path: thisFile + '/excelImport/save',
    method: 'post',
  },
  multimedia: { //文件上传(静态资源上传，主要用于上传可直接访问的多媒体文件) POST
    path: '/file/upload/static/multimedia',
    method: 'post',
  },
  selectDevice: { // 获取设备选择列表
    path: 'device/type/select/list',
    method: 'get',
  },

  delete: thisFile + '/remove', // 删除
};

export default api
