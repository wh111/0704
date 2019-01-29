/**
 * Created by Administrator on 2017/9/3.
 */


export default {
  /**-------开题申请-----*/

  //获取开题申请列表(研究生调用 )
  applicationList:{
    path:'open/topic/application/list',
    method: 'get'
  },

  //获取开题申请(修改时调用)
  applicationGet:{
    path:'open/topic/application/get/',//{id}
    method: 'get'
  },
  //获取开题申请(修改时调用)
  auditGet:{
    path:'open/topic/application/audit/get/',//{id}
    method: 'get'
  },
  //开题申请添加
  applicationAdd:{
    path:'open/topic/application/add',
    method: 'post'
  },
  //开题申请修改（修改未上报的开题申请）
  applicationModify:{
    path:'open/topic/application/modify/',//{id}
    method: 'post'
  },
  //开题申请上报（修改未上报的开题申请状态为DSDSH待导师审核）
  applicationReport:{
    path:'open/topic/application/report',//{id}
    method: 'put'
  },

  //通知列表(研究生获取)
  userList:{
    path:'open/topic/notice/user/list',
    method: 'get'
  },
  //获取开题通知
  noticeGet:{
    path:'open/topic/notice/get/',//{id}
    method: 'get'
  },

  //删除
  applicationRemove:{
    path:'open/topic/application/remove',//{ids}
    method: 'delete'
  },

  // 获取导师和专业
  getTeacherAndMajor: {
    path: 'training/plan/getTeacherAndMajor',
    method: 'get'
  },
}
