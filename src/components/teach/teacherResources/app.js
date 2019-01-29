/**
 * Created by Administrator on 2017/5/25.
 */

/*
* 劳务费配置
* */


export default {
  //修改劳务费（基础教务管理-师资库-劳务费配置-修改）PUT
  serviceFeeModify:'/service-fee/modify/' , //{id}


  //添加劳务费（基础教务管理-师资库-劳务费配置-添加）GET
  serviceFeeAdd:'/service-fee/add'  ,


  //根据ID删除劳务费（基础教务管理-师资库-劳务费配置-删除）DELETE
  serviceFeeRmove:'/service-fee/remove' , //{idS}


  //根据ID获取劳务费（基础教务管理-师资库-劳务费配置-根据ID获取）get
  serviceFeeGet:'/service-fee/get/' , //{id}


  //根据ID删除劳务费（基础教务管理-师资库-劳务费配置-删除）get
  serviceFeeList:'/service-fee/list',


}
