/**
 * 数据处理
 */

import _ from 'lodash'
import { formatDate } from '../../../libs/date' // 时间处理函数

/**
 * Excel中的数据转换成查看数据格式
 * @param arr
 * @returns {Object}
 */
function excel2ShowData (arr) {
  let resArr = []
  let startTime = ''
  let key = ['groupName', 'roomNum1', 'waitTime1', 'roomNum2', 'waitTime2', 'roomNum3', 'startTime3', 'endTime3',
    'roomNum4', 'waitTime4', 'roomNum5', 'startTime5', 'endTime5', 'roomNum6', 'startTime6', 'endTime6']
  _.defaultsDeep([], arr).map(item => {
    let obj = {}
    Object.keys(item).map(index => {
      if (!startTime && index == 2) {
        startTime = item[index]
      }
      obj[key[index]] = item[index].replace(/，/g, ',')
    })
    resArr.push(obj)
  })
  return {resArr, startTime}
}

/**
 * 显示数据转换为保存数据
 * @param obj
 * @param index
 * @param type
 */
function setDataByShow (obj, index, type) {
  let tempObj = {
    groupName: obj.groupName, // 组名
    groupOrder: index, // 组序
    totalStage: '', // 总阶段
    stageOrder: '', // 阶段顺序
    detailedStage: '', // 阶段详情
    examOrder: '', // 考核顺序
    roomNum: obj['roomNum' + type] || '', // 房间
    startTime: obj['startTime' + type] || '', // 开始时间
    endTime: obj['endTime' + type] || '', // 结束时间
    waitTime: obj['waitTime' + type] || '', // 等待时间
    changeTime: '' // 换站时间
  }
  switch (type) {
    case 1: // 总候考
      tempObj.totalStage = '总候考'
      tempObj.stageOrder = 1
      tempObj.detailedStage = '总候考'
      tempObj.examOrder = 1
      break;
    case 2: // 3楼-1、3考站（41min） 候考
      tempObj.totalStage = '3楼-1、3考站(41min)'
      tempObj.stageOrder = 2
      tempObj.detailedStage = '候考'
      tempObj.examOrder = 2
      break;
    case 3: // 3楼-1、3考站（41min） 候考
      tempObj.totalStage = '3楼-1、3考站(41min)'
      tempObj.stageOrder = 2
      tempObj.detailedStage = '1、3考站'
      tempObj.examOrder = 3
      break;
    case 4: // 3楼-1、3考站（41min） 候考
      tempObj.totalStage = '5楼-2考站'
      tempObj.stageOrder = 3
      tempObj.detailedStage = '候考'
      tempObj.examOrder = 4
      break;
    case 5: // 3楼-1、3考站（41min） 候考
      tempObj.totalStage = '5楼-2考站'
      tempObj.stageOrder = 3
      tempObj.detailedStage = '2考站-技能(11min)'
      tempObj.examOrder = 5
      break;
    case 6: // 3楼-1、3考站（41min） 候考
      tempObj.totalStage = '5楼-2考站'
      tempObj.stageOrder = 3
      tempObj.detailedStage = '2考站-体格检查(13min)'
      tempObj.examOrder = 6
      break;
  }
  return tempObj
}

/**
 * 显示数据转换为保存数据
 * @param arr
 * @returns {Object}
 */
function showData2Save (arr) {
  let resArr = []
  let allRoomNum = []
  _.defaultsDeep([], arr).map((item, index) => {
    resArr.push(setDataByShow(item, index, 1)) // 总候考
    resArr.push(setDataByShow(item, index, 2)) // 3楼-1、3考站（41min） 候考
    resArr.push(setDataByShow(item, index, 3)) // 3楼-1、3考站（41min） 1、3考站
    resArr.push(setDataByShow(item, index, 4)) // 5楼-2考站 候考
    resArr.push(setDataByShow(item, index, 5)) // 5楼-2考站 2考站-技能（11min）
    resArr.push(setDataByShow(item, index, 6)) // 5楼-2考站 2考站-体格检查（13min）
    '123456'.split('').map(str => allRoomNum.push(item['roomNum' + str])) // 记录所有房间号
  })
  allRoomNum = _.uniq(allRoomNum.join(',').split(','))
  return {resArr, allRoomNum}
}

