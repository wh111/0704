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
  path: 'performanceAnalysis',
  name: 'performanceAnalysis',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'performanceSetting');
  },
  redirect: to => {
    return '/manage/performanceAnalysis/studentPerQuery'
  },
  children:[
    {
      //学生绩效查询
      path:'studentPerQuery',
      name:'studentPerQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/performanceManagement/performanceAnalysis/studentPerQuery/studentPerQuery_list.vue'));
        }, 'performanceAnalysis');
      }
    },
    {
      //老师绩效查询
      path:'teacherPerQuery',
      name:'teacherPerQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/performanceManagement/performanceAnalysis/teacherPerQuery/teacherPerQuery_list.vue'));
        }, 'performanceAnalysis');
      }
    },
    {
      //教研室绩效查询
      path:'staffRoomPerQuery',
      name:'staffRoomPerQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/performanceManagement/performanceAnalysis/staffRoomPerQuery/staffRoomPerQuery_list.vue'));
        }, 'performanceAnalysis');
      }
    },

  ]
}

export default academicConferenceRouters;
