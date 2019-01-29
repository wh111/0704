<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/8/18
****--@author   gx
-->
<template>
  <div @mouseover="mouseover" @onmouseout="onmouseout " class="msg-right">
    <div class="right-commonality">
      公共聊天 &nbsp; &nbsp; &nbsp; &nbsp;
      <el-button class="liveVideoMsgBtn" type="danger" @click="speakClick('true')" v-if="isManagement&&!speakManagement"> 全体禁言</el-button>
      <el-button class="liveVideoMsgBtn" @click="speakClick('false')" v-if="isManagement&&speakManagement" type="success">取消禁言</el-button>
    </div>
    <!--聊天列表-->
    <div v-if="tableData!=0" ref="msgList" class="msg-list-wrap">
      <div class="msg-list" v-for="(item,index) in tableData" :key="index">
        <div>
          <span style="float: left;"><strong>{{item.name}}</strong></span>
          <span style="float: right;">{{item.times | formatDate('yy-MM-dd HH:mm:ss')}}</span>
          <div style="clear: both;padding-top: 15px">
            {{item.msg}}
          </div>
        </div>
      </div>
    </div>
    <p v-else style="text-align: center;line-height: 200px">暂无聊天</p>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['courseId', 'liveData', 'isManagement'],
    data() {
      return {
        tableData: [],
        unBeforeDestroy: true,
        lastTime: 0,
        setTime: '',
        speak: true,
        speakManagement: true,
        isSetScoll: true,

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        this.getData();
      },

      getData() {
        let that = this;
        //处理服务数据
        let myPromise = this.$util.queryData({
          url: api.queryMsg.path,

          params: {
            courseId: this.courseId,
            planId: this.liveData.id,
            lastTime: this.lastTime,
          }
        })();
        myPromise.then(function (res) {
          let responseData = res.data;
          if (that.$util._.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            that.updateListData(responseData)
          } else {
            let flag = that.$util.handleAjaxError(that, responseData["status"]["code"], responseData["status"]["msg"]);
            if (!flag) {
              that.errorMess('获取数据异常,重新获取');
              //                  that.setTime = setTimeout(()=>{
              //                    this.getData()
              //                  },1000)
              if (that.unBeforeDestroy) {
                this.getData()
              }
            }
          }
        }).catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            that.$util.handleAjaxError(that, error.response.status + '');
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            that.errorMess(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            that.errorMess(error.message);
          }
        })
      },


      updateListData(res) {
        let data = res.data;
        if (!data) return;
        //禁言或者允许发言
        this.$emit('speak', data);
        this.speak = data.speak;
        this.lastTime = data.lastTime;
        this.tableData = this.tableData.concat(data.msgList);
        this.speakManagement = data.speak
        this.setScoll();
        if (this.unBeforeDestroy) {
          this.getData()
        }
      },



      setScoll() {
        if (this.isSetScoll && this.$refs.msgList) {
          this.$refs.msgList.scrollTop = this.$refs.msgList.scrollHeight;
        }
      },


      mouseover() {
        this.isSetScoll = false;

      },

      onmouseout() {
        this.isSetScoll = true;

      },
      //禁止发言或者
      speakClick(flag) {
        let listMessTitle = {
          ajaxSuccess: res => {
            this.successMess(flag == 'true' ? '禁言成功' : '取消禁言成功');
            this.speakManagement = flag == 'true' ? true : false;
          },
          ajaxParams: {
            url: api.speak.path,
            method: 'post',
            data: {
              courseId: this.courseId,
              planId: this.liveData.id,
              speak: flag,
            }
          }
        }

        this.ajax(listMessTitle)

      },
    },
    beforeDestroy() {
      this.unBeforeDestroy = false;
      clearTimeout(this.setTime);
    },
    created() {
      this.init();
    },
    mounted() {},
    components: {}
  }

</script>
<style>
  .right-commonality {
    height: 40px;
    background: #c9c9c9;
    text-align: center;
    line-height: 40px;

    /* font-size: 24px; */
    /*border-bottom: 1px solid #535353 ;*/
  }

  .liveVideoMsgBtn {
    float: right;
    margin: 1px 4px;
  }

  .msg-list {
    padding: 10px 25px 10px 10px;
    border-bottom: 1px solid #c9c9c9;
  }

  .msg-right {
    height: 100%;
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 0;*/
    /*right: 0;*/
    /*bottom:0;*/
    /*!*border: 1px solid #535353;*!*/
    /*border-top:none;*/
    /*overflow: hidden;*/
  }

  .msg-list-wrap {
    position: absolute;
    left: 0;
    top: 42px;
    right: -13px;
    bottom: 0;
    /*border: 1px solid #535353;*/
    overflow: auto;
  }

</style>
