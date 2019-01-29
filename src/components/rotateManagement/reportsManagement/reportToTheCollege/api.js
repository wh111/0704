const thisFile = '/compliance/train';
const api = {
  list: { // 来院报道分页列表
    path: thisFile+'/reportPageList',
    method: 'get',
  },
  reportHostState: { // 科室报到
    path: thisFile+'/reportHostState', // {ids}
    method: 'post',
  },
}

export default api
