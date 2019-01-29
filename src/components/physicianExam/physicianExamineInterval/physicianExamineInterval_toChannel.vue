<!--
****--@file     physicianExamineInterval_toChannel
****--@date     2018/5/24 8:58
****--@author   YC
****--@describe 导入
-->
<template>
  <div>
    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="arrow-down-a"/>
      </el-col>
      <el-col :span="16">
        <p>填写事务表格</p>
        <br>
        <a :href="http">
          <el-button size="mini" type="primary">下载模板<i class="ivu-icon ivu-icon-arrow-down-a"></i></el-button>
        </a>
      </el-col>
    </el-row>
    <el-row class="but-space">
      <el-col :span="3" :offset="2">
        <Icon style="font-size: 50px" type="upload"/>
      </el-col>
      <el-col :span="16">
        <p>上传填好的事务列表 ( 仅支持.xls/.xlsx格式)</p>
        <br>
        <xlsx @on-select-file="handleSelectedFile" :row="2">上传</xlsx>
      </el-col>
    </el-row>
    <el-row class="but-space">
      <el-col :span="18" :offset="5">
        <p>本次已导入记录数 : {{totalNumber}}条</p>
      </el-col>
    </el-row>

    <el-row class="but-space">
      <el-col align="center">
        <el-button type="success" @click="success">完成</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineIntervalToChannel',
    data () {
      return {
        http: '',
        //记录总条数
        totalNumber: 0,
        convertedData: null
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        //初始化
        let http = this.$store.getters.getEnvPath.http;
        this.http = http + 'static/template/国家医师考试导入模板.xls';
      },
      // 上传Excel
      handleSelectedFile (convertedData) {
        if (convertedData.body == 0) {
          this.errorMess('导入数据为空，请重新选择数据');
          return;
        }
        this.convertedData = convertedData
        this.totalNumber = convertedData.body.length
      },
      // 取消
      cancel () {
        this.$emit('cancel', 'toChannel')
      },
      success () {
        this.$emit('toChannel', this.convertedData)
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
