<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/8/18
****--@author   gx-->
<template>
  <div class="live-container">
    <div class="live-left">
      <div :class="{'live-mes-h1':!isManagement}">
        <slot class="live-mes-h1" name="left"></slot>
      </div>
      <div v-if="!isManagement" style="height: 130px;border-top:1px solid #535353;">
        <el-row>
          <el-col :span="18" :offset="1" style="padding: 20px">
            <el-input :readonly="isSpeak" v-model="mes" :rows="5" resize="none" type="textarea"></el-input>
          </el-col>
          <el-col :span="5" style="line-height: 130px">
            <el-button :disabled="isSpeak" @click="sendMes" type="primary">发送</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="live-right">
      <div :class="{'live-mes-h':isManagement}" style="position: relative ;">
        <slot name="right"></slot>
      </div>
      <div v-if="isManagement" style="height: 80px;border-top:1px solid #535353;">
        <el-row>
          <el-col :span="17" :offset="1" style="padding: 8px 8px 8px 0 ">
            <el-input v-model="mes" :rows="3" resize="none" type="textarea"></el-input>
          </el-col>
          <el-col :span="6" style="line-height: 80px">
            <el-button @click="sendMes" type="primary">发送</el-button>
          </el-col>
        </el-row>

      </div>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['isManagement', 'courseId', 'liveData', 'speakData'],
    data() {
      return {
        isHasHeight: false,
        mes: '',
        listMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.sendMsg.path,
            method: 'post',
            data: {
              courseId: this.courseId,
              planId: this.liveData.id,
              msg: '',
            }
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        let userInfo = this.$store.getters.getUserInfo;
        let listMessTitle = {
          ajaxSuccess: (res) => {
            this.mes = '';
          },
          ajaxParams: {
            url: api.sendMsg.path,
            method: 'post',
            data: {
              courseId: this.courseId,
              planId: this.liveData.id,
              msg: userInfo.name + '进入房间',
            }
          }
        }
        //            this.ajax(listMessTitle);
      },


      sendMes() {
        //如果为禁言，则不允许发言，管理员能发言
        if (this.isManagement || !this.isSpeak) {
          let mes = this.mes.trim();
          if (mes === '') return;
          this.listMessTitle.ajaxParams.data.msg = this.mes;
          this.ajax(this.listMessTitle);
        } else {
          this.showMess('全体禁言中!');
        }

      },

      updateListData() {
        this.mes = '';
        this.successMess('发表成功');
        this.$emit('sendMes');
      }
    },
    created() {
      this.init();
    },


    computed: {
      //是否允许发言
      isSpeak() {
        if (this.speakData.speak==null||this.speakData.speak) {
          return true;
        } else {
          return false;
        }

      }

    },


    mounted() {},
    components: {}
  }

</script>
<style>
  .live-container {
    position: relative;
    height: 100%;
  }

  .live-left {
    width: 65%;
    height: 100%;
  }

  .live-right {
    position: absolute;
    left: 66%;
    top: 0;
    right: 0;
    bottom: 0;
    border: 1px solid #535353;
    overflow: hidden
  }

  .live-mes-h {
    height: 380px;
  }

  .live-mes-h1 {
    height: 330px;
  }

</style>
