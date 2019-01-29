<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <!--<h1 align="center">{{ hospitalName }}外出进修费用报销</h1>-->
    <el-form>
      <table class="el-table oeawInputTable erbInputTable">
        <tbody>
        <tr>
          <td width="140" align="center">
            <p class="cell">姓名</p>
          </td>
          <td>
            <div class="cell">
              {{ showData.userName }}
            </div>
          </td>
          <td width="140" align="center">
            <p class="cell">性别</p>
          </td>
          <td>
            <div class="cell">
              {{ showData.sex | typeText }}
            </div>
          </td>
          <td>
            <p class="cell">职称</p>
          </td>
          <td>
            <div class="cell">
              {{ showData.titles }}
            </div>
          </td>
        </tr>

        <tr>
          <td>
            <div class="cell">进修时间</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ showData.startTime }}
              <span>至</span>
              {{ showData.endTime }}
            </div>
          </td>
          <td>
            <div class="cell">手机号</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ showData.mobile }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">进修费</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ showData.studyFee/100 }}
            </div>
          </td>
          <td>
            <div class="cell">住宿费</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ showData.hotelFee/100 }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">交通费</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ showData.trafficFee/100 }}
            </div>
          </td>
          <td></td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td colspan="6">
            <div class="cell" align="center">费用报销</div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">进修费</div>
          </td>
          <td>
            <div class="cell tableFormInput">
              <el-form-item prop="studyCost">
                <el-input v-model="formValidate.studyCost" placeholder="请填写报销费用"></el-input>
              </el-form-item>
            </div>
          </td>
          <td>
            <div class="cell">住宿费</div>
          </td>
          <td>
            <div class="cell tableFormInput">
              <el-form-item prop="hotelCost">
                <el-input v-model="formValidate.hotelCost" placeholder="请填写报销费用"></el-input>
              </el-form-item>
            </div>
          </td>
          <td>
            <div class="cell">交通费</div>
          </td>
          <td>
            <div class="cell tableFormInput">
              <el-form-item prop="trafficCost">
                <el-input v-model="formValidate.trafficCost" placeholder="请填写报销费用"></el-input>
              </el-form-item>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </el-form>
    <!-- 操作按钮 -->
    <p style="margin-top: 20px;" align="center">
      <el-button type="info" @click="save">保存</el-button>
    </p>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../outEducationAntragWrite/api';
  //  import {expenseReimbursement as rules} from '../../rules';
  import uploadFile from '../../../common/uploadFile.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
//        rules:{},
        hospitalName: '',
        files: [],
        showData: {
          "userName": "",
          "sex": "BOY",
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
          "studyRecord": [],
        },
        formValidate: {
          id: '',
          studyCost: '', // 实际进修费
          hotelCost: '', // 实际住宿费
          trafficCost: '', // 实际交通费
          files: '', // 附件，多个逗号隔开
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '保存成功!',
          errorTitle: '保存失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.saveCost.path,
            method: api.saveCost.method
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        //给当前组件注入全局util
        Util = this.$util;
        this.hospitalName = this.$store.state.envPath.hospitalName;
        this.getShowData();
      },
      // 获取编辑数据
      getShowData() {
        let opt = {
          ajaxSuccess: "getShowDataSuccess",
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      // 初始化编辑数据
      getShowDataSuccess(res) {
        res.data.studyCost = res.data.studyCost / 100;
        res.data.hotelCost = res.data.hotelCost / 100;
        res.data.trafficCost = res.data.trafficCost / 100;
        if (!res.data || !res.data.id) {
          return
        }
        for (let key in this.showData) {
          if (res.data[key]) {
            this.showData[key] = res.data[key]
          }
        }
        for (let key in this.formValidate) {
          if (res.data[key]) {
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
          });
          filesIds.push(item.id);
        });

        this.formValidate.files = filesIds.join(',');

        // 经历（不足五个补齐）
        let l = (res.data.studyRecord || []).length;
        if (l < 5) {
          for (let i = 0; i < (5 - l); i++) {
            this.formValidate.studyRecord.push({
              "startDate": "",
              "endDate": "",
              "content": "",
              "duty": ""
            })
          }
        }
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      save() {
        if (this.checkData()) {
          let formValidates = Util._.defaultsDeep({}, this.formValidate);
          console.log(formValidates);
          formValidates.studyCost = formValidates.studyCost * 100;
          formValidates.hotelCost = formValidates.hotelCost * 100;
          formValidates.trafficCost = formValidates.trafficCost * 100;
          this.addMessTitle.ajaxParams.data = this.getFormData(formValidates);
          this.ajax(this.addMessTitle)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      checkData() {
        let flag = true;
        let num = {'studyCost':'进修费','hotelCost':'住宿费','trafficCost':'交通费'};
        for (let key in num){
          if (/^\d+\.\d+$/.test(this.formValidate[key])) {
            if (!/^\d{0,7}\.?\d{0,2}$/.test(this.formValidate[key])) {
              this.errorMess(`“${num[key]}”最多两位小数的数字且整数部分不能超过7位`);
              return false;
            }
          } else if (!/^\d{0,7}$/.test(this.formValidate[key])) {
            this.errorMess(`“${num[key]}”整数不能超过7位`);
            return false;
        }
        }
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

<style lang="scss">
  /*.erbInputTable{*/
    /*.el-form-item{margin-bottom: 20px;}*/
  /*}*/
  /*.tableFormInput{height: 60px;}*/
</style>
