<!--
****--@file     downloadExamineVideo
****--@date     2018/7/11 14:26
****--@author   YC
****--@describe 下载考核监控视频
-->
<template>
  <!-- 下载考核视频 -->
  <Modal @on-cancel="cancel" :mask-closable="false" v-model="downVideoModal" height="200" class-name="vertical-center-modal" :width="500">
    <modal-header slot="header" :content="downVideoId"></modal-header>
    <div v-if="downVideoModal">
      <el-form>
        <el-row>
          <el-col :span="22" :offset="1">
            <el-form-item>
              <h3>{{ operailityData.sceneName }}的考核视频：</h3>
            </el-form-item>
          </el-col>
          <el-col :span="22" :offset="1">
            <template v-if="downVideoArr && downVideoArr.length">
              <el-form-item v-for="(item,index) in downVideoArr" :key="index">
                <!--<a :href="getVideoPath(item.filePath)">{{ item.fileName }}</a>-->
                <a :href="getVideoPath(item.filePath)" target="_blank">{{ item.name }}</a>
              </el-form-item>
            </template>
            <el-form-item v-else>
              <span>{{ downVideoArr ? '暂无视频可下载' : '请稍等，正在准备文件...' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="22" align="right">
            <el-button style="margin-left: 10px" class="but-col" @click="cancel('downVideo')">关闭</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'downloadExamineVideo',
    props: ['operailityData'],
    data () {
      return {
        downVideoModal: true,
        downVideoId: {
          id: 'downVideo',
          title: '下载考核监控视频'
        },
        downVideoArr: null
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.operailityData && this.downVideo();
      },
      // 下载监控视频
      downVideo () {
        this.downVideoArr = null;
        let opt = {
          ajaxSuccess: res => this.downVideoArr = res.data,
          ajaxError: () => {
            this.errorMess('获取监控视频异常，请重试...');
            this.cancel();
          },
          ajaxParams: {
            url: 'scene/maintain/video/download/' + this.operailityData.id,
          }
        };
        this.ajax(opt);
      },

      // 获取监控视频下载地址
      getVideoPath (path) {
        return this.$store.getters.getEnvPath.http + path;
      },
      // 取消下载
      cancel () {
        this.downVideoModal = false;
        this.$emit('cancel');
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
