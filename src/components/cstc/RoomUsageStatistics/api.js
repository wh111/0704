const thisFile = '/room/roomstatic';
const api = {
  list: { // 列表数据
    path: thisFile,
    method: 'post'
  },
  reserveRoomStatistics: { // 房间预约统计
    path: 'reserve/room/statistics',
    method: 'get'
  },
  roomInfoList: { // 房间情况统计
    path: 'affair/date/room/list',
    method: 'get'
  },
  /********************************** 使用类型 ********************************************/
  getAffairType: { // 获取技能中心事项类型
    path: 'affair/getAffairType',
    method: 'get'
  }
};

export default api;
