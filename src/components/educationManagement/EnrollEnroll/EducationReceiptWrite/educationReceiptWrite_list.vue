<!----------------------------------
****--@name     进修回执填写
****--@role    进修生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
<div style="width: 100%;height: 100%;">
  <index @setShow="setShow" :operailityData="showData" v-if="show=='index'"></index>
  <add @setShow="setShow" :operailityData="showData" :userId="userInfo.id" v-if="show=='add'&& typeof userInfo.id!='undefined'"></add>
</div>
</template>
<script>
/*当前组件必要引入*/
import index from "./EducationReceiptWrite_index.vue";
import add from "./EducationReceiptWrite_add.vue";
import api from "./api.js";
//当前组件引入全局的util
let Util = null;
export default{
  data() {
    return {
      show:"",
      showData:null,
      listMessTitle:{
        ajaxSuccess:'updateListData',
        ajaxParams:{
          url: api.get.path,
          params:{}
        }
      },
    }
  },
  methods: {
    //初始化请求列表数据
    init(){
      let listMessTitle = Util._.defaultsDeep({},this.listMessTitle);
      listMessTitle.ajaxParams.url+=this.userInfo.id;
      this.ajax(listMessTitle);
    },
    /**
     * 子组件调用函数
     * @param str
     */
    setShow(str){
      this.show = str;
    },

    updateListData(responseData){
      let data = responseData.data;
      if (!data){
        return
      }
      this.showData = data;
      if(data.hasCompletedReceipt && data.hasCompletedReceipt == 'Y'){
        this.show="add";
      }else{
        this.show="index";
      }
    },

  },
  created(){
    Util = this.$util;
    this.init();
  },
  mounted(){
  },
  computed:{
    userInfo() {
      let info = this.$store.getters.getUserInfo || {};
      return info;
    }
  },
  components: {
    index,add
  }
}
</script>
