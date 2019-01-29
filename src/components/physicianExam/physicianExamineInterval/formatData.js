/**
 * 数据处理
 */

import _ from 'lodash'

/**
 * 获取保存数据
 * @param obj
 * @returns {{oneStationNames: String, oneStationRoomNums: String, towStationNames: String, towStationRoomNums: String}}
 */
function getSaveData (obj) {
  let allData = {
    'oneStationNames': [],
    'oneStationRoomNums': [],
    'twoStationNames': [],
    'twoStationRoomNums': []
  } // 所有的提交数据

  obj.one.map(item => {
    allData.oneStationRoomNums.push(item.roomNum)
    allData.oneStationNames.push(item.name)
  })

  obj.two.map(item => {
    allData.twoStationRoomNums.push(item.roomNum)
    allData.twoStationNames.push(item.name)
  })

  Object.keys(allData).map(key => allData[key] = allData[key].join(','))
  return allData
}

export {
  getSaveData
}
