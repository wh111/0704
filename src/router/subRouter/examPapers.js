/**
 * Created by Administrator on 2017/9/5.
 */
/**
 * 模块名称:理论考核理论考核-题库管理
 * 作者:gx
 * 日期:2017/9/5
 *
 * @date     2017/9/5
 * @author   gx
 */


const examPapersRouters = {
  path: 'examPapers',
  name: 'examPapers',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'examPapers');
  },
  redirect: to => {
    return '/manage/examPapers/papersManagement'
  },
  children:[
    {
      //试卷管理
      path:'papersManagement',
      name:'papersManagement',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/theoryAssess/examPapers/papersManagement/papersManagement_list.vue'));
        }, 'examPapers');
      }
    },
    {
      //手工评卷
      path:'examManualMaking',
      name:'examManualMaking',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/theoryAssess/examPapers/examManualMaking/examManualMaking_list.vue'));
        }, 'examPapers');
      }
    },
  ]
}

export default examPapersRouters;
