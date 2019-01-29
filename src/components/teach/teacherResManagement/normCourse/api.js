const thisFile = 'criterionCourse';
const api = {
  add: { // 创建标准课程
    path: thisFile + '/add',
    method: 'post'
  },
  get: { // 修改-先查
    path: thisFile + '/get/', // {id}
    method: 'get'
  },
  info: { // 查看
    path: thisFile + '/info/', // {id}
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },
  listPage: { // 列表 (点击树，分页查询标准课程列表)
    path: thisFile + '/listPage',
    method: 'get'
  },
  audit: { // 审核标准课程
    path: thisFile + '/audit/', // {ids}
    method: 'put'
  },
  remove: { // 删除标准课程
    path: thisFile + '/remove', // {ids}
    method: 'delete'
  },
  operation: { // 课程试运行
    path: thisFile + '/operation/', // {id}
    method: 'put'
  },
  endOperation: { // 课程退出
    path: thisFile + '/end/operation/', // {id}
    method: 'put'
  },
  select: { // 选择标准课程
    path: thisFile + '/queryRun',
    method: 'get'
  },
  tree: { // 左侧树-查树
    path: thisFile + 'Type/tree-by-manager',
    method: 'get'
  },
  getFile: { // 根据ID获取文件详情(课程试运行表文件获取)
    path: '/study/files/get/',
    method: 'get'
  },
  upload: '/file/upload/study', // 上传附件
};

export default api
