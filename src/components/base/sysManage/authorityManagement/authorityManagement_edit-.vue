<template>

  <div >
    <el-form ref="formValidate" :rules="ruleValidate"   class="demo-form-inline" label-width="80px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="角色名称" prop="name" >
            <el-input  placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="8">
          <el-form-item label="英文名称"   prop="school">
            <el-select v-model="formValidate.status" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="角色类型" prop="name" >
            <el-radio-group v-model="radio2">
              <el-radio :label="1">权限角色</el-radio>
              <el-radio :label="2">审核角色</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        </el-col >
      </el-row >

      <el-col :span="16" :offset="2">
        <el-form-item label="角色描述" prop="name" >
          <el-input type="textarea"  resize="none" :rows="8"></el-input>
        </el-form-item>
      </el-col>
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="9" :offset="10">
        <el-button type="primary" @click="confirm" >保存</el-button>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  export default {
    props: ['editData'],
    data (){
      return{

        countDate:0,
        options:[{
          value: '0',
          label: '待审核'
        }, {
          value: '1',
          label: '审核通过'
        }, {
          value: '2',
          label: '未审核'
        }],
        radio2:2,
        formValidate: {
          status:'',

        },
        formValidate1:{
          id:'',
          depId:'',
          applicantId:'',
          leaveType:'',



        },
        starTimes:'',
        endTimes:'',
        pickerOptions0: {
          //选择开始时间后设置结束日期的限制
          disabledDate:(time)=> {
            if(this.endTimes!="") {
              return time.getTime() >= this.endTimes;
            }
          }
        },
        pickerOptions1: {
          //选择结束时间后设置开始日期的限制
          disabledDate:(time)=> {
            if(this.starTimes!="") {
              return time.getTime() <= this.starTimes;
            }
          }
        },
        value1:'',
        value2:'',
        ruleValidate:{}

      }
    },
    methods:{
      //时间
      deformatterDate(d){
        return new Date(d).getTime()-1000*60*60*24;
      },
      handleStartTime(d){
        this.starTimes = this.deformatterDate(d);
      },
      handleEndTime(d){
        this.endTimes = this.deformatterDate(d);
      },
      confirm(){
        alert(this.editData)
      },
      cancel(){
        this.$emit('cancel','edit')
      },
    }

  }
</script>
<style>
</style>
