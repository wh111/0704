<!----------------------------------
****--@name     网上预审
****--@role     教育处
****--@date     2017/7/10
****--@author   gx
----------------------------------->
<template>
  <div id="content" ref="content">
    <!-- 模态框  安排面试 -->
    <el-row>
      <el-col :span="20" :offset="4">
        <el-form :inline="true" :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline">
          <el-form-item label="报道时间:" prop="checkInTime">
            <el-date-picker
              v-model="formValidate.checkInTime"
              type="date"
              :editable="false"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="14" :offset="4">
        <el-form ref="formValidate" :model="formValidate" label-width="80px">
          <el-form-item label="审核结果" prop="auditStatus">
            <el-radio-group v-model="formValidate.type">
              <el-radio label="Y">通过</el-radio>
              <el-radio label="N">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formValidate.type==='N'" label="审核意见" prop="desc">
            <el-input type="textarea" v-model="formValidate.rejectReason"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" align="center">
        <el-button @click="addCall" type="primary">提交</el-button>
        <el-button @click="$emit('cancel')">取消</el-button>
        <!--<el-button class="but-col" @click="addCall('N')">不通过</el-button>-->
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import show from './OnlinePrequalification_view.vue'
  import { OnlinePrequalification as rules } from '../../rules.js'
  //当前组件引入全局的util
  let Util = null
  export default {
    props: ['url', 'operailityData'],
    data () {
      return {
        rules,
        excelExportUrl: '',
        formValidate: {
          type: 'Y',
          checkInTime: '',
          rejectReason: '',
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
      },
      // 审核回调
      addCall () {
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          let opt = {
            type: 'add',
            successTitle: '审核成功!',
            errorTitle: '审核失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: api.modifyState.path + this.operailityData.subjectsId,
              method: api.modifyState.method,
              params: this.formDate(this.$util._.defaultsDeep({}, this.formValidate), ['checkInTime'], 'yyyy-MM-dd')
            }
          }
          this.ajax(opt)
        }
      },

      /*
     * 点击提交按钮 监听是否验证通过
     * @param formName string  form表单v-model数据对象名称
     * @return flag boolean   form表单验证是否通过
     * */
      submitForm (formName) {
        let flag = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {
      show
    }
  }
</script>
