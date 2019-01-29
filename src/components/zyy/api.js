let thisFile = '/intern/breaks';
let api = {
  breaksGetUser: { // 获取本人的减免申请
    path: thisFile + '/getUser',
    method: 'get'
  },
  breaksAdd: { // 减免申请-添加 Content-Type	application/json
    path: thisFile + '/add',
    method: 'post'
  },
  breaksModify: { // 减免申请--修改 Content-Type	application/json
    path: thisFile + '/modify/',//id
    method: 'put'
  },
  breaksAudit: { // 减免申请-审核 Content-Type	application/json
    path: thisFile + '/audit/',//id
    method: 'post'
  },
  breakListData: { // 减免申请-审核列表
    path: thisFile + '/listData/',
    method: 'get'
  },
  breakGet: { // 减免申请-审核列表
    path: thisFile + '/get/',//id
    method: 'get',
  },
  

};

export default api;
