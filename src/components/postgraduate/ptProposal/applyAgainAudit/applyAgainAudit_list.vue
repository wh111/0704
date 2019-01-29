<!----------------------------------
****--@name     再次开题审核
****--@role     导师、教研室秘书、教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
    <div>
      <proposalApplicationAudit  :view="'again'"></proposalApplicationAudit>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import  proposalApplicationAudit from '../proposalApplicationAudit/proposalApplicationAudit_list.vue'
    //当前组件引入全局的util
    let Util = null;
    export default{
        data() {
            return {}
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
          proposalApplicationAudit
        }
    }
</script>
