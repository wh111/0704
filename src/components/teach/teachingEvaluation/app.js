/**
 * Created by Administrator on 2017/6/8.
 */

/**
 * 我的评价表
 * 单表分析统计
 * 综合分析统计
 * 评价表管理
 * 评价活动设置
 * */
export default {
  /*
  *我的评价表
  * */
  //我的评价表-详情-点击人员头像进行打分或查看
  EvaluatedGet:'/appraiserEvaluated/get',

  //评价打分 POST
  appraiserSubmit:'/appraiserEvaluated/appraiser/submit',

  //详情 GET
  queryByUser:'/appraiserEvaluated/query/byUser',

  //详情(未评分列表)
  noScore:'/appraiserEvaluated/query/byUser/noScore',
  //详情(已评分列表)
  haveScore:'/appraiserEvaluated/query/byUser/haveScore',

  //活动列表（获取自己的活动列表） GET
  queryBySelf:'/appraiserEvaluated/query-by-self',


  /*
  * 单表分析统计
  * */

  //单表分析列表 GET
  analysiTable:'/activity/query/analysiTable',


  //单表分析-查看分析-分析报告 GET
  analysiTableReport:'/activity/query/analysiTableReport',

  //单表分析---查看分析
  analysiTableDetail:'/activity/query/analysiTableDetail/',//{activityId}

  /*
  * 综合分析统计
  * */

  //分页查询分析策略
  strategyListPage:'/strategy/listPage',

  //删除分析策略
  strategyRemove:'/strategy/remove', ///{ids}

  //添加 分析策略
  //	Content-Type	application/json
  strategyAdd:'/strategy/add',

  //修改分析策略
  //Content-Type	application/json
  strategyModify:'/strategy/modify/',//{id}

  //获得单个分析策略
  strategyGet:'/strategy/get/',//{id}

  //综合分析---查看分析
  strategyTableDetail:'/strategy/query/strategyTableDetail/',//{strategyId}

  //综合分析-查看分析-分析报告
  strategyTableReport:'/strategy/query/strategyTableReport',//

  /*
  *评价表管理
  * */

  //查看（右侧评分表列表-查看）
  templateGet:'/template/get/',//{id}

  //评分表模板列表（点击左侧类型，右侧显示列表）
  templateQuery:'/template/query',//{id}

  //删除（右侧评分表列表-删除）
  templateRemove:'/template/remove',//{ids}

  //添加（右侧添加评分表）
    templateAdd:'/template/add',

  //修改（右侧修改评分表）
  templateModify:'/template/modify/',//{id}

  //删除（删除评分表类型）
  //删除左侧类型
  templateTypeRemove:'/template-type/remove',//{id}

  //查询评分表类型详情
  //查询左侧类型
  templateTypeGet:'/template-type/get/',//{id}

  //新建（新建评分表类型）
  //左侧类型新建
  templateTypeAdd:'/template-type/add',

  //修改（修改评分表类型）
  //左侧类型修改
  templateTypeModify:'/template-type/modify/',//{id}

  // 查询所有评分表类型
  //左侧类型（可添加，修改，删除）
  templateTypeQuery:'/template-type/query',

  /*评价活动设置
  * */
  //修改评价
  activityModify:'/activity/modify/',//{id}

  //详情(根据ID获取活动详情）
  activityGet:'/activity/get/',//{id}

  //列表
  activityQuery:'/activity/query',

  //新建评价
  activityAdd:'/activity/add',

  //删除
  activityRemove:'/activity/remove',//{ids}

  //发布
  activityPublish:'/activity/publish',//{ids}



}
