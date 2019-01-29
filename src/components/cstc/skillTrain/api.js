let thisFile = 'skill/training';
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
  modify: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  excelImport: thisFile + '/detail/excelImport/save', // 导入课程表
  delete: thisFile + '/removes' // 删除
};

export default api;
