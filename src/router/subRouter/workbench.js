/**
 * 工作台
 * 作者:zyc
 * 日期:2017-7-6
 */
const workbenchRouters = {
  path: 'workbench',
  name: 'workbench',
  meta: {
    requireAuth: false,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'workbench');
  },
  redirect: to => {
    return '/manage/workbench/work'
  },
  children:[{
    //节假日
    path:'work',
    name:'work',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/common/workbench.vue'));
      }, 'workbench');
    }
  }

  ]
}

export default workbenchRouters;
