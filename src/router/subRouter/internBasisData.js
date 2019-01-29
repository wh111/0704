/**
 * 实习生基础数据
 * 作者:zyc
 * 日期:2017-5-18
 */
const internBasisRouters = {
  path: 'internBasis',
  name: 'internBasis',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'internBasis');
  },
  redirect: to => {
    return '/manage/internBasis/usersManagement'
  },
  children:[
    {
      //人员管理
      path:'usersManagement',
      name:'usersManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/recruitStudent/usersManagement/usersManagement_list.vue'));
        }, 'internBasis');
      }
    },
    {
    //实习大纲
    path:'internOutline',
    name:'internOutline',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/intern/internBasisData/internOutline/internOutline_list.vue'));
      }, 'internBasis');
    }
  },
    {
      //科室要求设置
      path:'deptRequireSet',
      name:'deptRequireSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internBasisData/deptRequireSet/deptRequireSet_list.vue'));
        }, 'internBasis');
      }
    },
    {
      //实习收费标准
      path:'chargingStandard',
      name:'chargingStandard',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internBasisData/chargingStandard/chargingStandard_list.vue'));
        }, 'internBasis');
      }
    },
    {
      //大病历填写设置
      path:'largeMedicalRecordsSet',
      name:'largeMedicalRecordsSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internBasisData/largeMedicalRecordsSet/largeMedicalRecordsSet_list.vue'));
        }, 'internBasis');
      }
    },
    {
      //出科设置
      path:'givenSet',
      name:'givenSet',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/intern/internBasisData/givenSet/givenSet_list.vue'));
        }, 'internBasis');
      }
    },

  ]
}

export default internBasisRouters;
