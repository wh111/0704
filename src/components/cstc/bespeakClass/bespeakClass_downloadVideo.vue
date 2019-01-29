<!----------------------------------
****--@name     预约上课（视频下载）
****--@role     ${*}
****--@date     2017/12/6
****--@author   gx
----------------------------------->
<template>
  <div class="bespeak-class-video" >
    <div v-if="fileList!=0" >
      <el-upload
        action="/file/upload"
        :on-preview="onPreview"
        class="onlyUploadShow noFile"
        :file-list="fileList">
      </el-upload>
    </div>
    <div v-else class="video-empty" >
      <strong>暂无视频</strong>
    </div>
  </div>

</template>
<script>
    /*当前组件必要引入*/
    //当前组件引入全局的util
    let Util = null;
    export default {
      props:['url','operailityData'],
        data() {
            return {
              //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
              listMessTitle:{
                ajaxSuccess:'updateListData',
                ajaxParams:{
                  url:this.url+this.operailityData.id,
                }
              },
              fileList:[],
            }
        },
        methods: {
          //初始化请求列表数据
          init() {
            this.ajax(this.listMessTitle)
          },

          updateListData(res){
            let data = res.data;
            data.map(item=>{
              item.url = 'http://192.168.1.3:554'+item.filePath;
              item.name = item.fileName;
            })
            this.fileList = data
          },

          onPreview(file){
            let  isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
            let isSafari  = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
            //点击已上传的文件链接时的钩子，返回字段为 file， 可以通过 file.response 拿到服务端返回数据
//              if (this.listType != 'text') return;
//              let downloadUrl = this.downUrl + '/' + file.id;
              //        let http = this.$store.getters.getEnvPath.http;
              //        if(http){
              //          downloadUrl =http+ downloadUrl
              //        }

            let sUrl = file.url
              //iOS devices do not support downloading. We have to inform user about this.
              if (/(iP)/g.test(navigator.userAgent)) {
                alert('Your device does not support files downloading. Please try again in desktop browser.');
                return false;
              }

              //If in Chrome or Safari - download via virtual link click
              if (isChrome || isSafari) {
                //Creating new link node.
                let link = document.createElement('a');
                link.href = sUrl;

                if (link.download !== undefined) {
                  //Set HTML5 download attribute. This will prevent file from opening if supported.
                  let fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
                  link.download = fileName;
                }

                //Dispatching click event.
                if (document.createEvent) {
                  let e = document.createEvent('MouseEvents');
                  e.initEvent('click', true, true);
                  link.dispatchEvent(e);
                  return true;
                }
              }

              // Force file download (whether supported by server).
              if (sUrl.indexOf('?') === -1) {
                sUrl += '?download';
              }

              window.open(sUrl, '_self');
              return true;
          },

        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {}
    }
</script>
<style lang="scss">
  .bespeak-class-video{
    min-height: 200px;
    .video-empty{
      text-align: center;
      line-height: 200px;
      font-size: 20px;

    }
  }
</style>
