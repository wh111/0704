/**
 * 轮转查询
 * 作者:gx
 * 日期:2017-7-3
 */
const rotateRouters = {
  path: 'reportsManagement',
  name: 'reportsManagement',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'reportsManagement');
  },
  redirect: to => {
    return '/manage/reportsManagement/entityAudit'
  },
  children:[{
    //来院报道
    path:'reportToTheCollege',
    name:'reportToTheCollege',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/rotateManagement/reportsManagement/reportToTheCollege/reportToTheCollege_list.vue'));
      }, 'reportsManagement');
    }
   },
    {
      //科室报到
      path:'deptReported',
      name:'deptReported',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/reportsManagement/deptReported/deptReported_list.vue'));
        }, 'deptReported');
      }
    },
    {
      //科室报到
      path: 'distributionTeach',
      name: 'distributionTeach',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/reportsManagement/distributionTeach/distributionTeach_list.vue'));
        }, 'deptReported');
      }
    },
  ]
}

export default rotateRouters;
