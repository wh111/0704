<template>
  <div>
    <el-row>
      <el-form :model="formValidate"  ref="formValidate" :rules="rules" label-width="120px">
        <el-col>
          <el-form-item label="资金库名称:" prop="fundName">
            <template v-if="isEdit">{{formValidate.fundName}}</template>
            <el-input v-else v-model="formValidate.fundName" @focus="selectFunds" icon="search"
                      :on-icon-click="selectFunds" placeholder="请选择资金库"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预期金额：" prop="totalOccurrenceMoney">
            <el-input v-model="formValidate.totalOccurrenceMoney" placeholder="请输入预期金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际金额：" prop="accountingMoney">
            <el-input v-model="formValidate.accountingMoney" placeholder="实际金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!--<el-form-item label="盘点时间：" prop="expenseTime">-->
            <!--<el-input v-model="formValidate.expenseTime" placeholder="管理规定"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="盘点时间:" prop="expenseTime">
            <el-date-picker name="start" v-model="formValidate.expenseTime" :editable="false" type="date"
                            placeholder="选择时间" @change="handleExpenseTime"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盘点人：" prop="userName">
            {{formValidate.userName}}
            <!--<el-input v-model="formValidate.userName" placeholder="盘点人"></el-input>-->
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
    <!--选择资金库-->
    <Modal :mask-closable="false" v-model="selectFundsModal" height="200" class-name="vertical-center-modal"
           :width="900">
      <modal-header slot="header" :parent="self" :content="headerContent.selectFundsId"></modal-header>
      <select-funds v-if="selectFundsModal" @cancel="cancel('selectFunds')" @select="selectFundsCall" :onlyOne="true"
                    :select="[formValidate.fundId]"></select-funds>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  import {fundManagement as rules} from '../../rules';
  import selectFunds from '../capitalLibraryManagement/capitalLibraryManagement_select.vue';
  let Util = null;
  export default {
    name: 'fundingInventory_add',
    props: ['operailityData'],
    data () {
      return {self:this,
        rules,
        selectFundsModal:false,
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        headerContent: {
          selectFundsId: {id: 'selectFundsId', title: '选择资金库'},
          selectUserId: {id: 'selectUserId', title: '选择报销人'},
        },
        formValidate: {
          inventoryId:'',
          fundName: '',
          fundCode: '',
          totalOccurrenceMoney:"",
          accountingMoney:'',
          userName:'',
          expenseTime:'',
          usedScope: '',
          regulation: '',
          remarks: ''
        },
        isEdit: false
      };
    },
    methods: {
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 时间
      handleExpenseTime(val) {
        this.formValidate.expenseTime = val
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      //初始化请求列表数据
      init () {
        this.formValidate.userName=this.$store.state.userInfo.name
        if (this.operailityData) {
          this.getEditData();
          this.isEdit = true;
        }
      },
      // 选择资金库
      selectFunds() {
        this.openModel('selectFunds')
      },
      // 选择资金库
      selectFundsCall(arr) {
        this.formValidate.fundCode = arr[0].fundCode;
        this.formValidate.fundName = arr[0].fundName;
        this.selectFundsModal=false;
      },
      // 获取编辑数据
      getEditData () {
        let opt = {
          ajaxSuccess: res => {
            for (let key in this.formValidate) {
              this.formValidate[key] = res.data[key];
            }
          },
          ajaxError: () => this.errorMess('获取失败'),
          ajaxParams: {
            url: api.get.path + this.operailityData.inventoryId,
            method: api.get.method
          }
        };
        this.ajax(opt);
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');

        if (isSubmit) {
          console.log(0)
          if (!isLoadingFun) isLoadingFun = function () {};
          this.formValidate.expenseTime=this.conductDate(this.formValidate.expenseTime, 'yyyy-MM-dd');
          isLoadingFun(true);
          let opt = {
            type: this.isEdit ? 'edit' : 'add',
            successTitle: (this.isEdit ? '修改' : '增加') + '成功',
            errorTitle: (this.isEdit ? '修改' : '增加') + '失败',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: this.isEdit ? api.modify.path + this.operailityData.inventoryId : api.add.path,
              method: this.isEdit ? api.modify.method : api.add.method,
              data: this.getFormData(this.formValidate)
            }
          };
          this.ajax(opt, isLoadingFun);
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
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', this.isEdit ? 'edit' : 'add');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = this.$util._.defaultsDeep({}, data);
        return myData;
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {  selectFunds}
  };

</script>

<style scoped>

</style>
