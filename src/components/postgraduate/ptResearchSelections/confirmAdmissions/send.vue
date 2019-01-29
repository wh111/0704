<template>
  <el-form :model="formValidate" ref="formValidate" :rules="rules" class="demo-form-inline" label-width="110px">
    <el-form-item label="手机号" prop="mobiles">
      <!--<el-input type="text"  v-model="formValidate.mobile"></el-input>-->
      {{formValidate.mobiles}}
    </el-form-item>
    <el-form-item label="短信内容" prop="content">
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="formValidate.content">
      </el-input>

    </el-form-item>
    <el-form-item>
      <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      <el-button  @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import url from './api';
  import {confirmSend as rules} from '../rules.js'
  let Util = null;
  export default {
    props: ['operailityData'],
    name: 'send',
    data () {
      return {
        rules,
        //发送按钮基本信息
        loadBtn:{title:'发送',callParEvent:'listenSubEvent'},
        formValidate:{
          content: '',
          mobiles: this.operailityData,
        },
//         sendMessTitle:{
//           type:'send',
//           successTitle:'发送成功!',
//           errorTitle:'发送失败!',
//           ajaxSuccess:'ajaxSuccess',
//           ajaxError:'ajaxError',
//           ajaxParams:{
// //            url:this.url.buildAdd,
//             jsonString:true,
//             method:'post',
//             data:{
//
//             },
//           }
//         },

      }
    },

    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
      },
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let opt = {
            type: 'send',
            successTitle: '发送通知成功!',
            errorTitle: '发送通知失败!',
            ajaxSuccess: 'ajaxSuccess',
            ajaxError: 'ajaxError',
            ajaxParams: {
              url: url.send.path,
              method: url.send.method,
              data: this.formValidate,
            }
          };
          this.ajax(opt,isLoadingFun)
        }
      },
      /*
      * 获取表单数据
      * @return string  格式:id=0&name=aa
      * */
      submitForm (formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      cancel () {
        this.$emit('cancel', 'send');
      },

      //   SuccessGetCurrData(data){
      //     // if (data === null || typeof data == "undefined" || data == "") return;
      //     this.formValidate.mobile= data.phone;
      //   }
      // },
     // //深拷贝form的数据
     //  getFormData (data) {
     //    console.log(data)
     //    let myData = Util._.defaultsDeep({}, data);
     //    return myData;
     //  },
      created () {
        this.init();
      },

      mounted () {
        // //页面dom稳定后调用
        // this.$nextTick(function () {
        //   //初始表格高度及分页位置
        //   this.setTableDynHeight();
        //   //为窗体绑定改变大小事件
        //   let Event = Util.events;
        //   Event.addHandler(window, "resize", this.setTableDynHeight);
        // })
      },
      // watch:{
      //   operailityData(val){
      //     this.SuccessGetCurrData(val)
      //   }
      // },
      components: {},

    }
  }
</script>

<style scoped>

</style>
