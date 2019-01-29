<!----------------------------------
****--@name     技能出科试卷设置
****--@role     ${*}
****--@date     2017/11/30
****--@author   gx
----------------------------------->
<template>
    <div style="height: 100%">
      <examineInterval style="height: 100%" skillType="skillOutdepExam" :url="url"></examineInterval>
    </div>
</template>
<script>
    /*当前组件必要引入*/
    import examineInterval from '../../../osce/examineInterval/examineInterval_list.vue'
    import url from '../api.js'
    //当前组件引入全局的util
    let Util = null;
    export default {
        data() {
            return {
              url,
            }
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
          examineInterval
        }
    }
</script>
