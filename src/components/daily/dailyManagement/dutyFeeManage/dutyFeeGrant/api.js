const file = '/';//当前模块api前缀
const api = {
  pagelist: {//获取值班费列表
    path: '/duty-fee-issue/pagelist',
    method: 'get'
  },
  exportExcel: {//
    path: '/api/duty-fee-issue/exportExcel',
    method: 'get'
  },
  get: {//
    path: file + '/get?id=',
    method: 'get'
  },
  modify: {//
    path: file + '/modify',
    method: 'put'
  },
  delete: {//
    path: file + '/remove?ids=',
    method: 'delete'
  }
}
export default api
