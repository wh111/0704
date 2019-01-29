<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/12
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-option
      v-for="item in optionData"
      :key="item.id"
      :label="item.name+`(${item.code})`"
      :value="item.name">
    </el-option>
  </div>
</template>
<script>
  let Util=null;
  export default {

    props:['type','url',"selectOptions",'unAll',"setSltOptionValue",'currSelectOne','id','isCode','userType','userId','name','role','selectDefault'],
    data() {
      return {
        optionData: [],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url:'/hospital/dept/getByDepth',  //向后台请求数据的地址
            params:{
              depth:2
            },
          }
        }
      }
    },
    created(){
      Util = this.$util;
      this.init();
    },
    methods:{


      //初始化组件信息
      init(){

        this.ajax(this.listMessTitle);
      },


      //通过get请求列表数据
      updateListData(responseData){
        let data = responseData.data;
        if(this.selectDefault){
          this.$emit('majorDefault',data[0])
        }

        this.optionData = data;
      },





    }
  }
</script>
