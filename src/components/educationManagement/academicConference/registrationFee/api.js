let thisFile = 'conference';
let api = {
  modifyFee: { // 登记费用/费用修改
        path: thisFile + '/modifyFee',
        method: 'post'
    },
  get: { // 获取
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
};

export default api;
