let thisFile = 'bedside/examination';
let api = {
  userList: { // 考生列表
    path: thisFile + '/user/list',
    method: 'get'
  },
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
  edit: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  getScore:{ // 获取评分项
    path: 'score/table/get/', // {id}
    method: 'get'
  },
  setMark: { // 设为出科考核成绩
    path: thisFile + '/set/graduate/mark',
    method: 'put'
  },
  delete: thisFile + '/remove', // 删除
};

export default api;
