let thisFile = 'enroll/person';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  report: { // 报到
    path: thisFile + '/report/', // ids
    method: 'put'
  },
  get: { // 获取
    path: thisFile + '/get', // {id}
    method: 'get'
  },
  printData: { // 修改
    path: thisFile + '/print/', // {id}
    method: 'get'
  },
  majorList: 'dictionary/getByCode/YJS_ZYDM', // 研究生专业代码
};

export default api;
