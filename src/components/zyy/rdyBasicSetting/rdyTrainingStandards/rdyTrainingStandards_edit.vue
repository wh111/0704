<template>

  <div>
    <el-steps :space="500" align-center :active="active" finish-status="success" style="margin-left: 60px">
      <el-step  title="第一步：设置轮转科室"></el-step>
      <el-step title="第二步：设置科室要求"><second></second></el-step>
      <el-step title="第三步：关联院内科室"><third></third></el-step>
    </el-steps>
    </br>
    <div>
      <keep-alive> <first :resizeFirst="resizeFirst" :rtId="rtId" @next="next" :rtModelType="rtModelType" v-if="active==0"></first></keep-alive>
      <keep-alive>  <second :resizeSecond="resizeSecond"  @next="next"  @last="last" :rtId="rtId" v-if="active==1"></second></keep-alive>
      <keep-alive>  <third @next="next" @cancel="cancel" @last="last" :rtId="rtId" :resizeSecond="resizeSecond" v-if="active==2"></third></keep-alive>
    </div>
  </div>
</template>
<script>
  /* --引入组件-- 第一步设置轮转科室-- */
  import first from './rdyTrainingStandards_edit/rdyTrainingStandards_editFirst.vue'
  /* 引入组件 第二步：设置科室要求 */
  import second from './rdyTrainingStandards_edit/rdyTrainingStandards_editSecond.vue'
  /* 引入组件 第三步：关联院内科室 */
  import third from './rdyTrainingStandards_edit/rdyTrainingStandards_editThird.vue'
  //当前组件引入全局的util
  let Util=null;
  export default {
    props:['operailityData','url' ,'rtModelType'],
    data (){
      return{
        active:0,
        rtId:this.operailityData.rtId,
        resizeFirst:false,
        resizeSecond:1,
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //暂时没有初始化,预留初始化入口
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit){
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle,isLoadingFun)
        }
      },

      //下一步
      next(id){
        if(this.active==0){
          this.$emit('resize') ;
          this.resizeSecond++;
          if(!this.rtId){
            this.rtId = id ;
          }
        }
        this.active++;
      },

      //上一步
      last(){
        if(this.active==1){
          this.resizeFirst = !this.resizeFirst;
        }
        this.active--;
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
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
    },

    components:{
      //当前组件引入的子组件
      first,second,third
    }
  }
</script>
