/**
 * Created by Administrator on 2017/9/3.
 */


export default {
  /**-------开题通知-----*/
  //开题通知添加
  noticeAdd:{
    path:'open/topic/notice/add',
    method: 'post'
  },
  //通知列表
  noticeList:{
    path:'open/topic/notice/list',
    method: 'get'
  },
  //通知列表(研究生获取)
  userList:{
    path:'open/topic/notice/user/list',
    method: 'get'
  },
  //删除开题通知
  noticeRemove:{
    path:'open/topic/notice/remove',//{ids}
    method: 'delete'
  },
  //开题通知发布
  noticePublish:{
    path:'open/topic/notice/publish',//{ids}
    method: 'put'
  },
  //获取开题通知
  noticeGet:{
    path:'open/topic/notice/get/',//{id}
    method: 'get'
  },
  //开题通知修改
  noticeModify:{
    path:'open/topic/notice/modify/',//{id}
    method: 'put'
  },
  // 从工作台来的查看
  noticeGetForWork:{
    path:'open/topic/notice/getToDoList/',//{id}
    method: 'get'
  },
}
