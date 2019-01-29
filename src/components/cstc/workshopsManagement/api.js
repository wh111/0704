const api = {
  workshopsList:{  //工作坊列表
    path: "workshops/list",
    method:"get"
  },
  workshopsOtherList:{  //其他工作坊列表  workshops/other/list/{workshopsId}
    path: "workshops/other/list/",
    method:"get"
  },
  workshopsRemove:{  // 工作坊删除接口（可批量删除） workshops/removes/{workshopsIds}
    path: "workshops/removes",
    method:"delete"
  },
  workshopsModify:{  // 工作坊修改接口  workshops/modify/{workshopsId}
    path: "workshops/modify/",
    method:"put"
  },
  workshopsAdd:{  // 工作坊添加接口  workshops/add
    path: "workshops/add",
    method:"post"
  },
  workshopsGet:{  // 工作坊详情接口  workshops/get/{workshopsId}
    path: "workshops/get/",
    method:"get"
  },
  getAllRoom:{  //获取所有房间列表  room/all/list
    path: "room/all/list",
    method: "get",
  },
  workshopsChatRoom:{  //工作坊聊天信息列表 workshopsChatRoom/messageList/{workshopsId}
    path: "workshopsChatRoom/messageList/",
    method: "get",
  },
  sendChatRoom:{  //工作坊聊天信息列表 workshopsChatRoom/sending/message/{workshopsId}
    path: " workshopsChatRoom/sending/message/",
    method: "post",
  },
}
export default api;
