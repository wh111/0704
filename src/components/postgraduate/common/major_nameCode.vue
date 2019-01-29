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
      :label="item.major+`-${item.majorCode}`"
      :value="item.major+'-'+item.majorCode">
    </el-option>
  </div>
</template>
<script>
  let Util=null;
  import api from './api'
  export default {

    props: ['type', 'url', "selectOptions", 'unAll', 'selectDefault'],
    data() {
      return {
        optionData: [],
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          ajaxSuccess:'updateListData',
          ajaxParams:{
            url: api.query.path,  //向后台请求数据的地址 （不分页）
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
