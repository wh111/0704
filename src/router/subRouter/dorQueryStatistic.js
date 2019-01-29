/**
 * 宿舍管理 - 查询统计
 * 作者:zyc
 * 日期:2017-5-18
 */
const dormitoryRouters = {
  path: 'dorQueryStatistic',
  name: 'dorQueryStatistic',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'dorQueryStatistic');
  },
  redirect: to => {
    return '/manage/dormitory/roomUseing'
  },
  children:[
    {
      //房间使用情况
      path:'roomUseing',
      name:'roomUseing',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/dormitory/roomUseing/roomUseing_list.vue'));
        }, 'dorQueryStatistic');
      }
    },
    {
      //人员入住情况
      path:'occupancy',
      name:'occupancy',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/dormitory/occupancy/occupancy_list.vue'));
        }, 'dorQueryStatistic');
      }
    },
  ]
}

export default dormitoryRouters;
