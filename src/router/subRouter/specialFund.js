/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:经费管理-专项经费
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const specialFundRouters = {
  path: 'specialFund',
  name: 'specialFund',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'graduate');
  },
  redirect: to => {
    return '/manage/specialFund/capitalLibraryManagement'
  },
  children:[
    {
      //资金库管理
      path:'capitalLibraryManagement',
      name:'capitalLibraryManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/fundsManagement/specialFund/capitalLibraryManagement/capitalLibraryManagement_list.vue'));
        }, 'specialFund');
      }
    },
    {
      //出入账管理
      path:'revealingManagement',
      name:'revealingManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/fundsManagement/specialFund/revealingManagement/revealingManagement_list.vue'));
        }, 'specialFund');
      }
    },
    {
      //资金明细
      path:'financialDetails',
      name:'financialDetails',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/fundsManagement/specialFund/financialDetails/financialDetails_list.vue'));
        }, 'specialFund');
      }
    },
    {
      //统计分析
      path:'capitalStatistic',
      name:'capitalStatistic',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/fundsManagement/specialFund/capitalStatistic/capitalStatistic_list.vue'));
        }, 'specialFund');
      }
    },

    {

      //经费盘点
      path: 'fundInventory',
      name: 'fundInventory',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/fundsManagement/specialFund/fundingInventory/fundingInventory_list.vue'));
        }, 'specialFund');
      }
    }
  ]
}

export default specialFundRouters;
