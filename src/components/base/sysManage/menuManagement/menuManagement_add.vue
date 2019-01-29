<template>

  <div >
    <el-form ref="formValidate" class="demo-form-inline" label-width="110px" >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="菜单名称：" prop="name" >
            <el-input v-model="formValidate.name"  placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="10" >
          <el-form-item label="菜单代码：" prop="identity" >
            <el-input v-model="formValidate.identity" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="图标：" prop="icon" >
            <el-input v-model="formValidate.icon" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="10" >
          <el-form-item label="显示顺序：" prop="sequence" >
            <el-input v-model="formValidate.sequence" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

      <el-row >
        <el-col :span="20" :offset="2">
          <el-form-item label="URL：" prop="url" >
            <el-input v-model="formValidate.url" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row >

    </el-form>
    <el-row >
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //form表单bind数据
        formValidate: {
          "parentId":this.operailityData.id,
          "name":"",
          "icon":"",
          "url":"",
          "sequence":"1",
        },

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/menu/add',
            method:'post'
          }
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{


      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        //this.ajax(this.addMessTitle);
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
          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun);
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


    }
  }
</script>
