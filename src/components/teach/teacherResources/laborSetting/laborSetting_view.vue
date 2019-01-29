<template>

  <div class="addLabor">
    <el-table
      align="center"
      border
      :data="tableData"
      tooltip-effect="dark"
      highlight-current-row
      style="width: 100%;height: 100%"
      >
      <el-table-column
        align="center"
        prop="teachLevel"
        label="职称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="type"
        label="课程类型"
        width="120">
      </el-table-column>
      <el-table-column
        label="优"
        align="center"
      >
        <el-table-column
          prop="excellent"
          label="评分"
          align="center"
        >
          <template scope="scope">
            {{scope.row.excellent}}-100
          </template>
        </el-table-column>
        <el-table-column
          prop="excellentFee"
          label="课时费"
          width="95"
          align="center"
        >
          <template scope="scope">
            {{scope.row.excellentFee | money}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        prop="type"
        label="良"
        width="120"
      >
        <el-table-column
          prop="good"
          label="评分"
          align="center"
        >
          <template scope="scope">
            {{scope.row.good}}-{{scope.row.excellent}}
          </template>
        </el-table-column>
        <el-table-column
          prop="goodFee"
          label="课时费"
          width="95"
          align="center"
        >
          <template scope="scope">
            {{scope.row.goodFee | money}}
          </template>
        </el-table-column>

      </el-table-column>
      <el-table-column
        prop="avg"
        label="中"
        width="120"
      >
        <el-table-column
          prop="avg"
          label="评分"
          align="center"
        >
          <template scope="scope">
            {{scope.row.avg}}-{{scope.row.good}}
          </template>
        </el-table-column>
        <el-table-column
          prop="avgFee"
          label="课时费"
          width="95"
          align="center"
        >
          <template scope="scope">
            {{scope.row.avgFee | money}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="差"
        width="120"
      >
        <el-table-column
          prop="bad"
          label="评分"
          align="center"
        >
          <template scope="scope">
            {{scope.row.bad}}-{{scope.row.avg}}
          </template>
        </el-table-column>
        <el-table-column
          prop="badFee"
          label="课时费"
          width="95"
          align="center"
        >
          <template scope="scope">
            {{scope.row.badFee | money}}
          </template>
        </el-table-column>
      </el-table-column>

    </el-table>
    <br />
    <el-row >
      <el-col :span="24" style="text-align: center;">
        <div style="margin-left: 100px">
          <el-button  @click="cancel">关闭</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<style>
  .addLabor .el-form-item{margin-bottom: 0}
</style>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        tableData: [
          {
            "id":8,
            "teachLevel":"正高",
            "type":"理论课",
            "excellent":90,
            "good":80,
            "avg":60,
            "bad":0,
            "excellentFee":100,
            "goodFee":80,
            "avgFee":70,
            "badFee":60,
            "maxMark":100,
          },
          {
            "id":2,
            "teachLevel":"正中",
            "type":"见习课",
            "excellent":90,
            "good":80,
            "avg":60,
            "bad":20,
            "excellentFee":100,
            "goodFee":80,
            "avgFee":70,
            "badFee":0,
            "maxMark":100,
          }
        ],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.serviceFeeGet+this.operailityData.id,
            params:{}
          }
        }
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

        let data = responseData.data;
        this.tableData = data;
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
      },
    }
  }
</script>
