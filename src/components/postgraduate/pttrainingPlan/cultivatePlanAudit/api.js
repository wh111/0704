/**
 * Created by Administrator on 2017/9/3.
 */
export default {
  //培养计划审核列表
  list: {
    path: 'training/plan/splist',
    method: 'get'
  },
  //培养计划审核列表（导师）
  tutorList: {
    path: 'training/plan/tutor/list',
    method: 'get'
  },
  //培养计划审核列表（教研室）
  jysList: {
    path: 'training/plan/jysAudit/list',
    method: 'get'
  },
  //培养计划审核列表（研究生）
  yjsList: {
    path: 'training/plan/list',
    method: 'get'
  },
  //导师审核
  tutorAudit: {
    path: 'training/plan/examine/',//{id}
    method: 'put'
  },

  getPlan: { //查看培养计划
    path: "/training/plan/get/",
    method: "get",
  },
}
