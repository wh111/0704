/**
 * Created by Administrator on 2017/7/24.
 */
//app管理
const api = {
  list: { // 列表
    path: '/apk/list',
    method: 'get'
  },
  save: { // 保存
    path: '/apk/save',
    method: 'post'
  },
  uploadApk: { // 上传APK文件
    path: '/file/upload/apk',
    method: 'post'
  },

};

export default api

