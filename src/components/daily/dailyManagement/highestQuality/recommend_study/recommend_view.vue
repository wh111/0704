<template>

  <div class="leaveManagement-show">
    <el-row class="lose-margin2">
      <el-col align="center">
        <h3>评优自荐</h3>
      </el-col>
    </el-row>
    <el-form ref="formValidate" class="demo-form-inline" label-width="110px">
      <!--富文本-->
      <el-row class="lose-margin2">
        <el-col>
          <viewUEditor style="width: 100%;" v-if="isGetSuccess" :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                       :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="相关证明材料：" prop="name" class="feildFontweight">
            <upload-file :uploadFiles="data.fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <template v-if="~['BTG','TG'].indexOf(data.examineStatus)">
        <el-row>
          <el-col>
            <el-form-item label="审核结果：" prop="name" class="feildFontweight">
              {{ data.examineStatus | typeText }}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="审批意见：" prop="name" class="feildFontweight">
              <el-input
                type="textarea"
                :rows="5"
                readonly
                resize="none"
                v-model="data.opinion">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

    </el-form>
  </div>
</template>
<script>
  import viewUEditor from '../../../../common/showUeditor.vue';

  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        isGetSuccess: false,
        "data": {
          "id": "",
          "userId": "",
          "userName": "",
          "reason": "",
          "declare_date": "",
          "opinion": "",
          "examineStatus": "",
          "fileList": [
//            {
//              "fileId": "",
//              "fileName": "",
//              "fileType": ""
//            }
          ]
        },

        //富文本编译器
        UE: {},
        ueditorVal: {
          ud1: "",
        },  //
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          initialFrameHeight: 220  //初始化编辑器高度,默认320
        },

        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'appraising/sellOneself/get/' + this.operailityData.sellOneselfId,
          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        this.data = responseData.data;
        this.ueditorVal.ud1 = responseData.data.reason;
        this.isGetSuccess = true;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'show');
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },


      /**
       *
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       *
       * @param val  {string}  编辑器的内容
       *
       */
      getUeditorVal(name, val) {
        this.ueditorVal[name] = val;
      },

      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */
      storeUE(name, editor) {
        this.UE[name] = editor;
        editor.setDisabled()

      },

      setMyVal(name, v) {
        this.UE[name].setContent(v);
      },
    },
    components: {viewUEditor},
  }
</script>
<style>
  .showWrapper {
    height: 100%;
    padding: 20px;
    border: 1px solid #eee;
  }

  .feildFontweight {
    font-weight: bold;
  }
</style>
