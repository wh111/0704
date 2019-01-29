let api = {
  edit: { // 部门人员-添加/修改 实习生
    path: "/user/saveSXS",
    method: 'post'
  },
  get: { // 部门人员-获取 实习生
    path: "/user/getSXS/",
    method: 'get'
  },
  getByFilter: { // 部门人员-获取 实习生（根据权限进行字段过滤）
    path: "/user/getSXS-by-filter/",
    method: 'get'
  },
  importSXS: { // 部门人员-导入实习生
    path: "/user/importSXS/", // {deptId}
    method: 'get'
  },
  uploadImg: "/file/upload/headImg", // 上传头像
  downloadImg: "/api/file/download/headImg", // 下载头像
};

export default api
