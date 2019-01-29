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
      <el-table :maxHeight="300" :data="formValidate" tooltip-effect="dark" align="center" rules="rules">
        <el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="会议补贴" prop="trafficFee">
          <template scope="scope">
            <el-input v-model="scope.row.trafficFee"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="会务费" prop="conferenceFee">
          <template scope="scope">
            <el-input v-model="scope.row.conferenceFee"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="差旅费" prop="travelFee">
          <template scope="scope">
            <el-input v-model="scope.row.travelFee"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="住宿费" prop="hotelFee">
          <template scope="scope">
            <el-input v-model="scope.row.hotelFee"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <!-- 操作按钮 -->
      <div style="margin-top: 16px" v-if="formValidate.length">
        <el-col :span="6" :offset="6" align="center">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6" align="center">
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </div>
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
        type: Object,
        default: () => ({id: ''})
      }
    },
    data() {
      return {
        rules,
        files: [],
        // 表单数据
        formValidate: [
//          {
//            trafficFee: '',// 交通费
//            conferenceFee: '',// 会务费
//            travelFee: '',// 差率费
//            hotelFee: ''// 住宿费
//          }
        ],
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        messTitle: {
          type: 'edit',
          successTitle: '登记成功!',
          errorTitle: '登记失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            jsonString: true,
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
      getEditData() {
        let opt = {
          ajaxSuccess: "getEditDataSuccess",
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      // 初始化编辑数据
      getEditDataSuccess(res) {
        if (!res.data || !res.data.id) {
          return
        }

        this.formValidate = res.data.conferenceUserList || [];
        this.formValidate[0].trafficFee = this.formValidate[0].trafficFee / 100;
        this.formValidate[0].hotelFee = this.formValidate[0].hotelFee / 100;
        this.formValidate[0].travelFee = this.formValidate[0].travelFee / 100;
        this.formValidate[0].conferenceFee = this.formValidate[0].conferenceFee / 100;

      },
      /*
     * 点击提交按钮 监听是否提交数据
     * @param isLoadingFun boolean  form表单验证是否通过
     * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.checkData();
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);

          let formValidates = Util._.defaultsDeep({}, this.formValidate);
          formValidates[0].trafficFee = formValidates[0].trafficFee * 100;
          formValidates[0].hotelFee = formValidates[0].hotelFee * 100;
          formValidates[0].travelFee = formValidates[0].travelFee * 100;
          formValidates[0].conferenceFee = formValidates[0].conferenceFee * 100;
          console.log(formValidates);

          // Object.assign(formValidates, this.formValidate)
          this.messTitle.ajaxParams.data = this.getFormData(formValidates);
          this.ajax(this.messTitle, isLoadingFun)
        }
      },
      // 检查数据
      checkData() {
        let keys = {trafficFee: '会议补贴', conferenceFee: '会务费', travelFee: '差旅费', hotelFee: '住宿费'};
        for (let i = 0, l = this.formValidate.length; i < l; i++) {
          for (let key in keys) {
            if (/^\d+\.\d+$/.test(this.formValidate[i][key])) {
              if (!/^\d{0,7}\.?\d{0,2}$/.test(this.formValidate[i][key])) {
                this.errorMess(`${this.formValidate[i].userName} 的 ${keys[key]}最多两位小数的数字且整数部分不能超过7位`);
                return false;
              }
            } else if (!/^\d{0,7}$/.test(this.formValidate[i][key])) {
              this.errorMess(`${this.formValidate[i].userName} 的 ${keys[key]}必须为数字，并整数位不能超过7位`);
              return false;
            }
          }
        }
        return true
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
        let myData = Util._.defaultsDeep([], data);
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
