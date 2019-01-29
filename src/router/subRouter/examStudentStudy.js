/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:理论考核-学员考试练习
 * 作者:zyc
 * 日期:2017/9/11
 *
 * @date     2017/9/11
 * @author   zyc
 */


const examStudentStudyRouters = {
  path: 'examStudentStudy',
  name: 'examStudentStudy',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'examStudentStudy');
  },
  redirect: to => {
    return '/manage/academicConference/examOnlineExam'
  },
  children:[
    {
      //网上考试
      path:'examOnlineExam',
      name:'examOnlineExam',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/theoryAssess/examStudentStudy/examOnlineExam/examOnlineExam_list.vue'));
        }, 'examStudentStudy');
      }
    },
    {
      //题库学习
      path:'examTkStudy',
      name:'examTkStudy',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/theoryAssess/examStudentStudy/examTkStudy/examTkStudy_list.vue'));
        }, 'examStudentStudy');
      }
    },
    {
      //达标作业
      path:'examObjectJob',
      name:'examObjectJob',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/theoryAssess/examStudentStudy/examObjectJob/examObjectJob_list.vue'));
        }, 'examStudentStudy');
      }
    },
  ]
}

export default examStudentStudyRouters;
