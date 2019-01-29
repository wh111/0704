/**
 * 考站是否有参考人员
 * @param {any} userList 参考人员列表
 * @returns {Boolean} 是否至少有一人
 */
function stationHasUser (userList) {
  return userList.length > 0;
}

/**
 * 是否有考站
 * @param {any} roomList 考站列表
 * @returns
 */
function hasRoom (roomList) {
  return roomList.length > 0;
}

/**
 * 考站是否全部都命名
 * @param {any} roomInfo 考站信息列表
 * @returns 没有命名的考站索引，如果返回-1则说明全部都已命名
 */
function roomHasName (roomInfo) {
  for (let i = 0, l = roomInfo.length; i < l; i++) {
    if (roomInfo[i].stationName == '') {
      return i;
    }
  }
  return -1;
}

/**
 * 考站是否有SP考站
 * @param {any} roomInfo 考站信息列表
 * @returns 第一个SP考站索引，返回-1则表示没有sp考站
 */
function hasSPRoom (roomInfo) {
  for (let i = 0, l = roomInfo.length; i < l; i++) {
    if (roomInfo[i].stationType == 'SP') {
      return i;
    }
  }
  return -1;
}

/**
 * 是否有SP人员
 * @param {any} spUserList
 * @returns
 */
function hasSPUser (spUserList) {
  console.log(spUserList);
  return spUserList.length > 0;
}

/**
 * SP人员都有剧本
 * @param {any} spUserList
 * @returns 返回第一个没有剧本的SP人员，如果返回-1则表示sp人员都有剧本
 */
function spUserHasScript (spUserList) {
  for (let i = 0, l = spUserList.length; i < l; i++) {
    if (spUserList[i].scriptIds.length < 1) {
      return i;
    }
  }
  return -1;
}

/**
 * SP人员数量是否与SP考站匹配  规则：SP人员大于等SP考站数量
 * @param {any} roomInfo 考站信息列表
 * @returns SP考站数量
 */
function spStationNum (roomInfo) {
  let count = 0;
  for (let i = 0, l = roomInfo.length; i < l; i++) {
    if (roomInfo[i].stationType == 'SP') {
      count++;
    }
  }
  return count;
}

/**
 * SP选择的剧本与SP考站必须匹配  规则：SP人员选择的剧本要包含SP考站选择的剧本
 * @param {any} roomInfo 考站信息列表
 * @param {any} spUserList
 * @returns SP考站中没有对应SP人员的剧本名称 ['xx剧本','xxxx剧本']
 */
function spScriptIsHasSpStationScript (roomInfo, spUserList) {
  let scriptId = [], stationContentList = [], scriptName = [], stationName = [];
  for (let i = 0, l = roomInfo.length; i < l; i++) {
    if (roomInfo[i].stationType == 'SP') {
      stationContentList = stationContentList.concat(roomInfo[i].stationContentList);
    }
  }
  for (let j = 0, item; j < stationContentList.length; j++) {
    item = stationContentList[j];
    if (item.scriptId != '') {
      scriptId.push(item.scriptId);
      scriptName.push(item.scriptName);
    }
  }
  let spScriptList = [], spScriptId = [];
  for (let i = 0, l = spUserList.length; i < l; i++) {
    if (spUserList[i].scriptIds) {
      spScriptList = spScriptList.concat(spUserList[i].scriptIds);
    }
  }
  for (let k = 0, l = spScriptList.length; k < l; k++) {
    spScriptId.push(spScriptList[k]);
  }
  let strArr = [];
  for (let i = 0; i < scriptId.length; i++) {
    if (spScriptId.indexOf(scriptId[i]) == -1) {
      strArr.push(scriptName[i]);
    }
  }
  return strArr;
}

/**
 * 考站是否都有房间
 * @param {any} roomList
 * @returns 返回没有设置房间的考站索引｛index:考站索引,cIndex:平行站索引｝
 */
function stationHasRoom (roomList) {
  for (let i = 0, l = roomList.length; i < l; i++) {
    let room = roomList[i].room;
    for (let j = 0, n = room.length; j < n; j++) { // 该考站没有选择房间
      if (!room[j].roomId) {
        return {
          index: i, // 考站索引
          cIndex: j // 平行站索引 为0则没有平行站
        };
      }
    }
  }
  return { // 所有考站都要房间
    index: -1,
    cIndex: -1
  };
}

export {
  stationHasUser,
  hasRoom,
  roomHasName,
  hasSPRoom,
  hasSPUser,
  spUserHasScript,
  stationHasRoom,
  spStationNum,
  spScriptIsHasSpStationScript
};
