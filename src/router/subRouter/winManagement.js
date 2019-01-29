/*
 * 模块名称:日常管理-评优
 * 作者:zyc
 * 日期:2017-4-6
 * */
const pyRouters = {
  path: 'awardManager',
  name: 'awardManager',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'awardManager');
  },
  redirect: to => {
    return '/manage/assessmentManagement/award';
  },
  children: [
    {
      //获奖管理
      path: 'award',
      name: 'award',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/daily/dailyManagement/award/award_list.vue'));
        }, 'awardManager');
      },
    },
  ],
};

export default pyRouters;
