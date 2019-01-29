/*
 * 模块名称:咨询管理
 * 作者:zyc
 * 日期:2017-4-6
 * */

const zxglRouters = {
  path: 'consultive',
  name: 'consultive',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'consultive');
  },
  redirect: to => {
    return '/manage/consultive/columnManagement'
  },
  children:[{
    //栏目管理
    path:'columnManagement',
    name:'columnManagement',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/consultiveManagement/columnManagement/columnManagement_list.vue'));
      }, 'consultive');
    }
  },{
    //内容管理
    path:'contentManagement',
    name:'contentManagement',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/consultiveManagement/contentManagement/contentManagement_list.vue'));
      }, 'consultive');
    }
  },{
    //发布管理
    path:'siteNotice',
    name:'siteNotice',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/consultiveManagement/releaseManagement/releaseManagement_list.vue'));
      }, 'consultive');
    }
  },{
    //页面静态化
    path:'pagesStaticize',
    name:'pagesStaticize',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/teach/consultiveManagement/pagesStaticize/pagesStaticize_list.vue'));
      }, 'consultive');
    }
  }
  ]
}

export default zxglRouters;

