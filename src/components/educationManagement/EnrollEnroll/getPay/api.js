const api = {
  pageList: { //进修回执--支付订单查询
    path: '/inStudy/returnReceipt/getPayPageList',
    method: 'get'
  },
  get: { //进修回执--支付订单查看
    path: '/inStudy/returnReceipt/getPay/',//{id}
    method: 'get'
  },

};

export default api
