/**
 * 住院医-基础设置
 * 作者:zyc
 * 日期:2017-7-21
 */
const zyyRouters = {
  path: 'rdyBasicSetting',
  name: 'rdyBasicSetting',
  meta: {
    requireAuth: false,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'rdyBasicSetting');
  },
  redirect: to => {
    return '/manage/rdyBasicSetting/rdyTrainingStandards'
  },
  children: [
    {
      //人员管理
      path: 'rdyPersonnelManagement',
      name: 'rdyPersonnelManagement',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/zyy/rdyEnrollEnroll/rdyPersonnelManagement/rdyPersonnelManagement_list.vue'));
        }, 'rdyBasicSetting');
      }
    },
    {
      //培训标准
      path: 'rdyTrainingStandards',
      name: 'rdyTrainingStandards',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/zyy/rdyBasicSetting/rdyTrainingStandards/rdyTrainingStandards_list.vue'));
        }, 'rdyBasicSetting');
      }
    }, {
      //科室对照
      path: 'rdyDepContrast',
      name: 'rdyDepContrast',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/zyy/rdyBasicSetting/rdyDepContrast/rdyDepContrast_list.vue'));
        }, 'rdyBasicSetting');
      }
    }, {
      //大病历设置
      path: 'rdyRecordsSet',
      name: 'rdyRecordsSet',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/zyy/rdyBasicSetting/rdyRecordsSet/rdyRecordsSet_list.vue'));
        }, 'rdyBasicSetting');
      }
    },
    {
      //出科设置
      path: 'rdyGivenSet',
      name: 'rdyGivenSet',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/zyy/rdyBasicSetting/rdyGivenSet/rdyGivenSet_list.vue'));
        }, 'rdyBasicSetting');
      }
    },
    {
      //短信模板设置
      path: 'rdySMSTemplate',
      name: 'rdySMSTemplate',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/zyy/rdyBasicSetting/rdySMSTemplate/rdySMSTemplate_list.vue'));
        }, 'rdyBasicSetting');
      }
    },

  ]
}

export default zyyRouters;
