/**
 * Created by Administrator on 2017/5/22.
 */
const api = {
  //查询评论列表（教学视频、文档文献、典型病例、医学图谱）
  commentListPage:{
    path: "/comment/listPage",
    method: "get",
  },
  commentAdd:{  //添加评论（可用来评论 教学视频、文档文献、典型病例、医学图谱）
    path: "/comment/add",
    method: "post",
  },
  commentRemove:{ //删除评论（教学视频、文档文献、典型病例、医学图谱）  /remove/{ids}
    path: "/comment/remove",
    method: "delete",
  }
}

export default api
