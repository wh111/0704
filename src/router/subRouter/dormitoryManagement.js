/**
 * 宿舍管理 - 基础设置
 * 作者:zyc
 * 日期:2017-5-18
 */
const dormitoryRouters = {
  path: 'baseSetting',
  name: 'baseSetting',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'baseSetting');
  },
  redirect: to => {
    return '/manage/baseSetting/dormitoryMess'
  },
  children:[{
    //宿舍管理
    path:'dormitoryMess',
    name:'dormitoryMess',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/dormitory/dormitoryMess.vue'));
      }, 'baseSetting');
    }
  },{
    //楼房信息管理
    path:'buildingMess',
    name:'buildingMess',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/dormitory/buildingMess/buildingMess_list.vue'));
      }, 'baseSetting');
    }
  },
    {
      //房间信息管理
      path:'roomMess',
      name:'roomMess',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/dormitory/roomMess/roomMess_list.vue'));
        }, 'baseSetting');
      }
    },
  ]
}

export default dormitoryRouters;
