/**
 * 系统管理
 * 作者:gx
 * 日期:2017-4-11
 */
const sysManageRouters = {
  path: 'sysManage',
  name: 'sysManage',
  meta: {
    requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
  },
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'sysManage');
  },
  redirect: to => {
    return '/manage/sysManage/authority'
  },
  children:[{
    //权限管理
    path:'authority',
    name:'authority',
    component:resolve=> {
      require.ensure([], () => {
        resolve(require('../../components/base/sysManage/authorityManagement/authorityManagement_list.vue'));
      }, 'sysManage');
    }
  },
    {
      //系统日志
      path:'systemLog',
      name:'systemLog',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/sysManage/systemLog/systemLog_list.vue'));
        }, 'sysManage');
      }
    },
    {
      //业务字典
      path:'bizDict',
      name:'bizDict',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/sysManage/bizDict/bizDict_list.vue'));
        }, 'sysManage');
      }
    },
    {
      //菜单管理
      path:'menuManagement',
      name:'menuManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/sysManage/menuManagement/menuManagement_list.vue'));
        }, 'sysManage');
      }
    },
    {
      //科室管理
      path:'departmentsManagement',
      name:'departmentsManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/sysManage/departmentsManagement/departmentsManagement_list.vue'));
        }, 'sysManage');
      }
    },
    {
      //部门人员管理
      path:'departmentStaff',
      name:'departmentStaff',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/sysManage/departmentStaff/departmentStaff_list.vue'));
        }, 'sysManage');
      }
    },
    {
      //分组管理
      path:'group',
      name:'group',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/sysManage/group/group_list.vue'));
        }, 'sysManage');
      }
    },
    {
      //来源单位管理
      path:'sourceUnit',
      name:'sourceUnit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/sysManage/sourceUnit/sourceUnit_list.vue'));
        }, 'sysManage');
      }
    },
    {
      //专业基地
      path:'woodsManagement',
      name:'woodsManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/sysManage/woodsManagement/woodsManagement_list.vue'));
        }, 'sysManage');
      }
    },
    {
      //短信回执查询
      path:'noteQuery',
      name:'noteQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/base/sysManage/noteQuery/noteQuery_list.vue'));
        }, 'sysManage');
      }
    }
  ]
}

export default sysManageRouters;
