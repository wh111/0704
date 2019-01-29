/**
 * 模块名称:日常管理-津贴管理
 * 作者:zyc
 * 日期:2017-4-6
 *
 * @date     2017-06-26
 * @author   zyc<332533011@qq.com>
 */
const benefitsRouters = {
  path: 'benefitsManagement',
  name: 'benefitsManagement',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'benefitsManagement');
  },
  redirect: to => {
    return '/manage/benefitsManagement/allowance'
  },
  children: [
    {
      //津贴
      path: 'allowance',
      name: 'allowance',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/allowance/allowance_list.vue'));
        }, 'benefitsManagement');
      }
    },
    {
      //津贴设置
      path: 'allowanceSetting',
      name: 'allowanceSetting',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/allowanceSetting/allowanceSetting_list.vue'));
        }, 'benefitsManagement');
      }
    },
    {
      //我的津贴
      path: 'myAllowance',
      name: 'myAllowance',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/myAllowance/myAllowance_list'));
        }, 'benefitsManagement');
      }
    }
  ]
};

export default benefitsRouters;
