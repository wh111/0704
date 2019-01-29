/**
 * 轮转管理
 * 作者:zyc
 * 日期:2017-5-18
 */
const recruitRouters = {
  path: 'internHandbook',
  name: 'internHandbook',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'internHandbook');
  },
  redirect: to => {
    return '/manage/internHandbook/chooseLesson'
  },
  children:[{
    //选课
    path:'chooseLesson',
    name:'chooseLesson',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/intern/internHandbook/chooseLesson/chooseLesson_list.vue'));
      }, 'internHandbook');
    }
  },
    {
      //病种
      path:'entityIsIntern',
      name:'entityIsIntern',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internHandbook/entityIsIntern/entityIsIntern_list.vue'));
        }, 'internHandbook');
      }
    },
    {
      //技能操作
      path:'skillOperation',
      name:'skillOperation',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internHandbook/skillOperation/skillOperation_list.vue'));
        }, 'internHandbook');
      }
    },
    {
      //大病历
      path:'largeMedicalIsIntern',
      name:'largeMedicalIsIntern',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internHandbook/largeMedicalIsIntern/largeMedicalIsIntern_list.vue'));
        }, 'internHandbook');
      }
    },
    {
      //出科申请(小科)
      path:'givenApplicationSmall',
      name:'givenApplicationSmall',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internHandbook/givenApplicationSmall/givenApplicationSmall_list.vue'));
        }, 'internHandbook');
      }
    },
    {
      //出科申请(大科)
      path:'givenApplicationBig',
      name:'givenApplicationBig',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internHandbook/givenApplicationBig/givenApplicationBig_list.vue'));
        }, 'internHandbook');
      }
    },
    {
      //我的评价
      path:'myEvaluationIsIntern',
      name:'myEvaluationIsIntern',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internHandbook/myEvaluationIsIntern/myEvaluationIsIntern_list.vue'));
        }, 'internHandbook');
      }
    },
    {
      //结业鉴定
      path:'graduationAppraisalIsIntern',
      name:'graduationAppraisalIsIntern',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internHandbook/graduationAppraisalIsIntern/graduationAppraisalIsIntern_list.vue'));
        }, 'internHandbook');
      }
    },
    {
      //轮转手册
      path:'rotateHandbookIsIntern',
      name:'rotateHandbookIsIntern',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internHandbook/rotateHandbookIsIntern/rotateHandbookIsIntern_list.vue'));
        }, 'internHandbook');
      }
    },
    {
      //补轮转
      path:'repairRotateIsIntern',
      name:'repairRotateIsIntern',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internHandbook/repairRotateIsIntern/repairRotateIsIntern_list.vue'));
        }, 'internHandbook');
      }
    },
  ]
}

export default recruitRouters;
