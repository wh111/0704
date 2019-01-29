/*----- 研究生__基础设置 --------------------------------------------------------------------------------*/

const api = {
  /*----- 答辩管理 --------------------------------------------------------------------------------*/
  //答辩申请
  defenseAppGet: {  //获取答辩申请(修改时调用)
    path: "/defense/application/get",
    method: 'get'
  },
  defenseAppModify: {  //答辩申请修改  /{id}
    path: "/defense/application/modify/",
    method: 'put'
  },
  defenseAppAdd: {  //答辩申请添加
    path: "/defense/application/add",
    method: 'post'
  },
  defenseAppReport: {  //答辩申请上报（修改未上报的答辩申请状态为DSH待审核） /{id}
    path: "/defense/application/report/",
    method: 'put'
  },

  /*----- 专业管理 --------------------------------------------------------------------------------*/
  //专业列表
  ptMajor: {
    path: '/major/list',
    method: 'get'
  },
  //添加专业
  ptMajorAdd: {
    path: '/major/add',
    method: 'post'
  },
  //修改专业
  ptMajorModify: {
    path: '/major/modify/',
    method: 'put'
  },
  //查看专业
  ptMajorGet: {
    path: '/major/get/', // {id}
    method: 'put'
  },
  //删除专业
  ptMajorRemoves: {
    path: '/major/remove', // {ids}
    method: 'put'
  },
  //删除专业
  ptMajorRemove: {
    path: '/major/removes', // {ids}
    method: 'put'
  },

  getByKey: {
    path: '/rotaryConfig/getByKey/', // {configKey}-YJS
    method: 'get'
  },

  modifyConfig: {
    path: '/rotaryConfig/modify/', // {configId}
    method: 'put'
  },

  /*----- 专业设置 --------------------------------------------------------------------------------*/
  majorList: {//专业-分页列表
    path: '/major/list', // {configKey}-YJS
    method: 'get'
  },
  majorModify: {//专业-修改
    path: '/major/modify/', // {id}
    method: 'put'
  },
  majorRemove: {//专业-删除
    path: '/major/remove', ///{ids}
    method: 'delete'
  },
  modifyStatusByIdList: {//专业-态修改
    path: '/modifyStatusByIdList/', ///{ids}
    method: 'put'
  },
  majorAdd:{
    path: '//major/add/', //添加
    method: 'put'
  },


};

export default api
