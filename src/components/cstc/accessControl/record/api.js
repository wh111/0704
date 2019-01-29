const thisFile = 'swing/card';
const api = {
  list: { // 列表数据
    path: thisFile + '/list',
    method: 'get'
  },
  exportExcel: { // 列表数据
    path: '/swing/card/exportExcel',
    method: 'get'
  },
};

export default api
