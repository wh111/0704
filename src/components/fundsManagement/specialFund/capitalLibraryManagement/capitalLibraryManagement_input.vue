<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row>
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="120px">
        <el-col>
          <el-form-item label="资金库名称：" prop="fundName">
            <el-input v-model="formValidate.fundName" placeholder="请输入资金库名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="经费代码：" prop="fundCode">
            <el-input v-model="formValidate.fundCode" placeholder="请输入经费代码"></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col>-->
          <!--<el-form-item label="使用范围：" prop="usedScope">-->
            <!--<el-input type="textarea" v-model="formValidate.usedScope" :autosize="{ minRows: 4, maxRows: 8}" placeholder="使用范围"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
          <el-col :span="16">
            <el-form-item  label="初始金额：" prop="fundMoney">
              <el-input style="width: 80%" v-model="formValidate.fundMoney" placeholder="请输入初始金额"></el-input> 元
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="系统默认：" prop="isSystem">
              <el-radio-group v-model="formValidate.isSystem">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col >
            <el-form-item label="使用范围：" prop="usedScope">
              <el-input type="textarea" v-model="formValidate.usedScope" :autosize="{ minRows: 4, maxRows: 8}" placeholder="使用范围"></el-input>
            </el-form-item>
          </el-col>
          <el-col >
          <el-form-item label="管理规定：" prop="regulation">
            <el-input type="textarea" v-model="formValidate.regulation" :autosize="{ minRows: 4, maxRows: 8}" placeholder="管理规定"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注：" prop="remarks">
            <el-input type="textarea" v-model="formValidate.remarks" :autosize="{ minRows: 4, maxRows: 8}" placeholder="资金库备注"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import {capitalLibraryManagement as rules} from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        formValidate: {
          fundId:"",
          fundName: "",
          fundCode: '',

          usedScope: '',
          regulation: '',
          remarks: "",
          isSystem:'1'
        },
        isEdit: false,
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        if(this.operailityData){
          this.getEditData();
          this.isEdit = true;
        }
      },
      // 获取编辑数据
      getEditData(){
        let opt = {
          ajaxSuccess:res=>{
            this.formValidate=res.data;
            this.formValidate.isSystem=this.formValidate.isSystem.toString()
          },
          ajaxError:()=>this.errorMess('获取资金库资料失败'),
          ajaxParams:{
            url:api.get.path + this.operailityData.fundId,
            method:api.get.method
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
          let opt = {
            type: this.isEdit ? 'edit' : 'add',
            successTitle: (this.isEdit ? '修改' : '增加') + '成功',
            errorTitle: (this.isEdit ? '修改' : '增加') + '失败',
            ajaxSuccess:"ajaxSuccess",
            ajaxError:"ajaxError",
            ajaxParams:{
              url: this.isEdit ? api.modify.path + this.formValidate.fundId : api.add.path,
              method: this.isEdit ? api.modify.method : api.add.method,
              data: this.getFormData(this.formValidate)
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
      cancel() {
        this.$emit('cancel', this.isEdit ? 'edit' : 'add');
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
