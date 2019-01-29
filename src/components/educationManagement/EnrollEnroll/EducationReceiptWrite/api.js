const api = {
  pageList: { //进修生回执管理列表
    path: '/inStudy/returnReceipt/pageList',
    method: 'get'
  },
  get: { //进修回执查看 -{userId}
    path: '/inStudy/returnReceipt/get-',
    method: 'get'
  },
  add: { //进修回执填写
    path: '/inStudy/returnReceipt/add',
    method: 'post'
  },

  createPay: { //进修回执--在线支付创建订单
    path: '/inStudy/returnReceipt/createPay/', //{subjectsId}
    method: 'post'
  },
  payNotify: { //进修回执--在线支付发起支付
    path: '/inStudy/returnReceipt/payNotify',
    method: 'post'
  },
  payResult: { //支付结果更新
    path: '/inStudy/returnReceipt/payResult/',//{orderNumber}
    method: 'post'
  },

};

export default api
