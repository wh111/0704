/**
 * 宿舍管理 - 住宿管理
 * 作者:zyc
 * 日期:2017-5-18
 */
const roomRouters = {
  path: 'stayManagement',
  name: 'stayManagement',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'stayManagement');
  },
  redirect: to => {
    return '/manage/stayManagement/inAndOut'
  },
  children:[
    {
      //迁入迁出
      path:'inAndOut',
      name:'inAndOut',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/dormitory/inAndOut/inAndOut_list.vue'));
        }, 'stayManagement');
      }
    },
    {
      //住宿确认
      path:'affirmStay',
      name:'affirmStay',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/dormitory/affirmStay/affirmStay_list.vue'));
        }, 'stayManagement');
      }
    },
  ]
}

export default roomRouters;
