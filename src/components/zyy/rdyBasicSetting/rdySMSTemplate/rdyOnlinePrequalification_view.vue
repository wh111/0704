<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form label-width="90px">
      <el-row>
        <el-col :span="10" :offset="2">
          <el-form-item label="模板名称：">
            {{formValidate.name}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="字典码：">
            {{formValidate.code}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form-item label="内容：">
            <el-input type="textarea" readonly v-model="formValidate.value"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData', 'url'],
    data() {
      return {
        formValidate: {
          name: '',
          code: '',
          value: '',
        },
        //保存按钮基本信息
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getViewData()
      },
      getViewData() {
        let opt = {
          ajaxSuccess: "getViewDataSuccess",
          ajaxParams: {
            url: this.url.smsTemplateGet.path + this.operailityData.id,
            method: this.url.smsTemplateGet.method,
          }
        };
        this.ajax(opt)
      },
      getViewDataSuccess(res) {
        let data = res.data;
        this.formValidate = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'edit');
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }

</script>
