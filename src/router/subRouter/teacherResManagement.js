 /*
  * 模块名称:资源库管理
  * 作者:yc
  * 日期:2017-7-27
  * */

 const resourcesRouters = {
   path: 'resources',
   name: 'resources',
   meta: {
     requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
   },
   component: resolve => {
     require.ensure([], () => {
       resolve(require('@/components/common/rightMain'));
     }, 'resources');
   },
   redirect: to => {
     return '/resources/normCourse'
   },
   children: [{
       //标准课程
       path: 'normCourse',
       name: 'normCourse',
       component: resolve => {
         require.ensure([], () => {
           resolve(require('../../components/teach/teacherResManagement/normCourse/normCourse_list'));
         }, 'resources');
       }
     },
     {
       //视频库
       path: 'videoBank',
       name: 'videoBank',
       component: resolve => {
         require.ensure([], () => {
           resolve(require('../../components/teach/teacherResManagement/videoBank/videoBank_list'));
         }, 'resources');
       }
     },
     {
       //文档文献
       path: 'resLiterature',
       name: 'resLiterature',
       component: resolve => {
         require.ensure([], () => {
           resolve(require('../../components/teach/teacherResManagement/resLiterature/resLiterature_list'));
         }, 'resources');
       }
     },
     {
       //医学图谱
       path: 'resMedicalAtlas',
       name: 'resMedicalAtlas',
       component: resolve => {
         require.ensure([], () => {
           resolve(require('../../components/teach/teacherResManagement/resMedicalAtlas/resMedicalAtlas_list'));
         }, 'resources');
       }
     },
     {
       //病例库
       path: 'resCaseLibrary',
       name: 'resCaseLibrary',
       component: resolve => {
         require.ensure([], () => {
           resolve(require('../../components/teach/teacherResManagement/resCaseLibrary/resCaseLibrary_list'));
         }, 'resources');
       }
     },
     {
       //题库
       path: 'resTk',
       name: 'resTk',
       component: resolve => {
         require.ensure([], () => {
           resolve(require('../../components/teach/teacherResManagement/resTk/resTk_list'));
         }, 'resources');
       }
     },
     {
       //资源分类管理
       path: 'resClassify',
       name: 'resClassify',
       component: resolve => {
         require.ensure([], () => {
           resolve(require('../../components/teach/teacherResManagement/resClassify/resClassify_list'));
         }, 'resources');
       }
     },
   ]
 }

 export default resourcesRouters;
