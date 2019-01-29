/**
 * Created by Administrator on 2017/9/3.
 */
/**
 * 模块名称:理论考核-考试统计
 * 作者:zyc
 * 日期:2017/9/11
 *
 * @date     2017/9/11
 * @author   zyc
 */


const examQueryStatisticRouters = {
  path: 'examQueryStatistic',
  name: 'examQueryStatistic',
  component:resolve=> {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'examQueryStatistic');
  },
  redirect: to => {
    return '/manage/academicConference/examStatistic'
  },
  children:[
    {
      //考试统计
      path:'examStatistic',
      name:'examStatistic',
      component:resolve=> {
        require.ensure([], () => {
          resolve(require('../../components/theoryAssess/examQueryStatistic/examStatistic/examStatistic_list.vue'));
        }, 'examQueryStatistic');
      }
    },
  ]
}

export default examQueryStatisticRouters;
