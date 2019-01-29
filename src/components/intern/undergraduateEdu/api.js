const thisFile = 'weekSet';
const api = {
  /*----- 周历 --------------------------------------------------------------------------------*/

  list: { // 列表数据
    path: thisFile + '/pagelist',
    method: 'get'
  },
  exportWeekSetExcel: { // 导出周历
    path: thisFile + '/exportWeekSetExcel',
    method: 'get'
  },
  exportCourseTable: { // 导出课程表
    path: thisFile + '/exportCourseTable',
    method: 'get'
  },
  exportReport: { // 列表数据
    path: thisFile + '/export-report',
    method: 'post'
  },
  get: { // 获取
    path: thisFile + '/get',
    method: 'get'
  },
  modify: { // 修改
    path: thisFile + '/modify',
    method: 'put'
  },
  add: { // 增加
    path: thisFile + '/add',
    method: 'post'
  },
  delete: thisFile + '/remove', // 删除
  publish: { //发布modifyStateRelease_release || 取消 modifyStateRelease_norelease
    path: thisFile + '/modifyStateRelease',
    method: 'put'
  },
  modifyStateIssued: { //下发
    path: thisFile + '/modifyStateIssued',
    method: 'put'
  },
  cancelIssued: { //取消下发
    path: thisFile + '/cancelIssued',
    method: 'put'
  },
  schools: { //查询学校
    path: '/schools/queryList',
    method: 'get'
  },
  courseTime: { //教研室设置时间添加
    path: thisFile + '/coursetime/add',
    method: 'post'
  },
  courseTimeModify: { //教研室设置时间添加
    path: thisFile + '/coursetime/modify',
    method: 'put'
  },

  getByDepthManager: { //教研室设置时间添加--获取院内科室树形结构（系统管理-科室管理-树）（获取三级科室）
    path: '/hospital/dept/queryChildByDepId',
    method: 'get'
  },
  byDepth: { //教研室设置时间添加--根据深度获取科室（获取二级科室）
    path: '/hospital/dept/getByDepth',
    method: 'get'
  },
  modifyThreeDep: { //教研室设置对应的三级科室
    path: '/weekSet/coursetime/modifyThreeDep',
    method: 'post'
  },
  teachCourseTime: {  //活动时间段获取
    path: '/teachCourseTime/list',
    method: 'get'
  },
  monthCourseSet: {  //根据教学周历ID获取每个月课程设置
    path: thisFile + '/monthCourseSet',
    method: 'get'
  },
  modifySubmit: { //上报教学周历设置 {id}
    path: thisFile + '/modifySubmit',
    method: 'put'
  },
  modifyNoSubmit: {  //取消上报教学周历 {id}
    path: thisFile + '/modifyNoSubmit',
    method: 'put'
  },
  dayCourseSet: {  //根据教学周历ID和时间获取一天的教学安排
    path: thisFile + '/dayCourseSet',
    method: 'get'
  },

  weekTimeCourseReviewList: {  //教育处审核页面列表
    path: thisFile + '/weekTimeCourseReviewList',
    method: 'get'
  },
  review: {  //教育处-审核
    path: thisFile + '/review/',//{ids}
    method: 'put'
  },
  modifyReview: {  //课程审核-审核修改
    path: thisFile + '/weekCourse/modifyReview',
    method: 'put'
  },
  courseReviewList: {  //课程审核-按周历科室审核
    path: thisFile + '/courseReviewList',//{ids}
    method: 'put'
  },
  getCourseBatchData: {  //根据周历获取批量添加数据
    path: thisFile + '/coursetime/getCourseBatchData',//{ids}
    method: 'get'
  },

  modifyCourseBatchData: {  //modifyCourseBatchData
    path: thisFile + '/coursetime/modifyCourseBatchData',//{ids}
    method: 'post'
  },

  queryCount: {//教研室统计应分配课时数和已分配课时数
    path: '/schoolOutline/queryCount',
    method: 'get'
  },
  countCourseTimeList: {//统计应分配课时数和已分配课时数列表(周历管理调用，获取应分配课时数和已分配课时数)
    path: '/courseTimeRecord/countCourseTimeList',
    method: 'get'
  },

  modifyIssued: {//教研室下发周历
    path: '/courseTimeRecord/modifyIssued',
    method: 'post'
  },

  getWeekState: {//获取监控进度
    path: '/weekState/getWeekState/',//{weekSetId}
    method: 'get'
  },

  weekTimeCourseThirdReviewList: {  //教育处与教研室审核列表（教研室审核三级科室列表）
    path: '/weekSet/weekTimeCourseThirdReviewList',//{courseArrangeId}
    method: 'get'
  },

  getCourseSet: {  //审核页面获取单个科室所有课程安排（教研室审核三级科室列表）
    path: '/weekSet/getCourseSet',//{courseArrangeId}
    method: 'get'
  },
  getReviewMess: {  //获取审核意见
    path: 'weekSet/getReviewMess',//{courseArrangeId}
    method: 'get'
  },

  getTeachingResearchRoomThirds: {  //查询教研室下发三级科室名称
    path: '/weekSet/getTeachingResearchRoomThirds',
    method: 'get'
  },


  /*----- 课程表管理 --------------------------------------------------------------------------------*/
  revoke: {  //课程管理-上报撤回
    path: thisFile + '/weekCourse/revoke/',//{ids}
    method: 'put'
  },
  manageWeekSetTimeTables: {  //获取本教研室的周历分页列表-课程表
    path: thisFile + '/researchRoom/pagelist',
    method: 'get'
  },
  getMyTeachRoomCourse: {
    path: thisFile + '/weekCourse/getMyTeachRoomCourse',
    method: 'get'
  },
  weekCourseModify: {
    path: thisFile + '/weekCourse/modify',
    method: 'post'
  },
  monthCourseSetResearchRoom: {  //根据教学周历ID获取每个月课程设置-----教研室人员可看  舍弃
    path: thisFile + '/monthCourseSetResearchRoom',
    method: 'get'
  },
  monthCourseSetResearchRoomList: {  //根据教学周历ID获取每个月课程设置-----教研室人员可看
    path: thisFile + '/monthCourseSetResearchRoomList',
    method: 'get'
  },
  userGetCourse: {  //根据教学周历ID获取每个月课程设置-----教研室人员可看
    path: '/weekSet/userGetCourse',
    method: 'get'
  },
  schoolOutlineDetail: {  //课程名与科室对应列表(教研室)
    path: '/schoolOutlineDetail/list',
    method: 'get'
  },
  detailqueryCount: {  //课程名与科室对应列表(教研室)
    path: '/schoolOutlineDetail/queryCount',
    method: 'get'
  },
  thirdModifyIssued: {  //三级科室提交审核(三级科室)
    path: '/courseTimeRecord/thirdModifyIssued',
    method: 'post'
  },
  researchRoomReview: {  //周历审核
    path: '/weekSet/researchRoomReview',
    method: 'put'
  },
  getByCode: {  //根据父CODE获取父项，以及子项。(通用)
    path: '/dictionary/getByCode/TEACHING_METHOD',
    method: 'get'
  },
  queryBySchoolId: {  //根据学校id查询树（建周历使用）
    path: '/dept/queryBySchoolId',
    method: 'get'
  },
  modifyState: {  //审核三级科室（教研室）
    path: '/weekState/modifyState',
    method: 'put'
  },
  /*weekTimeCourseReviewList: {  //周历审核
    path: '/weekSet/weekTimeCourseReviewList',
    method: 'put'
  },*/

  /*----- 课程资料 --------------------------------------------------------------------------------*/
  teacherCourseFileList: {  //课程资料列表
    path: thisFile + '/teacherCourseFile/pagelist',
    method: 'get'
  },
  teacherCourseFileAdd: {  //添加课程资料
    path: thisFile + '/teacherCourseFile/add',
    method: 'post'
  },
  teacherCourseFileEdit: {  //修改课程资料
    path: thisFile + '/teacherCourseFile/modify',
    method: 'put'
  },
  teacherCourseFileShow: {  //查看课程资料
    path: thisFile + '/teacherCourseFile/get',
    method: 'get'
  },

  teacherCourse: {  //授课老师获取本人的课程（添加课程资料时弹出选择课程）
    path: thisFile + '/teacherCourse/list',
    method: 'get'
  },
  getCourseTypeByCode: {  //获取课程类型
    path: '/dictionary/getByCode/TEACH_COURSE_TYPE',
    method: 'get'
  },
  weekCourseGet: {  //根据课程设置ID获取课程设置(课程审核使用)
    path: '/weekSet/weekCourse/get/',//{courseArrangeId}
    method: 'get'
  },

  /*----- 课程表预览 --------------------------------------------------------------------------------*/
//教学活动安排表
  teachctivityListType: '/teachctivityManagement/list',///{userType}

//活动时间段获取
//teachCourseTime:'/teachCourseTime/list',

  /*----- 签到记录 --------------------------------------------------------------------------------*/
  userSignRecord: {
    path: thisFile + '/userSignRecord/pagelist',
    method: 'get'
  },

  //教育处-课程表
  WeekSetTimeTables: '/weekSet/manageWeekSetTimeTables',

  //教育处-查看课程详情
  WeekSetManageGetCourse: '/weekSet/manageGetCourse',

  //老师-课程表
  WeekSetTeacherWeekSetTimeTables: '/weekSet/teacherWeekSetTimeTables',

  //老师-查看课程详情
  teacherGetCourse: '/weekSet/teacherGetCourse',

  //学员-课程表
  WeekSetUserWeekSetTimeTables: '/weekSet/userWeekSetTimeTables',

  //学员-学生查看课程详情
  weekSetUserGetCourse: '/weekSet/userGetCourse',

  /**学员*/
  //学员-学员获取课程安排
  userCurriculum: '/weekSet/userCurriculum',
  //学员-学员获取课程安排
  userCourse: '/weekSet/userGetCourse/',


  /**老师
   * */
  //老师-授课老师获取本人的课程
  teacherCourseFile: '/weekSet/teacherCourseFile/pagelist',
  //老师-授课老师获取本人的课程
  teacherCourseFileGet: '/weekSet/teacherCourseFile/get/',//{courseDataId}
  //老师-授课老师获取本人的课程
  /**教育处
   * */
  //教育处-课程表
  manageWeekCourseFile: '/weekSet/manageWeekSetTimeTablesPageList',
  //教育处-教育处查看课程详情
  manageGetCourse: '/weekSet/manageGetCourse',//{courseDataId}

  //教学秘书-课程表
  depWeekSetTimeTablesPageList: '/weekSet/depWeekSetTimeTablesPageList',

  //教学秘书-查看课程详情
  depWeekSetTimeTablesPageShow: '/weekSet/manageGetCourse', //{courseDataId}

  /**获取节假日列表*/
  holidayList: {//获取节假日列表
    path: 'holidaySet/queryList',
    method: 'get'
  },

  /**课程统计*/
  courseStatistics: {//课程统计列表
    path: thisFile + '/pagelist',
    method: 'get'
  },
  showCourseStatistics: {//课程统计列表
    path: thisFile + '/depStaticList',   //  /{weekId}
    method: 'get'
  },

  /**课程大纲*/
  OutlineQuery: {//教学大纲列表（分页查询）
    path: '/schoolOutline/query',
    method: 'get'
  },
  OutlineAddAll: {//添加教学大纲
    path: '/schoolOutline/addAll',
    method: 'post'
  },
  OutlineModifyAll: {//修改教学大纲
    path: '/schoolOutline/modifyAll',
    method: 'put'
  },
  OutlineGetAlll: {//获取单个教学大纲
    path: '/schoolOutline/getAll',
    method: 'get'
  },
  OutlineModifyState: {//修改大纲状态
    path: '/schoolOutline/modifyState',
    method: 'post'
  },
  OutlineList: {//教学大纲列表(所有)
    path: '/schoolOutline/list',
    method: 'post'
  },

  countCourseTime: {//统计应分配课时数和已分配课时数
    path: '/courseTimeRecord/countCourseTime',
    method: 'get'
  },
  /**获取科室*/
  getByDepth: {//根据深度获取科室
    path: '/hospital/dept/getByDepth',
    method: 'get'
  },
  queryChildByDepId: {//获取院内科室树形结构（系统管理-科室管理-树）
    path: '/hospital/dept/queryChildByDepId',
    method: 'get'
  },

};

export default api

