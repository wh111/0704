<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="110px">
      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="标题：" prop="title" class="feildFontweight">
            <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" :offset="2">
          <el-form-item label="对象：" class="feildFontweight" prop="roleId">
            <el-select v-model="formValidate.roleId" placeholder="请选择">
              <el-option v-for="(item,index) in roleOptions" :label="item.name" :key="index" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="评分表：" class="feildFontweight" prop="scoreTableName">
            <el-input v-model="formValidate.scoreTableName" readonly @focus="selectTemp" style="width: 210px;"
                      placeholder="点击选择评分表"></el-input>
            <el-button @click="showSelectTemp" type="info" :disabled="!formValidate.scoreTableId">预览</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <date-group :dateGroup="{text:'',startDate:formValidate.startDate,endDate:formValidate.endDate}" class="el-form--inline">

            <el-form-item name="start" label="自荐时间：" labelWidth="110px" class="feildFontweight pmStartDateBox" prop="startDate">
              <el-date-picker v-model="formValidate.startDate" type="date" :editable="false" placeholder="选择日期"
                              :picker-options="pickerOptions0" @change="handleStartTime">
              </el-date-picker>
            </el-form-item>
            <span class="pmDateText">到</span>
            <el-form-item name="end" labelWidth="10px" prop="endDate" class="pmEndDateBox">
              <el-date-picker v-model="formValidate.endDate" align="right" type="date" :editable="false"
                              placeholder="选择日期" :picker-options="pickerOptions1" @change="handleEndTime">
              </el-date-picker>
            </el-form-item>
          </date-group>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="说明：" prop="explains" class="feildFontweight">
            <el-input type="textarea" v-model="formValidate.explains" :rows="5" resize="none"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="相关证明材料：" class="feildFontweight">
            <upload-file :uploadFiles="fileList" @setUploadFiles="setUploadFiles"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <el-row>
      <el-col :span="10" :offset="2">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancelEdit">取消</el-button>
        </div>
      </el-col>
    </el-row>

    <!--选择评分表-->
    <Modal :mask-closable="false" v-model="selectTempModal" height="200" title="对话框标题"
           class-name="vertical-center-modal"
           :loading="true" :width="1000">
      <modal-header slot="header" :content="selectTempId"></modal-header>
      <select-temp v-if="selectTempModal" @cancel="cancel" @selectTemp="selectTempCall" :onlyOne="true"
                   :url="selectApi"></select-temp>
      <div slot="footer"></div>
    </Modal>
    <!--查看弹窗-->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :loading="true" :width="1000">
      <modal-header slot="header" :content="showId"></modal-header>
      <show v-if="showModal" :url="selectApi" @cancel="cancel" :operaility-data="{id:formValidate.scoreTableId}"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  .pmStartDateBox{
    .el-form-item__content{margin-left: 0 !important;}
  }
  .pmEndDateBox{
    .el-form-item__label:before{display: none;}
  }
  .pmDateText{line-height: 36px;}
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {projectManagement as rules} from '../../rules';
  import selectApi from '../../../../teach/teachingEvaluation/app';
  import selectTemp from '../../../../teach/teachingEvaluation/evaluationActivitySet/evaluationActivitySet_add/add_baseInfo/baseInfo_temp.vue';
  import show from '../../../../teach/teachingEvaluation/evaluationManagement/evaluationManagement_view.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        selectApi,
        roleOptions: [],
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        selectTempId: {
          id: "selectTempId",
          title: "选择评分表",
        },
        showId: {
          id: "showId",
          title: "查看评分表",
        },
        selectTempModal: false,
        //form表单bind数据
        fileList: [],
        //form表单bind数据
        formValidate: {
          id: "",
          "title": "", //标题
          "roleId": "", //角色id
          "scoreTableId": "", //评分表Id
          scoreTableName: "",
          "startDate": "", //自荐开始时间
          "endDate": "", //自荐结束时间
          "explains": "", //说明
          fileIds: "",                       //附件id字符串
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        editType: 'add',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.getRoleOptions();
        if (this.operailityData) {
          this.editType = 'edit';
          //默认请求加载数据
          this.getEditData();
        }
      },
      getRoleOptions() {
        let opt = {
          ajaxSuccess: res => {
            this.roleOptions = res.data;
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.relusList.path,
            method: api.relusList.method,
          }
        };
        this.ajax(opt)
      },
      getEditData() {
        let opt = {
          ajaxSuccess: res => {
            if (res.data instanceof Object) {
              for (let key in this.formValidate) {
                this.formValidate[key] = res.data[key]
              }
              this.fileList = res.data.fileList;
            }
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method,
          }
        };
        this.ajax(opt)
      },
      selectTemp() {
        this.selectTempModal = true
      },
      selectTempCall(res) {
        let d = res;
        this.formValidate.scoreTableId = d.id;
        this.formValidate.scoreTableName = d.name;
        this.cancel('selectTemp')
      },
      showSelectTemp() {
        this.showModal = true
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        let msg = {
          add: "添加",
          edit: "修改"
        };
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let opt = {
            type: this.editType,
            successTitle: msg[this.editType] + '成功',
            errorTitle: msg[this.editType] + '失败',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api[this.editType].path + (this.editType === 'add' ? '' : this.operailityData.id),
              method: api[this.editType].method,
              data: this.formDate(this.getFormData(this.formValidate), ['startDate', 'endDate'], this.yearMonthData)
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
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancelEdit() {
        this.$emit('cancel', this.editType);
      },
      cancel(type) {
        this[type + 'Modal'] = false;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },

      // 上传文件
      setUploadFiles(ids) {
        this.formValidate.fileIds = ids;
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      selectTemp, show
    }
  }

</script>
