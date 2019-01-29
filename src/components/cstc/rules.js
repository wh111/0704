import _ from 'lodash';
import baseRules from '../../formRules/base'; // 公共规则

// 事务管理
let affairs = {
  // registerDate: baseRules.isDate, // 开始时间 时间类型
  // timeInterval: baseRules.required, // 结束时间 必填
  // affairType: baseRules.selectText, // 类型 必选
  // classhour: baseRules.numberMust, // 课时 必须为数字
  // peopleNum: baseRules.numberMust, // 人数 必须为数字
  affairName: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  startTime: [baseRules.requiredNoEvent],
  endTime: [baseRules.requiredNoEvent],
  receptionObject: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  affairType: baseRules.selectText,
  peopleNum: [baseRules.requiredNoEvent, baseRules.greaterThanZero, baseRules.inputLen(1, 4)]
};

/**
 * 门禁
 */
// 门禁卡管理
let accessControlManage = {
  cardNum: [baseRules.requiredNoEvent, baseRules.numbers] // 卡号 必填，必须是数字
};
// 门禁设备管理
let accessControlDevice = {
  doorName: baseRules.required, // 门禁名称 必填
  doorNum: baseRules.requiredNoEvent, // 门禁名称 必填
  accessSn: [baseRules.greaterThanZero, baseRules.inputLen(1, 20)], // 控制器SN 必填
  accessIp: [baseRules.required, baseRules.ip] // 控制器IP 必填
};

// 中心日程
let centerSchedule = {
  date: baseRules.requiredNoEvent,
  startTime: baseRules.requiredNoEvent,
  endTime: baseRules.requiredNoEvent
};

// 声像设备 - 网络音响 - 添加音响设备
let audio = {
  brand: baseRules.selectText,
  modelNum: baseRules.required,
  ip: [baseRules.required, baseRules.ip]
  // terminalId:[baseRules.requiredNoEvent,baseRules.numbers,baseRules.inputLen(1,10)]
};

// 声像设备 - 网络音响 - 任务
let audioTask = {
  name: [baseRules.required, baseRules.inputLen(1, 50)],
  path: baseRules.selectText
};

// 声像设备 - 网络音响 - 任务
let video = {
  brand: baseRules.selectText,
  modelNum: baseRules.requiredNoEvent,
  ip: [baseRules.required],
  loginName: baseRules.requiredNoEvent,
  password: baseRules.requiredNoEvent,
  nvrIp: baseRules.requiredNoEvent,
  port: baseRules.requiredNoEvent
};

let reader = {
  roomId: [baseRules.requiredNoEvent],
  readerIp: [baseRules.requiredNoEvent, baseRules.ip]
};

/**
 * 预约上课
 */
let bespeakClass = {
  name: baseRules.required, // 课程名称 必填
  roomBearingCapacity: [baseRules.numberMust, baseRules.numberSection(1, 10000)], // 房间承载人数 必须为数字
  summary: baseRules.inputLen(0, 200), // 课程内容输入文字数测试测试测试测试测试测试测试测试测试测试测试
  minNum: [baseRules.numberMust] // 最低开课人数 必须为数字
};

/**
 * 预约设置 - 设备
 */
let bespeakSetModel = {
  openNum: baseRules.numbers
};

/**
 * 预约设置 - 项目
 */
let bespeakSetProject = {
  name: baseRules.required, // 项目名称 必填
  summary: baseRules.inputLen(0, 200) // 预约简介
};

/**
 * 树菜单
 */
let tree = {
  name: baseRules.required // 名称 - 必填
};

/**
 * 房间管理
 */
let roomManage = {
  roomNum: baseRules.required, // 房间号 - 必填
  roomName: baseRules.required, // 房间名称 - 必填
  floor: baseRules.numberMust, // 所在楼层 - 必须为数字
  roomType: baseRules.selectText, // 类型
  capacity: baseRules.numberMust // 所在楼层 - 必须为数字
};

/**
 * 房间使用情况
 */
let roomUsage = {
  roomId: baseRules.selectId, // 房间 - 必选
  employType: baseRules.selectText, // 使用类型 - 必选
  startTime: baseRules.isDate, // 开始时间 - 必须为日期时间
  endTime: baseRules.isDate // 结束时间 - 必须为日期时间
};

/**
 * 设备管理 - 设备入库
 */
let deviceStorage = {
  deviceTypeName: baseRules.required // 借用人 - 必填
};

/**
 * 设备管理 - 设备入库 - 设备详情
 */
let deviceStorageMoreInfo = {
  purchaseTime: baseRules.isDate, // 购买时间 - 必须为日期时间
  price: baseRules.numberMust, // 单价 - 必须为数字
//  model: baseRules.requiredNoEvent, // 设备编号
  deviceIdentifier: baseRules.required, // 设备编号 - 必填
  manufactureDate: baseRules.isDate, // 生产日期 - 必须为日期时间
  guaranteeDate: baseRules.isDate, // 保修截止日期 - 必须为日期时间
  status: baseRules.selectText // 使用类型 - 必选
};

