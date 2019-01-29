/*
 * Update: 2018/6/19 18:19
 * Author: yc
 * Describe: 该模块主要是继承湘雅项目
 */

/**
 * 数据处理
 */

import _ from 'lodash';
import { formatDate } from '../../../libs/date'; // 时间处理函数

/**
 * 分钟转换为秒
 * @param m 分钟数
 * @returns {number}
 */
function getM2S (m) {
  return isNaN(m) ? 0 : parseInt(Number(m) * 60);
}

/**
 * 秒转换为分钟
 * @param s 秒数
 * @returns {number}
 */
function getS2M (s) {
  return isNaN(s) ? 0 : Number((Number(s) / 60).toFixed(1));
}

/**
 * 获取保存数据
 *
 * @export
 * @param {any} args
 */
function getSaveData (args) {
  let allData = {}; // 所有的提交数据
  // 数据移除绑定
  let info = _.defaultsDeep({}, args.info); // 考次信息
  let roomList = _.defaultsDeep([], args.roomList); // 考站
  let roomData = _.defaultsDeep([], args.roomData); // 考站信息
  let managerList = _.defaultsDeep([], args.managerList); // 场次管理员
  let userList = _.defaultsDeep([], args.userList); // 参考人员
  let spList = _.defaultsDeep([], args.spList); // SP列表
  let spListVal = _.defaultsDeep([], args.spListVal); // SP列表可选择的剧本

  info.basicsTime = getM2S(info.basicsTime); // 考试时间基数
  info.remindTime = info.hasRemind ? getM2S(info.remindTime) : 0; // 提醒时长
  // 只有自由考核的时候
  if (info.sceneType === 'FREE') {
    // 变更考站的时间从分钟改为秒
    roomData.map(item => {
      item.timeCount = getM2S(item.timeCount);
      item.stationContentList.map(cItem => {
        cItem.timeCount = getM2S(cItem.timeCount);
      });
    });
  }
  if (info.sceneType === 'STANDARD') { // 理论考核
    info.restTime = getM2S(info.restTime); // 中场休息时间
    info.moveTime = getM2S(info.moveTime); // 换站时间
  }

  // 数据还原
  let stationList = []; // 站点集合
  let stationTimeCountArr = []; // 站点考核时间集合

  // 还原站点信息集合
  _.mapKeys(roomList, (item, index) => {
    let children = item.children; // 考站
    let room = item.room; // 考站房间
    let teacher = item.teacher; // 该房间下的监考老师
    let station = roomData[index]; // 考站对应的考站信息

    let stationContentObj = {}; // 记录当前考站对应的考核内容信息
    (roomData[index].stationContentList || []).map((item, contentOrder) => {
      // 记录考核内容序号
      item.contentOrder = contentOrder;
      stationContentObj[item._id] = item;
    });

    stationTimeCountArr.push(station.timeCount); // 记录每个考站的时长
    let roomTeacherList = []; // 该房间下的监考老师（提交数据）
    _.mapKeys(teacher, (tItem, tIndex) => { // 考站对应的监考老师
      _.mapKeys(tItem, (tcIntem, tcIndex) => { // 监考老师列表
        let contentScoreTableList = [];
        tcIntem.userId = tcIntem.teacherId;
        tcIntem.userName = tcIntem.teacherName;
        tcIntem.roomId = room[tIndex].roomId;
        tcIntem.weight = tcIntem.weight / 100;
        Object.keys(tcIntem.contentScoreTableObj).map(_id => { // 转换教师评分表数据结构
          let contentScoreTableItem = tcIntem.contentScoreTableObj[_id];
          contentScoreTableItem.contentName = stationContentObj[_id].contentName;
          contentScoreTableItem.contentOrder = stationContentObj[_id].contentOrder;
          contentScoreTableItem.oldScoreTableId = contentScoreTableItem.oldScoreTableId || contentScoreTableItem.scoreTableId;
          contentScoreTableList.push(contentScoreTableItem);
        });
        tcIntem.contentScoreTableList = contentScoreTableList;
        delete tcIntem.contentScoreTableObj;
        roomTeacherList.push(tcIntem);
      });
    });
    station.roomTeacherList = roomTeacherList;//保存老师

    let roomIdArr = []; // 缓存使用
    let specialtyList = []; // 考站专业
    _.mapKeys(room, (rItem, rIndex) => {
      roomIdArr.push(rItem.roomId);
      specialtyList.push({
        roomId: rItem.roomId,
        specialty: rItem.specialty === 0 ? '' : rItem.specialty
      });
    });

    // 当前考站的评分表
    station.stationContentList.map(sItem => {
      let scoreTableIds = [];
      (sItem.scoreTableList || []).map(ssItem => scoreTableIds.push(ssItem.scoreTableId));
      sItem.scoreTableIds = scoreTableIds.join(',');
      // 理论考核试卷试题排序
      (sItem.paperContentList || []).map((pItem, index) => pItem.parerOrder = index);
    });

    roomData[index].roomSpecialtyList = specialtyList; // 当前考站下的房间对应的专业

    station.roomIds = roomIdArr.join(',');
    station.stationWeight = station.stationWeight / 100;
    stationList.push(station);
  });

  // 剧本处理
  _.mapKeys(spList, (item, index) => {
    let temp = _.difference(item.scriptIds, spListVal); // 取出无效值
    let scriptId = _.difference(item.scriptIds, temp); // 有效值
    spList[index].scriptIds = scriptId.join(',');
  });

  // 所有考站中的时间是否相同，如果相同则有休息站
  info.isRest = stationTimeCountArr.some(time => stationTimeCountArr[0] != time)
    ? 'NO'
    : 'YES';
  // 数据集组合
  allData = _.assign(info, {
    managerList,
    userList,
    spList,
    stationList
  });
  // 时间格式化
  allData.startTime = formatDate(allData.startTime, 'yyyy-MM-dd HH:mm:ss').
    replace(/\d{2}$/, '00') || '';
  allData.endTime = formatDate(allData.endTime, 'yyyy-MM-dd HH:mm:ss').
    replace(/\d{2}$/, '00') || '';
  allData.examineeNum = userList.length; // 考核人数
  allData.stationNum = roomList.length; // 考站数量

  // 自由考核状态一开始就为“未发布”
  if (allData.sceneType === 'FREE') {
    allData.status = 'UNPUBLISH';
  }

  return allData;
}

