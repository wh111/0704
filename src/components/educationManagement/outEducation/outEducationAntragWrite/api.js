let thisFile = 'outStudy';
let api = {
  list: { // 列表
    path: thisFile + '/list',
    method: 'get'
  },
  listJXS: { // 列表-进修生
    path: thisFile + '/list-JXS',
    method: 'get'
  },
  save: { // 增加/修改
    path: thisFile + '/save',
    method: 'post'
  },
  get: { // 获取
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  audit: { // 上报、审核、驳回
    path: thisFile + '/audit/',
    method: 'post'
  },
  submit: { // 上报、审核、驳回
    path: thisFile + '/submit',
    method: 'post'
  },
  saveReport:{ // 添加汇报填写
    path: thisFile + '/saveReport',
    method: 'post',
  },
  saveCost:{ // 添加费用报销
    path: thisFile + '/saveCost',
    method: 'post',
  },
  delete: thisFile + '/remove', // 删除
};

export default api;
