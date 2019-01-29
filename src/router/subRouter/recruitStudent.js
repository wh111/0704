/**
 * 实习生招生
 * 作者:zyc
 * 日期:2017-5-18
 */
const recruitRouters = {
  path: 'recruitStudent',
  name: 'recruitStudent',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'recruitStudent');
  },
  redirect: to => {
    return '/manage/recruitStudent/internAudit'
  },
  children:[
  //   {
  //   //人员管理
  //   path:'usersManagement',
  //   name:'usersManagement',
  //   component:resolve=> {
  //     require.ensure([], () => {
  //       resolve(require('../../components/intern/recruitStudent/usersManagement/usersManagement_list.vue'));
  //     }, 'recruitStudent');
  //   }
  // },
    {
      //实习生审核
      path:'internAudit',
      name:'internAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/recruitStudent/internAudit/internAudit_list.vue'));
        }, 'recruitStudent');
      }
    },
    {
      //打印交费单
      path:'printBillPayment',
      name:'printBillPayment',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/recruitStudent/printBillPayment/printBillPayment_list.vue'));
        }, 'recruitStudent');
      }
    },
    {
      //交费登记
      path:'paymentRegistration',
      name:'paymentRegistration',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/recruitStudent/paymentRegistration/paymentRegistration_list.vue'));
        }, 'recruitStudent');
      }
    },
  ]
}

export default recruitRouters;
