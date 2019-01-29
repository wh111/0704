<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="skillWrite" class="demo-form-inline" label-width="90px">

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="科室:" prop="name">
            {{formValidate.depName}}
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="病人姓名:" prop="patientName">
            <el-input class="date-select-width" v-model="formValidate.patientName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="病历号:" prop="patienNo">
            <el-input class="select-width" v-model="formValidate.patienNo" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="日期:" prop="fillTime">
            <el-date-picker
              :editable="false"
              v-model="formValidate.fillTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="操作名称:" prop="disTitle">
            <el-select style="width: 100%;" multiple v-model="formValidate.disTitle" placeholder="请选择">
              <el-option v-if="role=='SXS'||role=='JXS'" v-for="item in getMyRotaryRequirements" :key="item.id"
                         :label="item.disTitle+'(科室要求:'+item.disNum+'未填:'+item.wwc+'掌握程度:'+item.deMasterDegree+')'"
                         :value="item.outlineRequireId+'-'+item.disTitle"></el-option>
              <el-option v-if="role=='ZYY'||role=='YJS'" v-for="item in getMyRotaryRequirements" :key="item.id"
                         :label="item.disTitle+'(科室要求:'+item.disNum+'未填:'+item.wwc+'掌握程度:'+item.deMasterDegree+')'"
                         :value="item.deId+'-'+item.disTitle"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="成功:" prop="isSuccess">
            <el-radio-group v-model="formValidate.isSuccess">
              <el-radio class="radio" label="Y">是</el-radio>
              <el-radio class="radio" label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formValidate.isSuccess=='N'">
        <el-col :span="16" :offset="2">
          <el-form-item label="失败原因:" prop="reasonFailure">
            <el-input type="textarea" v-model="formValidate.reasonFailure"></el-input>
          </el-form-item>
        </el-col>
        </el-col >
      </el-row>

      <el-row>
        <el-col :span="16" :offset="2">
          <el-form-item label="相关证明材料:" prop="name">
            <upload-file :uploadFiles="formValidate.fileList" @setUploadFiles="expenseFileEvent"></upload-file>
          </el-form-item>
        </el-col>
        </el-col >
      </el-row>


    </el-form>

    <el-row>
      <el-col :span="16" :offset="2">
        <div style="margin-left: 100px">
          <load-btn @saveSubEvent="saveSubEvent" :btnData="saveBtn"></load-btn>
          <load-btn @appearSubEvent="appearSubEvent" v-if="whereFrom!=='audit'" :btnData="appearBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { skillWrite } from '../../rules'

  //当前组件引入全局的util
  let Util = null
  export default {
    props: ['operailityData', 'url', 'whereFrom'],
    data () {
      return {
        skillWrite,
        optionData: '',
        disTitle: [],
        getMyRotaryRequirements: '',
        depUrl: '',
        //保存按钮基本信息
        saveBtn: {title: '提交', callParEvent: 'saveSubEvent'}, //保存
        appearBtn: {title: '上报', callParEvent: 'appearSubEvent'},//上报
        //form表单bind数据
        formValidate: {
//          "skillId":12,
//          "podId":12,
//          "depId":12,
//          "depName":"111",
//          "patientName":"张三",
//          "patienNo":"1212121",
//          "fillTime":"2017-05-08",
//          "isSuccess":"是否成功",
//          "reasonFailure":"失败原因",
//          "disState":"NO_SUBMIT",
//          "poddIds":"1,2,3,4",
//          "poddNames":"1,2,3123123,1231234",
//          "createUserName":"填写人名称",
//          "createTime":"2017-05-08 12:00:00",
//          "fileList":[
//            {
//              "id":11,
//              "fileName":"123",
//              "fileType":"txt",
//              "fileUrl":"www.baidu.com"
//            }
//          ]
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'edit',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.diseaseRecordModify + this.operailityData.skillId,
            method: 'post',
            data: {},
          }
        },
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: '',  //向后台请求数据的地址

          }
        },
        getMessTitle: {
          ajaxSuccess: 'getListData',
          ajaxParams: {
            url: this.url.skillRecordGet + this.operailityData.skillId,  //向后台请求数据的地址

          }
        },
        role: '',
      }
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util
      let userInfo = this.$store.getters.getUserInfo
      let userType = userInfo.studentTypes
      this.ajax(this.getMessTitle)
    },
    mounted () {
      //暂时没有初始化,预留初始化入口
    },
    methods: {
      getListData (res) {
        let data = res.data
        if (!data) return
        data.disTitle = []
        let poddIds = []
        let poddNames = []
        if (!data.deId) {
          data.deId = []
        } else {
          poddIds = (data.deId + '').split(',')
          poddNames = data.deName.split(',')
          for (let i = 0; i < poddIds.length; i++) {
            data.disTitle.push(poddIds[i] + '-' + poddNames[i])
          }
        }
        this.formValidate = data
        this.podIdChange(data.podId)
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun, flag) {
        let isSubmit = this.submitForm('formValidate')
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          }
          isLoadingFun(true)
          let formValidate = this.getFormData(this.formValidate)
          let poddIds = []
          let poddNames = []
          for (let i = 0; i < this.formValidate.disTitle.length; i++) {
            let disTitle = this.formValidate.disTitle[i].split('-')
            poddIds.push(disTitle[0])
            poddNames.push(disTitle[1])

          }
          formValidate.poddIds = poddIds.join(',')
          formValidate.poddNames = poddNames.join(',')
          if (formValidate.isSuccess == 'Y') {
            formValidate.reasonFailure = ''
          }

          this.addMessTitle.ajaxParams.data = this.formDate(formValidate, ['fillTime'], 'yyyy-MM-dd')
          this.ajax(this.addMessTitle, isLoadingFun)
        }
      },

      //添加
      saveSubEvent () {
        let addMessTitle = {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.skillRecordModify + this.operailityData.skillId,
            method: 'put',
            data: {},
          }
        }
        this.addMessTitle = addMessTitle
        this.listenSubEvent()
      },
      //上报
      appearSubEvent () {
        let addMessTitle = {
          type: 'edit',
          successTitle: '上报成功!',
          errorTitle: '上报失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.modifySubmit + this.operailityData.skillId,
            method: 'put',
            data: {},
          }
        }
        this.addMessTitle = addMessTitle
        this.listenSubEvent()
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
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel () {
        this.$emit('cancel', this.addMessTitle.type)
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data)
        return myData
      },
      /*
       * 组件初始化入口
       * */
      init () {
        //this.ajax(this.listMessTitle)
      },
      //轮转科室改变重新获取病种名称
      podIdChange (val) {
        let listMessTitle = {
          ajaxSuccess: 'podIdChangeListData',
          ajaxParams: {
            url: this.url.getMyRotaryRequirements + 'jn-' + val,

          }
        }

        //获取当前登录人来判定调用那个接口来获取技能和病种名称
        let userInfo = this.$store.getters.getUserInfo
        let role = userInfo.roleList[0].identify
        this.role = role
        if (role == 'SXS' || role == 'JXS') {
          listMessTitle.ajaxParams.url = this.url.getMyRotaryRequirements + 'jn-' + val
        } else if (role == 'ZYY' || role == 'YJS') {
          listMessTitle.ajaxParams.url = this.url.ZYYgetMyRotaryRequirements + 'jn_' + val
        }

        this.ajax(listMessTitle)

      },

      podIdChangeListData (res) {
        let data = res.data
        if (!data) return

        this.getMyRotaryRequirements = data
        this.formValidate.poddIds = []

      },

      expenseFileEvent (ids) {
        this.formValidate.fileIds = ids
      },
    }
  }
</script>
