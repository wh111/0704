/**
 * Created by Administrator on 2017/5/22.
 */
export default {

  /*发布通知*/

  //获取栏目树结构get

  treeList:'information/module/treeList',

  //获取栏目列表get
  moduleList:'information/module/list',

  //获取栏目详情GET
  moduleGet:'information/module/get/',//{id}

  //添加栏目POST
  moduleAdd:'information/module/add',

  //修改栏目PUT
  moduleModify:'information/module/modify/',//{id}

  //删除一个或多个栏目DELETE
  moduleRemove:'information/module/remove/',//{ids}

  /*
   * 内容管理
   * */
  //获取资讯内容列表  GET
  columnList:'information/list',

  //删除一条或多条资讯内容DELETE
  columnReomve:'information/remove',  //{ids}

  //修改资讯内容PUT
  columnModify:'information/modify/',  //{id}

  //修改资讯内容发布状态PUT
  columnModifyStatus:'information/modifyStatus/',  //{id}

  //获取资讯内容GET
  columnGet:'information/get/',  //{id}

  //添加资讯内容 POST
  columnAdd:'information/add',
  //文件上传(静态资源上传，主要用于上传可直接访问的多媒体文件) POST
  multimedia:'/file/upload/static/multimedia',

  /*
  * 发布通知
  *
  * */




  //删除一条或多条通知  DELETE
  noticeRemove:'notice/remove',    //{ids}

  //修改通知发布状态 PUT
  noticeModifyStatus:'notice/modifyStatus/',    //{id}

  //添加通知回执信息 POST
  noticeRreceipt:'notice/receipt/add',

  //获取通知列表  GET
  noticeList:'notice/list',

  //获取通知详情 GET
  noticeGet:'notice/get/',    //{id}

  //修改通知 PUT
  noticeModify:'notice/modify/',    //{id}

  //添加通知 PUT
  noticeAdd:'notice/add',

  //查看回执信息（查看回执时调用） get
  receiptList:'notice/receipt/list'




}
