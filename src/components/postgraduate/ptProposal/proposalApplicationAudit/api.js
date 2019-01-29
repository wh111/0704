/**
 * Created by Administrator on 2017/9/3.
 */


export default {
  /**-------开题审核-----*/

  //导师审核开题申请列表(导师审核时调用 )
  tutorList:{
    path:'open/topic/application/tutor/list',
    method: 'get'
  },
  //获取开题申请列表(教研室，审核时调用 )
  JYSAuditList:{
    path:'open/topic/application/jysAudit/list',
    method: 'get'
  },
  //获取开题申请列表(教育处审核时调用 )
  JYCAuditList:{
    path:'open/topic/application/jycAudit/list',
    method: 'get'
  },
  //导师审核
  tutorAudit:{
    path:'open/topic/application/tutorAudit/',//{id}
    method: 'post'
  },
  //教研室审核
  jysAudit:{
    path:'open/topic/application/jysAudit/',//{id}
    method: 'post'
  },
  //教育处审核
  jycAudit:{
    path:'open/topic/application/jycAudit/',//{id}
    method: 'post'
  },
  //获取开题申请(审核，查看时调用时调用 )
  auditGet:{
    path:'open/topic/application/audit/get/',//{id}
    method: 'get'
  },



}
