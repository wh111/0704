/**
 * 轮转查询
 * 作者:gx
 * 日期:2017-7-3
 */
const rotateRouters = {
  path: 'rotateQuery',
  name: 'rotateQuery',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'rotateQuery');
  },
  redirect: to => {
    return '/manage/rotateQuery/entityAudit'
  },
  children:[{
    //轮转表
    path:'rotateTables',
    name:'rotateTables',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/rotateManagement/rotateQuery/rotateTables/rotateTables_list.vue'));
      }, 'rotateQuery');
    }
   },
    {
      //培训档案
      path:'trainingArchives',
      name:'trainingArchives',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateQuery/trainingArchives/trainingArchives_list.vue'));
        }, 'rotateQuery');
      }
    },
     {
       //补轮转（移到安排轮转）
       path:'makeUpRotate',
       name:'makeUpRotate',
       component:resolve=> {
         require.ensure([], () => {
           resolve(require('../../components/rotateManagement/rotateQuery/makeUpRotate/makeUpRotate_list.vue'));
         }, 'rotateQuery');
       }
     },
    {
      //轮转表
      path:'myRotateTables',
      name:'myRotateTables',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateQuery/rotateTables/myRotateTables_list.vue'));
        }, 'rotateQuery');
      }
    },
    {
      //轮转表查询
      path: 'rotateTablesQuery',
      name: 'rotateTablesQuery',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateQuery/rotateTablesQuery/rotateTablesQuery_list.vue'));
        }, 'rotateQuery');
      }
    },
    {
      //轮转统计情况
      path: 'queryRotaryAndOutDepCondition',
      name: 'queryRotaryAndOutDepCondition',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateQuery/queryRotaryAndOutDepCondition/queryRotaryAndOutDepCondition_list.vue'))
        }, 'rotateQuery')
      }
    },
    {
      //大病历查询
      path: 'managePagelist',
      name: 'managePagelist',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateQuery/managePagelist/managePagelist_list.vue'))
        }, 'rotateQuery')
      }
    },

  ]
}

export default rotateRouters;
