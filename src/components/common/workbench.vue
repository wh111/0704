<template>
  <!-- 工作台 -->
  <work-layout>
    <div slot="notice" v-if="firstNoticeData.length==0">通知：</div>
    <div slot="notice" style="cursor: pointer" @click="showNotice(firstNoticeData[0])" v-else>通知：【{{firstNoticeData[0].publishDate}}】{{firstNoticeData[0].title}}（{{firstNoticeData[0].isRead==1?'已读':'未读'}}）</div>
    <div slot="content">
      <!-- 学生事项 -->
      <content-item v-if="isStudent">
        <student-dep></student-dep>
      </content-item>
      <!-- 下一个内容项 -->
      <content-item v-if="~['handle','handled'].indexOf(contentType)">
        <div slot="title" class="uwHeader">
          <h3 class="userOperate left">{{ contentType | contentText }}</h3>
          <span class="uwNum">{{ getHandlerData('TotalCount', contentType) }}</span>
        </div>
        <handle-items :contentType="contentType" :num="handleGetDataNum" @update="getAllHandle"></handle-items>
        <!-- 分页按钮 -->
        <div style="float: right;margin-top:10px;" v-if="totalCount > 20">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                         :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
        </div>
      </content-item>
      <!-- 通知 -->
      <content-item v-if="contentType === 'notice'">
        <div slot="title" class="uwHeader">
          <h3 class="userOperate left">通知公告</h3>
          <!--<span class="uwNum">{{noticeCount}}</span>-->
        </div>
        <div class="uwContent">
          <notice  v-if="noticeData!=0" :noticeData="noticeData"></notice>
        </div>
        <div style="float: right;margin-top:10px;" v-if="noticeCount > 20">
          <el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="myPages.currentPage"
                         :page-sizes="myPages.pageSizes" :page-size="myPages.pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="noticeCount"></el-pagination>
        </div>
      </content-item>
      <!-- 模态框 查看 -->
      <Modal :mask-closable="false"  v-model="showsModal"
             :width="800">
        <modal-header :content="button.showId"></modal-header>
        <template v-if="showsModal">
          <!-- 教学活动 -->
          <release-management :url="url" :operaility-data="operailityData"></release-management>
        </template>
        <div slot="footer"></div>
      </Modal>
    </div>
    <div slot="right">
      <!-- 用户资料 -->
      <smalls-item>
        <user-info></user-info>
      </smalls-item>
      <!-- 事项队列 -->
      <smalls-item>
        <ul class="uwTodoList">
          <li class="uwtItem" @click="handleTodo('handle')">
            <span class="uwtTitle dbsy">待办事宜</span>
            <span class="uwNum">{{ getHandlerData('TotalCount', 'handle') }}</span>
          </li>
          <li class="uwtItem" @click="handleTodo('handled')">
            <span class="uwtTitle ybsy">已办事宜</span>
            <span class="uwNum red">{{ getHandlerData('TotalCount', 'handled') }}</span>
          </li>
          <li class="uwtItem" @click="handleTodo('notice')">
            <span class="uwtTitle tzgg">通知公告</span>
            <span class="uwNum green">{{ noticeCount }}</span>
          </li>
        </ul>
      </smalls-item>
      <!-- 日期控件 -->
    </div>

  </work-layout>
</template>

