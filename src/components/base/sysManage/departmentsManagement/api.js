const api = {
  uploadExcel: { // 院内科室导入
    path: '/hospital/dept/uploadExcel', //{ids}
    method: 'post',
  },
  exportExcel: { // 院内科室导出
    path: '/api/hospital/dept/exportExcel', //{ids}
    method: 'get',
  },
}

export default api
