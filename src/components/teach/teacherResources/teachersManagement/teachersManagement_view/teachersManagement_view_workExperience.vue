<!--档案管理查看-->
<!--工作经历-->
<template>

  <div >
    <!--标题-->
    <el-row >
      <el-col :span="10" :offset="10" class="lose-margin2">
        <span class="table-headline ">学历信息</span>
      </el-col >
    </el-row >
    <!--内容-->
    <el-row>
      <el-col :span="20" :offset="2">
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
             {{startDate}}~{{endDate}}
            </template>
          </el-table-column>
          <el-table-column
            prop="companyName"
            label="单位名称">
          </el-table-column>
          <el-table-column
            prop="specialty"
            label="从事专业"
          >
          </el-table-column>
          <el-table-column
            prop="dutyDate"
            label="技术职务受聘时间">
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
        //医师资格级别
        options: [{
          value: '0',
          label: '职业'
        }, {
          value: '1',
          label: '助理'
        }, {
          value: '2',
          label: '无'
        }],

        courses: [{
          type: '',
          bizDict: ''
        }],
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        countDate:0,
        //表格数据
        tableData:[],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          paramsData:'/archives/get/basic/',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'archives/list/work/'+this.dataId
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


