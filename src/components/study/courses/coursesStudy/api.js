const api = {
  myTask: { // 学习任务
    path: '/course/main/my-task',
    method: 'get',
  },
  myStudy: { // 我的必修课
    path: '/course/main/my-study',
    method: 'get'
  },
  mainQuery: { // 最新课程
    path: '/course/main/query',
    method: 'get'
  },
  mainInfo: { // 最新课程查看
    path: '/course/main/info/',
    method: 'get'
  },
  nextPlay: { // 最近直播
    path: '/course/main/next-play',
    method: 'get'
  },
  myHistory: { // 播放记录
    path: '/course/main/my-history',
    method: 'get'
  },
};

export default api
