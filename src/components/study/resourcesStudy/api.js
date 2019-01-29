const options={
  VIDEO:"教学视频",
  LITERATURE:"文档文献",
  CASES:"典型病例",
  ATLAS:"医学图谱",
}
function fileType(type){
  type = type.toLowerCase();
  let obj = {
    doc:"c-icon-doc",
    docx:"c-icon-doc",
    xls:"c-icon-xls",
    xlsx:"c-icon-xls",
    ppt:"c-icon-ppt",
    pptx:"c-icon-ppt",
    pdf:"c-icon-pdf",
  }
  return obj[type];
}
//资源学习-学习记录
const studyRecord = {
  "0":"学习中",
  "1":"学习完成"
}
const api={
  fileType:fileType,
  types:options,
  studyRecord:studyRecord,

  //视频学习
  videoList:{  //列表
    path: "/video/query",
    method: "get",
  },
  videoInfo:{  //详情/{id}
    path: "/video/info",
    method: "get",
  },
  videoLike:{  //喜欢/{videoId}
    path: "/video/like",
    method: "post",
  },
  videoDislike:{  //不喜欢/{videoId}
    path: "/video/dislike",
    method: "post",
  },

  //文档文献
  literatureList:{  //列表
    path: "/literature/query",
    method: "get",
  },
  literatureInfo:{  //详情/{id}
    path: "/literature/info",
    method: "get",
  },

  //医学图谱
  atlasList:{  //列表
    path: "/atlas/query",
    method: "get",
  },
  atlasInfo:{  //详情/{id}
    path: "/atlas/info",
    method: "get",
  },

  //病例学习
  casesList:{  //列表
    path: "/cases/query",
    method: "get",
  },
  casesInfo:{  //详情/{id}
    path: "/cases/info",
    method: "get",
  },

  //学习记录
  userHistoryInfo:{  //详情/{id}
    path: "/userHistory/query",
    method: "get",
  },
  //上传视频进度(观看视频时，不定时上传视频进度)
  saveProgress:{  //详情/{id}
    path: "/video/saveProgress",
    method: "post",
  },
}

export default api;
