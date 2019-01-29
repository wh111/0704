let data = {
  "sceneName": "场次名称",
  "sceneType": "STANDARD", // 考核类型
  "startTime": "2016-01-02 08:00:00", // 开始时间
  "endTime": "2016-01-02 08:00:00", // 结束时间
  "restNum": "5", // 中场休息站数
  "restTime": "3", // 中场休息时间
  "moveTime": "3", // 换站时间
  "basicsTime": "5", // 考试时间基数
  "iSSPMove": "YES", // 是否SP轮转
  "examineeNum": "200", // 考核人数
  "stationNum": "20", // 考站数量
  "status": "NOARRANGED", // 考核状态
  "userList": [{ // 参考人员列表
    "userId": "1", // 考生id
    "userName": "张三1" // 考生姓名
  }, { // 参考人员列表
    "userId": "2", // 考生id
    "userName": "张三2" // 考生姓名
  }, { // 参考人员列表
    "userId": "3", // 考生id
    "userName": "张三3" // 考生姓名
  }, ],
  "spList": [{ // SP列表
    "userId": "2", // sp人员id
    "userName": "李四", // SP名称
    "scriptIds": "1,2,3" // 支持的剧本id集合
  }],
  "stationList": [{ // 站点集合
    "stationName": "站点名称",
    "stationType": "ORDINARY", // 站点类型
    "timeCount": "1", // 站内考核时间基数倍数
    "number": "1", // 单次考核人数
    "randomType": "SYSTEM", // 抽题类型
    "randomNum": "5", // 抽题数量
    "isQueue": "YES", // 是否是队列
    "queueNum": "5", // 队列编号
    "queueOrder": "1", // 队列内顺序
    "isDraw": "YES", // 是否抽签
    "drawNum": "5", // 抽签编号
    "roomIds": "1,2,3,4", // 平行考站房间id集合
    "stationContentList": [{ // 站点考核内容列表
      "contentName": "内容名称",
      "scoreTableId": "1", // 教师评分表id
      "spScoreTableId": "2", // SP评分表id
      "caseId": "", // 病例id
      "scriptId": 1, // 剧本id
      "timeCount": "2" // 考核时间基数倍数
    }]
  }],
  "roomTeacherList": [{ // 房间内监考老师列表
    "roomId": "1", // 房间id
    "teacherId": "2", // 教师id
    "teacherName": "王五",
    "weight": "0.5" // 权重
  }]
};

export default data;
