const file = '/matters/needing/attention';
const api = {
  get: {// 获取注意事项
    path: file + '/getCode/',
    method: 'get'
  },
  edit: {//修改注意事项
    path: file + '/modify/',
    method: 'put'
  }
};
export default api;
