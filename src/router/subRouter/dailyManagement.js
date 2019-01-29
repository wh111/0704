/*
 * 模块名称:日常管理-评优
 * 作者:zyc
 * 日期:2017-4-6
 * */
const pyRouters = {
  path: 'assessmentManagement',
  name: 'assessmentManagement',
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'assessmentManagement');
  },
  redirect: to => {
    return '/manage/assessmentManagement/highestQuality';
  },
  children: [{
    //评优
    path: 'highestQuality',
    name: 'highestQuality',
    component: resolve => {
      require.ensure([], () => {
        resolve(require('../../components/daily/dailyManagement/highestQuality/highestQuality_list.vue'));
        // resolve(require('../../components/daily/dailyManagement/highestQuality/highestQuality_study_list.vue'));
      }, 'assessmentManagement');
    }
  }, {
    //评优学生
    path: 'joinAppraising',
    name: 'joinAppraising',
    component: resolve => {
      require.ensure([], () => {
        // resolve(require('../../components/daily/dailyManagement/highestQuality/highestQuality_list.vue'));
        resolve(require('../../components/daily/dailyManagement/highestQuality/highestQuality_study_list.vue'));
      }, 'assessmentManagement');
    }
  },
    {
      //基础管理
      path: 'basicManagement',
      name: 'basicManagement',
      component: resolve => {
        require.ensure([], () => {
          // resolve(require('../../components/daily/dailyManagement/highestQuality/highestQuality_list.vue'));
          resolve(require('../../components/daily/dailyManagement/basicManagement/basicManagement_list'));
        }, 'assessmentManagement');
      }
    }
  ]
};

export default pyRouters;
