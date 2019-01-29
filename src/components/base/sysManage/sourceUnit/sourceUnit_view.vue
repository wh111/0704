<template>

  <div >
    <el-form ref="formValidate" class="demo-form-inline" label-width="90px" >
      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="单位名称：">
            {{formValidate.name}}
          </el-form-item>
        </el-col>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="联系人：" prop="contacts" >
            {{formValidate.contacts}}
          </el-form-item>
        </el-col>
        </el-col>
        <el-col :span="9" >
          <el-form-item label="联系电话：" prop="phone" >
            {{formValidate.phone}}
          </el-form-item>
        </el-col>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="18" :offset="2">
          <el-form-item label="备注：" prop="remark" >
            {{formValidate.remark}}
          </el-form-item>
        </el-col>
        </el-col>
      </el-row >

    </el-form>

    <el-row class="but-space">
      <el-col :span="9" :offset="10">
        <el-button @click="cancel">关闭</el-button>
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
        countDate:0,
        //form表单bind数据
        formValidate: {
          name:'',
          contacts:"",
          phone:'',
          remark:"",
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
      //初始化
      init(){
        let userList = {
          ajaxSuccess:(res)=>{
          let rawData = res.data;
          this.formValidate = rawData;
        },
        ajaxParams:{
          url:'/schools/get/'+this.operailityData.id,
        }
      }
        this.ajax(userList);
      },



      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel',"show");
      },

    }
  }
</script>
