<!----------------------------------
****--@name     组织复试
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
---------------------------------->
<template>
  <div style="height: 100%;">
    <keep-alive>
      <notices v-if="showType === 'notice'" @show="show"></notices>
    </keep-alive>
    <notice-info v-if="showType === 'info'" @show="show" :noticeData="noticeData"></notice-info>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import notices    from './ptOrganizationReexamine_notice';
  import noticeInfo from '../ptOrganizationReexamine_noticeInfo/ptOrganizationReexamine_list';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data () {
      return {
        showType: 'notice', // 显示类型
        noticeData: null // 附带参数
      };
    },
    methods: {
      show (type, obj = null) {
        this.showType = type;
        this.noticeData = obj;
      }
    },
    created () {
    },
    mounted () {
    },
    components: {
      notices, noticeInfo
    }
  };
</script>
