const file = 'reserve/poject';
const fileHasR = 'reserve/project';
const api = {
  list: {//列表
    path: file + '/list',
    method: 'get'
  },
  roomList: { // 预约上课列表
    path: file + '/room/search/list',
    method: 'get'
  },
  projectList: { // 预约项目查询列表
    path: fileHasR + '/search/list',
    method: 'get'
  },
  get: {//根据ID获取详情
    path: fileHasR + '/get/',
    method: 'get'
  },
  edit: {//修改
    path: file + '/modify',
    method: 'put'
  },
  add: {//添加
    path: file + '/add',
    method: 'post'
  },
  remove: {//删除
    path: file + '/remove',
    method: 'delete'
  },
  exportExcel: { // 导出
    path: file + '/room/search/excelExport',
    method: 'delete'
  },

  reserveList: { // 获取预约项目刷卡记录列表
    path: '/card/reader/record/reserve/list',
    method: 'get'
  }
};
export default api;
