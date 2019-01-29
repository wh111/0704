const thisFile = 'scene/teacher';
const api = {
  submitFinish: { // 教师结束考核提交评分信息（教师结束考核提交时调用）
    path: thisFile + '/submit/finish',
    method: 'post'
  },

  submit: { // 教师提交评分信息（自动提交，定时提交，手动提交，修改评分提交时调用）
    path: thisFile + '/submit',
    method: 'post'
  },

  modifyScore: { // 教师提交评分信息（自动提交，定时提交，手动提交，修改评分提交时调用）
    path: thisFile + '/modify/', // {id}
    method: 'put'
  },

  modiryStatus: { // 修改考生的考核状态（确认身份时调用）
    path: thisFile + '/arrangement/modiryStatus', // {id}
    method: 'put'
  },

  list: { // 监考老师获取要监考的考核场次列表（考核评分获取考核列表时调用）
    path: thisFile + '/list',
    method: 'get'
  },

  finish: { // 教师结束考核提交评分信息（教师结束考核提交时调用）
    path: thisFile + '/submit/finish',
    method: 'post'
  },

  examUserList: { // 获取当前考站考核人员列表（获取考站人员列表时调用）
    path: thisFile + '/examUser/List',
    method: 'get'
  },

  random: { // 抽取试题（教师抽题，学生抽题时调用）
    path: '/scene/content/random',
    method: 'get'
  },

  station: { // 抽取试题（教师抽题，学生抽题时调用）
    path: thisFile + '/station/get',
    method: 'get'
  },

  sign: { // 抽取试题（教师抽题，学生抽题时调用）
    path: thisFile + '/sign/modify/', // {id}
    method: 'put'
  },

  contentGet: { // 获取房间内容考核教师评分详情（单击考站获取教师评分详情时，刷新评分详情时调用【考核监控，考核评分公用】）
    path: 'scene/station/room/teacher/get/', // {id}
    method: 'get'
  },

  examUserGet: { // 添加评分获取考生详情（添加评分获取考生详情时调用）
    path: 'scene/station/room/examUser/get',
    method: 'get'
  },

  getContentOption: { // 添加评分获取考生详情（添加评分获取考生详情时调用）
    path: 'scene/maintain/station/teacher/examUser/get',
    method: 'get'
  },

  confimSelectContent: { // 选择考核内容
    path: 'scene/content/select',
    method: 'get'
  },

  // 获取考核内容详情
  getContentInfo: {
    path: 'scene/maintain/station/teacher/content/get/', // {contentId}
    method: 'get'
  }
};

export default api;
