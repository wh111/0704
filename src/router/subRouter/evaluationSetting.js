/*
 * 模块名称:评价设置
 * 作者:gx
 * 日期:2017-6-19
 * */

const jxpjRouters = {
  path: 'evaluationSetting',
  name: 'evaluationSetting',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'evaluationSetting');
  },
  redirect: to => {
    return '/manage/jxpj/evaluation'
  },
  children:[{
    //评价表管理
    path:'evaluation',
    name:'evaluation',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingEvaluation/evaluationManagement/evaluationManagement_list.vue'));
      }, 'evaluationSetting');
    }
  },{
    //评价活动设置
    path:'evaluationActive',
    name:'evaluationActive',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teachingEvaluation/evaluationActivitySet/evaluationActivitySet_list.vue'));
      }, 'evaluationSetting');
    }
  }
  ]
}

export default jxpjRouters;

