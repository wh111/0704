<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div class="meetSetContent">
    <h3>各职称参会次数设置：</h3>
    <el-row>
      <el-col :span="8" v-for="(item,index) in formValidate" :key="index">
        <el-form :model="item" ref="formValidate" :rules="rules" labelWidth="100px">
          <el-form-item :label="item.jobTitle" prop="participantsNum">
            <el-input v-model="item.participantsNum"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
  </div>
</template>
<style lang="scss">
  .meetSetContent {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    h3 {
      margin-bottom: 10px;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {meetSetNum as rules} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        rules,
        loading:false,
        formValidate: [],
        //保存按钮基本信息
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getParticipants()
      },
      // 获取数据
      getParticipants() {
        let opt = {
          ajaxSuccess: res => this.formValidate = res.data || [],
          ajaxError: () => this.errorMess('获取数据失败，请重试'),
          ajaxParams: {
            url: api.list.path,
            method: api.list.method
          }
        };
        this.ajax(opt)
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          let data = [];
          this.$util._.defaultsDeep([], this.formValidate).map(item=>{
            if(item.participantsNum == null){
              item.participantsNum = 10 // 默认值为10
            }
            data.push(item)
          })
          let opt = {
            ajaxSuccess: () => {
              this.successMess('保存成功');
              this.getParticipants();
            },
            ajaxError: () => this.errorMess('保存失败'),
            ajaxParams: {
              jsonString: true,
              url: api.save.path,
              method: api.save.method,
              data
            }
          };
          this.ajax(opt, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(name) {
        let flag = true;
        (this.$refs[name] || []).map(item=>{
          item.validate((valid) => {
            if (!valid) {
              flag = false;
            }
          });
        })
        return flag;
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
