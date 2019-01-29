<!----------------------------------
****--查看(respondentSumAudit_view)
****--@date     2017/9/12
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <baseView :operailityData="formValidate" :auditStep="auditStep"></baseView>
  <!--<div>-->
  <!--<el-form ref="formValidate" label-width="90px">-->
  <!--<el-row class="table-back-one-d">-->
  <!--<el-col :span="8">-->
  <!--<el-form-item label="状态:">-->
  <!--{{formValidate.resultStatus | dsresultRecord}}-->
  <!--</el-form-item>-->
  <!--</el-col>-->
  <!--</el-row>-->
  <!--</el-form>-->
  <!--</div>-->
</template>
<script>
  /*当前组件必要引入*/
  //  import baseView from '../common/makeOpenReply_base-view.vue';
  import baseView from '../common/makeOpenReply_view.vue';
  import api      from '../api.js';
  //当前组件引入全局的util
  let Util = null;
  export default {
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
              userId: this.operailityData.applicantId
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
      updateListData (responseData) {
        if (!responseData.data) return;
        if (responseData.data.fileInfo) {
          responseData.data.fileList = [responseData.data.fileInfo];
        } else {
          responseData.data.fileList = [];
        }
        this.auditStep = this.auditStepCall(responseData.data.status);
        this.formValidate = responseData.data;
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
      Util = this.$util;
      this.init();
    },
    mounted () {
    },
    components: {
      baseView
    }
  };
</script>
