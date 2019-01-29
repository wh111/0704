/**
 * Created by Administrator on 2017/9/3.
 */


export default {
  /**-------开题报告-----*/

  //获取开题报告列表(研究生调用 )
  applicationList:{
    path:'open/topic/report/list',
    method: 'get'
  },

  //获取开题申请(修改时调用)
  applicationGet:{
    path:'open/topic/report/get/',//{id}
    method: 'get'
  },
  //获取开题申请(修改时调用)
  auditGet:{
    path:'open/topic/report/audit/get/',//{id}
    method: 'get'
  },
  //开题申请添加
  applicationAdd:{
    path:'open/topic/report/add',
    method: 'post'
  },
  //开题申请修改（修改未上报的开题申请）
  applicationModify:{
    path:'open/topic/report/modify/',//{id}
    method: 'put'
  },
  //开题申请上报（修改未上报的开题申请状态为DSDSH待导师审核）
  applicationReport:{
    path:'open/topic/report/submit',//{id}
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
  //删除开题报告
  noticeRemove:{
    path:'open/topic/report/remove',//{id}
    method: 'get'
  },

  // 获取导师和专业
  getTeacherAndMajor: {
    path: 'training/plan/getTeacherAndMajor',
    method: 'get'
  },
}
