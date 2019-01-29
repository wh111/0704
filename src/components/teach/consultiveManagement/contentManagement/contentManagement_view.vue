<template>

  <div class="showWrapper leaveManagement-show">
    <el-form ref="formValidate"  class="demo-form-inline" label-width="90px">
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="所属栏目" prop="name" >
            {{data.moduleName}}
          </el-form-item>
        </el-col >


        <el-col :span="8" :offset="1">
          <el-form-item label="标题:" class="feildFontweight">
            {{data.title}}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="作者:" class="feildFontweight">
            {{data.authorName}}
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="1">
          <el-form-item label="来源:" class="feildFontweight">
            {{data.source == 'REPRINTED'?'转载':data.source == 'REPRINTED'?'原创':'其他'}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="URL:" class="feildFontweight">
            {{data.url}}
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="1">
          <el-form-item type="number" label="置顶顺序:" class="feildFontweight">
            {{data.newsOrder}}
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="2">
          <el-form-item label="内容类型:" class="feildFontweight">
            {{data.contentType == 'ORDINARY'?'普通':data.contentType == 'MULTIMEDIA'?'多媒体':data.contentType}}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row v-if="show">
        <el-col :span="17" :offset="2">
          <el-form-item type="附件" label="内容:" class="feildFontweight">
            <viewUEditor style="width:600px;" :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="20" :offset="3">
            <div  v-if="data.contentType=='MULTIMEDIA'" style="height:300px;">
              <el-row v-if="data.multimediaFileList!=0">
                <el-col style="height:300px;background: #000;"  :span="17" >
                  <myVideo v-if="videoShow" :filePath="file.path" :isAutoPlay="true" :videoType="file.type"> </myVideo>
                </el-col>
                <el-col :span="7" >
                  <ul style="height:300px;background: #cecece;overflow: auto">
                    <li v-for="(item,i) in data.multimediaFileList" :key="i" :class="{'my-video-list':(index==i)}" @click="changeIndex(item,i)" style="color: #fff;height:40px;line-height: 40px;cursor: pointer;" class="overflow-txt1">{{item.fileName}}</li>
                  </ul>
                </el-col>
              </el-row>
              <div v-else style="line-height: 200px;text-align: center;font-size: 18px">
               <strong>无视频文件</strong>
              </div>
            </div>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item type="附件" label="附件:" class="feildFontweight">

            <upload-file :uploadFiles="data.fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col >
      </el-row >

    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  //引入视频组件
  import myVideo from '../../../common/video.vue';
  let Util=null;
  import viewUEditor from '../../../common/showUeditor.vue';
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
        show:false,
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        showData:{},
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.columnGet+this.operailityData.id,
          }
        },

        UE:{},
        ueditorVal:{
          ud1:"",
        },  //
        ueditorConfig:{
          //详细配置参考UEditor 官网api
          initialFrameHeight:220,  //初始化编辑器高度,默认320
        },

        index:0,
        file:{id:''},
        videoShow:false,
       // 获取到的数据
        "data":{
          "moduleId":"",
          "moduleName":"",
          "id":"",
          "title":"",
          "authorName":"",
          "source":"",
          "url":"",
          "newsOrder":"",
          "contentType":"",
          "content":"",
          "multimediaFileList":[

          ],
          "fileList":[

          ],
          videoHttp :'',
        },
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
      let env = this.$store.getters.getEnvPath;
      this.videoHttp = env['http']
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){

        this.data = responseData.data;
        this.show = true;
        if(responseData.data.contentType=='MULTIMEDIA'&&responseData.data.multimediaFileList!=0){
          this.changeIndex(responseData.data.multimediaFileList[0],0);
        }
        if(!responseData.data.content)responseData.data.content='';
        this.ueditorVal.ud1=responseData.data.content||'';
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },

      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */
      storeUE(name,editor){
        this.UE[name] = editor;
        editor.setDisabled()
        if(this.data.content){
          this.setMyVal('ud1',this.data.content)
        }
      },

      setMyVal(name,v){
        this.UE[name].setContent(v);
      },
      /**
       *
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       *
       * @param val  {string}  编辑器的内容
       *
       */
      getUeditorVal(name,val){
        this.ueditorVal[name] = val;
      },


      //切换视频
      changeIndex(item,i){

        this.index = i;
        if(this.file.id == item.id){
            return;
        }
        let env = this.$store.getters.getEnvPath;
        let http = env['http'];
        let file = {};
        this.videoShow=false;
        file = item;
        file.path = http+file.filePath;
        let type = file.filePath.split('.');
        file.type = type[type.length-1];
        this.file = file
        //页面dom稳定后调用
        this.$nextTick(function () {
          this.videoShow=true;
        })
      },
    },
    components:{
     viewUEditor,myVideo
    }
  }
</script>
