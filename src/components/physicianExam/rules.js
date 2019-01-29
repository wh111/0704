import _ from 'lodash'
import baseRules from '../../formRules/base' // 公共规则

// 考核管理
let physicianExamineInterval = {
//  examName: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)]
  roomNum:[baseRules.requiredNoEvent],
  name:[baseRules.requiredNoEvent]
}

let physicianExamineMonitorWaitTime = {
  startTime: [baseRules.requiredNoEvent, baseRules.isDate],
  timeLong: [baseRules.requiredNoEvent, baseRules.float(1), baseRules.numberSection(-300, 300)]
}

export {
  physicianExamineInterval,
  physicianExamineMonitorWaitTime
}
