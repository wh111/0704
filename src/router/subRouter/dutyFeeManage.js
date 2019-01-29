/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:进修管理-学术会议
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const academicConferenceRouters = {
  path: 'dutyFeeManage',
  name: 'dutyFeeManage',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'dutyFeeManage');
  },
  redirect: to => {
    return '/manage/dutyFeeManage/dutyFeeAllocationSetting'
  },
  children: [
    {
      //值班费配置
      path: 'dutyFeeAllocationSetting',
      name: 'dutyFeeAllocationSetting',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/dutyFeeManage/dutyFeeAllocationSetting/dutyFeeAllocationSetting_list.vue'));
        }, 'dutyFeeManage');
      }
    },
    {
      //值班费发放
      path: 'dutyFeeGrant',
      name: 'dutyFeeGrant',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/dutyFeeManage/dutyFeeGrant/dutyFeeGrant_list.vue'));
        }, 'dutyFeeManage');
      }
    },

  ]
}

export default academicConferenceRouters;
