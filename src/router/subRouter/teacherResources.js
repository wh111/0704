/*
 * 模块名称:师资库
 * 作者:zyc
 * 日期:2017-4-6
 * */

const teachersRouters = {
  path: 'szk',
  name: 'szk',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('../../components/common/rightMain.vue'));
    }, 'szk');
  },
  redirect: to => {
    return '/manage/szk/teachersManagement'
  },
  children:[{
    //师资管理
    path:'teachersManagement',
    name:'teachersManagement',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teacherResources/teachersManagement/teachersManagement_list.vue'));
      }, 'szk');
    }
  },
  {
    //师资审核
    path:'teachersManagementReview',
    name:'teachersManagementReview',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teacherResources/teachersManagement/teachersManagement_auditList.vue'));
      }, 'szk');
    }
  },
  {
    //师资工作量管理
    path:'teachersWorkManagement',
    name:'teachersWorkManagement',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teacherResources/teachersWorkManagement/teachersWorkManagement_list.vue'));
      }, 'jxpj');
    }
  },{
    //师资评估管理
    path:'teachersAssessManagement',
    name:'teachersAssessManagement',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teacherResources/teachersAssessManagement/teachersAssessManagement_list.vue'));
      }, 'szk');
    }
  },{
    //课时费管理
    path:'classManagement',
    name:'classManagement',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teacherResources/classManagement/classManagement_list.vue'));
      }, 'szk');
    }
  },{
    //课时费设置
    path:'classSetting',
    name:'classSetting',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teacherResources/classSetting/classSetting_list.vue'));
      }, 'szk');
    }
  },{
    //劳务费管理
    path:'laborManagement',
    name:'laborManagement',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teacherResources/laborManagement/laborManagement_list.vue'));
      }, 'szk');
    }
  },{
    //劳务费设置
    path:'laborSetting',
    name:'laborSetting',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/teacherResources/laborSetting/laborSetting_list.vue'));
      }, 'szk');
    }
  }
  ]
}

export default teachersRouters;
