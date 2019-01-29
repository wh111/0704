let thisFile = 'appraising/vote/project';
let api = {
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
  modify: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  unpublish: { // 撤销发布一条或多条投票项目
    path: thisFile + '/unpublish/', // {id}
    method: 'put'
  },
  vote: { // 投票（投票结果提交时调用）
    path: thisFile + '/vote',
    method: 'post'
  },
  recordGet:{ // 获取投票记录（教育处查看评优项目公告页面查看评优项目详情获取投票详情时调用）
    path: thisFile + '/record/get/', // {id}
    method: 'get'
  },
  getResult:{ // 获取投票结果
    path: thisFile + '/getResult/', // {id}
    method: 'get'
  },
  publish:{ // 发布一条或多条投票项目
    path: thisFile + '/publish/', // {id}
    method: 'put'
  },
  delete: thisFile + '/delete', // 删除
};

export default api;
