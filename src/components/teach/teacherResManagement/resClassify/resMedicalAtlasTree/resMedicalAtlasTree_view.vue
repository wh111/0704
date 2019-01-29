<!----------------------------------
****--医学图谱-查看目录树节点(normCourseTree_view)
****--@date     2017/8/4
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div >
    <el-form :model="formValidate" ref="formValidate" class="demo-form-inline" label-width="110px" >

      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="名称：" prop="name" >
            {{formValidate.name}}
          </el-form-item>
        </el-col>
        </el-col >

        <el-col :span="10" >
          <el-form-item label="管理员：" prop="parentId" >
            {{formValidate.managerName}}
          </el-form-item>
        </el-col>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="10" :offset="2">
          <el-form-item label="创建人：">
            {{userInfo}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="创建时间：">
            {{currCreateDate}}
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="10" :offset="10">
        <el-button  @click="cancel">关闭</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  import api from "../api.js";
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{

        //当前创建时间
        currCreateDate:'2017-08-10 18:20 00',

        //form表单bind数据
        formValidate: {
//          name:'dd',
//          parentId:this.operailityData.parentId,
//          managerId:'2',
//          managerName:'44',
//          types:this.operailityData["types"],
//          createTime:'2017-08-10 18:20 00',
//          operator:"456"
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      //默认请求加载数据
      let getEditTitle = {
        ajaxSuccess:(res)=>{
          this.formValidate = res.data;
          this.formValidate.createTime = this.conductDate(this.formValidate.createTime,"yyyy-MM-dd HH:mm:ss");
          this.formValidate.parentId = this.operailityData.parentId;
          this.formValidate.types = this.operailityData.types;

          this.currCreateDate = this.formValidate.createTime;

        },
        ajaxParams:{
          url: api.treeGet.path+"/"+this.operailityData.id,
        }
      }
      this.ajax(getEditTitle);
    },
    mounted(){
      //初始化
      this.init();
    },
    computed:{
      userInfo(){
        let info = this.formValidate.operator || "";
        return info;
      }
    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },


      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options){
        this[options+'Modal'] = true;
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
