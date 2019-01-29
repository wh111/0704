/**
 * Created by Administrator on 2017/9/3.
 */


export default {
  /**-------开题报告审核-----*/

  //导师审核开题申请列表(导师审核时调用 )
  tutorList:{
    path:'open/topic/report/tutor/list',
    method: 'get'
  },
  //获取开题申请列表(教研室审核时调用 )
  jysAuditList:{
    path:'open/topic/report/jysAudit/list',
    method: 'get'
  },
  //获取开题申请列表(教研室，教育处审核时调用 )
  jycAuditList:{
    path:'open/topic/report/jycAudit/list',
    method: 'get'
  },
  //导师审核
  tutorAudit:{
    path:'open/topic/report/tutorAudit',//{id}
    method: 'put'
  },
  //教研室审核
  jysAudit:{
    path:'open/topic/report/jysAudit',//{id}
    method: 'put'
  },
  //教育处审核
  jycAudit:{
    path:'open/topic/report/jycAudit',//{id}
    method: 'put'
  },
  //获取开题申请(审核，查看时调用时调用 )
  auditGet:{
    path:'open/topic/report/audit/get/',//{id}
    method: 'get'
  },



}
