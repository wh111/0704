<template>

  <div>
    <el-form class="demo-form-inline">
      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="名称:" class="feildFontweight">
            {{formValidate.name}}
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="9">
          <el-form-item label="描述:" class="feildFontweight">
            {{formValidate.remark}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row :span="18" :offset="2">
        <div class="itemLayout">
          <fieldset>
            <legend style="font-size:16px"> 组员&nbsp;</legend>

            <span v-for="(item,index) in formValidate.userList" class="userName"><em class="nameText">{{item.name}}</em></span>

          </fieldset>
        </div>
      </el-row>
    </el-form>
    <el-row class="but-space">
      <el-col :span="9" :offset="10">
        <el-button @click="cancel">关闭</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script >
  //当前组件引入全局的util
  let Util=null;
  export default {
    props: ['operailityData'],
    data (){
      return{
        //form表单bind数据
        formValidate: {},
        //存储已选择人员的信息
        users:[],
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
        let userList = {
          ajaxSuccess:(res)=>{
            let rowData = res.data;
            this.formValidate= rowData;
          },
          ajaxParams:{
            url:'/groups/get/'+this.operailityData.id,
          }
        }
        this.ajax(userList);
      },
      cancel(){
        this.$emit('cancel','show')
      }
    }

  }
</script>
