/*
 * Update: 2018/6/19 18:32
 * Author: yc
 * Describe: 增加不用抽题
 */

// 抽题类型
const typeOption = [{
  value: '',
  label: '全部'
}, {
  value: 'SYSTEM',
  label: '自动抽题'
}, {
  value: 'EXAMINEE',
  label: '考生抽题'
}, {
  value: 'TEACHER',
  label: '考官随机抽题'
}, {
  value: 'TEACHER_SELECT',
  label: '考官手工抽题'
}, {
  value: 'NO',
  label: '不用抽题'
}];

export default typeOption;
