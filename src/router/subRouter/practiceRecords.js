/**
 * 模块名称:日常管理-奖惩记录
 * 作者:zyc
 * 日期:2017-4-6
 *
 * @date     2017-06-26
 * @author   zyc<332533011@qq.com>
 */
const recordRouters = {
  path: 'practiceRecords',
  name: 'practiceRecords',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'practiceRecords');
  },
  redirect: to => {
    return '/manage/practiceRecords/practiceRecordsManagement'
  },
  children:[
    {
      //奖惩记录管理
      path:'practiceRecordsManagement',
      name:'practiceRecordsManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/practiceRecords/practiceRecords_list.vue'));
        }, 'practiceRecords');
      }
    },
    {
      //奖惩记录登记
      path:'practiceRecordsRegister',
      name:'practiceRecordsRegister',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/daily/dailyManagement/practiceRecordsRegister/practiceRecordsRegister_list.vue'));
        }, 'practiceRecords');
      }
    }
  ]
}

export default recordRouters;
