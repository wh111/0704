/*
 * 模块名称:教学评价
 * 作者:zyc
 * 日期:2017-4-6
 * */

const jxpjRouters = {
  path: 'jxpj',
  name: 'jxpj',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'jxpj');
  },
  redirect: to => {
    return '/manage/jxpj/myEvaluationIsIntern'
  },
  children:[{
    //我的评价表
    path:'myEvaluation',
    name:'myEvaluation',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingEvaluation/myEvaluation/myEvaluation_list.vue'));
      }, 'jxpj');
    }
  },{
    //单表分析统计
    path:'singleTable',
    name:'singleTable',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingEvaluation/singleTableAnalysis/singleTableAnalysis_list.vue'));
      }, 'jxpj');
    }
  },{
    //综合分析统计
    path:'synthesize',
    name:'synthesize',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingEvaluation/synthesizeStatistics/synthesizeStatistics_list.vue'));
      }, 'jxpj');
    }
  },{
    //评价表管理
    path:'evaluation',
    name:'evaluation',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingEvaluation/evaluationManagement/evaluationManagement_list.vue'));
      }, 'jxpj');
    }
  },{
    //评价活动设置
    path:'evaluationActive',
    name:'evaluationActive',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingEvaluation/evaluationActivitySet/evaluationActivitySet_list.vue'));
      }, 'jxpj');
    }
  }
  ]
}

export default jxpjRouters;

