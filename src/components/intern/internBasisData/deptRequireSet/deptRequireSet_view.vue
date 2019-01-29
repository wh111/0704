<!---科室要求设置-查看--->
<template>
  <div>
    <el-row>
      <el-col :span="20">
        <div class="cal-schoolTit">病种名称：{{formValidate.name}}&nbsp;&nbsp;<!--&nbsp;&nbsp;专业：{{formValidate.specialty}}--></div>
      </el-col>
    </el-row>
    <br />
    <el-table
      ref="multipleTable"
      align="center"
      :data="formValidate.outlineRequires"
      :height="500"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        prop="depName"
        label="科室"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="disType"
        label="类别"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="disTitle"
        label="名称"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="disNum"
        label="要求例数"
        align="center"
        width="100">
      </el-table-column>
      <el-table-column
        prop="deMasterDegree"
        label="掌握程度"
        align="center">
      </el-table-column>
    </el-table>
    <br />
    <el-row>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
      <el-col :span="8" class="textCenter"><el-button  @click="cancel">关闭</el-button></el-col>
      <el-col :span="8" class="textCenter">&nbsp;</el-col>
    </el-row>
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
        //数据查询
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.depReGet.path+"/"+this.operailityData.depOutlineId,
          }
        },

        //表单数据bind
        formValidate:{
          "depOutlineId":"",
          "name":"",
          "specialty":"",
          "outlineRequires":[]
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        Util = this.$util;
        this.ajax(this.listMessTitle)
      },

      /**
       * 添加
       * */
      add(){
        //addRow模板
        let rowTemplate={
          "outlineRequireId":"",
          "depId":"",
          "depName":"",
          "disType":"",
          "disTitle":"",
          "disNum":""
        }
        this.formValidate["outlineRequires"].push(rowTemplate)
      },



      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        this.formValidate = {};
        this.formValidate= data;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
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

