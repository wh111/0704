const thisFile = '/scene';
const api = {
  list: { // 获取场次列表（考核场次加载场次列表，考核安排加载场次列表，成绩查询加载考核列表，场次维护加载考核列表时调用）
    path: thisFile + '/list',
    method: 'get'
  },
  add: { // 添加考核（新建考核提交时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  modifyStatus: { // 修改场次状态（发布场次或撤销发布时，开始考核或结束考核时调用）
    path: thisFile + '/modifyStatus',
    method: 'put'
  },
  /* 基本信息 */
  modifyBasic: { // 修改场次基本信息（保存场次基本信息时调用）
    path: thisFile + '/modify/basic',
    method: 'put'
  },
  getBasic: { // 获取场次基本信息（查看场次基本信息加载时调用）
    path: thisFile + '/get/basic',
    method: 'get'
  },
  modifyStationInfo: { // 修改场次考站信息（修改考站信息提交时调用）
    path: thisFile + '/station/modify/',
    method: 'post'
  },
  getStationInfo: { // 获取场次考站信息列表（查看考站信息加载时调用）
    path: thisFile + '/station/list/', // scene/station/list/{id}
    method: 'get'
  },
  /* 人员 */
  userAdd: { // 添加参考人员（考核人员列表添加考核人员时调用）
    path: thisFile + '/user/add',
    method: 'post'
  },
  userList: { // 获取场次参考人员列表（查看参考人员信息加载时调用）
    path: thisFile + '/user/list',
    method: 'get'
  },
  /* 排考预览 */
  preview: {
    path: thisFile + '/arrangement/preview',
    method: 'post'
  },
  /* 获取所有参考人员 */
  allUserId: { // 获取所有参考人员id（获取已选人员id时调用）
    path: thisFile + '/user/allId/', // {id}
    method: 'get'
  },
  /* 获取专业列表 */
  specialtyList: {
    path: thisFile + '/specialtyList',
    method: 'get'
  },
  queryAllUserList: { // 获取所有参考人员（分角色）
    path: thisFile + '/queryAllUserList',
    method: 'get'
  },
  sceneList: { // 获取预约场次刷卡记录列表(考勤查询)
    path: '/card/reader/record/scene/list',
    method: 'get'
  },
  roomList: { // 获取场次中的房间列表
    path: '/scene/room/list',
    method: 'get'
  },
  copy: { // 复制考核（复制多个场次时调用）
    path: '/scene/copy/add',
    method: 'post'
  },
  /* 删除 */
  delete: thisFile + '/remove', // 删除一条或多条场次记录（删除场次信息时调用）
  userDelete: thisFile + '/user/remove' // 删除一条或多条参考人员（删除参考人员时调用）
};

export default api;
