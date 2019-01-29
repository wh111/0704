import axios from 'axios';

const api = {

  //研究生培养计划
  getMyplan: {   //查询我的培养计划
    path: '/training/plan/myplan',
    method: 'get'
  },
  addPlan: {  //添加培养计划
    path: '/training/plan/add',
    method: 'post'
  },
  getPlan: { //查看培养计划
    path: '/training/plan/get/',
    method: 'get'
  },
  modifyPlan: { //修改培养计划 id
    path: '/training/plan/modify/',
    method: 'put'
  },
  modifyStatus: {  //上报培养计划
    path: '/training/plan/modifyStatus',
    method: 'put'
  },
  examinePlan: {   //培养计划审核 id
    path: '/training/plan/examine/',
    method: 'put'
  },
  getPlanlist: {   //获取培养计划列表
    path: '/training/plan/list',
    method: 'get'
  },

  exportWord: {   //导出word
    path: '/api/training/plan/exportWord',
    method: 'get'
  },

  //分配导师
  dslist: { //老师列表
    path: 'mutual/selection/student/list',
    method: 'get'
  },
  addTeacher: { //分配第二导师
    path: 'mutual/selection/addTeacher',
    method: 'put'
  },
  showTeacher: { // 查看导师
    path: 'mutual/selection/getTeacher',
    method: 'get'
  },
  removeTeacher: { // 删除第二导师
    path: 'mutual/selection/removeTeacher',
    method: 'delete'
  },

  // 获取导师和专业
  getTeacherAndMajor: {
    path: 'training/plan/getTeacherAndMajor',
    method: 'get'
  },

  // 我的轮转信息
  myRotaryInfo:{
    path: 'rotationProcess/rotaryTable/myRotaryInfo',
    method: 'get'
  }
};
export default api;
