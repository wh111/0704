/**
 * 住院医-基础设置
 * 作者:zyc
 * 日期:2017-7-21
 */
const zyyRouters = {
  path: 'workloadStatistics',
  name: 'workloadStatistics',
  meta: {
    requireAuth: false,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'))
    }, 'workloadStatistics')
  },
  redirect: to => {
    return '/manage/workloadStatistics/rotaryStatistics'
  },
  children: [
    {
      //轮转统计
      path: 'rotaryStatistics',
      name: 'rotaryStatistics',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/zyy/workloadStatistics/rotaryStatistics/rotaryStatistics_list.vue'))
        }, 'workloadStatistics')
      },
    },
    {
      //学员薪资统计
      path: 'studentSalaryStatistics',
      name: 'studentSalaryStatistics',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/zyy/workloadStatistics/studentSalaryStatistics/studentSalaryStatistics_list.vue'))
        }, 'workloadStatistics')
      },
    },
    {
      //师资劳务统计
      path: 'serviceFeeStatistics',
      name: 'serviceFeeStatistics',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/zyy/workloadStatistics/serviceFeeStatistics/serviceFeeStatistics_list.vue'))
        }, 'workloadStatistics')
      },
    },
    {
      //费用设置
      path: 'feeSetting',
      name: 'feeSetting',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/zyy/workloadStatistics/feeSetting/feeSetting_list.vue'))
        }, 'workloadStatistics')
      },
    },

  ],
}

export default zyyRouters
