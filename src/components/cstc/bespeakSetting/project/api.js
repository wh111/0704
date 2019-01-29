const thisFile = 'reserve/project';
const api = {
  list: { // 预约项目列表（加载预约项目列表时调用）
    path: thisFile + '/list',
    method: 'get'
  },
  get: { // 查看预约项目详情（查看预约项目详情时、修改预约项目加载时调用）
    path: thisFile + '/get/', // { id } 预约项目id
    method: 'get'
  },
  edit: { // 修改预约项目（修改预约项目保存时调用）
    path: thisFile + '/modify',
    method: 'put'
  },
  add: { // 新建预约项目（新建预约项目保存时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  teachCourseTime: { // 活动时间段获取
    path: '/teachCourseTime/list',
    method: 'get'
  },
  delete: 'reserve/poject/room/remove', // 删除
};

export default api
