/**
 * Created by Administrator on 2017/6/17.
 */
import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 添加评分
 */
let addScore = {
  mark: baseRules.numRequired
};

let selectContent = {
  contentId: [baseRules.selectId]
};

export {
  addScore,
  selectContent
};
