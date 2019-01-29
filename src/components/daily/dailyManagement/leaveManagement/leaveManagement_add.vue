<template>

  <div >
    <el-form ref="formValidate"    class="demo-form-inline" label-width="80px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="姓名" prop="name" >
           {{operailityData.userNmae}}
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="8">
          <el-form-item label="科室"   prop="school">
            <el-select filterable   v-model="formValidate.depId" placeholder="请选择">
              <select-option :unAll="true"></select-option>
            </el-select>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="请假事由" prop="name" >
            <el-radio-group v-model="formValidate.leaveType">
              <el-radio :label="'SHI'">事假</el-radio>
              <el-radio :label="'BING'">病假</el-radio>
              <el-radio :label="'SANG'">丧假</el-radio>
              <el-radio :label="'CHAN'">产假</el-radio>
              <el-radio :label="'TAN'">探亲假</el-radio>
              <el-radio :label="'HUN'">婚假</el-radio>
              <el-radio :label="'OTHER'">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="13" :offset="2">
          <el-form-item label="请假时间" prop="name" >
              <el-date-picker
                v-model="formValidate.beginDate"
                type="date"
                :editable="false"
                placeholder="选择日期"
                :picker-options="pickerOptions0"
                @change="handleStartTime"
              >
              </el-date-picker>
              到
              <el-date-picker
                v-model="formValidate.endDate"
                align="right"
                type="date"
                :editable="false"
                placeholder="选择日期"
                :picker-options="pickerOptions1"
                @change="handleEndTime">
              </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <p class="date">共<span class="countDate">{{length||0}}</span>天</p>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="事由说明" prop="name" >
            <el-input type="textarea" v-model="formValidate.explains" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="9" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  export default {
    props: ['operailityData'],
    data (){
      let userInfo = this.$store.getters.getUserInfo;
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        options:[{

          value: '10',
          label: '呼吸科'
        }, {
          value: '1',
          label: '审核通过'
        }, {
          value: '2',
          label: '未审核'
        }],
        radio2:2,

        formValidate: {
          depId:'',
          applicantId:userInfo.id,
          leaveType:'',
          beginDate:'',
          endDate:'',
          timeLength:'',
          explains:'',
          status:'WSB',
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
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'leave/add',
            method:'post'
          }
        },

      }
    },
    methods:{
      //时间
      deformatterDate(d){
        return new Date(d).getTime()-1000*60*60*24;
      },

      cancel(){
        this.$emit('cancel','add')
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          this.addMessTitle.ajaxParams.data = this.formDate(this.getFormData(this.formValidate),['beginDate','endDate'],this.yearMonthData);
          this.ajax(this.addMessTitle,isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = this.$util._.defaultsDeep({},data);
        return myData;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.addMessTitle.type);
      },

    },
    computed:{
        //计算总共多少天
        length(){
            if(!this.formValidate.endDate ||!this.formValidate.beginDate)return 0
          let length = this.formValidate.timeLength = (this.deformatterDate(this.formValidate.endDate) - this.deformatterDate(this.formValidate.beginDate))/86400000+1;
          return length
        }

    }


  }
</script>
