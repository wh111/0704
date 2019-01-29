const thisFile = 'evaluate';
const api = {
  submit: { // 教学质量评价表-提交评价
    path: thisFile + '/submit',
    method: 'post'
  },
  get: { // 教学质量评价表-查询我的评价(老师管理端)
    path: thisFile + '/get-by-teach',
    method: 'get'
  },
  info: { // 教学质量评价表-查询我的评价（学生评价端）
    path: thisFile + '/get-by-stu',
    method: 'get'
  },
};

export default api
