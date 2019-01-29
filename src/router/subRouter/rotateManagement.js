/**
 * 轮转管理
 * 作者:zyc
 * 日期:2017-5-18
 */
const rotateRouters = {
  path: 'rotateManagement',
  name: 'rotateManagement',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'rotateManagement');
  },
  redirect: to => {
    return '/manage/rotateManagement/groupSetIsRotate'
  },
  children:[{
    //选课
    path:'groupSetIsRotate',
    name:'groupSetIsRotate',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/intern/rotateManagement/groupSetIsRotate/groupSetIsRotate_list.vue'));
      }, 'rotateManagement');
    }
  },
    {
      //自动排班
      path:'autoArrangeIsRotate',
      name:'autoArrangeIsRotate',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/rotateManagement/autoArrangeIsRotate/autoArrangeIsRotate_list.vue'));
        }, 'rotateManagement');
      }
    },
    {
      //手工调整
      path:'handworkAdjustIsRotate',
      name:'handworkAdjustIsRotate',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/rotateManagement/handworkAdjustIsRotate/handworkAdjustIsRotate_list.vue'));
        }, 'rotateManagement');
      }
    },
    {
      //出科审核(大科)
      path:'givenAuditBigIsRotate',
      name:'givenAuditBigIsRotate',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/rotateManagement/givenAuditBigIsRotate/givenAuditBigIsRotate_list.vue'));
        }, 'rotateManagement');
      }
    },
    {
      //结业鉴定
      path:'graduationAppraisalIsRotate',
      name:'graduationAppraisalIsRotate',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/rotateManagement/graduationAppraisalIsRotate/graduationAppraisalIsRotate_list.vue'));
        }, 'rotateManagement');
      }
    },
    {
      //轮转手册
      path:'rotateHandbookIsRotate',
      name:'rotateHandbookIsRotate',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/rotateManagement/rotateHandbookIsRotate/rotateHandbookIsRotate_list.vue'));
        }, 'rotateManagement');
      }
    },
    {
      //补轮转
      path:'repairRotateIsRotate',
      name:'repairRotateIsRotate',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/rotateManagement/repairRotateIsRotate/repairRotateIsRotate_list.vue'));
        }, 'rotateManagement');
      }
    },
    {
      //科室报到
      path:'deptReportIsRotate',
      name:'deptReportIsRotate',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/rotateManagement/deptReportIsRotate/deptReportIsRotate_list.vue'));
        }, 'rotateManagement');
      }
    },
  ]
}

export default rotateRouters;
