/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:研究生管理-中期考核
 * 作者:gx
 * 日期:2017/9/3
 *
 * @date     2017/9/3
 * @author   gx
 */


const ptmediumTermExaminationRouters = {
  path: 'mediumTermExamination',
  name: 'mediumTermExamination',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'mediumTermExamination');
  },
  redirect: to => {
    return '/manage/mediumTermExamination/ptMidtermExamination'
  },
  children:[
    {
      //中期考核填写
      path:'ptMidtermExamination',
      name:'ptMidtermExamination',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/mediumTermExamination/ptMidtermExamination/ptMidtermExamination_list.vue'));
        }, 'mediumTermExamination');
      }
    },
    {
      //中期考核查询
      path:'ptMidtermExaminationQuery',
      name:'ptMidtermExaminationQuery',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/postgraduate/mediumTermExamination/ptMidtermExaminationQuery/ptMidtermExaminationQuery_list.vue'));
        }, 'mediumTermExamination');
      }
    },
  ]
}

export default ptmediumTermExaminationRouters;
