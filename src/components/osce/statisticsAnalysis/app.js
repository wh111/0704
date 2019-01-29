/**
 * Created by Administrator on 2017/6/1.
 */
export default {

  //获取场次列表 get
  sceneList: 'scene/list',

  //获取多场次统计列表（多场次统计列表加载时调用）
  statisticsList: 'scene/statistics/list',

  //删除一条或多条多场次统计（删除多场次统计时调用）
  statisticsRemoves: 'scene/statistics/removes', //{ids}

  //添加多场次统计（添加多场次统计时调用）
  statisticsAdd: 'scene/statistics/add',

  //获取场次概况（加载场次概况时调用）get
  sceneGet: 'scene/statistics/scene/get',

  //获取综合统计详情（加载综合统计时调用) get
  comprehensiveGet: 'scene/statistics/comprehensive/get',

  /*
   分站详情
  * */
  //获取考站详情信息（查看考站详情加载考站信息时调用）get
  stationGet: 'scene/statistics/station/get/', //{stationId}

  //获取考站考核内容评分详情（加载考核评分表时调用）
  contentGet: 'scene/statistics/station/content/get', //{scoreTableId}

  //获取考站详情考站列表（加载考站详情列表时调用）
  contentList: 'scene/statistics/station/list', //{scoreTableId}

  // 获取考站考核内容理论成绩详情（加载理论成绩详情时调用）
  paperContentGet: 'scene/statistics/station/content/paper/get',

  // 获取扇形统计图数据
  pipeData: 'scene/statistics/station/content/getStatistics',

  // 获取条形统计图数据
  lineData: 'scene/statistics/station/getMarkData/',

  /*
   * 考生详情
   * */

  //获取考生考站教师评分列表（加载考生考站评分列表时调用）
  markGet: 'scene/statistics/user/mark/get/', //{id}

  //考核统计获取考生详情个人考核信息（考核人员列表查看个人考信息时调用）
  userGet: 'scene/statistics/user/get/', //{id}

  //获取考生列表（查看考生详情加载考生列表时调用）
  userList: 'scene/statistics/user/list',

  //获取教师评分详情（查看教师评分详情时调用）get
  teacherGet: 'scene/station/room/teacher/get/', //{id}

  // 获取考生理论考站成绩（加载考生考站评分列表时调用）
  paperMarkGet: 'scene/statistics/user/paper/mark/get',

  /**
   * 考核内容详情
   */

  // 获取考核内容列表
  eContentList: 'scene/statistics/content/list',

  // 获取考核内容详情
  eContentGet: 'scene/statistics/content/get/' // {contentId}

};
