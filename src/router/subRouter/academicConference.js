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
  path: 'academicConference',
  name: 'academicConference',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'academicConference');
  },
  redirect: to => {
    return '/manage/academicConference/MeetingReportWrite'
  },
  children:[
    {
      //会议申请填写
      path:'MeetingReportWrite',
      name:'MeetingReportWrite',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/academicConference/MeetingReportWrite/meetingReportWrite_list.vue'));
        }, 'academicConference');
      }
    },
    {
      //会议申请审核
      path:'MeetingReportAudit',
      name:'MeetingReportAudit',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/academicConference/MeetingReportAudit/meetingReportAudit_list.vue'));
        }, 'academicConference');
      }
    },
    {
      //登记费用
      path:'registrationFee',
      name:'registrationFee',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/educationManagement/academicConference/registrationFee/registrationFee_list.vue'));
        }, 'academicConference');
      }
    },
  ]
}

export default academicConferenceRouters;
