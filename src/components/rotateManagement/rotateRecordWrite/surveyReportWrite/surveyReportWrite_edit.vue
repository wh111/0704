<!----------------------------------
****--专题综述
****--@role     实习生、研究生、住院医、进修生
****--@date     2017/7/9
****--@author   gx
---------------------------------->
<template>
  <div>
    <el-form :model="ueditorVal" ref="formValidate"  class="demo-form-inline" label-width="120px" >
      <el-row >
        <el-col :span="21" :offset="1">
          <el-form-item label="报告经验与总结:" prop="diseaseName" >
            <viewUEditor :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
          </el-form-item>
        </el-col>
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="10" :offset="10">
        <div style="margin-left: 100px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </div>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import viewUEditor from '../../../common/showUeditor.vue';
  //当前组件引入全局的util
  let Util = null;
  export default{
    props:['url','operailityData'],
    data() {
      return {
        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        UE:{},
        formValidate:{},
        ueditorVal:{
          ud1:this.operailityData.content||'',
        },  //
        ueditorConfig:{
          //详细配置参考UEditor 官网api
          initialFrameHeight:220,  //初始化编辑器高度,默认320
        },
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'edit',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:this.url.medicalEthicsModify+this.operailityData.id,
            method:'post',
            jsonString:true,
            data:{},
          }
        },
      }
    },
    methods: {
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

      /*
       * 保存或上报按钮会调用这个公共函数
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun){
        if(!isLoadingFun)isLoadingFun=function(){};
        isLoadingFun(true);
        this.formValidate.content = this.ueditorVal.ud1;
        this.editMessTitle.ajaxParams.data = this.formValidate;
        this.ajax(this.editMessTitle,isLoadingFun);
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
      },

      setMyVal(name,v){
        this.UE[name].setContent(v);
      }
    },
    created(){
    },
    mounted(){
    },
    components: {viewUEditor}
  }
</script>
