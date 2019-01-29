/**
 * 住院医-报名招录
 * 作者:zyc
 * 日期:2017-7-21
 */
const zyyRouters = {
  path: 'rdyEnrollEnroll',
  name: 'rdyEnrollEnroll',
  meta: {
    requireAuth: false,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'rdyEnrollEnroll');
  },
  redirect: to => {
    // return '/manage/rdyEnrollEnroll/rdyPersonnelManagement'
    return '/manage/rdyEnrollEnroll/rdyOnlinePrequalification'
  },
  children:[
  //   {
  //   //人员管理
  //   path:'rdyPersonnelManagement',
  //   name:'rdyPersonnelManagement',
  //   component:resolve=> {
  //     require.ensure([], () => {
  //       resolve(require('../../components/zyy/rdyEnrollEnroll/rdyPersonnelManagement/rdyPersonnelManagement_list.vue'));
  //     }, 'rdyEnrollEnroll');
  //   }
  // },
    {
    //网上预审
    path:'rdyOnlinePrequalification',
    name:'rdyOnlinePrequalification',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/zyy/rdyEnrollEnroll/rdyOnlinePrequalification/rdyOnlinePrequalification_list.vue'));
      }, 'rdyEnrollEnroll');
    }
  },{
    //现场审核
    path:'rdyOnAuditDay',
    name:'rdyOnAuditDay',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/zyy/rdyEnrollEnroll/rdyOnAuditDay/rdyOnAuditDay_list.vue'));
      }, 'rdyEnrollEnroll');
    }
  },{
    //招生考试
    path:'rdyEntranceExam',
    name:'rdyEntranceExam',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/zyy/rdyEnrollEnroll/rdyEntranceExam/rdyEntranceExam_list.vue'));
      }, 'rdyEnrollEnroll');
    }
  },{
    //招生录取
    path:'rdyStudentEnrolling',
    name:'rdyStudentEnrolling',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/zyy/rdyEnrollEnroll/rdyStudentEnrolling/rdyStudentEnrolling_list.vue'));
      }, 'rdyEnrollEnroll');
    }
  },{
    //招录设置
    path:'rdyEnrollSet',
    name:'rdyEnrollSet',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/zyy/rdyEnrollEnroll/rdyEnrollSet/rdyEnrollSet_list.vue'));
      }, 'rdyEnrollEnroll');
    }
    }, {
      //补调剂
      path: 'rdyUnapproved',
      name: 'rdyUnapproved',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/zyy/rdyEnrollEnroll/rdyUnapproved/rdyUnapproved_list.vue'));
        }, 'rdyEnrollEnroll');
      }
    },
    {
      //减免申请
      path: 'rdyReductionApply',
      name: 'rdyReductionApply',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/zyy/rdyEnrollEnroll/rdyReductionApply/rdyReductionApply_list.vue'));
        }, 'rdyEnrollEnroll');
      }
    },
    {
      //减免申请
      path: 'rdyReductionApplyReview',
      name: 'rdyReductionApplyReview',
      component: resolve => {
        require.ensure([], () => {
          resolve(require(
            '../../components/zyy/rdyEnrollEnroll/rdyReductionManage/rdyReductionManage_list.vue'));
        }, 'rdyEnrollEnroll');
      }
    },
    

  ]
}

export default zyyRouters;
