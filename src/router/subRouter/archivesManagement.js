/*
 * 模块名称:档案管理
 * 作者:zyc
 * 日期:2017-4-6
 * */

const archivesRouter = {
  path: 'dagl',
  name: 'dagl',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'dagl');
  },
  redirect: to => {
    return '/manage/dagl/archivesManagement'
  },
  children:[{
    //档案管理
    path:'archivesManagement',
    name:'archivesManagement',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/archivesManagement/archivesManagement/archivesManagement_list.vue'));
      }, 'dagl');
    }
  },{
    //档案审核
    path:'fileReview',
    name:'fileReview',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/archivesManagement/fileReview/fileReview_list.vue'));
      }, 'dagl');
    }
  },{
    //档案查询
    path:'fileQuery',
    name:'fileQuery',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/archivesManagement/fileQuery/fileQuery_list.vue'));
      }, 'dagl');
    }
  },{
    //权限设置
    path:'permissionSetting',
    name:'permissionSetting',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/archivesManagement/permissionSetting/permissionSetting_list.vue'));
      }, 'dagl');
    }
  }
  ]
}

export default archivesRouter;
