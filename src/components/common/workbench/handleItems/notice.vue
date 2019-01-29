<!----------------------------------
****--@name     ${*}
****--@role     ${*}
****--@date     2018/1/9
****--@author   gx
----------------------------------->
<template>
  <div>
    <el-row class="uwContent">
      <template v-if="noticeData.length">
        <div v-for="(item,i) in noticeData" :key="i">
          <el-col :span="14" class="overflow-txt1">
            　{{ item.title }}
          </el-col>
          <el-col :span="5" :offset="1">　{{item.publishDate}} （{{item.isRead==1?'已读':'未读'}}）</el-col>
          <el-col :span="2" align="right">
            <el-button type="text" @click="show(item)">查看</el-button>
          </el-col>
        </div>
      </template>
      <p v-else class="uwContentNoDataTips">暂无通知公告</p>
    </el-row>
    <!-- 模态框 查看 -->
    <Modal :mask-closable="false"  v-model="showModal"
           :width="800">
      <modal-header :content="button.showId"></modal-header>
      <template v-if="showModal">
        <!-- 教学活动 -->
        <release-management :url="url" :operaility-data="operailityData"></release-management>
      </template>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import url from '../../../teach/consultiveManagement/app.js'
  /*当前组件必要引入*/
  import releaseManagement from './notice_view.vue' //查看通知公告
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['noticeData'],
    data() {
      return {
        url,
        operailityData: {},
        button: {
          showId: {
            id: "showId",
            title: "查看"
          },
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {

      },

      show(item) {
        this.operailityData = item;
        this.showModal = true

      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      releaseManagement,
    }
  }
</script>
