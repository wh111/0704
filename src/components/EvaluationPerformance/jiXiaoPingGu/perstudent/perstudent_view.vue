<!--
****--@file     perstudent_view
****--@date     2018/10/23 14:59
****--@author   ZWT
****--@describe 学生试图
-->
<template>
  <div id="content" ref="content" class="modal">
    <h2>指标属性</h2>
    <el-form :model="formValidate" :rules="rules" ref="formValidate" label-width="130px">
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="指标代码:" prop="id">
            <span v-model="formValidate.id">{{formValidate.id}}</span>
            <!--<el-input placeholder="请输入" v-model="formValidate.id"></el-input>-->
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="9" :offset="2">
          <el-form-item label="指标名称:" prop="codeName">
            <span v-model="formValidate.codeName">{{formValidate.codeName}}</span>
            <!--<el-input placeholder="请输入" v-model="formValidate.codeName"></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="标准得分/权重:" prop="score">
            <el-input placeholder="请输入" v-model="formValidate.score"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="评估标准:" prop="evaCriteria">
            <el-input type="textarea" resize="none" :rows="4" placeholder="请输入命题要求" v-model="formValidate.evaCriteria"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea" resize="none" :rows="4" v-model="formValidate.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row>
      <el-col :span="24" style="text-align: center">
        <el-button @click="resetForm('formValidate')" type="danger">重置</el-button>
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>

      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import { perteachtion as rules } from './rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'perteach_view',
    props: ['deptId', 'operailityData'],
    data () {
      return {
        rules,
        formValidate: {
          id: '',
          codeName: '',
          score: '',
          evaCriteria: '',
          remark: ''
        },
        getDataUrl: '/examination/achieveproperties/modify/',
        //保存按钮基本信息
        loadBtn: {title: '保存', callParEvent: 'listenSubEvent'},
        addMessTitle: {
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: () => {
            this.successMess('保存成功');
          },
          error: () => {
            this.errorMess('保存失败');
          },
          ajaxParams: {
            url: this.getDataUrl,
            method: 'put',
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
          let formValidate = this.$util._.defaultsDeep({}, this.formValidate);
          formValidate.treeId = this.deptId;
          this.addMessTitle.ajaxParams.url = this.getDataUrl + this.deptId;
          this.addMessTitle.ajaxParams.data = formValidate;
          isLoadingFun(true);
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },
      /*
     * 点击提交按钮 监听是否验证通过
     * @param formName string  form表单v-model数据对象名称
     * @return flag boolean   form表单验证是否通过
     * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      resetForm (formName) {
        // this.$refs[formName].resetFields();
        this.formValidate.score = null;
        this.formValidate.evaCriteria = null;
        this.formValidate.remark = null;
      }
    },
    created () {
      this.init();
    },
    watch: {
      operailityData (data) {
        this.formValidate = data;
      }
    },
    mounted () {
    },
    components: {}
  };

</script>
