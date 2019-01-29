<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <show-ueditor name="graduationInformation" @storeUE="storeUE" @getUeditorVal="getUeditorVal"
                  :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig" style="width:100%"></show-ueditor>
    <p align="center" style="margin-top: 20px">
      <!--<el-button @click="save">保存</el-button>-->
      <load-btn @listenSaveEvent="listenSaveEvent" :btnData="saveBtn"></load-btn>
    </p>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import showUeditor from '../../../common/showUeditor'; // 编辑器

  //当前组件引入全局的util
  let Util = null;
  export default {
    props:['operailityData'],
    data() {
      return {
        UE: {}, // 编辑器
        rules: {}, // 验证输入规则
        ueditorVal: {
          graduationInformation: '' // 内容
        },
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          // zIndex: 9,
          initialFrameHeight: 500 //初始化编辑器高度,默认320
        },
        saveBtn: {
          title: '保存',
          callParEvent: 'listenSaveEvent'
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getShowData()
      },
      getShowData() {
        let opt = {
          ajaxSuccess: res => this.ueditorVal.graduationInformation = res.data.graduationInformation || '',
          ajaxError: () => this.errorMess('获取结业证书信息错误，请重试'),
          ajaxParams: {
            url: api.get.path + this.operailityData.subjectsId,
            method: api.get.method
          }
        };
        this.ajax(opt)
      },
      /**
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       * @param editor {}      编辑器的对象
       */
      storeUE(name, editor) {
        this.UE[name] = editor;
      },
      /**
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       * @param val  {string}  编辑器的内容
       */
      getUeditorVal(name, val) {
        this.ueditorVal[name] = val;
      },

      /*
       * 保存
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSaveEvent(isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        let opt = {
          type: 'edit',
          ajaxSuccess: "ajaxSuccess",
          ajaxError: "ajaxError",
          ajaxParams: {
            jsonString:true,
            url: api.modify.path + this.operailityData.subjectsId,
            method: api.modify.method,
            data: {
              graduationInformation: this.ueditorVal.graduationInformation
            }
          }
        };
        this.ajax(opt, isLoadingFun)
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      showUeditor
    }
  }

</script>
