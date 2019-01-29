/*
 * 模块名称:我的评价
 * 作者:gx
 * 日期:2017-6-19
 * */

const jxpjRouters = {
  path: 'evaluations',
  name: 'evaluations',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'evaluations');
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
  }
  ]
}

export default jxpjRouters;

