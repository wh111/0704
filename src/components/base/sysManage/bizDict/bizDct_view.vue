<template>
  <div >
    <el-form class="demo-form-inline" label-width="90px" >

      <el-row >
        <el-col :span="9" :offset="2">
          <el-form-item label="字典名称：">
            {{formValidate.parentName}}
          </el-form-item>
        </el-col>

        <el-col :span="9" >
          <el-form-item label="字典代码：">
            {{formValidate.parentCode}}
          </el-form-item>
        </el-col>
      </el-row >
      <el-row >
        <el-col :span="20" :offset="2">
          <fieldset>
            <legend style="font-size:16px"> 字典项 </legend>
            <div v-if="formValidate.child.length==0" style="padding: 10px 0;text-align: center;">无字典项</div>
            <el-row v-for="(value,index) in formValidate.child" :key="index" :gutter="10">
              <el-col :span="6">
                <el-form-item label="字典名称：">
                  {{value.name}}
                </el-form-item>
              </el-col>
              <el-col :span="6" >
                <el-form-item label="字典Code：">
                  {{value.code}}
                </el-form-item>
              </el-col>
              <el-col :span="6" >
                <el-form-item label="值：">
                  {{value.value}}
                </el-form-item>
              </el-col>
              <el-col :span="6" >
                <el-form-item label="排序：">
                  {{value.sequence}}
                </el-form-item>
              </el-col>
            </el-row >
          </fieldset>
        </el-col >
      </el-row >
    </el-form>

    <el-row class="but-space">
      <el-col :span="14" :offset="10">
        <el-button style="float: right"  @click="cancel">关闭</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script >
  let Util = null;
  export default {
    props: ['operailityData'],
    data (){
      return{
        //form表单bind数据
        formValidate: {
          "parentName":'',
          "parentCode":'',
          "child":[{
            "name":"",
            "code":"",
            "value":"",
            "sequence":"1"
          }]
        },
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/dictionary/get/'+this.operailityData.id,
          }
        }
      }
    },

    created(){
      Util = this.$util;
      //初始化
      this.init();
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.formValidate=data;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
      cancel(){
        this.$emit('cancel','show');
      }
    }

  }
</script>
