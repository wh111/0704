<template>

  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="contentManagement"  class="demo-form-inline" label-width="90px">
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="所属栏目" prop="moduleId" >
            <el-input  v-model="data.moduleName" readonly placeholder="请输入" @focus="seleColumn"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="17" :offset="2">
          <el-form-item label="标题:"  prop="title"  class="feildFontweight">
            <el-input v-model="formValidate.title" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >
      </el-row >

      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item label="作者:"  prop="authorName"  class="feildFontweight">
            <el-input  v-model="formValidate.authorName" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="1">
          <el-form-item   label="来源:" prop="source" class="feildFontweight">

            <el-select  v-model="formValidate.source" placeholder="请选择">
              <el-option
                v-for="item in source"
                :label="item.label"
                :key="item"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="17" :offset="2">
          <el-form-item label="URL:" prop="url" class="feildFontweight">
            <el-input  v-model="formValidate.url" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="8" :offset="2">
          <el-form-item  label="置顶顺序:" prop="newsOrder" class="feildFontweight">
            <el-input  v-model="formValidate.newsOrder"  placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >

        <el-col :span="8" :offset="1">
          <el-form-item label="内容类型:" class="feildFontweight">
            <el-select  v-model="formValidate.contentType"  placeholder="请选择">
              <el-option
                v-for="item in contentType"
                :label="item.label"
                :key="item"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row v-show="formValidate.contentType=='MULTIMEDIA'">
        <el-col :span="17" :offset="2">
          <el-form-item type="附件" label="多媒体文件:" class="feildFontweight">
            <upload-file :accept="'mp4'" :noFirstCallBack="true"  :uploadUrl="url.multimedia"  :size="500*1024" :uploadFiles="data.multimediaFileList" @setUploadFiles="setMultimediaFileIds">   </upload-file>
          </el-form-item>
        </el-col >
      </el-row>
      <el-row v-if="show">
        <el-col :span="17" :offset="2">
          <el-form-item label="内容:"  class="feildFontweight">
                <viewUEditor style="width:600px;" :name="'ud1'"@storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
          </el-form-item>
        </el-col >

      </el-row >

      <el-row >
        <el-col :span="17" :offset="2">
          <el-form-item type="附件" label="附件:" class="feildFontweight">
            <upload-file :unSize="true" :uploadFiles="data.fileList" @setUploadFiles="setFiles">   </upload-file>
          </el-form-item>
        </el-col >

      </el-row >
    </el-form>
    <el-row >
      <el-col :span="10" :offset="2">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button  @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row >
    <!--选择栏目弹窗-->
    <Modal
      close-on-click-modal="false"
      height="500"
      v-model="columnModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="columnId"></modal-header>
      <select-column @cancel="subCancel" @selectCoumn="columnCallback" :url="url"> </select-column>
      <div slot="footer"></div>
    </Modal>
  </div>

</template>
<script>
  import {contentManagement} from '../rules'
  //引入当前注册的组件
  import viewUEditor from '../../../common/showUeditor.vue';
  import selectColumn from './contentManagement_selectColumn.vue'
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData','url'],
    data (){
      return{
        show:false,
        contentManagement,
        source: [{
          value: 'ORIGINAL',
          label: '原创'
        }, {
          value: 'REPRINTED',
          label: '转载'
        }, {
          value: 'ORTHER',
          label: '其他'
        }],
        contentType: [{
          value: 'ORDINARY',
          label: '普通'
        }, {
          value: 'MULTIMEDIA',
          label: '多媒体'
        }],

        UE:{},
        ueditorVal:{
          ud1:"",
        },  //
        ueditorConfig:{
          //详细配置参考UEditor 官网api
          initialFrameHeight:220,  //初始化编辑器高度,默认320
        },

        multimediaFileList:[],

        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},
        //form表单bind数据
        "formValidate":{
          "moduleId":'',      //栏目id
          "title":"",                   //标题
          "authorName":"",                  //作者
          "source":"",                   //来源
          "url":"",                 //newsUrl
          "newsOrder":"",                        //置顶顺序
          "contentType":"",                 //内容类型
          "content":"",                 //内容
          multimediaFileList:[],               //多媒体文件id字符串
          fileIds:'',                         //    附件id字符串
        },
        ///获取的数据
        data:{},
        columnModal:false,
        columnId:{title:'选择栏目',id:'columnId',},

        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle:{
            type:'edit',
            successTitle:'修改成功',
            errorTitle:'修改失败',
            ajaxSuccess:'ajaxSuccess',
            ajaxParams:{
              jsonString:true,
              url:this.url.columnModify+this.operailityData.id,
              method:'put',
            }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:this.url.columnGet+this.operailityData.id,
          }
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
    },
    methods:{
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          if(this.formValidate.contentType=='MULTIMEDIA'){
            if(this.formValidate.multimediaFileList==0){
              this.errorMess('请上传多媒体文件');
              return;
            }
          }

          isLoadingFun(true);
          this.formValidate.content = this.ueditorVal.ud1;
          if(this.formValidate.contentType!='MULTIMEDIA')this.formValidate.multimediaFileIds='';
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        this.data = responseData.data;
        this.formValidate.moduleId=responseData.data.moduleId;
        this.show = true;
        if(!responseData.data.content)responseData.data.content='';
        this.ueditorVal.ud1=responseData.data.content;
        for(let i=0;i<(responseData.data.multimediaFileList||[]).length;i++){
          let item = responseData.data.multimediaFileList[i];
          item.fileId= item.filePath;
        }
        this.multimediaFileList =responseData.data.multimediaFileList
        this.formValidate = this.getFormValidate(this.formValidate ,responseData.data) ;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },


      //选择栏目
      seleColumn(){
        this.columnModal=true;
      },
      columnCallback(data){
        this.formValidate.moduleId = data.id;
        this.data.moduleName = data.name;

        this.subCancel();

      },
      subCancel(){
        this.columnModal=false;
      },

      //附件
      setFiles(ids){
        this.formValidate.fileIds = ids;
      },

      //多媒体附件
      setMultimediaFileIds(ids,lists){
        let multimediaFileList = []
        console.log(ids,lists);
        lists.map((item)=>{
          multimediaFileList.push({
            fileName:item.name,
            filePath:item.id,
          })
        })
        console.log(multimediaFileList);
        this.formValidate.multimediaFileList = multimediaFileList;
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
        this.setMyVal('ud1',this.formValidate.content)
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
      selectColumn,viewUEditor
    }
  }
</script>
