/**
 * 实习生轮转
 * 作者:zyc
 * 日期:2017-5-18
 */
const internRouters = {
  path: 'internRotate',
  name: 'internRotate',
  meta: {
    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'internRotate');
  },
  redirect: to => {
    return '/manage/internRotate/groupSet'
  },
  children: [{
      //分组设置
      path: 'groupSet',
      name: 'groupSet',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/internRotate/groupSet/groupSet_list.vue'));
        }, 'internRotate');
      }
    },
    {
      //自动排班
      path: 'autoArrange',
      name: 'autoArrange',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/internRotate/autoArrange/autoArrange_list.vue'));
        }, 'internRotate');
      }
    },
    {
      //手工调整
      path: 'handworkAdjust',
      name: 'handworkAdjust',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/internRotate/handworkAdjust/handworkAdjust_list.vue'));
        }, 'internRotate');
      }
    },
    {
      //出科审核(大科)
      path: 'givenAuditBig',
      name: 'givenAuditBig',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/internRotate/givenAuditBig/givenAuditBig_list.vue'));
        }, 'internRotate');
      }
    },
    // {
    //   //结业鉴定
    //   path:'graduationAppraisal',
    //   name:'graduationAppraisal',
    //   component:resolve=> {
    //     require.ensure([], () => {
    //       resolve(require('../../components/intern/internRotate/graduationAppraisal/graduationAppraisal_list.vue'));
    //     }, 'internRotate');
    //   }
    // },
    {
      //轮转手册
      path: 'rotateHandbook',
      name: 'rotateHandbook',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/internRotate/rotateHandbook/rotateHandbook_list.vue'));
        }, 'internRotate');
      }
    },
    {
      //补轮转
      path: 'repairRotate',
      name: 'repairRotate',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/intern/internRotate/repairRotate/repairRotate_list.vue'));
        }, 'internRotate');
      }
    },
    {
      //自选科室
      path:'optionalDepartment',
      name:'optionalDepartment',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internRotate/optionalDepartment/optionalDepartment_list.vue'));
        }, 'internRotate');
      }
    },
  ]
}

export default internRouters;
