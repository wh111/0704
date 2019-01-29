const file = 'appraising/project';
const api = {
  get: {//获取详情
    path: file + '/getBasicManagement',
    method: 'get'
  },
  edit: {//修改
    path: file + '/basicManagement',
    method: 'post'
  },
};
export default api;
