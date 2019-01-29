<!--档案管理查看-->
<!--学习培训情况-->


<template>

  <div >
    <!--标题-->
    <el-row >
      <el-col :span="24" class="lose-margin2" style="text-align: center">
        <span class="table-headline ">学习培训情况</span>
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
            label="起止时间">
            <template scope="scope">
              {{scope.row.startDate}}~{{scope.row.endDate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="studyType"
            label="学习方式">
          </el-table-column>
          <el-table-column
            prop="studyContent"
            label="学习内容"
          >
          </el-table-column>
          <el-table-column
            prop="sponsor"
            label="主办（进修）单位">
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
            url:'/archives/list/train/'+this.dataId
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
        let data = responseData.data;
        data = this.formDate(data,['startDate','endDate'],this.yearMonth);
        this.tableData = data;
      },



    }
  }
</script>


