<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <el-row>
    <el-form labelWidth="100px">
      <el-col>
        <h3 class="skillTrainTitle">培训名称：{{ showData.trainingName }}</h3>
      </el-col>
      <el-col :offset="2" :span="10">
        <el-form-item label="负责人：">{{ showData.user }}</el-form-item>
      </el-col>
      <el-col :offset="2" :span="10">
        <el-form-item label="手机号：">{{ showData.phone }}</el-form-item>
      </el-col>
      <el-col :offset="2" :span="10">
        <el-form-item label="开始日期：">{{ showData.startTime | formatDate('yyyy-MM-dd') }}</el-form-item>
      </el-col>
      <el-col :offset="2" :span="10">
        <el-form-item label="总时长：">{{ showData.timeLong }}</el-form-item>
      </el-col>
    </el-form>
    <el-table align="center" :maxHeight="400" :context="self" :data="showData.detailList" tooltip-effect="dark">
      <el-table-column label="培训日期" prop="date" show-overflow-tooltip width="120">
        <template scope="scope">
          {{ (scope.row.date || '-') | formatDate('yyyy-MM-dd') }}
        </template>
      </el-table-column>
      <el-table-column label="培训时间" show-overflow-tooltip width="160">
        <template scope="scope">
          {{ [scope.row.startTime,scope.row.endTime].join('-') }}
        </template>
      </el-table-column>
      <el-table-column label="学科" prop="subject" show-overflow-tooltip></el-table-column>
      <el-table-column label="培训项目" prop="content" show-overflow-tooltip></el-table-column>
      <el-table-column label="课时" prop="timeLong" show-overflow-tooltip width="70"></el-table-column>
      <el-table-column label="培训老师" prop="teachers" show-overflow-tooltip></el-table-column>
      <el-table-column label="房间号" prop="roomNum" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column label="培训对象" prop="trainingObject" show-overflow-tooltip></el-table-column>
      <el-table-column label="参加人数" prop="numberOfPeople" show-overflow-tooltip width="100"></el-table-column>
    </el-table>
  </el-row>
</template>
<style>
  .skillTrainTitle {
    text-align: center;
    line-height: 40px;
    margin-bottom: 20px;
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {
        self: this,
        showData: {
          'trainingName': '',
          'user': '',
          'phone': '',
          'startTime': '',
          'timeLong': '',
          'detailList': []
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.getDataForServer();
      },
// 获取数据
      getDataForServer () {
        this.ajax({
          ajaxSuccess: res => {
            this.showData = res.data;
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        });
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
