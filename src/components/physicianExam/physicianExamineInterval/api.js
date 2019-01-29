const file = 'physicianExam';
const api = {
  set: {
    path: file + '/five/set/ExamStation',
    method: 'post'
  },
  get: {
    path: file + '/five/get/ExamStation',
    method: 'get'
  },
  remove: {
    path: file + '/five/remove/ExamStation',
    method: 'delete'
  },
  timeLong: { //获取所有的时间
    path: file + '/five/get/timeLong',
    method: 'get'
  },
  saveTimeLong: { // 安排
    path: file + '/five/save/room/timeLong',
    method: 'post'
  }
}
export default api;
