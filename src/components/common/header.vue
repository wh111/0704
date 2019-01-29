<template>
  <div class="topbar-wrap topbar-clearfix">
    <div class="topbar-yylogo topbar-left">
      <div class="topbar-yylogo-imgBox">
        <a href="#"><!--<img src="../../assets/ambuf/images/logo/portalLogo.png" width="95%" />--></a>
      </div>
    </div>
    <div class="topbar-workbench topbar-left">
      <router-link to="/manage">工作台</router-link>
    </div>
    <!--<div class="topbar-global-nav topbar-left">-->
      <!--<a href="javascript:void(0)">功能大全</a>-->
    <!--</div>-->
    <div class="topbar-info topbar-right topbar-clearfix">
      <!--<div class="topbar-mobile-edition topbar-left">-->
        <!--<a href="#"><span class="icon-phone"></span>手机版</a>-->
      <!--</div>-->

      <div class="topbar-user topbar-left" :class="{'topbar-user-showLogout':expendLogin}">
        <el-popover
          ref="popover4"
          placement="bottom"
          width="400"
          trigger="click">
          <ul class="topbar-remind-list" v-if="noticeData.length>0">
            <li style="padding:0 0 5px 0" :style="{'border-bottom': index==noticeData.length-1?'':'1px solid #e7eaec'}"
                v-for="(item,index) in noticeData" :key="index" @click="show(item)"><a href="#">【{{item.publishDate}}】{{item.title}}（{{item.isRead==1?'已读':'未读'}}）</a></li>
            <!--<li class="topbar-remind-more"><a href="#">查看全部</a></li>-->
          </ul>
          <ul class="topbar-remind-list" v-else>
            <li><a href="#">无通知</a></li>
            <!--<li class="topbar-remind-more"><a href="#">查看全部</a></li>-->
          </ul>

        </el-popover>
        <!--<a style="cursor: pointer" class="topbar-remind" v-popover:popover4>-->
        <a style="cursor: pointer" class="topbar-remind" >
          <!--<span class="topbar-remind-text">通知</span>-->
          <!--<span class="topbar-remind-num icon-remind-dbsy">{{noticeCount}}</span>-->
        </a>
        <a href="#/" ref="showLoginMessId" class="topbar-user-box">
          <span class="topbar-user-name"
                v-if="typeof userInfo.name!='undefined'">{{userInfo.name}}({{userInfo.roleList[0].name}})</span>
          <span class="topbar-user-arrow icon-arrow-down2"></span>
          <span class="topbar-user-logout">
									<span class="topbar-user-logout-text" @click="loginOut">退出</span>
								</span>
        </a>
      </div>
      <!-- <div class="topbar-zyysLogo topbar-left">
           <a href="#"><img src="../../assets/ambuf/images/logo/small-zyysLogo.png" /></a>
        </div>-->
    </div>
    <!-- 模态框 查看 -->
    <Modal :mask-closable="false" @click.native="myNotice($event)" v-model="showModal"
           :width="800">
      <modal-header :content="button.showId"></modal-header>
      <template v-if="showModal">
        <!-- 教学活动 -->
        <notice :url="url" :operaility-data="operailityData"></notice>
      </template>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  let Util = null;
  import url from '../teach/consultiveManagement/app.js'
  import notice from './workbench/handleItems/notice_view.vue'
  export default {
    data() {
      return {
        url,
        expendLogin: false,
        showLogin: false,
        noticeCount: 0,
        noticeData: [],
        operailityData: {},
        button: {
          showId: {
            id: "showId",
            title: "查看"
          },
        }
      }
    },
    created() {
      Util = this.$util;
      this.queryQptions = {
        curPage: 1,
        pageSize: this.$util.pageInitPrams.pageSize
      }
//      this.getNotice();
    },
    methods: {
      showLoginMess() {
        this.expendLogin = !this.expendLogin;
        this.$emit("setZindex", this.expendLogin);
      },
      loginOut() {
        //退出登陆
        Util.loginOut(this, '/');
      },

      //获取通知公告
      getNotice() {
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (!data) {
              this.noticeData = [];
              this.noticeCount = 0;
              this.$store.commit('work/todoItems/update', {type:'headNotice', res:{data:[]}});
            } else if (data.length > 4) {
              data.length = 4;
            }
            this.$store.commit('work/todoItems/update', {type:'headNotice', res:{data:data}});
            this.noticeData = data;
            this.noticeCount = res.totalCount;
          },
          ajaxError: () => this.errorMess('获取事项数据失败，请重试...'),
          ajaxParams: {
            url: '/notice/myList',
            params: this.queryQptions,
          },
        };
        this.ajax(opt)
      },

      show(item) {
        this.operailityData = item;
        this.showModal = true;
        this.$refs.popover4.handleDocumentClick('popover4')//隐藏通知弹出层
        this.$emit("setZindex", true);

      },
      myNotice(e){
        e.stopPropagation();
      },
    },
    computed: {
      userInfo() {
        return this.$store.getters.getUserInfo || {};
      }
    },
    mounted() {
      let that = this;
      this.$nextTick(() => {
        Util.events.addHandler(this.$refs.showLoginMessId, "click", function (e) {
          e.stopPropagation();
          that.showLoginMess();
          that.$refs.popover4.handleDocumentClick('popover4')//隐藏通知弹出层
        });
        Util.events.addHandler(document, "click", function () {
          that.expendLogin = false;
          that.$emit("setZindex", false);
        });
      })
    },
    components:{
      notice
    }
  }
</script>
