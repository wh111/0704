let thisFile = 'card/reader/user';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  recordList: { // 获取刷卡记录列表
    path: 'card/reader/record/list',
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
  selectList: { // 获取人员对应卡号选择列表
    path: thisFile + '/select/list',
    method: 'get'
  },
  excelImport: { // 导入IC卡号信息
    path: thisFile + '/excelImport/save',
    method: 'post'
  },
  exportExcel: { // 导出IC卡号信息
    path: '/card/reader/record/exportExcel',
    method: 'post'
  },
  roomList: 'room/select/list',
};

export default api;
