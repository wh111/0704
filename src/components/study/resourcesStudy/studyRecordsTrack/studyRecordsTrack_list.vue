<!----------------------------------
****--@name     学习记录追踪
****--@role     教育处
****--@date     2018/9/29
****--@author   gx
----------------------------------->
<template>
  <studyRecords whereFrom="studyRecordsTrack"></studyRecords>
</template>
<script>
  /*当前组件必要引入*/
  import studyRecords from '../studyRecords/studyRecords_list.vue'
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
      studyRecords
    }
  }
</script>
