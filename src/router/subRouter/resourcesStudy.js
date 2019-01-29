/**
 * 资源学习
 * 作者:zyc
 * 日期:2017-8-7
 */
const resourcesStudyRouters = {
  path: 'resourcesStudy',
  name: 'resourcesStudy',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'resourcesStudy');
  },
  redirect: to => {
    return '/manage/resourcesStudy/videoStudy'
  },
  children:[{
    //视频学习
    path:'videoStudy',
    name:'videoStudy',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/study/resourcesStudy/videoStudy/videoStudy_list.vue'));
      }, 'resourcesStudy');
    }
  },
    {
      //文档文献
      path:'literature',
      name:'literature',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/study/resourcesStudy/literature/literature_list.vue'));
        }, 'resourcesStudy');
      }
    },
    {
      //医学图谱
      path:'medicalAtlas',
      name:'medicalAtlas',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/study/resourcesStudy/medicalAtlas/medicalAtlas_list.vue'));
        }, 'resourcesStudy');
      }
    },
    {
      //病例学习
      path:'caseStudy',
      name:'caseStudy',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/study/resourcesStudy/caseStudy/caseStudy_list.vue'));
        }, 'resourcesStudy');
      }
    },
    {
      //题库学习
      path:'tkStudy',
      name:'tkStudy',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/study/resourcesStudy/tkStudy/tkStudy_list.vue'));
        }, 'resourcesStudy');
      }
    },
    {
      //资源上传
      path:'resourcesUpload',
      name:'resourcesUpload',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/study/resourcesStudy/resourcesUpload/resourcesUpload_list.vue'));
        }, 'resourcesStudy');
      }
    },
    {
      //学习记录
      path:'studyRecords',
      name:'studyRecords',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/study/resourcesStudy/studyRecords/studyRecords_list.vue'));
        }, 'resourcesStudy');
      }
    },
    {
      //学习记录追踪
      path: 'studyRecordsTrack',
      name: 'studyRecordsTrack',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/study/resourcesStudy/studyRecordsTrack/studyRecordsTrack_list.vue'));
        }, 'resourcesStudy');
      }
    },
  ]
}

export default resourcesStudyRouters;
