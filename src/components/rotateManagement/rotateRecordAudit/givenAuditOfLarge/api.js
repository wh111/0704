const thisFile = '/rotationProcess/outBigDepAppraise';
const api = {
  managePagelist: { // 非轮转生查看出科鉴定列表
    path: thisFile + '/managePagelist',
    method: 'get'
  },
  addManageComment: { // 根据大科室出科鉴定ID添加教育处评语
    path: thisFile + '/addManageComment/', // {examinationId}
    method: 'post'
  },
  get: { // 查看出科鉴定
    path: thisFile + '/get/_', // {examinationId}
    method: 'get'
  },
  getConfig:{ // 根据key和生源类型查看单个配置
    path: '/rotaryConfig/getByKey/',
    method: 'get'
  },
};

export default api
