<template>
  <div>
    <div class="remove" v-if="title">{{title}}</div>
    <div v-else class="remove">确定要删除吗？</div>
    <el-row >
      <el-col :span="10" :offset="14">
        <load-btn @handleRemove="handleRemove" :btnData="loadBtn"></load-btn>
        <el-button class="but-col" @click="cancel('remove')" type="danger">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  let Util;
  export default {
    name: 'remove',
    props: ['operailityData', 'deleteUrl', 'idKey','title'],
    data () {
      return {
        //保存数据
        addUrl: '/role/add',
        loadBtn: {title: '确定', callParEvent: 'handleRemove'},
        countDate: 0
      };
    },
    created () {
      Util = this.$util;
    },
    methods: {
      cancel () {
        this.$emit('cancel', 'remove');
      },
      handleRemove (isLoadingFun) {
        let that = this;
        let myUrl = [];
        isLoadingFun(true);

        for (var i = 0; i < this.operailityData.length; i++) {
          myUrl.push(this.operailityData[i][this.idKey || 'id']);
        }
        if (this.valDataType(this.operailityData, 'Array')) {
          if (this.operailityData.length > 0) {
            myUrl = this.deleteUrl + '/' + myUrl.join(',');
          } else {
            myUrl = this.deleteUrl;
          }
        } else {
          myUrl = this.deleteUrl;
        }
        //处理服务数据
        let myPromise = Util.queryData({
          url: myUrl,
          method: 'delete'
        })();

        myPromise.then(function (res) {
          let responseData = res.data;
          if (Util._.isObject(responseData['status']) && responseData['status']['code'] == 0) {
            that.$emit('remove', 'remove', '删除成功');
          } else {
            isLoadingFun(false);
            let flag = Util.handleAjaxError(that, responseData['status']['code'], responseData['status']['msg']);
            if (!flag) {
              that.errorMess('删除失败');
            }
          }
        }).catch(function (error) {
          if (error.response) {
            isLoadingFun(false);
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            Util.handleAjaxError(that, error.response.status + '');
          } else if (error.request) {
            isLoadingFun(false);
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            that.errorMess(error.request);
          } else {
            isLoadingFun(false);
            // Something happened in setting up the request that triggered an Error
            that.errorMess(error.message);
          }
        });
      }
    }
  };
</script>
