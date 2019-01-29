<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row>
      <el-form label-width="120px">
        <el-col>
          <el-form-item label="资金库名称：" prop="fundName">
            {{ formValidate.fundName }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="经费代码：" prop="remarks">
            {{ formValidate.fundCode || '-' }}
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="初始金额：" prop="remarks">
            {{ formValidate.fundMoney | money }}
          </el-form-item>
        </el-col>
        <el-col  :span="8">
          <el-form-item label="系统默认：" prop="remarks">
            {{ formValidate.isSystem=='1'?'是':'否' }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="使用范围：" prop="remarks">
            {{ formValidate.usedScope || '-' }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="管理规定：" prop="remarks">
            {{ formValidate.regulation || '-' }}
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
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        formValidate: {
          fundId:"",
          fundName: "",
          fundMoney:'',
          fundCode: '',
          usedScope: '',
          regulation: '',
          remarks: "",
          isSystem:'1'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        if (this.operailityData) {
          this.getViewData();
        }
      },
      // 获取编辑数据
      getViewData() {
        let opt = {
          ajaxSuccess: res => {
            for (let key in this.formValidate) {
              this.formValidate[key] = res.data[key]
            }
          },
          ajaxError: () => this.errorMess('获取资金库资料失败'),
          ajaxParams: {
            url: api.get.path + this.operailityData.fundId,
            method: api.get.method
          }
        };
        this.ajax(opt)
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
