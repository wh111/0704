const thisFile = 'scene/examUser'
const api = {
  list: { // 获取考生列表（成绩查询查看场次详情时调用）
    path: thisFile + '/list',
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
  stationList: { // 获取考站列表（场次维护获取考站列表时调用）
    path: 'scene/maintain/station/list/', //{id}
    method: 'get'
  },
  teacherList: { // 获取考站监考老师列表列表（场次维护获取考站详情时调用）
    path: 'scene/maintain/station/teacher/list',
    method: 'get'
  },
  scheduleList: { // 获取考站监考老师评分列表（场次维护获取考站详情单击教师时调用）
    path: 'scene/maintain/station/teacher/schedule/list',
    method: 'get'
  },

  examUserRemove: { // 删除教师评分（删除教师评分时调用）
    path: 'scene/maintain/station/teacher/examUser/remove',//{id}
    method: 'get'
  },
  /*添加评分
  * */
  addExamUserGet: { // 添加评分获取考生详情（添加评分获取考生详情时调用）
    path: 'scene/maintain/station/teacher/examUser/get/',
    method: 'get'
  },
  contentGet: { // 获取评分表（选择考核内容时调用）
    path: 'scene/maintain/station/teacher/content/get/',//{id}
    method: 'get'
  },
  /*详情
  * */
  scheduleGet: { // 获取考站监考老师评分详情（获取单人评分详情时调用）
    path: 'scene/maintain/station/teacher/schedule/get',
    method: 'get'
  },

  /*
  * 提交评分*/
  teacherSubmit: { // 教师提交评分信息（自动提交，定时提交，手动提交，修改评分提交时调用）
    path: 'scene/teacher/submit',//{id}
    method: 'post'
  },

  // 下载考核视频
  downloadVideo: { // 下载考核视频
    path: 'scene/maintain/video/download/', // {id}
    method: 'get'
  },

  stationPaperList: { // 获取考站理论成绩列表（场次管理获取考站详情时调用）
    path: 'scene/maintain/station/paper/schedule/list',
    method: 'get'
  },

  stationPaperGet: { // 获取考站理论成绩详情（获取单人成绩详情时调用）
    path: 'scene/maintain/station/paper/schedule/get',
    method: 'get'
  }
}

export default api
