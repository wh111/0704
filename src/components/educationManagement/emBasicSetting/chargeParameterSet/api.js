let api = {
  getByKey: { //根据key和生源类型查看单个配置
    path:  '/rotaryConfig/getByKey/charging_parameter_setting-JXS',  //收费参数设置(银行卡账号)
    method: 'get'
  },
  modifyConfigId: { //修改轮转相关配置
    path:  '/rotaryConfig/modify/',  //{configId}
    method: 'put'
  },
};

export default api;
