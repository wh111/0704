const api = {
  video: { // 视频列表
    path: '/video/listPage',
    method: 'get',
  },
  literature: { // 文档文献
    path: '/literature/listPage',
    method: 'get',
  },
  cases: { // 病例
    path: '/cases/listPage',
    method: 'get',
  },
  atlas: { // 医学图谱
    path: '/atlas/listPage',
    method: 'get',
  },
  //   1 VIDEO 教学视频
  //   2 LITERATURE 文档文献
  //   3 CASES 典型病例
  //   4 ATLAS 医学图谱
  resourceTypeTree: { // 左侧树
    path: '/resourceType/tree?types=',
    method: 'get',
  },
};

export default api
