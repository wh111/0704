/**
 * Created by Administrator on 2017/5/31.
 */


export default {
  /*
   * 宿舍管理-楼房信息管理
   * */
  //获取列表GET
  buildList :'/dormitory/build/list',

  //查看（获取详情） GET
  buildGet :'/dormitory/build/get/',//{id}

  //添加 POST
  buildAdd :'/dormitory/build/add',

  //修改 PUT
  buildModify :'/dormitory/build/modify/',//{id}

  //删除 DELETE
  buildRemove :'/dormitory/build/remove',//{ids}


  /*
  * 宿舍管理-房间信息管理
  * */

  //添加-查询所有大楼(用于添加房间时，选择大楼的下拉框)
  allBuild :'/dormitory/build/query/allBuild',


  //查看（查看单个房间详情）
  roomGet :'/dormitory/room/get/',  //{id}

  //删除DELETE
  roomRemove :'/dormitory/room/remove',  //{ids}

  //批量添加POST
  roomAddList :'/dormitory/room/addList',


  //分页查询房间 GET
  roomListPage :'/dormitory/room/listPage',


  //修改 put
  roomModify :'/dormitory/room/modify/',//{id}

  //添加 put
  roomAdd :'/dormitory/room/add',
  //导入房间 put
  importRoom :'/dormitory/room/importRoom',

  /*
  *
  * 宿舍管理-房间使用情况
  * */

  //房间使用情况列表 GET
  roomUsingInfo :'/dormitory/bedPerson/listPage/roomUsingInfo',

  //房间使用情况总分析 GET
  findAllRoomInfo :'/dormitory/bedPerson/findAllRoomInfo',
  //房间使用情况总分析 GET
  exportRoomUsingInfo :'/dormitory/bedPerson/export/roomUsingInfo',

  /*
  *宿舍管理-人员入住情况
  * */

  //获取单个床位_人员记录 GET
  bedPersonGet :'/dormitory/bedPerson/get/',//{id}

  //人员入住情况 GET
  userInfo :'/dormitory/bedPerson/listPage/userInfo',

  //人员入住情况 GET
  exportBedPerson :'/dormitory/bedPerson/export/bedPerson',


  /*
  * 宿舍管理-迁入迁出
  * */
  //所有房间自动安排 post
  bedPersonAddAutoList :'/dormitory/bedPerson/addAutoList',

  //批量迁出 PUT
  bedPersonModifyList :'/dormitory/bedPerson/modifyList',

  //批量迁入 POST
  bedPersonAddList :'/dormitory/bedPerson/addList',

  //单个迁入 POST
  bedPersonAdd :'/dormitory/bedPerson/add',

  //更换房间 PUT
  bedPersonChange :'/dormitory/bedPerson/change',

  //迁入迁出详情（点击大楼图标后进入的房间展示页面） GET
  bedPersonList :'/dormitory/bedPerson/list/roomBedInfo',

  //查询实习生中可自动分配宿舍的人员） GET
  queryCormitory :'/user/query/dormitory',

  //房间历史入住情况 GET
  bedPersonListPage :'/dormitory/bedPerson/listPage',

  //单个迁出 PUT
  bedPersonModify :'/dormitory/bedPerson/modify',

  //根据大楼ID查询需要更换的房间信息 GET
  queryChangeRoom :'/dormitory/room/query/changeRoom',


  //根据用户Id获取用户详情（含学校、部门、角色、账户、档案）
  getUserInfo:'/user/getUserInfo/', //{userId}

  /**确认住宿*/
  //查询所有生源的人员信息 get
  userList:'/dormitory/bedPerson/userList', //{userId}
  //批量确认住宿 put
  confirm:'/dormitory/bedPerson/confirm', //{ids}


}

