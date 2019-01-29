<template>
  <div>
    <div class="remove">{{title}}</div>
    <el-row>
      <el-col :span="10" :offset="14">
        <el-button type="primary" @click="success">确定</el-button>
        <el-button class="but-col" @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  let Util;
  export default {
    name: 'ajaxDerive',
    props: ['type', 'url', 'messTitle', 'deriveParams', 'params', 'fileName'],
    data () {
      return {}
    },
    created () {
      Util = this.$util
      let messTitle;
      let todoType = {
        word: '导出到Word',
        excel: '导出到excel',
        student: '导出考生时间表',
        teacher: '导出监考老师时间表',
        sp: '导出sp时间表',
      };
      if (!this.messTitle) {
        this.title = `确定要${todoType[this.type]}吗？`
      } else {
        this.title = this.messTitle
      }
    },
    methods: {
      cancel () {
        this.$emit('cancel', this.type || 'derive')
      },

      success () {
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        let messTitle = {
          ajaxSuccess: (res) => {
            const blob = res.data
            const fileName = this.fileName || res.headers['content-disposition'] && decodeURIComponent(res.headers['content-disposition'].split(
              '=')[1]) || '轮转表导出信息.xls'
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
            this.cancel()
          },
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url,
            method: 'get',
            params: this.params,
            baseConfing: {
              responseType: 'blob', // 表明返回服务器返回的数据类型
            },
          }
        }
        if (this.deriveParams) {
          Object.assign(messTitle.ajaxParams, this.deriveParams)
        }
        let that = this;
        this.ajaxCreateLoading(true);
        //处理服务数据
        let myPromise = this.$util.queryData(messTitle.ajaxParams)();
        myPromise.then((res) => {
          this.ajaxCreateLoading(false);
          const blob = res.data;
          console.log(res,blob);
          if (!res.data) {
            this.errorMess('未获取到导出数据')
            return
          }else if(!blob.size){
            this.errorMess('暂无导出数据')
            return
          }

          if (!blob.type) {
            if (typeof FileReader !== 'undefined') {
              let reader = new FileReader();
              reader.readAsText(blob);
              reader.onload = (env) => {//读取文件成功
                let responseData = JSON.parse(env.currentTarget.result)
                let flag = this.$util.handleAjaxError(this, responseData['status']['code'], responseData['status']['msg']);
                if (!flag) {
                  this.errorMess(errorTitle);
                }
              }
              return
            } else {
              this.errorMess('系统异常，请刷新后重试')
              return
            }
          }else {
            if (typeof FileReader !== 'undefined') {
              let reader = new FileReader();
              reader.readAsText(blob);
              reader.onload = (env) => {//读取文件成功
                let responseData = '';
                try {
                  responseData = JSON.parse(env.currentTarget.result)//当传过来的不是一个文件(返回有错误)
                }catch (e) {
                }
                console.log(responseData);
                if (!responseData) {
                  messTitle.ajaxSuccess.call(this, res, messTitle)
                }
                else {
                  let flag = this.$util.handleAjaxError(this, responseData['status']['code'], responseData['status']['msg']);
                  if (!flag) {
                    this.errorMess(errorTitle);
                  }
                }
              }
            }
          }
        }).catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            Util.handleAjaxError(that, error.response.status + '');
            this.ajaxCreateLoading(false);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            that.errorMess(error.request);
            this.ajaxCreateLoading(false);
          } else {
            // Something happened in setting up the request that triggered an Error
            that.errorMess(error.message);
            this.ajaxCreateLoading(false);
          }
        })
      },

    }
  }

</script>

