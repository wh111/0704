const thisFile = '/scene';
const api = {
  list: { // 获取场次列表（考核场次加载场次列表，考核安排加载场次列表，成绩查询加载考核列表，场次维护加载考核列表时调用）
    path: thisFile + '/mylist',
    method: 'get'
  },
  importWord: { // 下载准考证
    path: '/api/scene/user/card/importWord?',
    method: 'get'
  },

};

export default api
