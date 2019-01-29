/*
 * 模块名称:课程学习
 * 作者:zyc
 * 日期:2017-4-6
 * */

const courses = {
  path: 'courses',
  name: 'courses',
  meta: {
    requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
  },
  component: resolve => {
    require.ensure([], () => {
      resolve(require('@/components/common/rightMain'));
    }, 'courses');
  },
  redirect: to => {
    return '/manage/courses/coursesStudy'
  },
  children: [{
      //课程学习
      path: 'coursesStudy',
      name: 'coursesStudy',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/study/courses/coursesStudy/coursesStudy_list.vue'));
        }, 'courses');
      }
    },
    {
      //课程学习
      path: 'webCourses',
      name: 'webCourses',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/study/courses/webCourses/webCourses_list.vue'));
        }, 'courses');
      }
    },
    {
      //课程授课审核
      path: 'webCoursesAudit',
      name: 'webCoursesAudit',
      component: resolve => {
        require.ensure([], () => {
          resolve(require('../../components/study/courses/coursesExamine/coursesExamine_list.vue'));
        }, 'courses');
      }
    },

  ]
}

export default courses;
