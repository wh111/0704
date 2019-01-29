<template>
  <!-- 用户资料 -->
  <div>
    <div class="uwUserInfo">
      <div class="userHeadPic"><img :src="userInfo.headPhoto"></div>
      <p class="userInfoName" v-if="userInfo.roleList">{{ userInfo.name }}（{{ userInfo.roleList[0].name }}）</p>
      <div class="userInfoTodoBtn">
        <el-button type="text" @click="eidtArchives">个人档案</el-button>
        <el-button type="text" @click="eidtPass">修改密码</el-button>
      </div>
    </div>
    <!--未审核提示信息-->
    <Modal :mask-closable="false" v-model="archivesModal" height="200" title="对话框标题" class-name="vertical-center-modal"
           :width="460">
      <modal-header slot="header" :content="contentHeader.archivesId"></modal-header>
      <div>
        <el-row>
          <el-col :span="24">
            <el-alert title="友情提示" type="info" :closable="false"
                      :description="'尊敬的用户'+userInfo.name+'，'+currAuditStatus" show-icon>
            </el-alert>

          </el-col>
        </el-row>
        <br/>
        <el-row>
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="8" style="text-align: center;">
            <el-button type="text" @click="eidtArchives">去完善个人档案</el-button>
          </el-col>
          <el-col :span="8" style="text-align: center;">
            <el-button type="text" @click="eidtPass">去修改密码</el-button>
          </el-col>
          <el-col :span="4">&nbsp;</el-col>
        </el-row>
      </div>
      <div slot="footer"></div>

    </Modal>
    <!--修改档案-->
    <Modal :mask-closable="false" v-model="editModal" height="200" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="contentHeader.editId"></modal-header>
      <template v-if="editModal">
        <!--<basic-audit v-if="userInfo.auditStatus != 'AUDIT_SUCCESS'" @cancel="cancel" @edit="subCallback"-->
        <!--:auditType="auditType" :operaility-data="operailityData"></basic-audit>-->
        <!--<template v-if="userInfo.auditStatus == 'AUDIT_SUCCESS'">-->
        <template v-if="['SXS','BKS','YJS','ZYY','JXS'].indexOf(userType) > -1">
          <!-- 实习生需要上报资料 -->
          <!--<template v-if="userType === 'SXS'">-->
          <!--<basic-audit v-if="userInfo.auditStatus != 'AUDIT_SUCCESS'" @cancel="cancel" @edit="subCallback" :auditType="auditType" :operaility-data="operailityData"></basic-audit>-->
          <!--<sxs-archives v-else @cancel="cancel" @edit="subCallback" :auditType="auditType" :operaility-data="operailityData"></sxs-archives>-->
          <!--</template>-->
          <sxs-archives v-if="userType === 'SXS'" @cancel="cancel" @edit="subCallback" :auditType="auditType"
                        :operaility-data="operailityData" :userInfo="userInfo" :mustUploadHP="true"
                        :formWhere="formWhere"></sxs-archives>
          <zyy-archives v-if="userType === 'ZYY'" @cancel="cancel" @edit="subCallback" :auditType="auditType"
                        :operaility-data="operailityData" :mustUploadHP="true"></zyy-archives>
          <yjs-archives v-if="userType === 'YJS'" @cancel="cancel" @edit="subCallback" :auditType="auditType"
                        :operaility-data="operailityData" :mustUploadHP="true"></yjs-archives>
          <jxs-archives v-if="userType === 'JXS'" @cancel="cancel" @edit="subCallback" :auditType="auditType"
                        :operaility-data="operailityData" :mustUploadHP="true"></jxs-archives>
          <bks-archives v-if="userType === 'BKS'" @cancel="cancel" @edit="subCallback" :auditType="auditType"
                        :operaility-data="operailityData" :mustUploadHP="true"></bks-archives>
        </template>
        <archives v-else @cancel="cancel" @edit="subCallback" :auditType="auditType" :operaility-data="operailityData"
                  :mustUploadHP="true"></archives>
        <!--</template>-->
      </template>
      <div slot="footer"></div>
    </Modal>
    <!--修改密码-->
    <Modal :mask-closable="false" v-model="passwordModal" height="200" class-name="vertical-center-modal" :width="460">
      <modal-header slot="header" :content="contentHeader.passwordId"></modal-header>
      <pwd v-if="passwordModal" @cancel="cancel" @password="subCallback" :operaility-data="operailityData"></pwd>
      <div slot="footer"></div>
    </Modal>
    <!--研究生报到须知-->
    <Modal :mask-closable="false" v-model="yjsbdxzModal" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="contentHeader.yjsbdxzId"></modal-header>
      <div v-if="yjsbdxzModal">
        <html-content style="min-height: 100px;max-height: 350px;" :html="yjsbdxzContent"></html-content>
        <div align="center" style="margin-top: 15px;">
          <el-button type="info" @click="yjsbdxzModal=false">关闭</el-button>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  /*当前组件必要引入*/
  //  import basicAudit from "../archives/basic.vue";
  //  import archivesAudit from "../../archivesManagement/archivesManagement_edit.vue";
  import archives    from '../../../base/sysManage/departmentStaff/departmentStaff_info.vue';
  import sxsArchives from '../../../intern/recruitStudent/usersManagement/usersManagement_info.vue';
  import zyyArchives from '../../../zyy/rdyEnrollEnroll/rdyPersonnelManagement/rdyPersonnelManagement_info.vue';
  import yjsArchives from '../../../postgraduate/ptEnrollEnroll/yjsPersonnelManagement/yjsPersonnelManagement_info.vue';
  import jxsArchives from '../../../educationManagement/EnrollEnroll/jxsPersonnelManagement/jxsPersonnelManagement_info.vue';
  import bksArchives from '../../../educationManagement/EnrollEnroll/bksPersonnelManagement/bksPersonnelManagement_info.vue';

  import pwd         from '../../password';
  import HtmlContent from '../../htmlContent';

  let Util = null;
  export default {
    data () {
      return {
//        isOnce: true,
        formWhere: 'work',
        userType: '', // 普通人员
        operailityData: [],

        auditType: 'basic',
        yjsbdxzContent: '', // 研究生报到须知
        loadYjsbdxz: false, // 是否加载研究生报到须知

        //档案审核
        yjsbdxzModal: false,
        archivesModal: false,
        currAuditStatus: '',

        passwordModal: false,
        contentHeader: {
          editId: {
            id: 'editId',
            title: '档案修改'
          },
          passwordId: {
            id: 'password',
            title: '修改密码'
          },
          archivesId: {
            id: 'add',
            title: '提示'
          },
          yjsbdxzId: {
            id: 'yjsbdxzId',
            title: '报到须知'
          }
        }
      };
    },
    created () {
      Util = this.$util;
    },
    methods: {
      //打开完善档案弹窗
      eidtPass () {
        this.operailityData = this.userInfo;
        this.passwordModal = true;
        this.cancel('archives');
      },

      //打开完善档案弹窗
      eidtArchives () {
        this.operailityData = this.userInfo;
        this.editModal = true;
        this.cancel('archives');
      },

      //模态窗操作完成后的回调
      subCallback (target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
//        if (target == "edit") {
        if (target == 'edit') {
//          location.reload()
          this.submitArchivesAudit();
        }
      },

      // 提交档案之后修改状态
      submitArchivesAudit () {
        let opt = {
          ajaxSuccess: () => {
            // 重新获取个人数据
            this.$store.commit('setUserInfo', this);
          },
          ajaxError: () => {},
          ajaxParams: {
            url: '/archives/submit-archives-audit',
            method: 'put'
          }
        };
        this.ajax(opt);
      },

      // 加载研究生报到须知
      loadYjsbdxzFun () {
        if (!this.loadYjsbdxz) {
          return false;
        }
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (data instanceof Object) {
              this.yjsbdxzContent = data.matterContent;
              // 有通知内容才显示通知弹窗
              this.yjsbdxzModal = !!data.matterContent;
            }
          },
          ajaxParams: {
            url: '/matters/needing/attention/getYJSNotice',
            params:{
              userId: this.userInfo.id
            }
          }
        };
        this.ajax(opt);
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel (targer) {
        this[targer + 'Modal'] = false;
      }
    },
    computed: {
      userInfo () {
        let info = this.$store.getters.getUserInfo || {};
        if (!Util.isEmptyObject(info)) {
          this.operailityData = info;
          this.userType = info.roleList[0].identify;
//          if (this.isOnce) {
          if (info.auditStatus) {
            if (info.archivesAuditStatus == 'NOT_SUBMIT') {
              this.archivesModal = true;
            }

            if (info.archivesAuditStatus == 'NOT_SUBMIT') { //未提交
//              if (info.auditStatus == "NOT_SUBMIT") { //未提交
              this.currAuditStatus = '请先完善个人档案！';
//              } else if (info.auditStatus == "NOT_AUDIT") { //未审核
//                this.currAuditStatus = "您的档案审核中,请等待!";
//              } else { //AUDIT_FAILURE  审核拒绝
//                this.currAuditStatus = "您的档案审核拒绝,请检查并重新填写!";
            }

            // 实习生的基本信息在未审核通过之前一直都要显示修改资料弹窗
            if (this.userType == 'SXS') {
              if (info.auditStatus != 'AUDIT_SUCCESS') {
                this.archivesModal = true;
                if (info.auditStatus == 'NOT_SUBMIT') { //未提交
                  this.currAuditStatus = '请先完善个人档案并提交审核！';
                } else if (info.auditStatus == 'NOT_AUDIT') { //未审核
                  this.currAuditStatus = '您的档案审核中,请等待!';
                } else { //AUDIT_FAILURE  审核拒绝
                  this.currAuditStatus = '您的档案审核被驳回,请检查并重新填写!';
                }
              }
            }

          }

          // 没有弹窗的研究生就加载研究生报到须知
          this.loadYjsbdxz = !this.archivesModal && this.userType == 'YJS';
//       }
        }
        return info;
      }
    },
    components: {
      HtmlContent,
//      basicAudit,
      archives,
      sxsArchives,
      zyyArchives,
      yjsArchives,
      jxsArchives,
      bksArchives,
      pwd
    },
    mounted () {
      this.loadYjsbdxzFun();
    }
  };

</script>

<style lang="scss">
  /* 用户资料 */
  @import "../../../../assets/ambuf/css/workbench_v1.0/userInfo";

</style>
