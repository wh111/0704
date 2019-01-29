<!--
****--@name     外出进修填写
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <h1 align="center">{{ hospitalName }}外出进修申请</h1>
    <table class="el-table oeawInputTable">
      <tbody>
        <tr >
          <td width="140" align="center">
            <p class="cell">姓名</p>
          </td>
          <td>
            <div class="cell">
              {{ formValidate.userName }}
            </div>
          </td>
          <td width="140" align="center">
            <p class="cell">性别</p>
          </td>
          <td>
            <div class="cell">
              {{ formValidate.sex | typeText }}
            </div>
          </td>
          <td width="140">
            <p class="cell">出生年月</p>
          </td>
          <td>
            <div class="cell">
              {{ formValidate.birthday }}
            </div>
          </td>
        </tr>
        <tr>
          <td align="center">
            <p class="cell">来院工作时间</p>
          </td>
          <td>
            <div class="cell">
              {{ formValidate.workDate }}
            </div>
          </td>
          <td align="center">
            <p class="cell">定职时间</p>
          </td>
          <td>
            <div class="cell" align="center">
              {{ formValidate.entryDate }}
            </div>
          </td>
          <td>
            <p class="cell">专业技术职称</p>
          </td>
          <td>
            <div class="cell">
              {{ formValidate.titles }}
            </div>
          </td>
        </tr>
        <tr>
          <td rowspan="2">
            <div class="cell">最后学历（包括毕业时间、学校、科系、学位）</div>
          </td>
          <td colspan="5">
            <div class="cell">
              <el-form labelWidth="56px">
                <el-form-item label="国内：">
                  {{ formValidate.domesticEdu }}
                </el-form-item>
              </el-form>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="5">
            <div class="cell">
              <el-form labelWidth="56px">
                <el-form-item label="国外：">
                  {{ formValidate.foreignEdu }}
                </el-form-item>
              </el-form>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">主要研究方向</div>
          </td>
          <td colspan="5">
            <div class="cell">
              {{ formValidate.direction }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">申请进修医院</div>
          </td>
          <td colspan="5">
            <div class="cell">
              {{ formValidate.hospital }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">进修科目</div>
          </td>
          <td colspan="5">
            <div class="cell">
              {{ formValidate.deptName }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">进修时间</div>
          </td>
          <td colspan="5">
            <div class="cell">
              {{ formValidate.startTime }}
              <span>至</span>
              {{ formValidate.endTime }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">Email地址</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ formValidate.email }}
            </div>
          </td>
          <td>
            <div class="cell">手机号</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ formValidate.mobile }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">进修费</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ formValidate.studyFee/100 }}
            </div>
          </td>
          <td>
            <div class="cell">住宿费</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ formValidate.hotelFee/100 }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="cell">交通费</div>
          </td>
          <td colspan="2">
            <div class="cell">
              {{ formValidate.trafficFee/100 }}
            </div>
          </td>
          <td></td>
          <td colspan="2"></td>
        </tr>
        <!-- 汇报通过、费用报销之后才可显示 -->
        <template v-if="['6','8'].indexOf(formValidate.status) > -1">
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
            <div class="cell">
              {{ formValidate.studyCost/100 || '——' }}
            </div>
          </td>
          <td>
            <div class="cell">住宿费</div>
          </td>
          <td>
            <div class="cell">
              {{ formValidate.hotelCost/100 || '——' }}
            </div>
          </td>
          <td>
            <div class="cell">交通费</div>
          </td>
          <td>
            <div class="cell">
              {{ formValidate.trafficCost/100 || '——' }}
            </div>
          </td>
        </tr>
        </template>
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
            <div class="cell">
              <template v-if="item.startDate">
                <span>{{ item.startDate }}</span>
                <span>至</span>
                <span>{{ item.endDate }}</span>
              </template>
            </div>
          </td>
          <td colspan="3">
            <div class="cell">
              {{ item.content }}
            </div>
          </td>
          <td>
            <div class="cell">
              {{ item.duty }}
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
              <upload-file :uploadFiles="files" :show="true"></upload-file>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!viewData">
      <el-row >
        <el-col :span="18" :offset="2" style="margin: 10px 0">
          <img :src="formValidate.hisProcess&&formValidate.hisProcess.base64Img" alt="" style="max-width:100%">
        </el-col >
      </el-row >
      <el-table
        v-if="formValidate.hisProcess && formValidate.hisProcess.listHisTaskLog!=0"
        align="center"
        :height="200"
        :data="formValidate.hisProcess.listHisTaskLog"
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;height: 100%">
        <el-table-column
          align="center"
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="spUserName"
          show-overflow-tooltip
          label="审核人">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="审核时间">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="mess"
          label="审核意见"
          align="center"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="status"
          label="审核状态"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import uploadFile from '../../../common/uploadFile.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      operailityData: {
        type:Object,
        default: () => ({id:''})
      },
      viewData:{
        type:Object,
        default: () => null
      },
      // 显示申请上报审核结果
      showReport:{
        type:Boolean,
        default: true,
      }
    },
    data() {
      return {
        hospitalName: '',
        files: [],
        formValidate: {
          "id": '',
          "userId": "",
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
          "studyCost":"",
          "hotelCost":"",
          "trafficCost":"",
          "status": "",
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
          ],
          hisProcess:'',
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.hospitalName = this.$store.state.envPath.hospitalName;
        //给当前组件注入全局util
        Util = this.$util;

        if(this.viewData){
          this.getEditDataSuccess(this.viewData)
        }else{
          this.getEditData()
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