<script>
  import workLayout from './workBench/layout/work'; // 工作台布局基础
  import smallsItem from './workBench/layout/smallItem'; // 小项
  import contentItem from './workBench/layout/contentItem'; // 内容项
  import userInfo from './workBench/layout/userInfo'; // 用户信息
  import studentDep from './workbench/layout/studenDep'; // 学生科室情况

  import handleItems from './workbench/handleItems/items.vue'; // 事项
  import notice from './workbench/handleItems/notice.vue'; // 通知
  import releaseManagement from './workbench/handleItems/notice_view.vue' //查看通知公告
  import url from '../teach/consultiveManagement/app.js';//通知公告url
  export default {
    data() {
      return {
        url,
        operailityData:'',
        totalCount: 0,
        noticeCount: 0,
        noticeData: [],
        firstNoticeData:[],
        showsModal:false,
        contentType: 'handle', // notice公告|handle事项
        handleGetDataNum: 0, // 变更数据
        button: {
          showId: {
            id: "showId",
            title: "查看"
          },
        },
      }
    },
    methods: {
      init() {
        //ajax请求参数设置
        this.myPages = this.$util.pageInitPrams;
        this.queryQptions = {
          url: '/toDoList/listPage',
          params: {
            curPage: 1,
            pageSize: this.$util.pageInitPrams.pageSize
          }
        };
        this.getAllHandle();
        this.getNotice()
      },
      getAllHandle() {
        ['handle', 'handled'].map(item => this.getHandleForServer(item));
      },
      // 初始化查询项
      initQueryQptions() {
        this.queryQptions.params = {
          curPage: 1,
          pageSize: this.$util.pageInitPrams.pageSize
        }
      },
      //打开通知公告弹窗
      showNotice(item){
        this.operailityData = item;
        this.showsModal = true;
      },
      // 获取事项相关数据
      getHandlerData(type, name) {
        return this.$store.getters['work/todoItems/workHandle' + type](name)
      },
      // 右侧菜单点击
      handleTodo(type) {
        if (this.contentType === type) {
          return
        }
        this.contentType = type;
        this.initQueryQptions();
        if (type !== 'notice') {
          this.getHandleForServer(type);
        }else {
          this.getNotice()
        }
      },
      // 分页切换
      setTableData() {
        if(this.contentType=='notice'){
          this.getNotice()
        }else {
          this.getHandleForServer(this.contentType);

        }
      },
      // 获取事项
      getHandleForServer(type) {
        this.queryQptions.params.state = type === 'handle' ? '0' : '1';
        let opt = {
          ajaxSuccess: res => {
            this.$store.commit('work/todoItems/update', {type, res});
            setTimeout(() => {
              this.handleGetDataNum++;
              this.totalCount = this.getHandlerData('TotalCount', this.contentType);
            }, 50);
          },
          ajaxError: () => this.errorMess('获取事项数据失败，请重试...'),
          ajaxParams: {
            url: '/toDoList/listPage',
            params: this.queryQptions.params,
          },
        };
        this.ajax(opt)
      },

      //获取通知公告
      getNotice() {
        let opt = {
          ajaxSuccess: res => {
            let data = res.data;
            if (!data) {
              this.noticeData = [];
              this.$store.commit('work/todoItems/update', {type:'listNotice', res:{data:[]}});
              this.noticeCount = 0;
            }
            if(this.queryQptions.params.curPage==1 && data.length>0){
              let firstNoticeData = [data[0]];
              console.log(firstNoticeData);
              this.firstNoticeData = firstNoticeData;
            }
            this.$store.commit('work/todoItems/update', {type:'listNotice', res:{data:data}});
            this.noticeData = data;
            this.noticeCount = res.totalCount;
          },
          ajaxError: () => this.errorMess('获取事项数据失败，请重试...'),
          ajaxParams: {
            url: '/notice/myList',
            params: this.queryQptions.params,
          },
        };
        this.ajax(opt)
      },
    },
    components: {
      workLayout,
      smallsItem,
      contentItem,
      userInfo,
      studentDep,
      handleItems,
      notice,
      releaseManagement,
    },
    computed: {
      // 是否是学生
      isStudent() {
        let info = this.$store.getters.getUserInfo || {};
        let isStudent = false;
        let student = ['SXS', 'ZYY', 'JXS', 'YJS'];
        if (info.roleList) {
          isStudent = student.indexOf(info.roleList[0].identify) > -1
        }
        return isStudent;
      }
    },
    filters: {
      contentText(val) {
        let text = {
          handle: "待办事宜",
          handled: "已办事宜",
        };
        return text[val] || val
      },
    },
    created() {
      this.init()
    },
    destroyed() {
      this.$store.commit('work/todoItems/destroy');
    },
  }

</script>

<style>
  /* 工作台 */

</style>
