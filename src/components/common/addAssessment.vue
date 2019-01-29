<!--
****--@file     addAssessment
****--@date     2018/10/19 14:38
****--@author   ZWT
****--@describe 新增评估项
-->
<template>
  <div>
    <div>
      <el-form ref="formValidate" :model="formValidate" class="demo-form-inline" label-width="110px">

        <el-row>
          <el-col :span="10" :offset="2">
            <el-form-item label="指标名称：" prop="codeName">
              <el-input v-model="formValidate.codeName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-col :span="10" :offset="10">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'addAssessment',
    props: ['operailityData'],
    data () {
      return {
        formValidate: {
          codeName: ''
        },
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        addMessTitle: {
          type: 'add',
          successTitle: '保存成功',
          errorTitle: '保存失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: '/examination/achievetree/add',
            method: 'post',
            jsonString: true
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      },
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formValidate = this.$util._.defaultsDeep({}, this.formValidate);
          formValidate.parentId = this.operailityData.id;
          formValidate.achieveType = this.operailityData.fromWhereTre;
          this.addMessTitle.ajaxParams.data = formValidate;
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      cancel () {
        this.$emit('cancel', 'add');
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
