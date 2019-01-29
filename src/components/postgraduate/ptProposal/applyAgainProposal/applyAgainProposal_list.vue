<!----------------------------------
****--@name     再次开题申请
****--@role     研究生
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
    <div  style="position: absolute;top: 10px;left: 10px;right:10px;bottom: 10px">
      <changeProposalApplication :api="url" :again="true"></changeProposalApplication>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import url from './api'
  import changeProposalApplication from '../changeProposalApplication/changeProposalApplication_list.vue'
    //当前组件引入全局的util
    let Util = null;
    export default{
        data() {
            return {
              url,
            }
        },
        methods: {
            //初始化请求列表数据
            init(){

            },

        },
        created(){
            this.init();
        },
        mounted(){
        },
        components: {
          changeProposalApplication
        }
    }
</script>
