<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <h1 align="center">{{ hospitalName }}外出进修情况汇报</h1>
    <el-form :model="formValidate" ref="formValidate" :rules="rules">
      <table class="el-table oerwInputTable">
        <tbody>
          <tr>
            <td width="150" align="center">
              <div class="cell">姓名</div>
            </td>
            <td>
              <div class="cell">{{ showData.userName }}</div>
            </td>
            <td width="150" align="center">
              <div class="cell">科室</div>
            </td>
            <td>
              <div class="cell">{{ showData.direction }}</div>
            </td>
          </tr>
          <tr>
            <td width="150" align="center">
              <div class="cell">外派进修单位</div>
            </td>
            <td>
              <div class="cell">{{ showData.hospital }}</div>
            </td>
            <td width="150" align="center">
              <div class="cell">进修科目</div>
            </td>
            <td>
              <div class="cell">{{ showData.deptName }}</div>
            </td>
          </tr>
          <tr>
            <td align="center">
              <div class="cell">进修时间</div>
            </td>
            <td colspan="3">
              <div class="cell">
                {{ showData.startTime }} 至 {{ showData.endTime }}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center">
              <div class="cell"><p class="tdTitle">进修情况总结</p></div>
            </td>
            <td colspan="3">
              <div class="cell">
                <el-form-item prop="summed">
                  <el-input
                    type="textarea" :autosize="{ minRows: 6, maxRows: 8}" placeholder="请输入内容" v-model="formValidate.summed">
                  </el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <div class="cell">
                <p class="suggest">需要说明的情况或建议：</p>
                <el-form-item prop="suggest">
                  <el-input
                    type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.suggest">
                  </el-input>
                </el-form-item>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="cell">附件</div>
            </td>
            <td colspan="3">
              <div class="cell">
                <div class="cell upFileBox">
                  <upload-file @setUploadFiles="setUploadFiles" :uploadFiles="files"></upload-file>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </el-form>
    <!-- 操作按钮 -->
    <el-row style="margin-top: 20px;">
      <el-col :span="6" :offset="6" align="center">
        <el-button type="info" @click="save('NOT_SUBMIT')">保存</el-button>
      </el-col>
      <el-col :span="6" align="center">
        <el-button type="success" @click="save('NOT_AUDIT')">上报</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from '../outEducationAntragWrite/api';
  import uploadFile from '../../../common/uploadFile.vue';
  import { outEducationReportWrite as rules } from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['operailityData'],
    data() {
      return {
        rules,
        hospitalName: '',
        files: [],
        showData:{
          userName: "", // 进修人姓名
          direction:"", // 主要研究方向
          hospital:"", // 申请进修医院
          deptName:"", // 进修科目名称
          startTime: "", // 进修开始时间
          endTime: "", // 进修截止时间
        },
        formValidate: {
          id: this.operailityData.id,
          summed: '', // 总结
          suggest: '', // 情况与建议
          files: '', // 附件，多个逗号隔开
          reportStatus: '', // 状态
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: this.operailityData.reportStatus?'edit':'add',
          successTitle: this.operailityData.reportStatus?'修改成功':'添加成功!',
          errorTitle: this.operailityData.reportStatus?'修改失败':'添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.saveReport.path,
            method: api.saveReport.method
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
        if (!res.data || !res.data.id) {
          return
        }

        for (let key in this.showData) {
          if (res.data[key]) {
            this.showData[key] = res.data[key]
          }
        }

        // 汇报是草稿状态
        if (res.data.reportStatus =='NOT_SUBMIT'){
          for (let key in this.formValidate) {
            if (res.data[key]) {
              this.formValidate[key] = res.data[key]
            }
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
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      save(type) {
        this.formValidate.reportStatus = type;
        if (type === 'NOT_AUDIT') {
          this.addMessTitle.successTitle = '上报成功';
          this.addMessTitle.errorTitle = '上报失败';
        }
        this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
        this.ajax(this.addMessTitle)
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
        this.$emit('cancel', this.addMessTitle.type)
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
  .oerwInputTable {
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
    .tdTitle{width: 20px;}
    .suggest{margin-top: 10px;}
    /*.el-form-item {*/
      /*margin-bottom: 20px;*/
    /*}*/
    .el-date-editor.el-input{width: 100%;}
    .upFileBox{padding-top:10px;padding-bottom: 10px;}
  }
</style>
