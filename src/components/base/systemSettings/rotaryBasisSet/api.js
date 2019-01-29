/**
 * Created by Administrator on 2017/7/24.
 */

const api = {
  //大病历设置
  modifyConfigId: { // 住院医黏贴比例修改  {configId}
    path: '/rotaryConfig/modify/',
    method: 'put'
  },
  rotarySigndepTime: { // 轮转时长 -ZYY -YJS -JXS
    path: '/rotaryConfig/getByKey/',
    method: 'get'
  },

};

export default api

