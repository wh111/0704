const api = {
  get: { // 获取授课试题
    path: '/courseTestingQuestions/query',
    method: 'get'
  },
  getCT: { // 获取标准课程试题
    path: '/criterionCourseTestingQuestions/query',
    method: 'get'
  },


  submit: { // 测评-提交分数
    path: '/courseTestingQuestions/submit',
    method: 'get'
  },
};

export default api
