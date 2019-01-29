<!--
****--@file     ab_table_gk
****--@date     2018/5/23 11:50
****--@author   YC
****--@describe 国考定制表格
-->
<template>
  <el-table border :data="tableDatas" :height="tableHeightNum" style="width: 100%">
    <el-table-column label="组别　　(7人/组)" prop="groupName" width="100px"></el-table-column>
    <el-table-column label="总候考" align="center">
      <el-table-column label="房间" prop="roomNum1" width="90px">
        <template scope="scope">
          {{ scope.row.roomNum1.replace(/,/g,'、') }}
        </template>
      </el-table-column>
      <el-table-column label="语音播报时间" prop="waitTime1" min-width="130px"></el-table-column>
    </el-table-column>

    <el-table-column label="3楼-1、3考站（41min）" align="center">
      <el-table-column label="候考" align="center">
        <el-table-column label="候考房间" prop="roomNum2" min-width="100px">
          <template scope="scope">
            {{ scope.row.roomNum2.replace(/,/g,'、') }}
          </template>
        </el-table-column>
        <el-table-column label="候考播报时间" prop="waitTime2" min-width="130px"></el-table-column>
      </el-table-column>
      <el-table-column label="考试房间" prop="roomNum3" min-width="100px"></el-table-column>
      <el-table-column label="1、3考站" align="center">
        <el-table-column label="开始时间" prop="startTime3" min-width="100px"></el-table-column>
        <el-table-column label="结束时间" prop="endTime3" min-width="100px"></el-table-column>
      </el-table-column>
    </el-table-column>

    <el-table-column label="5楼-2考站" align="center">
      <el-table-column label="候考" align="center">
        <el-table-column label="候考房间" prop="roomNum4" min-width="100px">
          <template scope="scope">
            {{ scope.row.roomNum4.replace(/,/g,'、') }}
          </template>
        </el-table-column>
        <el-table-column label="候考播报时间" prop="waitTime4" min-width="130px"></el-table-column>
      </el-table-column>
      <el-table-column label="2考站-技能（11min）" align="center">
        <el-table-column label="考试房间" prop="roomNum5" min-width="100px">
          <template scope="scope">
            {{ scope.row.roomNum5.replace(/,/g,'、') }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime5" min-width="100px"></el-table-column>
        <el-table-column label="结束时间" prop="endTime5" min-width="100px"></el-table-column>
      </el-table-column>
      <el-table-column label="2考站-体格检查（13min）" align="center">
        <el-table-column label="考试房间" prop="roomNum6" min-width="100px">
          <template scope="scope">
            {{ scope.row.roomNum6.replace(/,/g,'、') }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime6" min-width="100px"></el-table-column>
        <el-table-column label="结束时间" prop="endTime6" min-width="100px"></el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'abTableGk',
    props: ['tableData', 'tableHeight'],
    data () {
      return {
        tableHeightNum: this.tableHeight || 100,
        tableDatas: this.tableData || []
      }
    },
    methods: {
      //初始化请求列表数据
      init () {

      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    watch: {
      tableHeight () {
        this.tableHeightNum = this.tableHeight
      },
      tableData () {
        this.tableDatas = this.tableData
      }
    },
    components: {}
  }

</script>
