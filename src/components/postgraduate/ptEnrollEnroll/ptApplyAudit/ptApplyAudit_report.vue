<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form v-if="operailityData && operailityData instanceof Array">
      <el-form-item>
        <span style="text-indent: 2em;">
        对 {{ operailityData | getArrText('name') }} 进行批量审核操作
        </span>
      </el-form-item>
    </el-form>
    <yjs-show v-if="showData.id" :operaility-data="showData"></yjs-show>
    <el-row style="margin-top: 16px">
      <el-col align="center">
        <el-button type="success" @click="getPrintData('AUDIT_SUCCESS')">通过</el-button>
        <el-button type="danger" @click="getPrintData('AUDIT_FAILURE')">驳回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api     from './api';
  import yjsShow from '../yjsPersonnelManagement/yjsPersonnelManagement_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {
        ids: '',
        showData: {
          id: ''
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        let ids = [];
        if (this.operailityData instanceof Array) {
          (this.operailityData || []).map(item => ids.push(item.id));
        } else {
          ids.push(this.operailityData.id);
          this.showData.id = this.operailityData.accountId;
        }
        this.ids = ids.join(',');
      },
      getPrintData (accountStatus) {
        let msg = {
          AUDIT_SUCCESS: '通过',
          AUDIT_FAILURE: '驳回'
        };
        let opt = {
          ajaxSuccess: res => {
            this.$emit('report', 'report', `审核${msg[accountStatus]}操作成功`);
          },
          ajaxError: () => this.errorMess(`审核${msg[accountStatus]}操作失败`),
          ajaxParams: {
            url: api.audit.path + this.ids,
            method: api.audit.method,
            data: {
              ids: this.ids,
              accountStatus
            }
          }
        };
        this.ajax(opt);
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {
      yjsShow
    }
  };

</script>
