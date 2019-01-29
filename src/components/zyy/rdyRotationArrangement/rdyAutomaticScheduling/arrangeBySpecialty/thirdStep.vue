<!----------------------------------
****--选择培训标准(thirdStep)
****--@date     2017/7/23
****--@author   zyc<332533011@qq.com
---------------------------------->
<template>
  <el-radio-group v-model="radio" style="width: 100%;">
    <el-table
      stripe
      :data="tableData1"
      height="480"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        label=""
        width="50">
        <template scope="scope">
          <el-radio class="radio" :label="scope.row.rtName+'##'+scope.row.rtId">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="jdName"
        v-if="userType=='YJS'"
        label="学校">
      </el-table-column>
      <el-table-column
        prop="jdName"
        v-if="userType!='YJS'"
        label="基地名">
      </el-table-column>
      <el-table-column
        prop="rtName"
        label="培训标准名称">
      </el-table-column>
      <el-table-column
        prop="rtProclass"
        label="培训方向"
        width="180">
      </el-table-column>
      <el-table-column
        prop="rtSchlength"
        label="学历"
        width="180">
      </el-table-column>
    </el-table>
  </el-radio-group>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["initRtId","jdProclass","userType"],
    data() {
      return {
        radio:this.initRtId,
        tableData1: [
            /*{
          "rtId":"3",
          "rtName":"细则名称",
          "rtProclass":"内科方向",
          "rtSchlength":"本科",
          "rtType":"指标类型",
          "rtrulesType":"西医/中医",
          "jdName":"基地名"
        }*/
        ],

        //初始化获取基地信息
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.getRulesList.path,
            params:{
              rtProclass:this.jdProclass,
              rtModelType:this.userType,
            }
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.listMessTitle);
      },
      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.tableData1=[];
        this.tableData1= data;
      },
    },
    watch:{
      radio(val){
        this.$emit("setThirdVal",val);
      }
    },
    created(){
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
