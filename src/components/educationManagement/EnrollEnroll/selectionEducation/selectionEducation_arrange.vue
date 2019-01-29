<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules">
      <el-form-item label="科室：" prop="depId">
        <el-select v-model="formValidate.depId" placeholder="请选择" @change="changeAllName">
          <el-option
            v-for="(item,index) in allNameOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <p style="margin-top: 20px;" align="center">
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
    </p>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {selectionEducation as rules} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        allNameOptions: {},
        formValidate: {
          subjectsIds: '',
          depId: '',
          depName: '',
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '遴选人员到科室成功!',
          errorTitle: '遴选人员到科室失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modifyWehterSelection.path,
            method: api.modifyWehterSelection.method,
          }
        },
        //保存按钮基本信息
        loadBtn: {
          title: '确定',
          callParEvent: 'listenSubEvent'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        let ids = [];
        this.operailityData.map(item => ids.push(item.subjectsId));
        this.formValidate.subjectsIds = ids.join(',');
        this.getAllNameId()
      },
      getAllNameId() {
        let opt = {
          ajaxSuccess: res => {
            let t = {};
            (res.data || []).map(item => {
              t[item.id] = item
            })
            this.allNameOptions = t;
//            console.log(this.allNameOptions)
          },
          ajaxParams: {
            url: '/hospital/dept/query/allNameId'
          }
        };
        this.ajax(opt)
      },
      changeAllName(val) {
        this.formValidate.depName = this.allNameOptions[val].name
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.params = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },
      /*
      * 点击提交按钮 监听是否验证通过
      * @param formName string  form表单v-model数据对象名称
      * @return flag boolean   form表单验证是否通过
      * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
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
