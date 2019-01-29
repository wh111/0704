<!----------------------------------
****--@name     培训标准
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <standards :rtModelType="'YJS'"></standards>
</template>
<script>
    /*当前组件必要引入*/
    import standards from "../../../zyy/rdyBasicSetting/rdyTrainingStandards/rdyTrainingStandards_list.vue";
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
          standards
        }
    }
</script>
