<template>

  <div>
    <el-row>
      <el-col :span="20" :offset="3">
        <el-form v-if="viewType=='base'"  ref="formValidate" :model="formValidate" :rules="rules.teachplanAdd" inline label-width="90px">
          <el-form-item label="计划年份:" prop="activityPlanYear" >
            <el-date-picker
              v-model="formValidate.activityPlanYear"
              align="right"
              type="year"
              :editable="false"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="计划月份:" prop="activityPlanMonth" >
            <el-date-picker
              v-model="formValidate.activityPlanMonth"
              align="right"
              format="MM"
              type="month"
              :editable="false"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="科室:" prop="activityPlanDep">
            <el-select v-model="formValidate.activityPlanDep" placeholder="科室">
              <el-option
                v-for="item in optionData"
                :key="item.id"
                :label="item.name"
                :value="item.id+'-'+item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button  @click="submit">确定</el-button>
        </el-form>
      </el-col>
    </el-row>

    <add-sub v-if="viewType=='sub'" @add="addSuccess" @cancel="cancel" :url="url" :operailityData="formValidate"></add-sub>
  </div>
</template>
<script>
  import rules from '../../rules';
  import addSub from './teachplan_addSub.vue';
  //当前组件引入全局的util
  let Util=null;
  export default {
      props:['operailityData','url'],
    data (){
      return{
        rules,
          viewType:'base',
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          activityPlanYear:'',        //计划对应年份
          activityPlanMonth:'',     //计划对应月份
          activityPlanDepId:'',       //计划科室ID
          activityPlanDepName:'',      //计划科室名称
          activityPlanDep:'',
        },
        //请求科室信息
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:this.url.byUserType,  //向后台请求数据的地址
            params:{userId:''}
          }
        },
        optionData:[], // 请求的科室信息
        tableData:[
        ],

      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      let userInfo = this.$store.getters.getUserInfo;
      this.listMessTitle.ajaxParams.params.userId = userInfo.id;
      //请求科室信息
      this.ajax(this.listMessTitle);
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{

      /*
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','add');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //this.ajax(this.listMessTitle)
      },

      updateListData(responseData){
        let data = responseData.data;
        this.optionData = data;
      },


      //点击确定切换组件
      submit(){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          let dep =  this.formValidate.activityPlanDep;
          dep = dep.split('-');
          this.formValidate.activityPlanDepId = dep[0] ;
          this.formValidate.activityPlanDepName = dep[1] ;
          this.formValidate.activityPlanYear = this.conductDate(this.formValidate.activityPlanYear,'yyyy');
          this.formValidate.activityPlanMonth = this.conductDate(this.formValidate.activityPlanMonth,'MM');
          this.viewType = 'sub';
        }
      },


      //添加成功的回调函数
      addSuccess(type,tag){
          this.$emit('add',type,tag)
      }
    },
    components:{
      addSub
    }
  }
</script>

