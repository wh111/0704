/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:进修管理-基础设置
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const emBasicSettingRouters = {
  path: 'emBasicSetting',
  name: 'emBasicSetting',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'ptRotationArrangement');
  },
  redirect: to => {
    return '/manage/emBasicSetting/emTrainingStandards'
  },
  children:[
    /*{
      //培训标准
      path:'emTrainingStandards',
      name:'emTrainingStandards',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emBasicSetting/emTrainingStandards/emDeptRequireSet_list.vue'));
        }, 'emBasicSetting');
      }
    },
    {
      //科室对照
      path:'emDepContrast',
      name:'emDepContrast',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emBasicSetting/emDepContrast/emDepContrast_list.vue'));
        }, 'emBasicSetting');
      }
    },*/
    {
      //科室要求(20170914)
      path:'emDeptRequireSet',
      name:'emDeptRequireSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emBasicSetting/emDeptRequireSet/emDeptRequireSet_list.vue'));
        }, 'emBasicSetting');
      }
    },
    {
      //收费标准(20170914)
      path:'emChargingStandard',
      name:'emChargingStandard',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emBasicSetting/emChargingStandard/emChargingStandard_list.vue'));
        }, 'emBasicSetting');
      }
    },
    {
      //大病历设置
      path:'emRecordsSet',
      name:'emRecordsSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emBasicSetting/emRecordsSet/emRecordsSet_list.vue'));
        }, 'emBasicSetting');
      }
    },
    {
      //出科设置
      path:'emGivenSet',
      name:'emGivenSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emBasicSetting/emGivenSet/emGivenSet_list.vue'));
        }, 'emBasicSetting');
      }
    },
    {
      //人员管理
      path:'emPersonnelManagement',
      name:'emPersonnelManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/EnrollEnroll/jxsPersonnelManagement/jxsPersonnelManagement_list.vue'));
        }, 'emBasicSetting');
      }
    },
    {
      //科目管理
      path:'emStudySubjects',
      name:'emStudySubjects',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/EnrollEnroll/emStudySubjects/emStudySubjects_list.vue'));
        }, 'emBasicSetting');
      }
    },
    {
      //结业证书
      path:'certificatesSet',
      name:'certificatesSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emBasicSetting/certificatesSet/certificatesSet_list.vue'));
        }, 'emBasicSetting');
      }
    },
    {
      //学术会议
      path:'meetSet',
      name:'meetSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emBasicSetting/meetSet/meetSet_list.vue'));
        }, 'emBasicSetting');
      }
    },
    {
      //收费参数设置
      path:'chargeParameterSet',
      name:'chargeParameterSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/emBasicSetting/chargeParameterSet/chargeParameterSet_list.vue'));
        }, 'emBasicSetting');
      }
    },
  ]
}

export default emBasicSettingRouters;
