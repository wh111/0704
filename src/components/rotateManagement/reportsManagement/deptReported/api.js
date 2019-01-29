const thisFile = 'rotationProcess/rotaryDepSign';
const api = {
  depList: { // 获取所有科室的ID NAME
    path: '/hospital/dept/query/allNameId',
    method: 'get',
  },
  list: { // 科室报到列表
    path: thisFile + '/pageList',
    method: 'get'
  },
  signDep: { // 科室报到
    path: thisFile + '/signDep/', // {podId}
    method: 'post',
  },
  modifyDjTeacher: { // 科室报到
    path: thisFile + '/modifyDjTeacher/', // {podId}
    method: 'put',
  },
  delTeacher: { // 删除带教老师
    path: thisFile + '/removeTeach/', // {podId}
    method: 'delete'
  },
  get: { // 查看单个轮转详情
    path: '/traineeRotary/arrangeRotary/getRotaryInfo/', // {podId}
    method: 'get'
  },
  teachPageList: { // 分配带教老师列表
    path: '/rotationProcess/rotaryDepSign/teachPageList', // {podId}
    method: 'get'
  },
  getRotaryTeachers: { // 科室报到--获取带教老师
    path: thisFile + '/getRotaryTeachers/',
    method: 'get'
  }
}

export default api