/**
 * 获取考站信息修改提交数据
 *
 * @param {any} args
 */
function getModifyStationInfoData (args) {
  let info = _.defaultsDeep({}, args.info); // 考次信息
  let roomList = _.defaultsDeep([], args.roomList); // 考站
  let roomData = _.defaultsDeep([], args.roomData); // 考站信息
  let spList = _.defaultsDeep([], args.spList); // SP列表
  let spListVal = _.defaultsDeep([], args.spListVal); // SP列表可选择的剧本

  let allData = {};

  let stationList = [];
  let stationTimeCountArr = []; // 站点考核时间集合
  let isRest;

  // 只有自由考核的时候
  if (info.sceneType === 'FREE') {
    // 变更考站的时间从分钟改为秒
    roomData.map(item => {
      let timeCount = item.timeCount;
      if (item.stationType === 'SP') {
        timeCount = 0;
        item.stationContentList.map(cItem => {
          timeCount += cItem.timeCount; // 重新计算
          cItem.timeCount = getM2S(cItem.timeCount);
        });
      }
      item.timeCount = getM2S(timeCount);
    });
  }

  // 考站遍历
  // 还原站点信息集合
  _.mapKeys(roomList, (item, index) => {
    let children = item.children; // 考站
    let room = item.room; // 考站房间
    let teacher = item.teacher; // 该房间下的监考老师
    let station = roomData[index]; // 考站对应的考站信息
    let stationContentObj = {}; // 记录当前考站对应的考核内容信息
    (roomData[index].stationContentList || []).map((item, contentOrder) => {
      // 记录考核内容序号
      item.contentOrder = contentOrder;
      stationContentObj[item._id] = item;
    });

    stationTimeCountArr.push(station.timeCount); // 记录每个考站的时长

    let roomTeacherList = []; // 该房间下的监考老师（提交数据）
    console.log('teacher', teacher);
    _.mapKeys(teacher, (tItem, tIndex) => { // 考站对应的监考老师
      _.mapKeys(tItem, (tcIntem, tcIndex) => { // 监考老师列表
        let contentScoreTableList = [];
        tcIntem.userId = tcIntem.teacherId;
        tcIntem.userName = tcIntem.teacherName;
        tcIntem.roomId = room[tIndex].roomId;
        tcIntem.weight = tcIntem.weight / 100;
        Object.keys(tcIntem.contentScoreTableObj).map(_id => { // 转换教师评分表数据结构
          let contentScoreTableItem = tcIntem.contentScoreTableObj[_id];
          contentScoreTableItem.contentName = stationContentObj[_id].contentName;
          contentScoreTableItem.contentOrder = stationContentObj[_id].contentOrder;
          contentScoreTableItem.oldScoreTableId = contentScoreTableItem.oldScoreTableId || contentScoreTableItem.scoreTableId;
          contentScoreTableList.push(contentScoreTableItem);
        });
        tcIntem.contentScoreTableList = contentScoreTableList;
        delete tcIntem.contentScoreTableObj;
        roomTeacherList.push(tcIntem);
      });
    });
    console.log('roomTeacherList', roomTeacherList);
    station.roomTeacherList = roomTeacherList;

    let roomIdArr = []; // 缓存使用
    let specialtyList = []; // 考站专业
    _.mapKeys(room, (rItem, rIndex) => {
      roomIdArr.push(rItem.roomId);
      specialtyList.push({
        roomId: rItem.roomId,
        specialty: rItem.specialty === 0 ? '' : rItem.specialty
      });
    });

    // 当前考站的评分表
    station.stationContentList.map(sItem => {
      let scoreTableIds = [];
      (sItem.scoreTableList || []).map(ssItem => scoreTableIds.push(ssItem.scoreTableId));
      sItem.scoreTableIds = scoreTableIds.join(',');
      // 理论考核试卷试题排序
      (sItem.paperContentList || []).map((pItem, index) => pItem.parerOrder = index);
    });

    roomData[index].roomSpecialtyList = specialtyList; // 当前考站下的房间对应的专业

    station.roomIds = roomIdArr.join(',');
    // 权重处理（0-1）
    station.stationWeight = station.stationWeight / 100;
    stationList.push(station);
  });

  // 剧本处理
  _.mapKeys(spList, (item, index) => {
    let temp = _.difference(item.scriptIds, spListVal); // 取出无效值
    let scriptId = _.difference(item.scriptIds, temp); // 有效值
    spList[index].scriptIds = scriptId.join(',');
  });

  // 所有考站中的时间是否相同，如果相同则有休息站
  isRest = stationTimeCountArr.some(time => stationTimeCountArr[0] != time)
    ? 'NO'
    : 'YES';

  allData = _.assign({
    isRest,
    stationList,
    spList
  });

  return allData;
}

