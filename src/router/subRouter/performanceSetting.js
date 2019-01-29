/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:进修管理-学术会议
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const academicConferenceRouters = {
  path: 'performanceSetting',
  name: 'performanceSetting',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'performanceSetting');
  },
  redirect: to => {
    return '/manage/performanceSetting/studentPerSetting'
  },
  children:[
    {
      //学生绩效设置
      path:'studentPerSetting',
      name:'studentPerSetting',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/performanceManagement/performanceSetting/studentPerSetting/studentPerSetting_list.vue'));
        }, 'performanceSetting');
      }
    },
    {
      //老师绩效设置
      path:'teacherPerSetting',
      name:'teacherPerSetting',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/performanceManagement/performanceSetting/teacherPerSetting/teacherPerSetting_list.vue'));
        }, 'performanceSetting');
      }
    },
    {
      //教研室绩效设置
      path:'staffRoomPerSetting',
      name:'staffRoomPerSetting',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/performanceManagement/performanceSetting/staffRoomPerSetting/staffRoomPerSetting_list.vue'));
        }, 'performanceSetting');
      }
    },

  ]
}

export default academicConferenceRouters;
