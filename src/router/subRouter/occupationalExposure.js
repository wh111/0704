/**
 * 模块名称:日常管理-职业暴露
 * 作者:zyc
 * 日期:2017-4-6
 *
 * @date     2017-06-26
 * @author   zyc<332533011@qq.com>
 */
const exposureRouters = {
  path: 'occupationalExposure',
  name: 'occupationalExposure',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'occupationalExposureAudit');
  },
  redirect: to => {
    return '/manage/occupationalExposure/occupationalExposureAudit'
  },
  children: [{
      //职业暴露
      path: 'occupationalExposureAudit',
      name: 'occupationalExposureAudit',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/occupationalExposureAudit/occupationalExposure_list.vue'));
        }, 'occupationalExposureAudit');
      }
    },
    {
      //职业暴露
      path: 'occupationalExposureWrite',
      name: 'occupationalExposureWrite',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/occupationalExposureWrite/occupationalExposure_list.vue'));
        }, 'occupationalExposureAudit');
      }
    }
  ]
}

export default exposureRouters;
