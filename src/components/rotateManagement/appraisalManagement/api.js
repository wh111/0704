const graduation = '/graduation/';
const api = {
/*----- 结业考核 --------------------------------------------------------------------------------*/
  examineList: { // 结业考核管理列表
    path: graduation + 'examine/pagelist',
    method: 'get',
  },
  examineImport: { // 从Excel导入考核人员
    path: graduation + 'examine/importFromExcel',
    method: 'post',
  },
  examineExport: { // 从Excel导入考核人员
    path: graduation + 'examine/exportExcel',
    method: 'get',
  },

  /*----- 公共课考核 --------------------------------------------------------------------------------*/
  commonsCourseList: { // 公共课考核管理列表
    path: graduation + 'commonsCourse/pagelist',
    method: 'get',
  },
  commonsCourseImport: { // 从Excel导入考核人员
    path: graduation + 'commonsCourse/importFromExcel',
    method: 'post',
  },
  commonsCourseExport: { // 从Excel导入考核人员
    path: graduation + 'commonsCourse/exportExcel',
    method: 'get',
  },

  /*----- 执业医师考试 --------------------------------------------------------------------------------*/
  modifyOneState: { // 执业医师考试审核单个审核
    path:'/doctor/exam/modifyOneState/',//{userId}
    method: 'put',
  },
  modifyState: { // 执业医师考试审核(多个)
    path:'/doctor/exam/modifyState',//{userIds}
    method: 'put',
  },
  examPagelist: { // 执业医师考试列表
    path:'/doctor/exam/pagelist',//{userIds}
    method: 'put',
  },

  getExamInfoByUserId: { //执业医师考试查看详情
    path:'/doctor/exam/getExamInfoByUserId/',//{userIds}
    method: 'put',
  },

  /*----- 出科技能考核 --------------------------------------------------------------------------------*/
  assessmentList: { //出科技能考核列表
    path:'/dept/skill/assessment/list',//{userIds}
    method: 'get',
  },
  assessmentAdd: { //添加出科技能考核（新建出科技能考核提交时调用)
    path:'/dept/skill/assessment/add',//{userIds}
    method: 'post',
  },
  byUserType: { // 选择科室
    path:'/hospital/dept/query/byUserType/',
    method: 'get'
  },



};

export default api

