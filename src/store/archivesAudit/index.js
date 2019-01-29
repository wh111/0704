let state = {
  archivesContent:{},
}

let mutations = {
  // 初始化data
  initData: (state, dataVal) => {
    state.archivesContent = {
      archivesBasicInfoDto:["0","1"],           //基本信息
      archivesEduInfoDtoList:[],         //学历信息
      archivesWorkRecordInfoDtoList:[],  //工作经历
      archivesPromotionInfoDtoList:[],   //专业技术职称晋升情况
      archivesQualifiedInfoDtoList:[],   //资格证书取得情况(如医师资格证书、医师执业证书等)
      archivesTeachRecordDto:{},         //教学经历
      archivesTrainInfoDtoList:[],       //学习培训过情况
      archivesTrainExamInfoDtoList:[],   //培训考试，考核情况
      archivesPrizeInfoDtoList:[],       //获奖情况
      archivesScientificDto:{},          //科研信息
      archivesFilesDtoList:[],           //证件复印件
    }
  },
  // 初始化考站信息
  intStationRoom: (state, stationObj) => {
    state.stationRoom = stationObj
  },
  // 更新当前考站数据
  updateData: (state, dataObj) => {
    for(key in dataObj){
      state.archivesContent[key] = dataObj[key];
    }
    /*Object.keys(dataObj).map(key => {
      state.archivesContent[key] = dataObj[key]
    })*/
  }
}

export {
  state,
  mutations
};
