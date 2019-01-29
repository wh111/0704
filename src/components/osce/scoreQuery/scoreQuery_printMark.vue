<!--
****--@file     scoreQuery_printMark
****--@date     2018/5/22 11:10
****--@author   YC
****--@describe 打印成绩
-->
<template>
  <el-table border align="center" :context="self" :data="showData.userList" tooltip-effect="dark" class="tableShowMoreInfo"
            style="width: 100%;">
    <el-table-column label="考生姓名" prop="userName" show-overflow-tooltip min-width="100px"></el-table-column>
    <!--<el-table-column label="部门" prop="sceneId" show-overflow-tooltip></el-table-column>-->
    <el-table-column label="考生编号" prop="userNum" show-overflow-tooltip min-width="100px"></el-table-column>
    <el-table-column label="性别" prop="sex" show-overflow-tooltip min-width="80px">
      <template scope="scope">
        {{ scope.row.sex | typeText }}
      </template>
    </el-table-column>
    <el-table-column label="考官评分" prop="userNum" show-overflow-tooltip align="center">
      <el-table-column v-for="(item,index) in stationHeader" :key="index" :label="item.stationName+'('+item.stationWeight+')'"
                       show-overflow-tooltip min-width="120px">
        <template scope="scope">
          {{ scope.row.stationList.scoreList[index].examStatus == 'MISS' ? '缺考' : scope.row.stationList.scoreList[index].totalMark }}
        </template>
      </el-table-column>
      <el-table-column label="合计" show-overflow-tooltip min-width="80px" align="center">
        <template scope="scope">
          <el-col align="left">
            {{ showData.stationSize ? scope.row.stationList.staionSum : 0 }}
          </el-col>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="SP评分" prop="userNum" show-overflow-tooltip align="center">
      <el-table-column v-for="(item,index) in stationSpHeader" :key="index" :label="item.stationName+'('+item.stationWeight+')'"
                       show-overflow-tooltip min-width="120px">
        <template scope="scope">
          {{ scope.row.spStationList.scoreList[index].examStatus == 'MISS' ? '缺考' : scope.row.spStationList.scoreList[index].totalMark }}
        </template>
      </el-table-column>
      <el-table-column label="合计" show-overflow-tooltip min-width="80px" align="center">
        <template scope="scope">
          <el-col align="left">
            {{ showData.stationSpSize ? scope.row.spStationList.staionSum : 0 }}
          </el-col>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="成绩汇总" prop="sumMark" show-overflow-tooltip min-width="100px"></el-table-column>
    <el-table-column label="排名" show-overflow-tooltip min-width="70px">
      <template scope="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'scoreQueryPrintMark',
    props: ['showData', 'stationHeader', 'stationSpHeader'],
    data () {
      return {
        self: this
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
    components: {}
  }

</script>
