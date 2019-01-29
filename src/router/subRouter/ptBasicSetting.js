/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:研究生管理-基础设置
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const ptBasicSettingRouters = {
  path: 'ptBasicSetting',
  name: 'ptBasicSetting',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'ptRotationArrangement');
  },
  redirect: to => {
    return '/manage/ptBasicSetting/ptTrainingStandards'
  },
  children:[
    {
      //培训标准
      path:'ptTrainingStandards',
      name:'ptTrainingStandards',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/ptTrainingStandards/ptTrainingStandards_list.vue'));
        }, 'ptBasicSetting');
      }
    },
    {
      //科室对照
      path:'ptDepContrast',
      name:'ptDepContrast',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/ptDepContrast/ptDepContrast_list.vue'));
        }, 'ptBasicSetting');
      }
    },
    {
      //大病历设置
      path:'ptRecordsSet',
      name:'ptRecordsSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/ptRecordsSet/ptRecordsSet_list.vue'));
        }, 'ptBasicSetting');
      }
    },
    {
      //出科设置
      path:'ptGivenSet',
      name:'ptGivenSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/ptGivenSet/ptGivenSet_list.vue'));
        }, 'ptBasicSetting');
      }
    },
    {
      //专业管理
      path:'ptMajorManagement',
      name:'ptMajorManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/ptMajorManagement/ptMajorManagement_list.vue'));
        }, 'ptBasicSetting');
      }
    },
    {
      //人员管理
      path:'ptPersonnelManagement',
      name:'ptPersonnelManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptEnrollEnroll/yjsPersonnelManagement/yjsPersonnelManagement_list.vue'));
        }, 'ptBasicSetting');
      }
    },
    {
      //时间设置
      path:'ptTimeSet',
      name:'ptTimeSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/ptTimeSet/ptTimeSet_list.vue'));
        }, 'ptBasicSetting');
      }
    },
    {
      //收费标准
      path: 'postgraduateChargingStandard',
      name: 'postgraduateChargingStandard',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/postgraduateChargingStandard/postgraduateChargingStandard_list'));
        }, 'ptBasicSetting');
      }
    },
    {
      //专业设置
      path: 'majorEstablishment',
      name: 'majorEstablishment',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/majorEstablishment/majorEstablishment_list'));
        }, 'ptBasicSetting');
      }
    },
    {
      //短信模版设置
      path: 'YJSSMSTemplate',
      name: 'YJSSMSTemplate',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/YJSSMSTemplate/YJSSMSTemplate_list'));
        }, 'ptBasicSetting');
      }
    },
    {
      //答辩设置
      path: 'defenseSet',
      name: 'defenseSet',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/ptBasicSetting/defenseSet/defenseSet'));
        }, 'ptBasicSetting');
      }
    },
  ]
}

export default ptBasicSettingRouters;
