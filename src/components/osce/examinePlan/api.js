const file = 'scene';
const thisFile = file + '/arrangement';
const thisDrawFile = file + '/draw';
const api = {
  preview: { // 预览考核安排表（预览考核安排时调用）
    path: thisFile + '/preview',
    method: 'post'
  },
  userList: { // 获取考生考核列表（查看考生时间表加载时调用）
    path: thisFile + '/examUser/list',
    method: 'get'
  },
  teacherGet: { // 获取当前教师的考核安排（教师加载我的安排时调用）
    path: thisFile + '/teacher/get/',
    method: 'post'
  },
  spList: { // 获取单个SP的考核安排列表（sp查看我的安排时调用）
    path: thisFile + '/sp/list',
    method: 'get'
  },
  examUserGet: { // 获取单个考生的考核安排列表（考生查看我的安排时调用）
    path: thisFile + '/examUser/get',
    method: 'get'
  },
  manualList: { // 获取考生未考核的考站列表（自由考核安排考核页面查询时调用）
    path: thisFile + '/manual/List',
    method: 'get'
  },
  manual: { // 获取考生未考核的考站列表（自由考核安排考核页面查询时调用）
    path: thisFile + '/manual',
    method: 'post'
  },
  manualGet: { // 获取考生未考核的考站列表（自由考核安排考核页面查询时调用）
    path: thisFile + '/manual/get',
    method: 'get'
  },
  teacherExcelExport: { // 导出监考老师时间表（导出监考老师时间表时调用）
    path: thisFile + '/teacher/excelExport',
    method: 'get'
  },
  spExcelExport: { // 导出SP时间表（导出SP时间表时调用）
    path: thisFile + '/sp/excelExport',
    method: 'get'
  },
  examUserExcelExport: { // 导出考生时间表到Excel(导出考生时间表时调用)
    path: thisFile + '/examUser/excelExport',
    method: 'get'
  },
  teacherList: { // 获取监考老师时间表（查看监考老师时间表加载时调用）
    path: thisFile + '/teacher/list',
    method: 'get'
  },
  add: { // 生成考核安排表（生成考核安排时调用）
    path: thisFile + '/add',
    method: 'post'
  },
  /******* 抽签相关 *******/
  station: { // 抽签（进行抽签时调用）
    path: thisDrawFile + '/station',
    method: 'post'
  },
  stationGet: { // 生成考核安排表（生成考核安排时调用）
    path: thisDrawFile + '/station/get',
    method: 'get'
  },
  signList: { // 获取场次参考人员签到列表（查看参考人员信息加载时调用）
    path: file + '/user/sign/list/', //{id}
    method: 'get'
  },
  userSign: { // 获取场次参考人员签到列表（查看参考人员信息加载时调用）
    path: file + '/user/sign',
    method: 'post'
  },
  /******* 签到相关 *******/

  importExcel: { // 获取场次参考人员签到列表（查看参考人员信息加载时调用）
    path: file + '/user/sign/importExcel/',
    method: 'get'
  },
};

export default api
