import baseRules from '../../formRules/base' // 公共规则

/**
 * 树菜单
 */
let set = {
  sceneId: [baseRules.requiredNoEvent, baseRules.selectId],
  roomNum: baseRules.requiredNoEvent
}

export {
  set,
}
