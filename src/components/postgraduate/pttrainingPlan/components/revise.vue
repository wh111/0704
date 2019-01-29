<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="queryAudit" class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="姓名:" prop="name" >
            {{getData.name}}
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="学号:" prop="studentCode">
           {{getData.studentCode}}
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="2">
          <el-form-item label="专业方向:" prop="major">
          {{getData.major}}
          </el-form-item>
        </el-col >
        <el-col :span="8" :offset="2">
          <el-form-item label="指导老师:" prop="teacher" >
          {{getData.teacher}}
          </el-form-item>
        </el-col>


        <el-col :span="8" :offset="2">
          <el-form-item label="所在学院:" prop="school">
            {{getData.school}}
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="2">
          <el-form-item label="研究方向:" prop="direction">
           {{getData.direction}}
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="2">
          <el-form-item label="学习年限:" prop="life">
          {{getData.life}}
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="2">
          <el-form-item label="入学日期:" prop="admissionDate">
           {{getData.admissionDate}}
          </el-form-item>
        </el-col >


        <el-col :span="16" :offset="2" prop="fileIds">
          <el-form-item label="相关证明资料:" prop="fileIds">
            <div v-for="(item,index) in getData.fileList" :key="index">{{item.oldName}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="16" :offset="2">
          <el-form-item label="审核结果" prop="resource">
            <el-radio-group v-model="formValidate.status">
              <el-radio label="ADOPT">通过</el-radio>
              <el-radio label="NOTPASS">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="16" :offset="2">
          <el-form-item label="审核意见" prop="opinion">
            <el-input v-model="formValidate.opinion" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <div style="text-align: center">
          <el-button  @click="resave">保存</el-button>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-row >
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../api'
  //当前组件引入验证规则
  import {queryAudit} from '../rules'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        getData:{},
        formValidate: {
          status:'ADOPT',
          opinion:'',
          ids:this.operailityData.id
        },
        queryAudit,
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.ajax({
          ajaxParams: {
            url: api.getPlan.path + this.operailityData.id,
            method: api.getPlan.method,
          },
          ajaxSuccess: res => {
            this.getData = res.data;
          }
        })
//              console.log(this.formValidate)
      },
      resave (){
        let that = this;
        this.ajax({
          ajaxParams: {
            url: api.examinePlan.path ,
            method: api.examinePlan.method,
            data:this.formValidate
          },
          ajaxSuccess: res => {
            if(res.status.code == 0){
              that.$message({
                type: 'info',
                message: '操作成功'
              });
              this.$emit('edit','edit');
            }
          }
        })
      },
      cancel (){
        this.$emit('cancel','edit');
      }

    },
    created() {
      this.init();
    },
    mounted () {

    },
    components: {}

  }
</script>
