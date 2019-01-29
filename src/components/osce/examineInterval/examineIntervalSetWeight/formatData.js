/**
 * 获取考站
 * @param $vue vue实例
 * @returns {{}}
 */
let getWeigthRooms = function ($vue) {
  let rooms = {}
  let roomInfo = $vue.$util._.defaultsDeep([], $vue.$store.state.examineInterval.room.roomInfo)
  roomInfo.map((item, index) => {
    let drawNum = item.drawNum || 'noDraw' // 有抽签的以抽签组分组，不然就以“noDraw”分组
    if (!rooms[drawNum]) {
      rooms[drawNum] = []
    }
    if (item.stationType !== 'REST') { // 空站不加入计算范围
      rooms[drawNum].push({
        index, // 记录下该考站原来是索引
        stationName: item.stationName, // 考站名称
        stationWeight: item.stationWeight // 考站权重（属于非“noDraw”分组的所有考站将以此分组中的第一个考站权重初始化给此分组下的其他考站）
      })
    }
  })

  return rooms
}

/**
 * 检测权重和是否为100
 * @param obj 检测数据
 * @returns {boolean}
 */
let checkWeigthRoomsData = function (obj) {
  let sum = 0
  let drawArr = Object.keys(obj)
  for (let i = 0, l = drawArr.length; i < l; i++) {
    let stationWeight = 0
    let item = obj[drawArr[i]]
    if (drawArr[i] !== 'noDraw') {
      stationWeight = isNaN(item[0].stationWeight) ? 0 : Number(item[0].stationWeight)
      if (stationWeight == 0) {
        return false
      }
      sum += stationWeight
    } else {
      for (let j = 0, jl = item.length; j < jl; j++) {
        stationWeight = isNaN(item[j].stationWeight) ? 0 : Number(item[j].stationWeight)
        if (stationWeight == 0) {
          return false
        }
        sum += stationWeight
      }
    }
  }
  return sum === 100
}

export { getWeigthRooms, checkWeigthRoomsData }
