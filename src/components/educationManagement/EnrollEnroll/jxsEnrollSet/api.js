let thisFile = 'rotaryConfig';
let api = {
  get: { // 获取
    path: thisFile + '/getByKey/', // {id}
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
};

export default api;
