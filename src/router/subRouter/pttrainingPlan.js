/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:研究生管理-培养计划
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const pttrainingPlanRouters = {
  path: 'pttrainingPlan',
  name: 'pttrainingPlan',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'pttrainingPlan');
  },
  redirect: to => {
    return '/manage/pttrainingPlan/cultivatePlanWrite'
  },
  children:[
    {
      //培养计划填写
      path:'cultivatePlanWrite',
      name:'cultivatePlanWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/pttrainingPlan/cultivatePlanWrite/cultivatePlanWrite_list.vue'));
        }, 'pttrainingPlan');
      }
    },
    {
      //培养计划审核
      path:'cultivatePlanAudit',
      name:'cultivatePlanAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/pttrainingPlan/cultivatePlanAudit/cultivatePlanAudit_list.vue'));
        }, 'pttrainingPlan');
      }
    },
    {
      //培养计划查询
      path:'cultivatePlanQuery',
      name:'cultivatePlanQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/pttrainingPlan/cultivatePlanQuery/cultivatePlanQuery_list.vue'));
        }, 'pttrainingPlan');
      }
    },
    {
      //分配导师
      path:'ptDistributionTutor',
      name:'ptDistributionTutor',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/pttrainingPlan/ptDistributionTutor/ptDistributionTutor.list.vue'));
        }, 'pttrainingPlan');
      }
    },

  ]
}

export default pttrainingPlanRouters;
