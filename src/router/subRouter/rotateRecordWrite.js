/**
 * 轮转记录填写
 * 作者:guanxin
 * 日期:2017-7-3
 */
const rotateRouters = {
  path: 'rotateRecordWrite',
  name: 'rotateRecordWrite',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'rotateRecordWrite');
  },
  redirect: to => {
    return '/manage/rotateRecordWrite/entityWrite'
  },
  children:[{
    //病种填写
    path:'entityWrite',
    name:'entityWrite',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/rotateManagement/rotateRecordWrite/entityWrite/entityWrite_list.vue'));
      }, 'rotateRecordWrite');
    }
   },{
      //手术操作  2017-08-31
      path:'operationTechnique',
      name:'operationTechnique',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/operationTechnique/operationTechnique_list.vue'));
        }, 'rotateRecordWrite');
      }
    },{
    //延期出科申请  2017-09-02
    path:'extensionRequest',
    name:'extensionRequest',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/rotateManagement/rotateRecordWrite/extensionRequest/extensionRequest_list.vue'));
      }, 'rotateRecordWrite');
    }
    },
    {
      //技能操作填写
      path:'skillWrite',
      name:'skillWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/skillWrite/skillWrite_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //大病历书写
      path:'largeCaseWrite',
      name:'largeCaseWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/largeCaseWrite/largeCaseWrite_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //临床操作记录
      path:'clinicalOperationWrite',
      name:'clinicalOperationWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/clinicalOperationWrite/clinicalOperationWrite_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //抢救记录
      path:'saveRecordWrite',
      name:'saveRecordWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/saveRecordWrite/saveRecordWrite_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //管床纪录
      path:'tubeBedRecordWrite',
      name:'tubeBedRecordWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/tubeBedRecordWrite/tubeBedRecordWrite_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //专题综述
      path:'monographReviewWrite',
      name:'monographReviewWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/monographReviewWrite/monographReviewWrite_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //调查报告
      path:'surveyReportWrite',
      name:'surveyReportWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/surveyReportWrite/surveyReportWrite_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    /* ----*/
    {
      //科研日志填写
      path:'scientificResearchLog',
      name:'scientificResearchLog',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/scientificResearchLog/scientificResearchLog_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //出科申请
      path:'givenTheApplication',
      name:'givenTheApplication',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/givenTheApplication/givenTheApplication_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //出大科申请
      path:'givenTheApplicationOfLarge',
      name:'givenTheApplicationOfLarge',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/givenTheApplicationOfLarge/givenTheApplicationOfLarge_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //结业申请
      path:'applicationOfCompletion',
      name:'applicationOfCompletion',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/applicationOfCompletion/applicationOfCompletion_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //经典病例 （2017-11-10 新增）
      path:'userClassicCase',
      name:'userClassicCase',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/userClassicCase/userClassicCase_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
    {
      //出科技能补考填写 （2018-02-06 新增）
      path: 'givenSkillMakeUpWrite',
      name: 'givenSkillMakeUpWrite',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/rotateRecordWrite/givenSkillMakeUpWrite/givenSkillMakeUpWrite_list.vue'));
        }, 'rotateRecordWrite');
      }
    },
  ]
}

export default rotateRouters;
