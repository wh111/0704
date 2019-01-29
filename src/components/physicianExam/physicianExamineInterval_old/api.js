const file = 'physicianExam';
const api = {
  list: {//列表
    path: file + '/list',
    method: 'get'
  },
  get: {//根据ID获取详情
    path: file + '/get/',
    method: 'get'
  },
  add: {//添加
    path: file + '/add',
    method: 'post'
  },
  edit: { // 编辑
    path: file + '/modify/',
    method: 'post'
  },
  remove: {//删除
    path: file + '/removes',
    method: 'delete'
  },
  checkByRoomNum:{ // 根据房间号检查房间是否存在
    path:'room/checkByRoomNum',
    method:'post'
  }
}
export default api;
