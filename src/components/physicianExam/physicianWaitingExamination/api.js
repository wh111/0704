const file = 'physicianExam/wait';
const api = {
  list: {//列表
    path: file + '/list',
    method: 'get'
  },
  get: {//查看
    path: file + '/getInfo',
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
  }
}
export default api;
