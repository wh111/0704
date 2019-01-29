const file = 'smsTemplate';
const api = {
  list: {//列表
    path: file + '/pageList',
    method: 'get'
  },
  get: {//根据ID获取详情
    path: file + '/get/',
    method: 'get'
  },
  edit: {//修改
    path: file + '/modify/',
    method: 'put'
  },
};
export default api;
