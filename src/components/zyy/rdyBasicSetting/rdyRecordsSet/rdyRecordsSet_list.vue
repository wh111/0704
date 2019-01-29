<!----------------------------------
****--大病历设置(rdyRecordsSet_list)
****--@date     2017/7/21
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="3" style="text-align: right;width: 120px;">
        <span class="font14">是否允许粘贴：</span>
      </el-col>
      <el-col :span="10">
        <el-tooltip :content="formValidate.tipMess" placement="top">
          <el-switch
            v-model="formValidate.tipMess"
            on-color="#13ce66"
            off-color="#ff4949"
            on-value="允许粘贴"
            off-value="不允许粘贴"
            @change="handleChange">
          </el-switch>
        </el-tooltip>
        <span class="font14">&nbsp;&nbsp;({{formValidate.tipMess}})</span>
      </el-col>
    </el-row>
    <div v-if="formValidate.tipMess=='允许粘贴'" style="margin-top: 20px;">
      <el-row :gutter="10">
        <el-col :span="3" style="text-align: right;width: 120px;"><span class="font14" style="padding-top: 7px;">粘贴比例：</span></el-col>
        <el-col style="width: 80px;"><span class="font14" style="padding-top: 7px;">{{formValidate.percent}}%</span></el-col>
        <el-col style="width: 400px;">
          <el-slider
            v-model="formValidate.percent"
            show-input>
          </el-slider>

        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 20px;">
      <el-row :gutter="10">
        <el-col :span="3" style="width: 120px;">&nbsp;</el-col>
        <el-col :span="3">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from "../api.js";
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:{
      userType:{  //人员类型
        type: String,
        default: "ZYY",
      }
    },
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //bind表单数据
        formValidate:{
          tipMess:"不允许粘贴",
          percent:0,
        },

        //是否黏贴
        isCopy:{
          configId:"",
          configKey:"",
          configValue:"",  //0否 1是
          remark:"",
          userType:"",
        },


        //黏贴比例
        copyScale:{
          configId:"",
          configKey:"",
          configValue:"",  //黏贴的比例值
          remark:"",
          userType:"",
        },



        //获取是否黏贴信息
        getBigcaseIscopy:{
          ajaxSuccess:'getBigcaseIscopyData',
          ajaxParams:{
            url: api.bigcaseIscopy.path+this.userType,
          }
        },


        //获取黏贴比例百分比
        getBigcaseCopyscale:{
          ajaxSuccess:'getBigcaseCopyscaleData',
          ajaxParams:{
            url: api.bigcaseCopyscale.path+this.userType,
          }
        },


        //修改是否黏贴信息
        saveIsCopy:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.modifyConfigId.path,
            method: api.modifyConfigId.method,
          },
        },


        //修改获取黏贴比例百分比
        saveCopyScale:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'saveSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.modifyConfigId.path,
            method: api.modifyConfigId.method,
          },
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init(){
        this.ajax(this.getBigcaseIscopy);
      },


      //通过get请求列表数据
      getBigcaseIscopyData(responseData){
        let data = responseData.data;
        let isCopy = data["configValue"];
        this.isCopy=data;
        if(isCopy=="0"){   //需要黏贴
          this.formValidate.tipMess = "不允许粘贴";
        }else{   //不需要黏贴
          this.formValidate.tipMess = "允许粘贴";
        }
        this.ajax(this.getBigcaseCopyscale);
      },


      //通过get请求黏贴比例信息
      getBigcaseCopyscaleData(responseData){
        let data = responseData.data;
        let percent = parseInt(data["configValue"]);
        this.copyScale=data;
        this.formValidate.percent = percent;
      },


      //开关事件
      handleChange(val){
        if(val=="不允许粘贴"){
          this.isCopy["configValue"]="0";
        }else{
          this.isCopy["configValue"]="1";
        }
      },


      //保存按钮基本信息
      loadBtn:{title:'提交',callParEvent:'listenSubEvent'},


      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        let isSubmit = true; //this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);

          let saveIsCopy = Util._.defaultsDeep({},this.saveIsCopy);

          saveIsCopy.ajaxParams.url += this.isCopy.configId;
          saveIsCopy.ajaxParams.data = this.getFormData(this.isCopy);
          this.ajax(saveIsCopy,isLoadingFun);

          let saveCopyScale = Util._.defaultsDeep({},this.saveCopyScale);
          saveCopyScale.ajaxParams.url += this.copyScale.configId;
          this.copyScale["configValue"] = this.formValidate.percent;
          saveCopyScale.ajaxParams.data = this.getFormData(this.copyScale);
          this.ajax(saveCopyScale,isLoadingFun);
        }
      },


      //保存成功
      saveSuccess(){
        this.successMess("保存成功!");
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){},


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        return myData;
      },
    },
    created(){
      Util = this.$util;
      this.init();
    },
    mounted(){
    },
    components: {}
  }
</script>
