let thisFile = 'participants';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  save: { // 保存
    path: thisFile + '/save',
    method: 'post'
  },
};

export default api;
