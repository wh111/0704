let thisFile = '/mutual/open/choice';
const api = {
  choiceList:{  //开放导师列表
    path:'/mutual/open/choice/list',
    method:'get'
  },
  release:{  //开放导师发布
    path:'/mutual/open/choice/release/',
    method:'put'
  },
  removes:thisFile + '/removes', // 删除
  choiceGet:{  //查看开放导师
    path:'/mutual/open/choice/get/',
    method:'get'
  },
  modify:{   //修改开放导师
    path:'/mutual/open/choice/modify/',
    method:'put'
  },
  add:{    //新增开放导师
    path:'/mutual/open/choice/add',
    method:'post'
  },

}
export default api
