<!--
****--@file     layout
****--@date     2018/2/28 11:40
****--@author   YC
****--@describe 理论考核基础布局
-->
<template>
    <router-view/>
</template>
<script>
    /*当前组件必要引入*/

    //当前组件引入全局的util
    let Util = null;
    export default {
        data() {
            return {}
        },
        methods: {
            //初始化请求列表数据
            init() {

            }

        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {}
    }

</script>
