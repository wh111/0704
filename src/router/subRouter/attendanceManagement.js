/**
 * 模块名称:日常管理-考勤管理
 * 作者:zyc
 * 日期:2017-4-6
 *
 * @date     2017-06-26
 * @author   zyc<332533011@qq.com>
 */
const attendanceRouters = {
    path: 'attendanceManagement',
    name: 'attendanceManagement',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/components/common/rightMain'));
        }, 'attendanceManagement');
    },
    redirect: to => {
        return '/manage/attendanceManagement/dailyAttendance'
    },
    children: [
        {
            //签到记录
            path: 'dailyAttendanceRecord',
            name: 'dailyAttendanceRecord',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../components/daily/dailyManagement/dailyAttendanceRecord/dailyAttendanceRecord_list.vue'));
                    // resolve(require('../../components/daily/dailyManagement/dailyAttendance/dailyAttendanceStatistics_list.vue'));
                }, 'attendanceManagement');
            }
            
        },
        {
            //日常考勤
            path: 'dailyAttendance',
            name: 'dailyAttendance',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../components/daily/dailyManagement/dailyAttendance/dailyAttendance_list.vue'));
                    // resolve(require('../../components/daily/dailyManagement/dailyAttendance/dailyAttendanceStatistics_list.vue'));
                }, 'attendanceManagement');
            }
        }, {
            //我的考勤
            path: 'myAttendance',
            name: 'myAttendance',
            component: resolve => {
                require.ensure([], () => {
                    // resolve(require('../../components/daily/dailyManagement/dailyAttendance/dailyAttendance_list.vue'));
                    resolve(require('../../components/daily/dailyManagement/dailyAttendance/myAttendance_list.vue'));
                }, 'attendanceManagement');
            }
        },
        {
            //请假管理
            path: 'leaveManagement',
            name: 'leaveManagement',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../components/daily/dailyManagement/leaveManagement/leaveManagement_list.vue'));
                }, 'attendanceManagement');
            }
        },
        {
            //日常考勤统计
            path: 'myLeave',
            name: 'myLeave',
            component: resolve => {
                require.ensure([], () => {
                    resolve(require('../../components/daily/dailyManagement/myLeave/myLeave_list.vue'));
                }, 'attendanceManagement');
            }
        }
    ]
}

export default attendanceRouters;
