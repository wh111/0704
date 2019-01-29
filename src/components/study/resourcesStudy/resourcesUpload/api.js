const api = {

  add: { // 添加
    path:  '/atlas/add', //{id}
    method: 'post',
  },

  // VIDEO 教学视频
  //   2 LITERATURE 文档文献
  //   3 CASES 典型病例
  //   4 ATLAS 医学图谱

  resourceTypeTree:{ // 左侧树
    path:  '/resourceType/tree',  //{ids}   //
    method: 'delete',
  },






};

export default api
