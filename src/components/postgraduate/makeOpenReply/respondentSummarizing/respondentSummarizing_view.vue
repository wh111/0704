<!----------------------------------
****--查看答辩汇总(respondentSummarizing_view)
****--@date     2017/9/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
<div>
    <el-form ref="formValidate" :model="formValidate"   class="demo-form-inline" label-width="100px">
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

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label="答辩人员:" prop="summaryUserList">
            <div class="itemLayout" style="width: 100%">
              <fieldset>
                <legend style="font-size:16px"> 人员信息 </legend>
                <el-tag v-for="(item,index) in formValidate.summaryUserList" :key="index" type="success">{{item.userName}}</el-tag>
              </fieldset>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="22" :offset="1">
          <el-form-item label=" 状态:" prop="defensePlace">
            {{formValidate.status | typeText}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="formValidate.status=='TG'||formValidate.status=='BH'">
        <el-col :span="8" :offset="1">
          <el-form-item label=" 审核人:" prop="defensePlace">
            {{formValidate.auditName }}
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="1">
          <el-form-item label=" 审核时间:" prop="defensePlace">
            {{formValidate.auditTime }}
          </el-form-item>
        </el-col>

        <el-col :span="22" :offset="1">
          <el-form-item label=" 审核意见:" prop="defensePlace">
            {{formValidate.auditOpinion }}

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
        paramsData:'listUrl',
        ajaxSuccess:'updateListData',
        ajaxParams:{
          url:api.defenseSummaryGet.path+this.operailityData.id,
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
