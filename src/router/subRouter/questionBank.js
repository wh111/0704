/**
 * Created by Administrator on 2017/9/5.
 */
/**
 * 模块名称:理论考核理论考核-题库管理
 * 作者:gx
 * 日期:2017/9/5
 *
 * @date     2017/9/5
 * @author   gx
 */


const questionBankRouters = {
  path: 'questionBank',
  name: 'questionBank',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'questionBank');
  },
  redirect: to => {
    return '/manage/questionBank/questionTypes'
  },
  children:[
    {
      //题库分类管理
      path:'questionTypes',
      name:'questionTypes',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/theoryAssess/questionBank/questionTypes/questionTypes_list.vue'));
        }, 'questionBank');
      }
    },
    {
      //题库管理
      path:'tkMangement',
      name:'tkMangement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/theoryAssess/questionBank/tkMangement/tkMangement_list.vue'));
        }, 'questionBank');
      }
    },
    {
      //纠错管理
      path:'tkErrorRecovery',
      name:'tkErrorRecovery',
      component:resolve=> {
        require.ensure([], () => {
          //resolve(require('../../components/theoryAssess/questionBank/tkErrorRecovery/tkErrorRecovery_list.vue'));
          resolve(require('../../components/common/iframeView.vue'));
        }, 'questionBank');
      }
    },
  ]
}

export default questionBankRouters;
