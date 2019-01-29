let api = {
  // 其他人员
  otherGet: {
    path: '/archives/get/basic/',
    method: 'get'
  },
  // 根据档案Id，获取基本信息(按权限过滤)
  otherGetByFilter: {
    path: '/archives/get/basic-by-filter/',
    method: 'get'
  },
  otherSave: {
    path: '/archives/save/basic/',
    method: 'post'
  },
  schools: { //查询学校
    path: '/schools/queryList',
    method: 'get'
  },

  // 头像上传
  uploadHeaderUrl: '/file/upload/headImg',
  // 获取字典
  getDictionary: '/dictionary/getByCode/',
  major: '/hospital/dept/getByDepth',  //专业
};

export default api;
