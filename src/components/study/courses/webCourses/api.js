const api = {

  add: { // 建立课程授课
    path: '/course/add',
    method: 'post',
  },

  get: { // 修改-先查
    path: '/course/get/', //{id}
    method: 'get',
  },
  getTemp: { // 修改-先查
    path: '/criterionCourse/get/', //{id}
    method: 'get',
  },

  query: { // 查看-公告-列表
    path: '/courseNotices/query',
    method: 'get',
  },

  info: { // 课程-查看
    path: '/course/info/', //{id}
    method: 'get',
  },

  mainInfo: { // 最新课程-查看
    path: '/course/main/info/',
    method: 'get'
  },

  modify: { // 修改
    path: '/course/modify/', //{id}
    method: 'put',
  },

  remove: { // 删除授课
    path: '/course/remove', //{ids}
    method: 'delete',
  },

  listPage: { // 列表
    path: '/course/listPage',
    method: 'get',
  },


  courseNoticesAdd: { // 管理-公告-发布
    path: '/courseNotices/add',
    method: 'post',
  },



};

export default api
