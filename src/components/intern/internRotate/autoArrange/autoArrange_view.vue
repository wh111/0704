<!--- 自动排班-查看轮转 --->
<template>
  <div id="content"  ref="content"  class="modal">
    <div
      id="myTable"
      ref="myTable"
    >
        <el-table
          align="center"
          :height="dynamicHt"
          :context="self"
          :data="tableData1"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="depName"
            label="科室">
          </el-table-column>
          <el-table-column
            prop="beginTime"
            label="入科时间"
            width="150">
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="出科时间"
            width="150">
          </el-table-column>
          <el-table-column
            prop="ts"
            label="周期"
            width="100">
            <template scope="scope">
              {{scope.row.ts}}周
            </template>
          </el-table-column>
        </el-table>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {
        dynamicHt: 500,
        self: this,
        tableData1: [],
        loading:false,
        listTotal:0,
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.userRotaryByUserId.path+"/"+"SXS-"+this.operailityData.userId,
            params:{}
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        this.setTableData();
      },


      //设置表格及分页的位置
      setTableDynHeight(){
        let content = this.$refs.content;
        let parHt = content.parentNode.offsetHeight;
        let myTable = this.$refs.myTable;
        let paginationHt = 50;
        this.dynamicHt = parHt - myTable.offsetTop - paginationHt;
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        this.tableData1=data;
      },
      setTableData(){
        this.ajax(this.listMessTitle);
      },
    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