/**
 * 服务器数据转换为显示数据
 * @param arr
 * @returns {Object}
 */
function server2ShowData (arr) {
  let startOrder = false
  let resArr = [] // 表格显示数组
  let lastWaitTime = '' // 3~5站的第一个等待时间
  let callFun = [
    obj => { // 总候考
      resArr[obj.groupOrder - startOrder].waitTime1 = obj.waitTime // 等待时间（语音播报时间）
      if (!resArr[obj.groupOrder - startOrder].roomNum1) {
        resArr[obj.groupOrder - startOrder].roomNum1 = [] // 房间号
      }
      resArr[obj.groupOrder - startOrder].roomNum1.push(obj.roomNum)
    },
    obj => { // 3楼-1、3考站（41min） 候考
      resArr[obj.groupOrder - startOrder].waitTime2 = obj.waitTime // 等待时间（语音播报时间）
      if (!resArr[obj.groupOrder - startOrder].roomNum2) {
        resArr[obj.groupOrder - startOrder].roomNum2 = [] // 房间号
      }
      resArr[obj.groupOrder - startOrder].roomNum2.push(obj.roomNum)
    },
    obj => { // 3楼-1、3考站（41min） 1、3考站
      resArr[obj.groupOrder - startOrder].startTime3 = obj.startTime // 开始时间
      resArr[obj.groupOrder - startOrder].endTime3 = obj.endTime // 结束时间
      if (!resArr[obj.groupOrder - startOrder].roomNum3) {
        resArr[obj.groupOrder - startOrder].roomNum3 = [] // 房间号
      }
      resArr[obj.groupOrder - startOrder].roomNum3.push(obj.roomNum)
    },
    obj => { // 5楼-2考站 候考
      resArr[obj.groupOrder - startOrder].waitTime4 = obj.waitTime // 等待时间（语音播报时间）
      if (!resArr[obj.groupOrder - startOrder].roomNum4) {
        resArr[obj.groupOrder - startOrder].roomNum4 = [] // 房间号
      }
      resArr[obj.groupOrder - startOrder].roomNum4.push(obj.roomNum)
    },
    obj => { // 5楼-2考站 2考站-技能（11min）
      resArr[obj.groupOrder - startOrder].startTime5 = obj.startTime // 开始时间
      resArr[obj.groupOrder - startOrder].endTime5 = obj.endTime // 结束时间
      if (!resArr[obj.groupOrder - startOrder].roomNum5) {
        resArr[obj.groupOrder - startOrder].roomNum5 = [] // 房间号
      }
      resArr[obj.groupOrder - startOrder].roomNum5.push(obj.roomNum)
    },
    obj => { // 5楼-2考站 2考站-体格检查（13min）
      resArr[obj.groupOrder - startOrder].startTime6 = obj.startTime // 开始时间
      resArr[obj.groupOrder - startOrder].endTime6 = obj.endTime // 结束时间
      if (!resArr[obj.groupOrder - startOrder].roomNum6) {
        resArr[obj.groupOrder - startOrder].roomNum6 = [] // 房间号
      }
      resArr[obj.groupOrder - startOrder].roomNum6.push(obj.roomNum)
    }
  ];
  (arr || []).map((item, index) => {
    if (index == 0 && startOrder === false) {
      startOrder = item.groupOrder
    }
    if (!resArr[item.groupOrder - startOrder]) {
      resArr[item.groupOrder - startOrder] = {
        groupName: item.groupName || '', // 组名
        groupOrder: item.groupOrder // 组序
      }
    }
    if (!lastWaitTime && item.examOrder == 4) {
      lastWaitTime = item.waitTime
    }
    callFun[item.examOrder - 1](item)
  })
  resArr.map(item => {
    ','.repeat(6).split('').map((s, index) => item['roomNum' + (index + 1)] = item['roomNum' + (index + 1)].join(s))
  })
  return {lastWaitTime, resArr}
}

export {
  excel2ShowData,
  showData2Save,
  server2ShowData
}