/**
 * 设备管理 - 借用记录
 */
let deviceLoan = {
  borrower: baseRules.required, // 借用人 - 必填
  borrowTime: baseRules.isDate, // 借用时间 - 必须为日期时间
  purpose: [baseRules.required, baseRules.inputLen(0, 200)], // 用途 - 必填
  deviceId: baseRules.selectId, // 设备名称 - 必选
  deviceTypeId: baseRules.selectId, // 设备编号 - 必选
  parts: baseRules.inputLen(0, 200) // 配件
};

/**
 * 设备管理 - 维修记录
 */
let deviceServicing = {
  deviceId: baseRules.selectId, // 设备名称 - 必选
  deviceTypeId: baseRules.selectId, // 设备编号 - 必选
  cost: baseRules.numberMust, // 费用 - 必填
  startTime: baseRules.isDate // 维修开始时间 - 必须为日期时间
};

/**
 * 设备管理- 报废记录
 */
let deviceScrap = {
  deviceId: baseRules.selectId, // 设备名称 - 必选
  deviceTypeId: baseRules.selectId, // 设备编号 - 必选
  scrapTime: baseRules.isDate, // 报废时间 - 必须为日期时间
  scrapReason: baseRules.required // 报废原因 - 必填
};

/**
 * 耗材管理 - 消耗品管理
 */
let consumablesManage = {
  consumablesName: baseRules.required, // 名称 - 必填
  price: [baseRules.requiredNoEvent, baseRules.float(2)], // 价格 - 必填
  stock: baseRules.numberMust, // 库存 - 必填
  baseline: baseRules.greaterThanZero2//报警基线
};

/**
 * 耗材管理 - 消耗品管理 - 耗材入库
 */
let consumablesManageInfo = {
  buyDate: baseRules.isDate, // 购买时间 - 必须为日期时间
  buyNum: baseRules.numberMust, // 购买数量 - 必填
  price: [baseRules.requiredNoEvent, baseRules.float(2)] // 单价 - 必填
};

/**
 * 耗材管理 - 使用记录
 */
let consumablesUse = {
  consumablesId: baseRules.selectId, // 设备名称 - 必选
  borrowerNum: baseRules.numberMust, // 数量 - 必须为数字
  borrower: baseRules.required, // 借用人 - 必填
  borrowerTime: baseRules.isDate, // 借用时间 - 必须为日期时间
  purpose: baseRules.required // 用途 - 必填
};

/**
 * 耗材管理 - 盘点记录
 */
let consumablesCount = {
  consumablesId: baseRules.selectId, // 设备名称 - 必选
  expectNum: baseRules.numberMust, // 预期数量 - 必须为数字
  actualNum: baseRules.numberMust, // 实际数量 - 必须为数字
  // inventoryMan: baseRules.required, // 盘点人 - 必填
  inventoryTime: baseRules.isDate // 盘点时间 - 必须为日期时间
};

/**
 * 工作坊
 */
let workshops = {
  workshopsName: baseRules.required, // 工作坊名称 必填,
  //roomId: baseRules.requiredNoEvent,  //房间必须填写
  //roomNum: baseRules.requiredNoEvent,  //房间必须填写
  roomIdAndNum: baseRules.requiredNoEvent,  //房间id和房间号组合用于验证和存储
  summary: baseRules.required, // 简介必须填写 必填,
  workshopsImageList: baseRules.requiredNoEvent  //图片必选上传
};

// 技能培训
let skillTrain = {
  trainingName: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  user: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  phone: [baseRules.requiredNoEvent, baseRules.mobile]
};

let ICCard = {
  cardNum: [baseRules.requiredNoEvent, baseRules.numbers, baseRules.inputLen(1, 25)]
};

let bespeakAudit = {
  opinion: baseRules.inputLen(0, 300)
};

// 房间预约
let roomReserve = {
  name: [baseRules.requiredNoEvent, baseRules.inputLen(1, 50)],
  applicantName: [baseRules.requiredNoEvent],
  reserveNumber: [baseRules.requiredNoEvent, baseRules.greaterThanZero],
  useType: [baseRules.requiredNoEvent, baseRules.selectText],
  comments: [baseRules.inputLen(0, 250)]
};

export {
  video,
  audio,
  reader,
  audioTask,
  affairs,
  accessControlManage,
  accessControlDevice,
  bespeakClass,
  bespeakSetModel,
  bespeakSetProject,
  centerSchedule,
  tree,
  roomManage,
  roomUsage,
  deviceStorage,
  deviceStorageMoreInfo,
  deviceLoan,
  deviceServicing,
  deviceScrap,
  consumablesManage,
  consumablesManageInfo,
  consumablesUse,
  consumablesCount,
  skillTrain,
  ICCard,
  workshops,
  bespeakAudit,
  roomReserve
};
