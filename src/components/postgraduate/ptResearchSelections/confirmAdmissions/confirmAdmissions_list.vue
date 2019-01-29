<!----------------------------------
****--@name     确认招生
****--@role     导师
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content" class="modal" style="position: absolute;top: 10px;left: 10px;right:10px;bottom: 10px">
    <confirm-ds :url="url" :fromModular="fromModular" v-if="typeView.includes('DS')" :view="view"
                style="height: 100%"></confirm-ds>
    <!--<confirm-jys :url="url" :fromModular="fromModular" v-else-if="typeView.includes('KEZR') || typeView.includes('JXMS')"-->
    <!--:view="view"></confirm-jys>-->
    <confirm-jyc :url="url" :fromModular="fromModular" v-else-if="typeView.includes('YJSGL') || typeView.includes('JYC')" :view="view"
                 style="height: 100%"></confirm-jyc>
    <!--<div v-else style="font-size: 18px;text-align: center;line-height: 100px;">-->
    <!--<strong>您没有此权限！</strong>-->
    <!--</div>-->
    <!--<confirm-all v-else :fromModular="fromModular" :typeView="typeView"></confirm-all>-->
    <confirm-all v-else :fromModular="fromModular"></confirm-all>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import url        from './api';
  //导师审核
  import confirmDs  from './confirmAdmissions_DS.vue';
  //教研室审核
  //  import confirmJys from './confirmAdmissions_JYS.vue';
  //教育处审核
  import confirmJyc from './confirmAdmissions_JYC.vue';
  import confirmAll from './confirmAdmissions_All.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {//peport
    props: ['api', 'view', 'fromModular'],
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
        (userInfo.roleList || []).map(item => typeView.push(item.identify));
        this.typeView = typeView;
        console.log(typeView);
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
      confirmDs, /*confirmJys, */ confirmJyc,
      confirmAll
    }
  };
</script>

