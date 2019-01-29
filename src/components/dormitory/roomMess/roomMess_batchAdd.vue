<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules.roomMess"  class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="大楼名称:" prop="buildId" >
            <el-select
              v-model.number="formValidate.buildId"
              placeholder="选择或输入匹配搜索">
              <select-option :unAll="true" :type="'allBuild'"></select-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="房间类别:" prop="sex" >
            <el-select v-model="formValidate.sex" placeholder="请选择活动区域">
              <el-option label="男宿舍" value="BOY"></el-option>
              <el-option label="女宿舍" value="GIRL"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="房间号:"  >
            <el-input v-model.number="formValidate.noBegin"  min="0" type="number" placeholder="0" style="width: 120px;" @blur="noBegin"></el-input>到
            <el-input v-model.number="formValidate.noEnd"  min="0" type="number" placeholder="0"  style="width: 120px;" @blur="noEnd"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-form-item label="床位数:" prop="bedNum" >
            <el-input v-model.number="formValidate.bedNum"  min="0" type="number" placeholder="请输入" @blur="bedNum"></el-input>
          </el-form-item>
        </el-col>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="16" :offset="2">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="formValidate.remark" type="textarea" resize="none" :rows="8"></el-input>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="16" :offset="2">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
      props:['operailityData','url','rules'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        formValidate: {
          buildId:'',
          sex:'',        //房间性别
          noBegin:1,          //房间号起始
          noEnd:1,          //房间号结束
          bedNum:'',       //床位数
          remark:'',      //备注
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'batchAdd',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.roomAddList,
            method:'post',
            data:{},
          }
        },
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
            if(this.formValidate.noEnd<this.formValidate.noBegin) {
                this.errorMess('起始房间号不能大于终止房间号');
                return;
            }
          if(!isLoadingFun) isLoadingFun=function(){};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data=this.getFormData(this.formValidate);
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',this.addMessTitle.type);
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


      //开始和结束房间

      noBegin(){
        let val;
        let noEnd = this.formValidate.noEnd;
        val =Math.abs(Number.parseInt(this.formValidate.noBegin)) ;
        if(typeof val !='number'||val!=val ||!val){
            this.formValidate.noBegin=1;
          return
        }
        this.formValidate.noBegin = val

      },


      noEnd(value){
        let val;
        val = Number.parseInt(this.formValidate.noEnd);
        let noBegin = this.formValidate.noBegin;
        if(typeof val !='number'||val!=val ||!val){
          this.formValidate.noEnd=noBegin+1;
          return;
        }
      },

      bedNum(){
        let val =Math.abs(parseInt(this.formValidate.bedNum)) ;
        if(typeof val !='number'||val!=val ||!val){
          this.formValidate.bedNum = 1;
          return
        }
        this.formValidate.bedNum =val;
      }
    },

  }
</script>
<style>
  .date{
    line-height: 25px;
  }
  .date .countDate{
    display: inline-block;
    width:70px;
    text-align: center;
    border-bottom: 1px solid;
  }
</style>