/**
 * 获取基本信息
 * @param res
 * @returns {{id: Array.id, sceneName: Array.sceneName, startTime: Array.startTime, endTime: Array.endTime, setupTime: Array.setupTime, restNum: Array.restNum, restTime: Array.restTime, moveTime: Array.moveTime, basicsTime: Number.basicsTime, isSpMove: Array.isSpMove, sceneType: Array.sceneType, step: String.step, scoringMethod: Array.scoringMethod, status: Array.status, hasRemind: boolean, remindTime: String.remindTime}}
 */
function getBasicInfo (data) {
  let {
    id,
    sceneName,
    startTime,
    endTime,
    setupTime,
    restNum,
    restTime,
    moveTime,
    basicsTime,
    isSpMove,
    sceneType,
    step,
    scoringMethod,
    status,
    remindTime
  } = data;
  let hasRemind = typeof remindTime === 'number' && remindTime !== 0; // 如果提醒时间不为0就需要显示提醒时间输入框
  remindTime = hasRemind ? getS2M(remindTime) : ''; // 提醒时间
  remindTime = remindTime.toString();

  basicsTime = getS2M(basicsTime); // 考试时间基数
  if (sceneType === 'STANDARD') { // 理论考核
    restTime = getS2M(restTime); // 中场休息时间
    moveTime = getS2M(moveTime); // 换站时间
  }

  step = (step || '').toString();

  return {
    id,
    sceneName,
    startTime,
    endTime,
    setupTime,
    restNum,
    restTime,
    moveTime,
    basicsTime,
    isSpMove,
    sceneType,
    step,
    scoringMethod,
    status,
    hasRemind,
    remindTime
  };
}

export {
  getM2S,
  getS2M,
  getSaveData,
  getModifyStationInfoData,
  getBasicInfo
};
