const thisFile = 'scene/examUser';
const api = {
  list: { // 获取考生列表（成绩查询查看场次详情时调用）
    path: thisFile + '/List',
    method: 'get'
  },
  examUserGet: { // 获取考生分站SP评分详情（查看分站详情加载SP评分详情时调用）
    path: thisFile + '/get',
    method: 'get'
  },
  spGet: { // 获取考生分站成绩教师列表及SP列表（查看分站评分详情加载考生信息，监考老师列表以及SP列表时调用）
    path: thisFile + '/station/sp/get',
    method: 'get'
  },
  stationGet: { // 获取考生分站成绩教师列表及SP列表（查看分站评分详情加载考生信息，监考老师列表以及SP列表时调用）
    path: thisFile + '/station/get',
    method: 'get'
  },
  teacherGet: { // 获取考生分站教师评分详情（查看分站详情加载监考老师评分详情时调用）
    path: thisFile + '/station/teacher/get',
    method: 'get'
  },
  comprehensiveGet: { // 获取综合统计详情（加载综合统计时调用）
    path: 'scene/statistics/comprehensive/get',
    method: 'get'
  },

  allScoreTable: { // 获取打印评分表详情数据接口
    path: 'scene/examUser/allScoreTable',
    method: 'get'
  },

  stationAllScoreTable: { // 根据考站id获取打印评分表详情数据接口
    path: 'scene/examUser/station/allScoreTable',
    method: 'get'
  },

  stationScoreTable:{ // 根据考站id获取打印评分表详情数据接口
    path: 'scene/examUser/station/teacher/get',
    method: 'get'
  },

  paperGet: {
    path: 'scene/station/room/paper/get', // 获取试卷信息（理论考核）
    method: 'get'
  },
};

export default api
