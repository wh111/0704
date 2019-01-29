<!--
****--@name   出科会议填写
****--@role     未知
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row class="editForm">
      <!-- 表单 -->
      <el-form label-width="130px">
        <el-col :span="12">
          <el-form-item label="会议名称：" prop="name">
            {{ formValidate.name }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在部门：" prop="hosdeptName">
            {{ formValidate.hosdeptName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主办单位：" prop="sponsor">
            {{ formValidate.sponsor | dictionary(this, 'XSHY_ZBDW') }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会议类型：" prop="conferenceType">
            {{ formValidate.conferenceType | dictionary(this, 'XSHY_HYLX') }}
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">
          <el-form-item label="科室：" prop="hosdeptName">
            {{ formValidate.hosdeptName}}
          </el-form-item>
        </el-col>-->
        <el-col :span="12">
          <el-form-item label="职称：" prop="jobTitle">
            {{ formValidate.jobTitle}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参会身份：" prop="participationStatus">
            {{ formValidate.participationStatus}}
          </el-form-item>
        </el-col>
        <!--<el-col>
          <el-form-item label="参加人员：" prop="participantName" class="mrwUserBox">
            <el-row v-if="formValidate.conferenceUserList.length">
              <el-col v-for="(item,index) in formValidate.conferenceUserList" :key="index">
                <span>{{ item.userName }}</span>
                （<span class="mrwpIs">是否委员：{{ item.member | typeText }}</span>）
                <template v-if="item.member == 'Y'">
                  <span>；附件：</span>
                  <div>
                    <upload-file :uploadFiles="item.fileArr" :show="true" :downServer="downloadUrl"></upload-file>
                  </div>
                </template>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>-->
        <el-col :span="12" name="start">
          <el-form-item label="会议开始时间：" prop="startTime">
            {{ formValidate.startTime }}
          </el-form-item>
        </el-col>

        <el-col :span="12" name="end">
          <el-form-item label="会议结束时间：" prop="endTime">
            {{ formValidate.endTime }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="会议地点：" prop="address">
            {{ formValidate.address }}
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
        <!--<el-form-item label="劳务费：" prop="conferenceFee">-->
        <!--{{ formValidate.conferenceFee }}元-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col>
          <el-form-item label="会议内容：" prop="content">
            {{ formValidate.content || '-' }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注：" prop="remark">
            {{ formValidate.remark || '-' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请人：" prop="applicantName">
            {{ formValidate.applicantName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时间：" prop="applicantTime">
            {{ formValidate.applicantTime }}
          </el-form-item>
        </el-col>
      </el-form>

      <el-table v-if="formValidate.status=='AUDIT_SUCCESS'" :maxHeight="300" :data="formValidate.conferenceUserList||[]" tooltip-effect="dark" align="center">
        <el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="交通费" prop="trafficFee" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.trafficFee/100}}
          </template>
        </el-table-column>
        <el-table-column label="会务费" prop="conferenceFee" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.conferenceFee/100}}
          </template>
        </el-table-column>
        <el-table-column label="差旅费" prop="travelFee" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.travelFee/100}}
          </template>
        </el-table-column>
        <el-table-column label="住宿费" prop="hotelFee" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.hotelFee/100}}
          </template>
        </el-table-column>
      </el-table>
      <br>

      <template v-if="formValidate.hisProcess.listHisTaskLog.length">
        <el-col>
          <h3>审批流程：</h3>
          <img :src="formValidate.hisProcess.base64Img" style="max-width: 100%;">
        </el-col>
        <el-col>
          <h3>操作日志：</h3>
          <ul>
            <li class="mrwListHisTaskLog" v-for="(item,index) in formValidate.hisProcess.listHisTaskLog" :key="index">
              <span class="l">{{ 1+index }}、{{ item.spUserName }}【{{ item.status }}】</span>
              <span class="right">{{ item.createTime }}</span>
              <p v-if="item.mess">意见或建议：{{ item.mess }}</p>
            </li>
          </ul>
        </el-col>
      </template>
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
        users: [],
        downloadUrl: '',
        // 表单数据
        formValidate: {
            jobTitle:'',
          id: '',
          name: '', // 会议名称
          hosdeptId: '', // 所在部门ID
          hosdeptName: '', // 所在部门名称
          sponsor: "", // 主办单位
          conferenceType: "", // 会议类型
          participationStatus:'',
//          participantId: '', // 参加人员ID（多个，隔开）
//          participantName: '', // 参加人员名称（多个，隔开）
          conferenceUserList: [ // 参加人员列表
//            {
//              userId:"", // 参加人员ID
//              userName:"",// 参加人员名称
//              member:"N", // 是否是委员 Y是 N否
//              filePath:"" // 附件id（多个，隔开）
//              fileArr:[], // 附件预览对象
//             }
          ],
          hisProcess: {
            base64Img: '',
            commentTypes: [],
            hasSp: false,
            listHisTaskLog: [],
            taskId: '',
          },
          startTime: '', // 会议开始时间
          endTime: '', // 会议结束时间
          address: '', // 会议地点
//          conferenceFee: '', // 劳务费
          content: '', // 会议内容
          remark: '', // 备注
          applicantName: '', // 申请人
          applicantTime: '', // 申请时间
          status: '', // 状态 NOT_SUBMIT未上报（保存草稿）| NOT_AUDIT未审核（上报审核）
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.downloadUrl = this.$store.state.envPath.http;
        this.getEditData()
      },
      // 获取编辑数据
      getEditData() {
        let opt = {
          ajaxSuccess: "getEditDataSuccess",
          ajaxParams: {
            url: api.get.path + this.operailityData.id,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      // 初始化编辑数据
      getEditDataSuccess(res) {
        if (!res.data || !res.data.id) {
          return
        }

        for (let key in this.formValidate) {
          if (key == 'conferenceUserList') {
            let conferenceUserList = [];
            (res.data.conferenceUserList || []).map(item => {
              let filePathArr = item.filePath && item.filePath.split(',') || [];
              let fileArr = [];
              for (let i = 0, l = filePathArr.length; i < l; i++) {
                fileArr.push({
                  id: filePathArr[i],
                  filePath: this.getFileDownPath(filePathArr[i]),
                  name: filePathArr[i].split('/').pop(),
                  fileType: filePathArr[i].split('/').pop().split('.').pop(),
                })
              }
              item.fileArr = fileArr; // 阅览使用
              this.users.push({
                key: item.userId,
                label: item.userName,
                disabled: false,
              })
              conferenceUserList.push(item);
            });
            this.formValidate.conferenceUserList = conferenceUserList;
          } else if (res.data[key]) {
            this.formValidate[key] = res.data[key]
          }
        }

        this.$emit('getHisProcess', res.data.hisProcess)
      },
      // 获取附件访问路径
      getFileDownPath(path) {
        return path && this.$store.state.envPath.http + path || '';
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
<style lang="scss">
  .mrwUserBox {
    .el-tag {
      margin-right: 10px;
    }
  }

  .mrwListHisTaskLog {
    text-indent: 2em;
    font-size: 14px;
    overflow: hidden;
    margin-top: 10px;
    .l {
      float: left;
    }
    span {
      float: right;
    }
    p {
      clear: both;
      text-indent: 3em;
    }
    &:last-child {
      margin-bottom: 10px;
    }
  }
</style>
