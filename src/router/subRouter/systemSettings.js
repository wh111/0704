/**
 * 系统设置
 * 作者:gx
 * 日期:2017-4-11
 */
const systemSettingsRouters = {
  path: 'systemSettings',
  name: 'systemSettings',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'systemSetting');
  },
  redirect: to => {
    return '/manage/systemSettings/holidays'
  },
  children:[{
    //节假日
    path:'holidays',
    name:'holidays',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/base/systemSettings/holidays/holidays_list.vue'));
      }, 'systemSetting');
    }
  },
    {
      //考勤位置
      path:'checkLocation',
      name:'checkLocation',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/systemSettings/checkLocation/checkLocation_list.vue'));
        }, 'systemSetting');
      }
    },
    {
      //病历评价设置
      path:'evaluationSet',
      name:'evaluationSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/systemSettings/evaluationSet/evaluationSet_list.vue'));
        }, 'systemSetting');
      }
    },
    {
      //轮转基础设置
      path:'rotaryBasisSet',
      name:'rotaryBasisSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/systemSettings/rotaryBasisSet/rotaryBasisSet_list.vue'));
        }, 'systemSetting');
      }
    },
    {
      //短信模版设置
      path:'noteTemplate',
      name:'noteTemplate',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/systemSettings/noteTemplate/noteTemplate_list.vue'));
        }, 'systemSetting');
      }
    },
    {
      //APP管理
      path:'appManager',
      name:'appManager',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/systemSettings/appManager/appManager_list.vue'));
        }, 'systemSetting');
      }
    },
      {
      //住院医实施（导入轮转表）
      path:'implementationManagement',
      name:'implementationManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/zyy/implementationManagement/implementationManagement_list.vue'));
        }, 'systemSetting');
      }
  },
  ]
}

export default systemSettingsRouters;
