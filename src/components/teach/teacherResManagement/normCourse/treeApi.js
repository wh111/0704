const thisFile = 'criterionCourseType';
const api = {
  tree: { // 左侧树-查树
    path: thisFile + '/tree',
    method: 'get'
  },
  add: { // 左侧树-添加
    path: thisFile + '/add',
    method: 'post'
  },
  modify: { // 左侧树-修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  remove: { // 左侧树-删除
    path: thisFile + '/remove', // {ids}
    method: 'delete'
  },
};

export default api
