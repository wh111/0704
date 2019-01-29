const thisFile = 'criterionCourseTestingQuestions';
const api = {

  get: { // 课程直播-详情
    path: '/live/info',
    method: 'get'
  },


  historyPlay: { // 课程直播-历史点播
    path: '/live/history-play',
    method: 'get'
  },

  nextPlay: { // 课程直播-最近直播
    path: '/live/next-play',
    method: 'get'
  },

  queryMsg: { // 课程直播-获取最新聊天记录
    path: '/live/queryMsg',
    method: 'get'
  },


  sendMsg: { // 程直播-发消息
    path: '/live/sendMsg',
    method: 'get'
  },

  speak: { // 课程直播-禁言/发言
    path: '/live/speak',
    method: 'get'
  },


  camera: { // 获取房间内的摄像机列表
    path: 'video/room/camera/list/',//{id}
    method: 'get'
  },

  startLive: { // 老师：开始直播/切换摄像头
    path: '/live/startLive',//{id}
    method: 'post'
  },

  pauseLive: { //老师：暂停直播
    path: '/live/pauseLive',//{id}
    method: 'post'
  },


  stopLive: { // 老师：终止直播
    path: '/live/stopLive',//{id}
    method: 'post'
  },

  historyInfo: { // 老师：终止直播
    path: '/live/history-info',//{id}
    method: 'post'
  },


};

export default api
