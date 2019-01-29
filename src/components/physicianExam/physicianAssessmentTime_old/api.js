const file = '/physicianExam/countdown';
const api = {
  list: {//列表
    path: file + '/roomList',
    method: 'get'
  },
  get: {//根据ID获取详情
    path: file + '/getTime',
    method: 'get'
  },
  finish: {//结束
    path: file + '/finish',
    method: 'post'
  },
}
export default api;
