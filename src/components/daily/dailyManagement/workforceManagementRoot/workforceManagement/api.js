const api = {
  queryStudents: { // 获取带教老师所带教的学生记录
    path: '/scheduling-management/query-students',
    method: 'get'
  },
  roasterAdd: { // 学生排班记录添加 json
    path: '/scheduling-management/roaster-add',
    method: 'post'
  },
  queryRoaster: { // 学生排班记录添加 json
    path: '/scheduling-management/query-roaster',
    method: 'post'
  },
  getByCode: { // 学生排班记录添加
    path: '/dictionary/getByCode/',
    method: 'post'
  },

};

export default api
