/**
 * Created by Administrator on 2017/9/3.
 */


export default {
  /**-------开题审核-----*/

  //答辩申请列表（导师（答辩秘书）审核时调用）
  tutorList:{
    path:'defense/application/list',
    method: 'get'
  },
  //答辩申请列表（教研室审核时调用）
  jysAuditList:{
    path:'defense/application/jysAudit/list',
    method: 'get'
  },
  //答辩申请列表（教育处审核时调用）
  jycAuditList:{
    path:'defense/application/jycAudit/list',
    method: 'get'
  },
  //导师审核
  tutorAudit:{
    path:'defense/application/audit/',//{id}
    method: 'put'
  },
  //教研室审核
  jysAudit:{
    path:'defense/application/jysAudit/',//{id}
    method: 'put'
  },
  //教育处审核
  jycAudit:{
    path:'defense/application/jycAudit/',//{id}
    method: 'put'
  },
  //获取开题申请(审核，查看时调用时调用 )
  auditGet:{
//    path:'defense/application/audit/get/',//{id}
    path:'/defense/application/getByUser',
    method: 'get'
  },



}
