<!--
****--@name   出科会议填写
****--@role     未知
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row class="editForm">
      <!-- 表单 -->
      <el-form label-width="130px">
        <el-col :span="12">
          <el-form-item label="会议名称：" prop="name">
            {{ formValidate.name }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请单位：" prop="hosdeptName">
            {{ formValidate.hosdeptName }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="参加人员：" prop="participantName" class="mrwUserBox">
            <el-tag type="gray" v-for="(item,index) in users" :key="index">{{ item.label }}</el-tag>
          </el-form-item>
        </el-col>
          <el-col :span="12" name="start">
            <el-form-item label="会议开始时间：" prop="startTime">
              {{ formValidate.startTime }}
            </el-form-item>
          </el-col>

          <el-col :span="12" name="end">
            <el-form-item label="会议结束时间：" prop="endTime">
              {{ formValidate.endTime }}
            </el-form-item>
          </el-col>
        </date-group>
        <el-col :span="12">
          <el-form-item label="会议地点：" prop="address">
            {{ formValidate.address }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="劳务费：" prop="conferenceFee">
            {{ formValidate.conferenceFee }}元
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="会议内容：" prop="content">
            {{ formValidate.content || '-' }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注：" prop="remark">
            {{ formValidate.remark || '-' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请人：" prop="applicantName">
            {{ formValidate.applicantName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时间：" prop="applicantTime">
            {{ formValidate.applicantTime }}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['operailityData'],
    data() {
      return {
        users: [],
        // 表单数据
        formValidate: {
          id: '',
          name: '', // 会议名称
          hosdeptId: '', // 申请单位ID
          hosdeptName: '', // 申请单位名称
          participantId: '', // 参加人员ID（多个，隔开）
          participantName: '', // 参加人员名称（多个，隔开）
          startTime: '', // 会议开始时间
          endTime: '', // 会议结束时间
          address: '', // 会议地点
          conferenceFee: '', // 劳务费
          content: '', // 会议内容
          remark: '', // 备注
          applicantName: '', // 申请人
          applicantTime: '', // 申请时间
          status: '', // 状态 NOT_SUBMIT未上报（保存草稿）| NOT_AUDIT未审核（上报审核）
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getEditData()
      },
      // 获取编辑数据
      getEditData(){
        let opt = {
          ajaxSuccess: "getEditDataSuccess",
          ajaxParams:{
            url: api.get.path + this.operailityData.id,
            method:api.get.method
          }
        };
        this.ajax(opt)
      },
      // 初始化编辑数据
      getEditDataSuccess(res){
        if(!res.data || !res.data.id){
          return
        }

        for(let key in this.formValidate){
          if(res.data[key]){
            this.formValidate[key] = res.data[key]
          }
        }

        let userIds = res.data.participantId && res.data.participantId.split(',') || [];
        let userNames = res.data.participantName && res.data.participantName.split(',') || [];

        for(let i=0,l=userIds.length;i<l;i++){
          this.users.push({
            key:userIds[i],
            label:userNames[i],
            disabled: false,
          })
        }
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
    }
  }

</script>
<style lang="scss">
  .mrwUserBox {
  .el-tag {
    margin-right: 10px;
  }
  }
</style>
