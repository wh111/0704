<!--
****--@file     YJSSMSTemplate_view
****--@date     2018/7/31 19:53
****--@author   YC
****--@describe 研究生短信模版-查看
-->
<template>
  <div>
    <el-form label-width="90px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="模板名称：">
            {{formValidate.name}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典码：">
            {{formValidate.code}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="内容：">
            {{ formValidate.value }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'YJSSMSTemplateView',
    props: ['operailityData', 'url'],
    data () {
      return {
        formValidate: {
          name: '',
          code: '',
          value: ''
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.getViewData();
      },
      // 获取查看数据
      getViewData () {
        let opt = {
          ajaxSuccess: 'getViewDataSuccess',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt);
      },
      // 获取查看数据成功回调
      getViewDataSuccess (res) {
        let data = res.data;
        this.formValidate = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', 'edit');
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
