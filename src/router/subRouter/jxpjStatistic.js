/*
 * 模块名称:教学评价
 * 作者:zyc
 * 日期:2017-4-6
 * */

const jxpjRouters = {
  path: 'jxpjStatistic',
  name: 'jxpjStatistic',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'jxpjStatistic');
  },
  redirect: to => {
    return '/manage/jxpj/singleTable'
  },
  children:[{
    //单表分析统计
    path:'singleTable',
    name:'singleTable',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingEvaluation/singleTableAnalysis/singleTableAnalysis_list.vue'));
      }, 'jxpjStatistic');
    }
  },{
    //综合分析统计
    path:'synthesize',
    name:'synthesize',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingEvaluation/synthesizeStatistics/synthesizeStatistics_list.vue'));
      }, 'jxpjStatistic');
    }
  }
  ]
}

export default jxpjRouters;

