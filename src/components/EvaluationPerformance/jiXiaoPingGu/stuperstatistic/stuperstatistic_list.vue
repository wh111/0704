<!--
****--@file     stuperstatistic_list
****--@date     2018/10/24 10:12
****--@author   ZWT
****--@describe 学生统计列表
-->
<template>
  <div style="height: 100%">
    <!--<el-tabs v-model="deActiveName">-->
    <!--<el-tab-pane label="教师" name="teach">-->
    <!--</el-tab-pane>-->
    <!--<el-tab-pane label="教研室" name="staff">-->
    <!--</el-tab-pane>-->
    <!--<el-tab-pane label="学生" name="student">-->
    <!--</el-tab-pane>-->
    <!--</el-tabs>-->
    <!--<stuteach v-if="deActiveName == 'teach'" ></stuteach>-->
    <!--<stustaff v-if="deActiveName == 'staff'" ></stustaff>-->
    <stustudent v-if="deActiveName == 'student'"></stustudent>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import stuteach from './stuTeach'
  import stustaff from './stuStaff'
  import stustudent from './stuStudent'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'stuperstatistic_list',
    data () {
      return {
        deActiveName: 'student',
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
      stuteach,stustaff,stustudent
    }
  };

</script>
