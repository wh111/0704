import _ from 'lodash';
import baseRules from '../../../formRules/base'; // 公共规则

/**
 * 视频库，文档文献，医学图谱，病例库  列表
 */
let videoBankList = {
  name: [baseRules.inputLen(0,50),baseRules.illegalChar()],
  title: [baseRules.inputLen(0,50),baseRules.illegalChar()],
};

/**
 * 视频库
 */
let videoBank = {
  name: [{ required: true, message: '此项不能为空'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //视频名称
  tags: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //标签
  viewNum: [{ required: true, message: '此项不能为空'},baseRules.greaterThanZero2,baseRules.inputLen(0,5)],  //播放次数
  remark:[baseRules.inputLen(0,500),baseRules.illegalChar()],  //简介
  fileId: [{ required: true, message: '此项不能为空'}],  //视频ID
  logoPath: [{ required: true, message: '此项不能为空'}],  //封面图
  typeId: [{ required: true, message: '此项不能为空'}],  //封面图
};
/**
 * 文档文献
 */
let resLiterature = {
  title:[{ required: true, message: '此项不能为空'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //视频名称
  tags: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //标签
  viewNum: [{ required: true, message: '此项不能为空'},baseRules.greaterThanZero2,baseRules.inputLen(0,5)],  //浏览次数
  brief:[baseRules.inputLen(0,500),baseRules.illegalChar()],  //简介

  fileId: [{ required: true, message: '此项不能为空'}],  //视频ID
  typeId: [{ required: true, message: '此项不能为空'}],  //视频ID
};
/**
 * 医学图谱
 */
let resMedicalAtlas = {
  title:[{ required: true, message: '此项不能为空'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //视频名称
  tags: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //标签
  viewNum: [{ required: true, message: '此项不能为空'},baseRules.greaterThanZero2,baseRules.inputLen(0,5)],  //浏览次数
  brief:[baseRules.inputLen(0,500),baseRules.illegalChar()],  //简介
  remark:[baseRules.inputLen(0,50),baseRules.illegalChar()],  //简介
  img: [{ required: true, message: '此项不能为空'}],  //首图
  fileId: [{ required: true, message: '此项不能为空'}],  //视频ID
  typeId: [{ required: true, message: '此项不能为空'}],  //视频ID
};
/**
 * 病例库
 */
let resCaseLibrary = {
  title:[{ required: true, message: '此项不能为空'},baseRules.inputLen(0,50),baseRules.illegalChar()],  //视频名称
  tags: [baseRules.inputLen(0,50),baseRules.illegalChar()],  //标签
  viewNum: [{ required: true, message: '此项不能为空'},baseRules.greaterThanZero2,baseRules.inputLen(0,5)],  //浏览次数
  brief:[baseRules.inputLen(0,500),baseRules.illegalChar()],  //简介
  logo: [{ required: true, message: '此项不能为空'}],  //首图
  fileId: [{ required: true, message: '此项不能为空'}],  //视频ID
  typeId: [{ required: true, message: '此项不能为空'}],  //视频ID
};


export {
  videoBank,
  videoBankList,
  resLiterature,
  resMedicalAtlas,
  resCaseLibrary,
};
