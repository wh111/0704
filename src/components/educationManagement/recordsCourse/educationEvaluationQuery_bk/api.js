let thisFile = 'inStudy/monthlyReview';
let api = {
  pageList: { // 进修月度考核列表(进修生查看)
    path: thisFile + '/pageList',
    method: 'get'
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post'
  },
  get: { // 获取
    path: thisFile + '/get-', // {id}
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify-', // {id}
    method: 'put'
  },
  submit:{ // 进修月度考核上报
    path: thisFile + '/submit-', // {id}
    method: 'put'
  },
  addSubmit: { // 进修月度考核添加上报
    path: thisFile + '/addSubmit', // {id}
    method: 'post',
  },
  modifySubmit:{ // 进修月度考核修改上报
    path: thisFile + '/modifySubmit-', // {id}
    method: 'put',
  },
  delete: thisFile + '/remove', // 删除,

  /******************* 管理员使用 ****************************/

  pageListManage: { // 进修月度考核列表(管理员查看)
    path: thisFile + '/pageListManage',
    method: 'get'
  },

  review: { // 审核
    path: thisFile + '/review-', // {id}
    method: 'put'
  }
};

export default api;
