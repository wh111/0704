<!--
    作者：yongchao0310@163.com
    时间：2016-08-31
    描述：通知公告
-->
<template>
  <div>

    <div class="viewFramework-inner">
      <div class="workbench-notice boder-bot-3px">
        <ul class="notice-list fl">
          <li class="notice-title">通知:</li>
          <li>没有通知!</li>
          <!--<li><span class="date">[8.31]</span><a href="#">9月12日云盾老版应用防火墙(免费版)下线公告</a></li>
                    <li><span class="date">[8.31]</span><a href="#">9月12日云盾老版应用防火墙(免费版)下线公告</a></li>
                    <li class="notice-more"><a href="#">更多>></a></li>-->
        </ul>
      </div>
    </div>
    <div class="workbench-main">
      <div class="workbench-main-left">
        <div class="workbench-training-pro boder-top-3px">
          <div class="module-title">
            <div class="training-title-text01 fl">培训进度</div>
            <div class="training-title-text02 fr">当前轮转科室：<em class="color-0087b4">心内科[8月-9月]</em></div>
          </div>
          <div class="workbench-training-intr">
            <!--<div class="jdicon-line"></div>
                        <div class="jdicon-circular01"></div>
                        <div class="jdicon-circular02"></div>
                        <ul class="ul-list">
                            <li>您现在需要在<em class="color-0087b4">心内科</em>进行轮转，并填写培训手册。</li>
                            <li>轮转时间<em class="color-0087b4">7月-8月</em>。</li>
                            <li>请点击：【入科报道按钮】进行入科报道。</li>
                            <li>带教干事确认后。</li>
                            <li>方可填写培训手册。</li>
                        </ul>-->
          </div>
          <div class="btn-box"><a href="#" class="btn btn-0087b4 btn-rkbd">入科报道</a></div>
        </div>
        <div class="comm-area boder-top-3px margin-top-14px">
          <div class="module-title">
            <div class="training-title-text01 fl">待办事宜</div>
            <div class="training-title-text02 fr"><a href="#" class="color-0087b4">更多>></a></div>
          </div>
          <div style="text-align: center;margin-top: 200px;">
            还没有待办事宜!
          </div>
          <!--<ul class="ul-list">
                        <li class="first">
                            <dl class="dl-content">
                                <dt><em>[学术会议]</em> <a href="#">李美英上报的“天坛国际脑血管病会议2016年-住宿经费-会议经费”</a></dt>
                                <dd><div class="date fl">2016-08-10</div><div class="status-dc7200 fr">审批中</div></dd>
                            </dl>
                        </li>
                        <li class="second">
                            <dl class="dl-content">
                                <dt><em>[学术会议]</em> <a href="#">李美英上报的“天坛国际脑血管病会议2016年-住宿经费-会议经费”</a></dt>
                                <dd><div class="date fl">2016-08-10</div><div class="status-dc7200 fr">审批中</div></dd>
                            </dl>
                        </li>
                        <li class="third">
                            <dl class="dl-content">
                                <dt><em>[学术会议]</em> <a href="#">李美英上报的“天坛国际脑血管病会议2016年-住宿经费-会议经费”</a></dt>
                                <dd><div class="date fl">2016-08-10</div><div class="status-d60000 fr">驳回</div></dd>
                            </dl>
                        </li>
                        <li>
                            <dl class="dl-content">
                                <dt><em>[学术会议]</em> <a href="#">李美英上报的“天坛国际脑血管病会议2016年-住宿经费-会议经费”</a></dt>
                                <dd><div class="date fl">2016-08-10</div><div class="status-dc7200 fr">审批中</div></dd>
                            </dl>
                        </li>
                        <li>
                            <dl class="dl-content">
                                <dt><em>[学术会议]</em> <a href="#">李美英上报的“天坛国际脑血管病会议2016年-住宿经费-会议经费”</a></dt>
                                <dd><div class="date fl">2016-08-10</div><div class="status-d60000 fr">驳回</div></dd>
                            </dl>
                        </li>
                    </ul>-->
        </div>
      </div>
      <div class="workbench-main-right">
        <div class="personal-infor boder-top-3px">
          <div class="module-title">
            <div class="personal-title-text01 fl">个人信息</div>
          </div>
          <ul class="header-list">
            <li>
              <div class="header"> </div>
            </li>
            <li v-if="typeof userInfo.name!='undefined'">{{userInfo.name}}({{userInfo.roleList[0].name}})</li>
            <li><a href="#" class="userOperate" @click="eidtArchives">个人档案</a> <a href="#" class="userOperate" @click="eidtPass">修改密码</a></li>
          </ul>
        </div>
        <ul class="module-handle margin-top-14px">
          <li><span class="nav-icon-box icon-dbsy"></span><a href="#">待办事宜</a><span class="nav-remind-box icon-remind-dbsy">6</span></li>
          <li><span class="nav-icon-box icon-tzgg"></span><a href="#">通知公告</a><span class="nav-remind-box icon-remind-tzgg">3</span></li>
          <li><span class="nav-icon-box icon-txl"></span><a href="#">通讯录</a></li>
        </ul>
      </div>
    </div>
    <!--未审核提示信息-->
    <Modal :mask-closable="false" v-model="archivesModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="460">
      <modal-header slot="header" :content="archivesId"></modal-header>
      <div>
        <el-row>
          <el-col :span="24">
            <el-alert title="友情提示" type="info" :closable="false" :description="'尊敬的用户'+userInfo.name+','+currAuditStatus" show-icon>
            </el-alert>

          </el-col>
        </el-row>
        <br />
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
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></edit>
      <div slot="footer"></div>
    </Modal>
    <!--修改密码-->
    <Modal :mask-closable="false" v-model="passwordModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="460">
      <modal-header slot="header" :content="passwordId"></modal-header>
      <pwd v-if="passwordModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData"></pwd>
      <div slot="footer"></div>

    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import edit from "../teach/archivesManagement/archivesManagement/archivesManagement_edit.vue";
  import pwd from "./password.vue";

  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        isOnce: true,

        //完善个人档案
        archivesModal: false,
        currAuditStatus: "",
        operailityData: "",

        //修改密码
        passwordModal: false,

        /*--按钮button--*/
        editId: {
          id: 'editId',
          title: '修改'
        },
        archivesId: {
          id: 'add',
          title: '提示'
        },
        passwordId: {
          id: 'password',
          title: '修改密码'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      },


      //打开完善档案弹窗
      eidtPass() {
        this.passwordModal = true;
      },


      //打开完善档案弹窗
      eidtArchives() {
        this.editModal = true;
      },


      //模态窗操作完成后的回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
      },

      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
    },
    created() {
      Util = this.$util;
      this.init();
    },
    computed: {
      userInfo() {
        let info = this.$store.getters.getUserInfo || {};
        if (!Util.isEmptyObject(info)) {
          this.operailityData = info;
          if (this.isOnce) {
            if (!!info.auditStatus) {
              if (info.auditStatus != "AUDIT_SUCCESS") {
                this.archivesModal = true;
              }

              if (info.auditStatus == "NOT_SUBMIT") { //未提交
                this.currAuditStatus = "您的档案未提交,请先完善个人档案!";
              } else if (info.auditStatus == "NOT_AUDIT") { //未审核
                this.currAuditStatus = "您的档案审核中,请等待!";
              } else { //AUDIT_FAILURE  审核拒绝
                this.currAuditStatus = "您的档案审核拒绝,请检查并重新填写!";
              }
            }
          }
        }
        return info;
      }
    },
    mounted() {},
    components: {
      edit,
      pwd
    }
  }

</script>
