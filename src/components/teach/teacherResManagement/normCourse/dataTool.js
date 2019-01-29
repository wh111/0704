import _ from "lodash";

/**
 * 获取课程提交数据
 * @param {*} course 
 * @param {*} evaluate 
 * @param {*} planDtoList
 * @param status 状态
 */
const getCourse = function (course, evaluate, planDtoList, status) {
  let data = _.defaultsDeep({}, course); // 课程基本信息
  data.evaluate = _.defaultsDeep({}, evaluate); // 教学质量评价对象
  data.status = status;
  data.planDtoList = [];
  planDtoList.map((items, index) => {
    let item = _.defaultsDeep({}, items);
    item.no = index + 1; // 第几节课
    // 课件
    item.wareDtoListTemp.before.map(beforeWareItem => {
      item.wareDtoList.push(beforeWareItem)
    })
    item.wareDtoListTemp.in_progress.map(in_progressWareItem => {
      item.wareDtoList.push(in_progressWareItem)
    })
    item.wareDtoListTemp.after.map(beforeWareItem => {
      item.wareDtoList.push(beforeWareItem)
    })
    // 作业
    item.testingDtoList.push(item.testingDtoListTemp.before);
    item.testingDtoList.push(item.testingDtoListTemp.in_progress);
    item.testingDtoList.push(item.testingDtoListTemp.after);
    // 删除无用值
    delete(item.wareDtoListTemp);
    delete(item.testingDtoListTemp);
    data.planDtoList.push(item)
  })
  delete(data.createTime);
  return data
}

export {
  getCourse
}
