let thisFile = 'mutual/selection';
let api = {
  list: { // 列表
    path: thisFile + '/student/list',
    method: 'get'
  },
  jyclist: { // 教育处查看报名学生列表
    path: thisFile + '/student/jyc/list',
    method: 'get',
  },
  jyslist: { // 教研室查看报名学生列表(科室主任)
    path: thisFile + '/student/jys/list',
    method: 'get',
  },
  interview: { // 安排面试
    path: thisFile + '/interview',
    method: 'put'
  },
  getInterview: {
    path: thisFile + '/getInterview/',
    method: 'get'
  }

};

export default api;
