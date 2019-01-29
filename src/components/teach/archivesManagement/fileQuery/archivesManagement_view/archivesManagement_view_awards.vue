<!--档案管理查看-->
<!--获奖情况-->



<template>

  <div >
    <!--标题-->
    <el-row >
      <el-col :span="24" class="lose-margin2" style="text-align: center">
        <span class="table-headline ">获奖情况</span>
      </el-col >
    </el-row >
    <!--内容-->
    <el-row>
      <el-col :span="24">
        <el-table
          align="center"
          :data="tableData"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            prop="date"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="level"
            label="级别">
          </el-table-column>
          <el-table-column
            prop="member"
            label="参与人员">
          </el-table-column>
          <el-table-column
            prop="company"
            label="颁奖单位">
          </el-table-column>
          <el-table-column
            prop="remark"
            label="相关证明材料">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['dataId'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //表格数据
        tableData:[],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/archives/list/prize/'+this.dataId
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
    },
    mounted(){

    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.initMessTitle);
      },

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let type = [];
        let data = responseData.data;
        this.tableData = data;
      },



    }
  }
</script>



