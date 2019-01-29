<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <bksContent></bksContent>
</template>
<script>
    /*当前组件必要引入*/
    import bksContent from '../../../educationManagement/EnrollEnroll/bksPersonnelManagement/bksPersonnelManagement_list.vue';
    //当前组件引入全局的util
    let Util = null;
    export default {
        data() {
            return {}
        },
        methods: {
            //初始化请求列表数据
            init() {

            },

        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
          bksContent
        }
    }

</script>
