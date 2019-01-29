<!--
****--@file     respondentStatusQuery_view
****--@date     2018/8/9 19:13
****--@author   YC
****--@describe 答辩状态查询-查看
-->
<template>
  <baseView :operailityData="formValidate" :auditStep="auditStep"></baseView>
</template>
<script>
  /*当前组件必要引入*/
  import baseView from '../common/makeOpenReply_view.vue';
  import api      from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'respondentStatusQueryView',
    props: ['operailityData'],
    data () {
      return {
        formValidate: {},
        auditStep: '',
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
//            url: api.defenseAppResGet.path + this.operailityData.id,
            url: api.defenseAppGet.path,
            params: {
              userId: this.operailityData.accountId
            }
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.ajax(this.listMessTitle);
      },

      //通过get请求列表数据
      updateListData (res) {
        if (!res.data) return;
        if (res.data.fileInfo) {
          res.data.fileList = [res.data.fileInfo];
        } else {
          res.data.fileList = [];
        }
        this.auditStep = this.auditStepCall(res.data.status);
        this.formValidate = res.data;
      },
      //审核步骤
      auditStepCall (status) {
        let obj = {
          'WSB': '-1',
          'DSH': '0',
          'DSBH': '1',
          'JYSDSH': '2',
          'JYSBH': '3',
          'JYCDSH': '4',
          'JYCBH': '5',
          'TG': '6',
          'MODIFY_END': '-1',
          'AGAIN_END': '-1'
        };
        return obj[status];
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      baseView
    }
  };

</script>
