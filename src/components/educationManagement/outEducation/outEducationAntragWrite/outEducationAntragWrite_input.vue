<!--
****--@name     外出进修填写
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-form :inline="true" :model="formValidate" ref="formValidate" :rules="rules" labek-width="0">
      <h1 align="center">{{ hospitalName }}外出进修申请</h1>
      <table class="el-table oeawInputTable">
        <tbody>
          <tr>
            <td width="140" align="center">
              <p class="cell">姓名</p>
            </td>
            <td>
              <div class="cell">
                {{formValidate.userName}}
              </div>
            </td>
            <td width="140" align="center">
              <p class="cell">性别</p>
            </td>
            <td>
              <div class="cell">
                {{formValidate.sex=='BOY'?'男':formValidate.sex=='GIRL'?'女':formValidate.sex}}
                <!--<el-radio-group v-model="formValidate.sex">-->
                  <!--<el-radio label="BOY">男</el-radio>-->
                  <!--<el-radio label="GIRL">女</el-radio>-->
                <!--</el-radio-group>-->
              </div>
            </td>
            <td width="140">
              <p class="cell">出生年月</p>
            </td>
            <td>
              <div class="cell">
                {{formValidate.birthday}}
                <!--<el-date-picker v-model="formValidate.birthday" type="month" :editable="false" placeholder="请选择"></el-date-picker>-->
              </div>
            </td>
          </tr>
          <tr>
            <td align="center">
              <p class="cell"><span style="color: #ff4949">*</span>来院工作时间</p>
            </td>
            <td class="valiTableStyle">
              <div class="cell" >
                <el-form-item prop="workDate">
                  <el-date-picker v-model="formValidate.workDate" type="date" :editable="false" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </div>
            </td>
            <td align="center">
              <p class="cell"><span style="color: #ff4949">*</span>定职时间</p>
            </td>
            <td class="valiTableStyle">
              <div class="cell" align="center">
                <el-form-item prop="entryDate">
                  <el-date-picker v-model="formValidate.entryDate" type="date" :editable="false" placeholder="选择日期"></el-date-picker>
                </el-form-item>
              </div>
            </td>
            <td>
              <p class="cell"><span style="color: #ff4949">*</span>专业技术职称</p>
            </td>
            <td class="valiTableStyle">
              <div class="cell">
                <el-form-item prop="titles">
                 <el-input v-model="formValidate.titles"></el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td rowspan="2">
              <div class="cell">最后学历（包括毕业时间、学校、科系、学位）</div>
            </td>
            <td colspan="5" class="valiTableStyle">
              <div class="cell" >
                  <el-form-item label="国内："  prop="domesticEdu" style="width: 750px">
                    <el-input v-model="formValidate.domesticEdu"  type="textarea" style="width: 640px"  :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                  </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="5"  class="valiTableStyle">
              <div class="cell">
                  <el-form-item label="国外：" prop="foreignEdu" style="width:750px">
                    <el-input v-model="formValidate.foreignEdu" style="width: 650px" type="textarea" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                  </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell"><span style="color: #ff4949">*</span>主要研究方向</div>
            </td>
            <td colspan="5"  class="valiTableStyle">
              <div class="cell">
                <el-form-item  prop="direction" style="width: 750px">
                  <el-input v-model="formValidate.direction" style="width: 705px" type="textarea" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell"><span style="color: #ff4949">*</span>申请进修医院</div>
            </td>
            <td colspan="5"  class="valiTableStyle" >
              <div class="cell">
                <el-form-item  prop="hospital" style="width: 750px">
                  <el-input v-model="formValidate.hospital"  style="width: 705px" type="textarea" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell"><span style="color: #ff4949">*</span>进修科目</div>
            </td>
            <td colspan="5" class="valiTableStyle">
              <div class="cell" >
                <el-form-item  prop="deptName" style="width: 700px">
                   <el-input v-model="formValidate.deptName" style="width: 705px" type="textarea" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell"><span style="color: #ff4949">*</span>进修时间</div>
            </td>
            <td colspan="5" class="valiTableStyle">
              <div class="cell">
                <date-group :dateGroup="{text:'',startDate:formValidate.startTime,endDate:formValidate.endTime}">
                  <el-form-item  prop="startTime">
                   <el-date-picker v-model="formValidate.startTime" type="date" :editable="false" placeholder="选择日期" class="jxTimeInput" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
                  </el-form-item>
                    <span>至</span>
                  <el-form-item  prop="endTime">
                   <el-date-picker v-model="formValidate.endTime" type="date" :editable="false" placeholder="选择日期" class="jxTimeInput" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
                  </el-form-item>
                </date-group>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">Email地址</div>
            </td>
            <td colspan="2" class="valiTableStyle">
              <div class="cell">
                <el-form-item  prop="email">
                  <el-input v-model="formValidate.email"></el-input>
                </el-form-item>
              </div>
            </td>
            <td>
              <div class="cell"><span style="color: #ff4949">*</span>手机号</div>
            </td>
            <td colspan="2" class="valiTableStyle">
              <div class="cell">
                <el-form-item  prop="mobile">
                 <el-input v-model="formValidate.mobile"></el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell"><span style="color: #ff4949">*</span>进修费</div>
            </td>
            <td colspan="2"  class="valiTableStyle">
              <div class="cell" >
                <el-form-item prop="studyFee">
                  <el-input v-model="formValidate.studyFee" placeholder="0">
                  </el-input>
                </el-form-item>
              </div>
            </td>
            <td>
              <div class="cell"><span style="color: #ff4949">*</span>住宿费</div>
            </td>
            <td colspan="2"   class="valiTableStyle">
              <div class="cell">
                <el-form-item prop="hotelFee">
                   <el-input v-model="formValidate.hotelFee" placeholder="0"></el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell"><span style="color: #ff4949">*</span>交通费</div>
            </td>
            <td colspan="2" class="valiTableStyle">
              <div class="cell">
                <el-form-item prop="trafficFee">
                 <el-input v-model="formValidate.trafficFee" placeholder="0"></el-input>
                </el-form-item>
              </div>
            </td>
            <td></td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td colspan="6">
              <div class="cell" align="center">
                <h3>主要经历（从大学开始，包括境外学习、工作经历）</h3>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="cell">起止年月</div>
            </td>
            <td colspan="3">
              <div class="cell">工作（学习）单位与内容</div>
            </td>
            <td>
              <div class="cell">职称、职务</div>
            </td>
          </tr>
          <!-- 循环开始 -->
          <tr v-for="(item,index) in formValidate.studyRecord">

            <td colspan="2">
              <date-group :dateGroup="{text:'',startDate:item.startDate,endDate:item.endDate}">
                <el-date-picker v-model="item.startDate" type="month" :editable="false" placeholder="选择日期" class="jxTimeInput" :picker-options="pickerOptions0" @change="handleStartTime"></el-date-picker>
                <span>至</span>
                <el-date-picker v-model="item.endDate" type="month" :editable="false" placeholder="选择日期" class="jxTimeInput" :picker-options="pickerOptions1" @change="handleEndTime"></el-date-picker>
              </date-group>
            </td>

            <td colspan="3">
              <div class="cell">
                   <el-input v-model="item.content" type="textarea" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-input v-model="item.duty" type="textarea" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
              </div>
            </td>
          </tr>
          <!-- 循环结束 -->
          <tr>
            <td>
              <div class="cell">附件</div>
            </td>
            <td colspan="5">
              <div class="cell upFileBox">
                <upload-file @setUploadFiles="setUploadFiles" :uploadFiles="files"></upload-file>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 操作按钮 -->
      <el-row style="margin-top: 20px;">
        <el-col :span="6" :offset="6" align="center">
          <el-button type="info" @click="save('NOT_SUBMIT')">保存</el-button>
          <!--<load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>-->
        </el-col>
        <el-col :span="6" align="center">
          <el-button type="success" @click="saves('NOT_AUDIT')">上报</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import {outEducationAntragInput as rules} from '../../rules'
  import api from './api';
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
        hospitalName: '',
        files: [],
        formValidate: {
          "id": '',
          "userId": "",
          "userName": "",
          "sex": "",
          "birthday": "",
          "workDate": "",
          "entryDate": "",
          "titles": "",
          "domesticEdu": "",
          "foreignEdu": "",
          "direction": "",
          "hospital": "",
          "deptId": "",
          "deptName": "",
          "startTime": "",
          "endTime": "",
          "email": "",
          "mobile": "",
          "studyFee": "",
          "hotelFee": "",
          "trafficFee": "",
          "status": "0",
          "files": "",
          "studyRecord": [
            {
              "startDate":"",
              "endDate":"",
              "content":"",
              "duty":""
            },
            {
              "startDate":"",
              "endDate":"",
              "content":"",
              "duty":""
            },
            {
              "startDate":"",
              "endDate":"",
              "content":"",
              "duty":""
            },
            {
              "startDate":"",
              "endDate":"",
              "content":"",
              "duty":""
            },
            {
              "startDate":"",
              "endDate":"",
              "content":"",
              "duty":""
            },
          ]
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
            jsonString: true,
            url: api.save.path,
            method: api.save.method
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.hospitalName = this.$store.state.envPath.hospitalName;
        //给当前组件注入全局util
        Util = this.$util;

        if (this.operailityData.id) {
          this.getEditData()
        }else {
          // 当前申请人
          let thisUserInfo = this.$store.getters.getUserInfo;
          this.formValidate.userId = thisUserInfo.id;
          this.formValidate.userName = thisUserInfo.name;
          this.formValidate.sex = thisUserInfo.sex;
          if(thisUserInfo.birth){
            this.formValidate.birthday = this.yearMonth(thisUserInfo.birth);
          }
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
        res.data.studyFee = res.data.studyFee / 100;
        res.data.hotelFee = res.data.hotelFee / 100;
        res.data.trafficFee = res.data.trafficFee / 100;
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

        this.formValidate.files = filesIds.join(',');

        // 经历（不足五个补齐）
        let l = (res.data.studyRecord || []).length;
        if(l < 5){
          for(let i = 0;i < (5-l);i++){
            this.formValidate.studyRecord.push({
              "startDate":"",
              "endDate":"",
              "content":"",
              "duty":""
            })
          }
        }
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saves (type) {
        let isSubmit = this.submitForm('formValidate');
        if (!isSubmit) return;
//          if (!isLoadingFun) isLoadingFun = function () {
//          };
        if (type) {
          this.formValidate.status = type;
          this.messTitle.successTitle = '上报成功';
          this.messTitle.errorTitle = '上报失败';
        }
//          isLoadingFun(true);
        let formValidates = Util._.defaultsDeep({}, this.formValidate);
        formValidates.studyFee = formValidates.studyFee * 100;
        formValidates.hotelFee = formValidates.hotelFee * 100;
        formValidates.trafficFee = formValidates.trafficFee * 100;
        this.messTitle.ajaxParams.data = this.getFormData(formValidates);
        let data = this.messTitle.ajaxParams.data;
        data.birthday = this.conductDate(data.birthday, 'yyyy-MM') || '';
        data.workDate = this.conductDate(data.workDate, 'yyyy-MM-dd') || '';
        data.entryDate = this.conductDate(data.entryDate, 'yyyy-MM-dd') || '';
        data.startTime = this.conductDate(data.startTime, 'yyyy-MM-dd') || ''
        data.endTime = this.conductDate(data.endTime, 'yyyy-MM-dd') || '';
        data.studyRecord.map(item => {
          if (item.startDate) {
            item.startDate = this.conductDate(item.startDate, 'yyyy-MM-dd') || '';
          }
          if (item.endDate) {
            item.endDate = this.conductDate(item.endDate, 'yyyy-MM-dd') || '';
          }
        });
        if (!data.studyFee) data.studyFee = '0';
        if (!data.hotelFee) data.studyFee = '0';
        if (!data.trafficFee) data.studyFee = '0';
        this.ajax(this.messTitle);
//        }
      },
      save(type) {
        let isSubmit = this.submitForm("formValidate");
        if (!isSubmit) return;
//          if (!isLoadingFun) isLoadingFun = function () {
//          };
        if (type) {
          this.formValidate.status = type;
          this.messTitle.successTitle = '保存成功';
          this.messTitle.errorTitle = '保存失败';
        }
//          isLoadingFun(true);
        let formValidates = Util._.defaultsDeep({}, this.formValidate);
        formValidates.studyFee = formValidates.studyFee * 100;
        formValidates.hotelFee = formValidates.hotelFee * 100;
        formValidates.trafficFee = formValidates.trafficFee * 100;
        this.messTitle.ajaxParams.data = this.getFormData(formValidates);
        let data = this.messTitle.ajaxParams.data;
        data.birthday = this.conductDate(data.birthday, 'yyyy-MM') || '';
        data.workDate = this.conductDate(data.workDate, 'yyyy-MM-dd') || '';
        data.entryDate = this.conductDate(data.entryDate, 'yyyy-MM-dd') || '';
        data.startTime = this.conductDate(data.startTime, 'yyyy-MM-dd') || ''
        data.endTime = this.conductDate(data.endTime, 'yyyy-MM-dd') || '';
        data.studyRecord.map(item => {
          if (item.startDate) {
            item.startDate = this.conductDate(item.startDate, 'yyyy-MM-dd') || '';
          }
          if (item.endDate) {
            item.endDate = this.conductDate(item.endDate, 'yyyy-MM-dd') || '';
          }
        })
        if(!data.studyFee)data.studyFee = '0';
        if(!data.hotelFee)data.studyFee = '0';
        if(!data.trafficFee)data.studyFee = '0';
        this.ajax(this.messTitle)
//        }
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
      // 取消
      cancel() {
        this.$emit('cancel', this.messTitle.type)
      },
      // 上传附件
      setUploadFiles(ids) {
        this.formValidate.files = ids;
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      uploadFile
    }
  }

</script>

<style lang="scss">
  .oeawInputTable {
    margin-top: 20px;
    overflow: auto;
    border: none;
    &:before,&:after {
      height: 0;
    }
    tr, td {
      border: 1px solid #bfcbd9;
    }
    .el-input__inner,.el-textarea__inner {
      border: none;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-date-editor.el-input{width: 100%;}
    .jxTimeInput.el-date-editor.el-input{width: 130px;}
    .upFileBox{padding-top:10px;padding-bottom: 10px;}
  }
</style>
