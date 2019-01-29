<template>

  <div class="showWrapper leaveManagement-show">
    <el-form ref="formValidate"  class="demo-form-inline" label-width="90px">
      <el-row >
        <el-col :span="17" :offset="2">
          <el-form-item  label="标题:" prop="name" class="feildFontweight">
            {{data.title}}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item  label="发布人:" class="feildFontweight">
            {{data.publisher}}
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="1">
          <el-form-item label="是否需要回执:" label-width="110px" class="feildFontweight">
            {{data.isReceipt==1?'需要':'不需要'}}  &nbsp;    <el-button v-if="data.isReceipt==1" @click="examineReceipt(true)"  size="mini" type="info">回执情况</el-button>
          </el-form-item>
        </el-col >
      </el-row >



      <el-row >
        <el-col :span="17" :offset="2">
          <el-form-item  label="浏览权限:" class="feildFontweight">
            {{data.roleName}}
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="17" :offset="2">
        </el-col >
        <fieldset class="layui-elem-field">
          <legend>通知内容</legend>
          <div class="layui-field-box" v-if="show">
            <viewUEditor style="width:700px;" :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
          </div>
        </fieldset>

      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item type="附件" label="附件:" class="feildFontweight">
            <upload-file :uploadFiles="data.fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col >
      </el-row >
    </el-form>

    <!--查看回执弹窗-->
    <Modal
      :mask-closable="false"
      v-model="receiptModal"
      height="200"
      title="对话框标题"
      class-name="vertical-center-modal"
      :loading="true"
      :width="800"
    >
      <modal-header slot="header"  :content="receiptId"></modal-header>
      <receipt v-if="receiptModal"  @cancel="examineReceipt(false)"  :operaility-data="operailityData"  :url="url"></receipt>
      <div slot="footer"></div>
    </Modal>
    <!---->
  </div>
</template>
<script>
  //当前组件引入全局的util
  /*   引入--回执--组件*/
  import viewUEditor from '../../../common/showUeditor.vue';
  import receipt from './releaseManagement_receipt.vue';
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    options:[{
      value: '选项1',
      label: '黄金糕'
    }, {
      value: '选项2',
      label: '双皮奶'
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }],
    data (){
      return{
        show:false,
        UE:{},
        ueditorVal:{
          ud1:"",
        },  //
        ueditorConfig:{
          //详细配置参考UEditor 官网api
          initialFrameHeight:220,  //初始化编辑器高度,默认320
        },

        receiptModal:false,
        receiptId:{
          id:'receiptId',
          title:'查看回执'},

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        "data":
          {
//            "id":"1",
//            "title":"标题",
//            "publisher":"教育处",
//            "roleId":"",
//            "roleName":"",
//            "isReceipt":"1",
//            "content":"通知内容",
//            "fileList":[
//              {
//                "fileId":"1",
//                "fileName":"文件名称",
//                "fileType":"txt"
//              }
//            ]
          },
        showData:{},
        listMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.noticeGet+this.operailityData.id,
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
          let data = responseData.data;
          if(!data)return;
          if(!data.roleName) {
            data.roleName = '全部'
          }
          if(!data.content){
            data.content = '';
          }
        this.data = data;
        this.show = true;
        this.ueditorVal.ud1 = data.content;
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
      //查看回执信息
      examineReceipt(flag){
          this.receiptModal = flag||false;
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


    },
    components:{
      receipt,viewUEditor
    }
  }
</script>
