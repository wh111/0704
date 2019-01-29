let thisFile = 'enroll/person/sp';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  audit: { // 审核
    path: thisFile + '/audit/',
    method: 'put'
  },
  majorList: 'dictionary/getByCode/YJS_ZYDM', // 研究生专业代码
};

export default api;
