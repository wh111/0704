/**
 * 轮转查询
 * 作者:gx
 * 日期:2017-7-3
 * update : 2017-11-09
 */
const rotateRouters = {
  path: 'appraisalManagement',
  name: 'appraisalManagement',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'appraisalManagement');
  },
  redirect: to => {
    return '/manage/appraisalManagement/entityAudit'
  },
  children:[{
    //日常考核 (舍弃)
    path:'dailyAppraisal',
    name:'dailyAppraisal',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/rotateManagement/appraisalManagement/dailyAppraisal/dailyAppraisal_list.vue'));
      }, 'appraisalManagement');
    }
   },
    {
      //出科考核
      path:'givenAppraisal',
      name:'givenAppraisal',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/appraisalManagement/givenAppraisal/givenAppraisal_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //技能出科试卷设置
      path:'skillOutdepExam',
      name:'skillOutdepExam',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/appraisalManagement/skillOutdepExam/skillOutdepExam_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //年度考核 (舍弃)
      path:'yearAppraisal',
      name:'yearAppraisal',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/appraisalManagement/yearAppraisal/yearAppraisal_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //年度评优 (舍弃)
      path:'yearAssessment',
      name:'yearAssessment',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/appraisalManagement/yearAssessment/yearAssessment_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //结业考核
      path:'completionOfTheInspection',
      name:'completionOfTheInspection',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/appraisalManagement/completionOfTheInspection/completionOfTheInspection_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //执业医师考试
      path:'occupationalExamination',
      name:'occupationalExamination',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/appraisalManagement/occupationalExamination/occupationalExamination_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //公共课考试
      path:'commonTest',
      name:'commonTest',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/rotateManagement/appraisalManagement/commonTest/commonTest_list.vue'));
        }, 'appraisalManagement');
      }
    },

    //从研究生中期考核移动过来的
    {
      //中期考核填写
      path:'ptMidtermExamination',
      name:'ptMidtermExamination',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/mediumTermExamination/ptMidtermExamination/ptMidtermExamination_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //中期考核查询
      path:'ptMidtermExaminationQuery',
      name:'ptMidtermExaminationQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/mediumTermExamination/ptMidtermExaminationQuery/ptMidtermExaminationQuery_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //中期考核查询
      path:'midtermExaminationNotice',
      name:'midtermExaminationNotice',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/mediumTermExamination/midtermExaminationNotice/midtermExaminationNotice_list.vue'));
        }, 'appraisalManagement');
      }
    },

    //以下进修为月度考核  从进修管理-过程记录移动过来的
    {
      //进修考核填写
      path:'educationEvaluationQuery',
      name:'educationEvaluationQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/educationEvaluationQuery/educationEvaluationQuery_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //进修考核审核
      path:'educationEvaluationAudit',
      name:'educationEvaluationAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/educationEvaluationAudit/educationEvaluationAudit_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //进修考核汇总
      path:'educationEvaluationSummarizing',
      name:'educationEvaluationSummarizing',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/educationEvaluationSummarizing/educationEvaluationSummarizing_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //理论出科试卷设置
      path:'theoryOutdepExam',
      name:'theoryOutdepExam',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/theoryOutdepExam/theoryOutdepExam_list.vue'));
        }, 'appraisalManagement');
      }
    },
    {
      //理论出科试卷设置（2017-12-15 新增）
      path:'theoryOutdepExamHtml',
      name:'theoryOutdepExamHtml',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/theoryOutdepExamHtml/theoryOutdepExamHtml_list.vue'));
        }, 'appraisalManagement');
      }

    },
  ]
}

export default rotateRouters;
