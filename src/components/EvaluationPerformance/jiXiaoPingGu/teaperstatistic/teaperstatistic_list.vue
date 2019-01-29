<!--
****--@file     teaperstatistic_list
****--@date     2018/10/24 10:10
****--@author   ZWT
****--@describe 老师统计列表
-->
<template>
  <div style="height: 100%">
    <!--<el-tabs v-model="deActiveName">-->
    <!--<el-tab-pane label="教师" name="teach"></el-tab-pane>-->
    <!--<el-tab-pane label="教研室" name="staff"></el-tab-pane>-->
    <!--<el-tab-pane label="学生" name="student"></el-tab-pane>-->
    <!--</el-tabs>-->
    <teteach v-if="deActiveName == 'teach'"></teteach>
    <!--<testaff v-if="deActiveName == 'staff'"></testaff>-->
    <!--<testudent v-if="deActiveName == 'student'"></testudent>-->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import teteach from './teTeach'
  import testaff from './teStaff'
  import testudent from './teStudent'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'teaperstatistic_list',
    data () {
      return {
        deActiveName: 'teach',
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      teteach,testaff,testudent
    }
  };

</script>
