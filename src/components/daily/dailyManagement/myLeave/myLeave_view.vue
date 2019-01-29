<template>

  <div class="leaveManagement-show" >
    <div >
    <el-row >
      <el-col :span="9" :offset="2">
        <p class="center"><span class="name">姓名</span><span>{{data.userName}}</span></p>
      </el-col >

      <el-col :span="9">
        <p class="center"><span class="name">科室</span><span>{{data.depName}}</span></p>

      </el-col >
    </el-row >
    <el-row >
      <el-col :span="18" :offset="2">
        <p class="center"><span class="name">请假事由</span><span>{{converterLeaveType(data.leaveType)}}</span></p>
      </el-col >
    </el-row >

    <el-row >
      <el-col :span="18" :offset="2">
        <p class="center">
          <span class="name">请假时间</span>
          <span style="padding-right: 25px" >{{data.beginDate}}到{{data.endDate}}</span>
          共<span class="border">{{data.timeLength}}</span>天
        </p>
      </el-col >
    </el-row >
    <el-row >
      <el-col :span="18" :offset="2">
        <div class="center">
          <span class="shiy-text">事由说明</span>
          <div class="shiy">{{data.explains}}</div>
        </div>
      </el-col >
    </el-row >
    </div>

  <div v-if="data.status!='WSB'">
    <el-row >
      <el-col :span="18" :offset="2" style="margin: 10px 0">
        <img :src="data.hisProcess&&data.hisProcess.base64Img" alt="" style="max-width:100%">
      </el-col >
    </el-row >
    <el-table
      v-if="data.hisProcess && data.hisProcess.listHisTaskLog!=0"
      align="center"
      :height="200"
      :data="data.hisProcess.listHisTaskLog"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="100">
      </el-table-column>
      <el-table-column
        align="center"
        prop="spUserName"
        label="审核人"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="审核时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="mess"
        label="审核意见"
        align="center"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="审核状态"
      >
        <template scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
    </el-table>
  </div>


  </div>
</template>
  <script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{

        "data": {
          hisProcess:{listHisTaskLog:[]},
          }
        ,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'leave/get/'+this.operailityData.id,
          }
        },
//        //当前组件默认请求(Task)数据时,ajax处理的 基础信息设置(已办理事项）
//        taskMessTitle:{
//          ajaxSuccess:'SuccessGetTask',
//          ajaxParams:{
//            url:'workflow/gethistoryTask/'+this.operailityData.id,
//          }
//        },

      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){

        this.data =this.getFormData(this.data,responseData.data)
      },


      SuccessGetTask(responseData){

        this.data.tasks = responseData.data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
//        this.ajax(this.taskMessTitle);
      },

  //转换
      converterLeaveType(leaveType){
        switch (leaveType){
          case 'SHI' : leaveType = '事假';
              break;
          case 'BING' : leaveType = '病假';
              break;
          case 'SANG' : leaveType = '丧假';
              break;
          case 'CHAN' : leaveType = '产假';
              break;
          case 'TAN' : leaveType = '探亲假';
              break;
          case 'HUN' : leaveType = '婚假';
              break;
          case 'OTHER' : leaveType = '其他';
              break;

        }
        return leaveType
      },
//转换请假条状态
      converterStatus(status){
        switch (status){
          case 'WSB' : status = '未上报';
            break;
          case 'DSH' : status = '审核中(待审)';
            break;
          case 'TG' : status = '通过';
            break;
          case 'BTG' : status = '不通过';
            break;
          case 'BH' : status = '驳回修改';
            break;
        }
        return status
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data,data1){
         let  arr =  Array.prototype.slice.call(arguments).reverse()
        let myData = Util._.defaultsDeep.apply(null,arr);
        return myData;
      },
    }
  }
</script>
