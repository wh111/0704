<!----------------------------------
****--科目管理-查看(emStudySubjects_add)
****--@date     2017/9/18
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="100px" >

      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="进修科目名：">
            {{formValidate.courseName}}
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="主办单位：">
            {{formValidate.organizer}}
          </el-form-item>
        </el-col>

        <el-col :span="9" >
          <el-form-item label="招收人数：">
            {{formValidate.enrolmentNumbers}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="学习期限：">
            {{formValidate.learningPeriod}}
          </el-form-item>
        </el-col>

        <el-col :span="9" >
          <el-form-item label="开学时间：">
            {{formValidate.schoolTime}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="招生条件：">
            {{formValidate.conditionsEnrolment}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="进修安排：">
            {{formValidate.furtherArrangement}}
          </el-form-item>
        </el-col>
      </el-row >

      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="科室名称：">
            <el-tag style="margin-left: 8px;" v-for="(item,index) in formValidate.depNames" :key="index" type="success">{{item.depName}}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="备注：">
            {{formValidate.note}}
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>
    <br />
    <el-row>
      <el-col style="text-align: center;" :span="24">
        <el-button  @click="cancel">关闭</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "./api.js";
  import addDep from "./selectDep.vue";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:["operailityData"],
    data() {
      return {

        //form表单bind数据
        formValidate: {
          courseName:"",
          organizer:"",
          enrolmentNumbers:"",
          learningPeriod:"",
          schoolTime:"",
          conditionsEnrolment:"",
          furtherArrangement:"",
          depIds:"",
          depNames:[],
          note:"",
          state:"",  //Y 启用 N 禁用
          subDeps:[
            /*{
             depId:111,
             depName:"科室名称"
             }*/
          ],
        },

        //获取当前基地的详细信息
        getListDetail:{
          ajaxSuccess:"SuccessGetCurrData",
          ajaxParams:{
            url: api.subGet.path+this.operailityData.managementId,
          }
        },
      }
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.getListDetail);

      },

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        if(!Util.isEmptyObject(data)){
          this.formValidate = Object.assign(this.formValidate,data);
          this.formValidate["depNames"] = data["subDeps"];
        }
      },

      cancel(){
        this.$emit("cancel","show")
      },

    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {
      addDep
    }
  }
</script>
