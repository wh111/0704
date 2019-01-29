
/**----- 病例评分表 --------------------------------------------------------------------------------*/
/*----- 实习生__病例评分表 --------------------------------------------------------------------------------*/
const configuration = '/rotaryevaluation/configuration'
let api = {
  //评分配置列表
  configurationPageList:{
    path: configuration+'/pageList', //
    method: 'get'
  },
//根据模块获取对应的评分表
  configurationGet:{
    path: configuration+'/get/', // {model}
    method: 'get'
  },
//根据评分表打分
  configurationAddMark:{
    path: configuration+'/addMark', //
    method: 'post'
  },
//根据轮转ID和模块获取打分详情
  configurationGetMark:{
    path: configuration+'/getMark/', //{businessId}_{model}
    method: 'get'
  },
//修改评分配置
  configurationModify:{
    path: configuration+'/modify/', //{configurationId}
    method: 'put'
  },
//添加评分配置
  configurationAdd:{
    path: configuration+'/add/', //
    method: 'post'
  },

}
export  default  api
