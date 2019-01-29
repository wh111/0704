<!--
****--@file     editAssessment
****--@date     2018/10/19 17:15
****--@author   ZWT
****--@describe 修改评估项
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
    name: 'editAssessment',
    props: ['operailityData'],
    data () {
      return {
        formValidate: {
          codeName: ''
        },
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        addMessTitle: {
          type: 'edit',
          successTitle: '修改成功',
          errorTitle: '修改失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: '/examination/achievetree/modify/' + this.operailityData.id,
            method: 'put',
            jsonString: true
          }
        },
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            // url: this.operailityData["getTreeUrl"] + '/tree/' + this.operailityData.id,
            url: '/examination/achievetree/get/' + this.operailityData.id
          }
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.ajax(this.listMessTitle);
        console.log(this.operailityData);
      },
      /*
      * 默认组件第一次请求数据
      * @param res JSON  数据请求成功后返回的数据
      * */
      SuccessGetCurrData (responseData) {
        this.formValidate = Object.assign(this.formValidate, responseData.data);
      },
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let formValidate = this.$util._.defaultsDeep({}, this.formValidate);
          formValidate.parentId = this.operailityData.parentId;
          formValidate.achieveType = this.operailityData.fromWhereTre;
          // delete formValidate.isDelete;
          // delete formValidate.id;
          // delete formValidate.id;
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
