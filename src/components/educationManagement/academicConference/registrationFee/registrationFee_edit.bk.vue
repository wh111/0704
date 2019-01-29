<!--
****--@name     费用修改
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row class="editForm">
      <!-- 表单 -->
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="90px">
        <el-col :span="12">
          <el-form-item label="会务费：" prop="conferenceFee">
            <el-input v-model="formValidate.conferenceFee"><template slot="append">元</template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="差旅费：" prop="travelFee">
            <el-input v-model="formValidate.travelFee"><template slot="append">元</template></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="住宿费：" prop="hotelFee">
            <el-input v-model="formValidate.hotelFee"><template slot="append">元</template></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="附件：">
            <uploadFile @setUploadFiles="setUploadFiles" :uploadFiles="files"></uploadFile>
          </el-form-item>
        </el-col>
      </el-form>
      <!-- 操作按钮 -->
      <el-col :span="6" :offset="6" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="6" align="center">
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {meetingRegistrationFee as rules} from '../../rules';
  import uploadFile from '../../../common/uploadFile.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      operailityData: {
        type:Object,
        default: () => ({id:''})
      }
    },
    data() {
      return {
        rules,
        files: [],
        // 表单数据
        formValidate: {
          id: '',
          conferenceFee: '', // 会务费
          travelFee: '', // 差旅费
          hotelFee: '', // 住宿费
          files: '', // 附件ID，多个逗号隔开
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        messTitle: {
          type: this.operailityData.id ? 'edit' : 'add',
          successTitle: this.operailityData.id ? '修改成功!' : '添加成功!',
          errorTitle: this.operailityData.id ? '修改失败!' : '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modifyFee.path,
            method: api.modifyFee.method
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        //给当前组件注入全局util
        Util = this.$util;

        if (this.operailityData.id) {
          this.getEditData()
        }
      },
      // 获取编辑数据
      getEditData(){
        let opt = {
          ajaxSuccess: "getEditDataSuccess",
          ajaxParams:{
            url: api.get.path + this.operailityData.id,
            method:api.get.method
          }
        };
        this.ajax(opt)
      },
      // 初始化编辑数据
      getEditDataSuccess(res){
        if(!res.data || !res.data.id){
          return
        }

        for(let key in this.formValidate){
          if(res.data[key]){
            this.formValidate[key] = res.data[key]
          }
        }

        // 附件
        let filesIds = [];
        (res.data.files || []).map(item => {
          this.files.push({
            fileId: item.id,
            fileName: item.oldName,
            filePath: '/api/file/download/' + item.id
          })
          filesIds.push(item.id);
        });

        this.formValidate.files = filesIds.join(',')
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
          this.messTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.messTitle, isLoadingFun)
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
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      // 上传附件
      setUploadFiles(ids) {
        this.formValidate.files = ids;
      },
      // 取消
      cancel() {
        this.$emit('cancel', this.messTitle.type)
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      uploadFile,
    }
  }

</script>
