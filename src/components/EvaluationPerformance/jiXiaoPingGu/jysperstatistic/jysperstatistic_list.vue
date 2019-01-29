<!--
****--@file     jysperstatistic_list
****--@date     2018/10/24 10:13
****--@author   ZWT
****--@describe 教研室统计列表
-->
<template>
  <div style="height: 100%">
    <!--<el-tabs v-model="deActiveName">-->
    <!--<el-tab-pane label="教师" name="teach"></el-tab-pane>-->
    <!--<el-tab-pane label="教研室" name="staff"></el-tab-pane>-->
    <!--<el-tab-pane label="学生" name="student"></el-tab-pane>-->
    <!--</el-tabs>-->
    <!--<jysteach v-if="deActiveName == 'teach'"></jysteach>-->
    <jysstaff v-if="deActiveName == 'staff'"></jysstaff>
    <!--<jysstudent v-if="deActiveName == 'student'"></jysstudent>-->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import jysteach from './jysTeach'
  import jysstaff from './jysStaff'
  import jysstudent from './jysStudent'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'jysperstatistic_list',
    data () {
      return {
        deActiveName: 'staff',
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
      jysteach,jysstaff,jysstudent
    }
  };

</script>
