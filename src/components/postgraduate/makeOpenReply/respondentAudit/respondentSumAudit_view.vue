<!----------------------------------
****--查看(respondentSumAudit_view)
****--@date     2017/9/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-form ref="formValidate" :model="formValidate"  class="demo-form-inline" label-width="100px">
      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="申请人:">
            {{formValidate.userName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="答辩时间:" prop="defenseTime">
            {{formValidate.defenseTime}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label=" 答辩地点:" prop="defensePlace">
            {{formValidate.defensePlace}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
        formValidate:{},
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:api.defenseAppAuditGet.path+this.operailityData.id,
            params:{}
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.listMessTitle)
      },

      //通过get请求列表数据
      updateListData(responseData){
        if(!responseData.data)return;
        this.formValidate = responseData.data;
      },
    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
