<!-- 出科审核(小科) -->
<template>
  <div>
    <!--<teacher v-if="userView === 'teacher'"></teacher>-->
    <kezr></kezr>
    <!--<dep v-if="userView === 'dep'"></dep>-->
    <!--<el-alert v-if="userView === 'def'" title="错误提示" type="error" description="当前角色没有权限操作该模块相关功能！" show-icon></el-alert>-->
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import teacher from './user_teacher/list'; // 老师（带教老师）
  import kezr from './user_kezr/list'; // 老师（科室主任、带教秘书）
  import dep from './user_dep/list'; // 教育处（教育处、导师）
  //当前组件引入全局的util
  export default {
    data() {
      return {
        userView: '', // 用户视图
        userInfo: {}, // 用户信息
        type: '',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

        let view = ['teacher', 'kezr', 'dep']; // 视图
        let identify = [ // 角色
          ['DJLS'], // 带教老师（出科 | 查看）
          ['KEZR', 'JXMS'], // 科室主任、带教秘书（出科 | 查看）
          ['JYC', 'DS'] // 教育处、导师 （查看）
        ];
        let defView = 'dep'; // 默认视图

        this.userInfo = this.$store.getters.getUserInfo;

        for (let i = 0, l = identify.length; i < l; i++) {
          if (identify[i].indexOf(this.userInfo.roleList[0].identify) > -1) {
            defView = view[i];
            break;
          }
        }

        this.userView = defView;
      },
    },
    created() {
      this.init();
    },
    components: {
      teacher,
      kezr,
      dep,
    }
  }

</script>
