let api = {
  get: { // 获取进修生科室要求
    path: 'deprequirement/getJxsModel',
    method: 'get'
  },
  addOrModify: { // 添加或修改科室要求
    path: '/deprequirement/addOrModify',
    method: 'post'
  },
  depReDistype: { // 根据父CODE获取父项，以及子项。(通用)
    path: '/dictionary/getByCode/conf_sx_dep_requires_distype',
    method: 'get'
  },
  depReDegree: { // 获取掌握程度
    path: '/dictionary/getByCode/ROTARY_MASTER_DEGREE',
    method: 'get'
  },
  specialty: { //查询专业
    path: "/dictionary/getByCode/TRAINING_DIRECTION_SX",
    method: 'get'
  },
  searhDepAndSpecialty: { //查询所有启用的科室（查询所有启用的科室，不带分页）
    path: "/hospital/dept/queryAll",
    method: 'get'
  },
};

export default api;
