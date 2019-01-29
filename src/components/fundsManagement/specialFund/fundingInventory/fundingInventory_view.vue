<template>
  <div>
    <el-row>
      <el-form label-width="120px">
        <el-col>
          <el-form-item label="资金库名称：" prop="fundName">
            {{ formValidate.fundName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预期金额：" prop="totalOccurrenceMoney">
            {{ formValidate.totalOccurrenceMoney|money}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实际金额：" prop="accountingMoney">
            {{ formValidate.accountingMoney |money}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盘点时间：" prop="remarks">
            {{ formValidate.expenseTime}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盘点人：" prop="userName">
            {{ formValidate.userName}}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注：" prop="remarks">
            {{ formValidate.remarks || '-' }}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {
        formValidate: {
          fundId: '',
          totalOccurrenceMoney:"",
          accountingMoney:'',
          inventoryTime:'',
          inventoryName:'',
          fundName: '',
          fundCode: '',
          usedScope: '',
          regulation: '',
          remarks: '',
          expenseTime:'',
          userName:'',
        }
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        if (this.operailityData) {
          this.getViewData();
        }
      },
      // 获取编辑数据
      getViewData () {
        let opt = {
          ajaxSuccess: res => {
            this.formValidate=res.data
//            for (let key in this.formValidate) {
//              this.formValidate[key] = res.data[key];
//            }
          },
          ajaxError: () => this.errorMess('获取资金库资料失败'),
          ajaxParams: {
            url: api.get.path + this.operailityData.inventoryId,
            method: api.get.method
          }
        };
        this.ajax(opt);
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


<style scoped>

</style>
