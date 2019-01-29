/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:进修管理-外出进修
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const outEducationRouters = {
  path: 'outEducation',
  name: 'outEducation',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'outEducation');
  },
  redirect: to => {
    return '/manage/outEducation/outEducationAntragWrite'
  },
  children:[
    {
      //外出进修申请填写
      path:'outEducationAntragWrite',
      name:'outEducationAntragWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/outEducation/outEducationAntragWrite/outEducationAntragWrite_list.vue'));
        }, 'outEducation');
      }
    },
    {
      //外出进修申请审核
      path:'outEducationAntragAudit',
      name:'outEducationAntragAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/outEducation/outEducationAntragAudit/outEducationAntragAudit_list.vue'));
        }, 'outEducation');
      }
    },
    {
      //外出进修汇报填写
      path:'outEducationReportWrite',
      name:'outEducationReportWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/outEducation/outEducationReportWrite/outEducationReportWrite_list.vue'));
        }, 'outEducation');
      }
    },
    {
      //外出进修汇报审核
      path:'outEducationReportAudit',
      name:'outEducationReportAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/outEducation/outEducationReportAudit/outEducationReportAudit_list.vue'));
        }, 'outEducation');
      }
    },
    {
      //费用报销
      path:'expenseReimbursement',
      name:'expenseReimbursement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/outEducation/expenseReimbursement/expenseReimbursement_list.vue'));
        }, 'outEducation');
      }
    },
  ]
}

export default outEducationRouters;
