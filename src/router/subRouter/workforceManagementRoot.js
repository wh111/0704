/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:日常-排班表管理
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const academicConferenceRouters = {
  path: 'workforceManagementRoot',
  name: 'workforceManagementRoot',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'workforceManagementRoot');
  },
  redirect: to => {
    return '/manage/workforceManagementRoot/workforceManagement'
  },
  children: [
    {
      //排班表设置
      path: 'workforceManagement',
      name: 'workforceManagement',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/workforceManagementRoot/workforceManagement/workforceManagement_list.vue'));
        }, 'workforceManagementRoot');
      }
    },
    {
      //我的排班表
      path: 'myWorkforce',
      name: 'myWorkforce',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/workforceManagementRoot/myWorkforce/myWorkforce_list.vue'));
        }, 'workforceManagementRoot');
      }
    },

  ]
}

export default academicConferenceRouters;
