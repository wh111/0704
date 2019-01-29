<!----------------------------------
****--按组轮转排班预览 (rotaryTableView)
****--@date     2017/7/11
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div v-if="tableData1.length>0">
    <el-table
      :data="tableData1"
      border
      style="width: 100%"
      :height="height">
      <el-table-column
        v-for="(item,idx) in tableData.thead"
        :key="idx"
        :fixed="idx<3?true:false"
        :prop="item.prop"
        :label="item.label"
        :width="idx<3?wdt[idx]:otherWdt">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["tableData"],
    data() {
      return {
        wdt:[120,120,120],
        otherWdt:120,
        dynamicWt:1000,
        height:480,
        tableData1:[],
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.tableData1 = this.tableData["tbody"];
        if(this.tableData1.length*this.otherWdt<this.dynamicWt){
          this.otherWdt='';
        }
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
