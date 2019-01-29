const api = {
  auditDepRotaryDataList: { // 三级科室安排轮转审核列表
    path: '/rotationProcess/rotaryTable/auditDepRotaryDataList',
    method: 'get'
  },
  auditDepRotaryDataGet: { // 三级科室安排轮转审核--查看
    path: '/rotationProcess/rotaryTable/auditDepRotaryData/get',
    method: 'get'
  },
  auditDepRotaryDataAudit: { // 三级科室安排轮转审核--审批
    path: '/rotationProcess/rotaryTable/auditDepRotaryData/audit/',//{id}
    method: 'post'
  },
  auditZYYRotaryDataAudit: { // 三级科室安排轮转审核--审批
    path: '/rotationProcess/rotaryTable/auditZYYRotaryData/audit/',//{id}
    method: 'post'
  },
};

export default api

