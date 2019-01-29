let thisFile = 'inStudy/monthlyReview';
let api = {
  pageList: { // 进修月度考核列表(教学秘书填写)
    path: thisFile + '/list',
    method: 'get'
  },
  manageReviewPageList: { // 进修月度考核主表列表(带教秘书查看)
    path: thisFile + '/manageReviewPageList',
    method: 'get'
  },
  get: { // 获取
    path: thisFile + '/get-', // {id}
    method: 'get'
  },

  getManageReview: { // 根据主表查看进修月度考核
    path: thisFile + '/getManageReview/', // {{mrId}}
    method: 'get'
  },

  add: { // 增加
    path: thisFile + '/add',
    method: 'post'
  },
  addSubmit: { // 进修月度考核添加上报
    path: thisFile + '/addSubmit', //
    method: 'post',
  },

  modify: { // 修改
    path: thisFile + '/modify/', // {mrIds}
    method: 'put'
  },
  modifySubmit: { // 进修月度考核修改上报
    path: thisFile + '/modifySubmit/', // {mrIds}
    method: 'put',
  },

  submit: { // 进修月度考核主表列表上报
    path: thisFile + '/manageReviewSubmit/', // {mrIds}
    method: 'put'
  },

  delete: thisFile + '/remove', // 删除,

  /******************* 新增的 ***************************/
  getQueryTreeByManager:{ // 获取当前登录人员管理的三级以及三级以下的科室集合
    path: '/hospital/dept/getQueryTreeByManager',
    method:'get'
  },

  /******************* 管理员使用 ****************************/

  pageListManage: { // 进修月度考核列表(管理员查看)
    path: thisFile + '/pageListManage',
    method: 'get'
  },

  review: { // 审核
    path: thisFile + '/review-', // {mrIds}
    method: 'put'
  }



};

export default api;
