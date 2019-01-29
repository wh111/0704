<!----------------------------------
****--@name     培养计划审核
****--@role     导师、教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal" style="position: absolute;top: 10px;left: 10px;right:10px;bottom: 10px">
    <tutor :url="url" :peport="peport" v-if="typeView.includes('DS')" :view="view" style="height: 100%"></tutor>
    <staffRoom :url="url" :peport="peport" v-else-if="!peport&&typeView.includes('KEZR')" :view="view"></staffRoom>
    <education :url="url" :peport="peport" v-else-if="typeView.includes('YJSGL') || typeView.includes('JYC')" :view="view"
               style="height: 100%"></education>
    <div v-else style="font-size: 18px;text-align: center;line-height: 100px;">
      <strong>您没有此权限</strong>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url       from './api';
  //导师审核
  import tutor     from './proposalApplicationAudit_DS/tutor_list.vue';
  //教研室审核
  import staffRoom from './proposalApplicationAudit_JYS/staffRoom_list.vue';
  //教育处审核
  import education from './proposalApplicationAudit_JYC/education_list.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['api', 'view', 'peport'],
    data () {
      return {
        typeView: []
      };
    },
    methods: {
      //初始化请求列表数据

      init () {
        if (this.api) {
          this.url = this.api; // 开题报告填写
        } else {
          this.url = url;// 开题申请填写
        }
        let typeView = [];
        let userInfo = this.$store.getters.getUserInfo;
        userInfo.roleList.map(item => typeView.push(item.identify));
        this.typeView = typeView;
        Util = this.$util;
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      //当前组件引入的子组件
      tutor, education, staffRoom
    }
  };
</script>

