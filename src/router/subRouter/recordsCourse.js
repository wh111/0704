/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:进修管理-过程记录
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const recordsCourseRouters = {
  path: 'recordsCourse',
  name: 'recordsCourse',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'academicConference');
  },
  redirect: to => {
    return '/manage/recordsCourse/educationPlanWrite'
  },
  children:[
    {
      //进修计划填写
      path:'educationPlanWrite',
      name:'educationPlanWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/educationPlanWrite/educationPlanWrite_list.vue'));
        }, 'recordsCourse');
      }
    },
    {
      //进修计划查询
      path:'educationPlanQuery',
      name:'educationPlanQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/educationPlanQuery/educationPlanQuery_list.vue'));
        }, 'recordsCourse');
      }
    },
    {
      //进修考核填写
      path:'educationEvaluationQuery',
      name:'educationEvaluationQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/educationEvaluationQuery/educationEvaluationQuery_list.vue'));
        }, 'recordsCourse');
      }
    },
    {
      //进修考核审核
      path:'educationEvaluationAudit',
      name:'educationEvaluationAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/educationEvaluationAudit/educationEvaluationAudit_list.vue'));
        }, 'recordsCourse');
      }
    },
    {
      //进修考核汇总
      path:'educationEvaluationSummarizing',
      name:'educationEvaluationSummarizing',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/educationEvaluationSummarizing/educationEvaluationSummarizing_list.vue'));
        }, 'recordsCourse');
      }
    },
    {
      //结束进修
      path:'endEducation',
      name:'endEducation',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/endEducation/endEducation_list.vue'));
        }, 'recordsCourse');
      }
    },
    {
      //调查报告
      path:'surveyReport',
      name:'surveyReport',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/surveyReport/surveyReport_list.vue'));
        }, 'recordsCourse');
      }
    },
    {
      //调查报告
      path:'CertificatePrinting',
      name:'CertificatePrinting',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/recordsCourse/CertificatePrinting/certificatePrinting_list.vue'));
        }, 'recordsCourse');
      }
    },
  ]
}

export default recordsCourseRouters;
