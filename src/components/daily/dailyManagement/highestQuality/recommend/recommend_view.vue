<template>

  <div class="leaveManagement-show">
    <el-form ref="formValidate" class="demo-form-inline" label-width="100px">
      <el-row class="lose-margin2">
        <el-col align="center">
          <h3>评优自荐</h3>
        </el-col>
      </el-row>
      <el-row class="lose-margin2">
        <el-col>
          <view-u-editor style="width: 100%" v-if="isGetSuccess" :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                         :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></view-u-editor>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="自荐人:" prop="name" class="feildFontweight">
            {{showData.userName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="日期:" prop="declareDate" class="feildFontweight">
            {{showData.declareDate || '——'}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="相关证明材料:" prop="name" class="feildFontweight">
            <upload-file :uploadFiles="showData.fileList" :show="true"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>

      <template v-if="~['BTG','TG'].indexOf(showData.examineStatus)">
        <el-row>
          <el-col>
            <el-form-item label="审核结果:" prop="name" class="feildFontweight">
              {{ showData.examineStatus | typeText}}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="审批意见:" prop="name" class="feildFontweight">
              <el-input
                type="textarea"
                :rows="11"
                readonly
                resize="none"
                v-model="showData.opinion">
              </el-input>
            </el-form-item>

          </el-col>
        </el-row>
      </template>

    </el-form>
  </div>
</template>
<script>
  import api from "./api";
  import viewUEditor from '../../../../common/showUeditor.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ["operailityData"],
    data() {
      return {
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        showData: {},
        listMessTitle: {
          ajaxSuccess: "SuccessGetCurrData",
          ajaxParams: {
            url: api.get.path + this.operailityData.id
          }
        },
        //富文本编译器
        UE: {},
        ueditorVal: {
          ud1: "",
        },
        isGetSuccess: false,
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          initialFrameHeight: 220  //初始化编辑器高度,默认320
        },
      };
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
        this.showData = responseData.data;
        this.ueditorVal.ud1 = responseData.data.reason;
        this.isGetSuccess = true;
      },
      /*
         * 当前组件发送事件给父组件
         * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
         * */
      cancel() {
        this.$emit("cancel", "show");
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
      /*
         * 组件初始化入口
         * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      }
    },
    components: {viewUEditor}
  };
</script>

