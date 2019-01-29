<!----------------------------------
****--页面静态化(pagesStaticize_list)
****--@date     2017/8/22
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div>
    <el-row>
      <el-col :span="4">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="4">
        <load-btn @listenSubEvent2="listenSubEvent2" :btnData="loadBtn2"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
/*当前组件必要引入*/

//当前组件引入全局的util
let Util = null;
export default{
  data() {
    return {
      //保存按钮基本信息
      loadBtn:{title:'静态化首页',callParEvent:'listenSubEvent'},
      loadBtn2:{title:'静态化列表页',callParEvent:'listenSubEvent2'},

      //当前组件提交(add)数据时,ajax处理的 静态化首页
      indexPageStatic:{
        type:'add',
        successTitle:'静态化门户首页成功!',
        errorTitle:'静态化门户首页失败!',
        ajaxSuccess:'indexStaticSuccess',
        ajaxError:'ajaxError',
        ajaxParams:{
          url:'/portalPageStatic/indexPageStatic',
          method:'post'
        }
      },

      //当前组件提交(add)数据时,ajax处理的 静态化列表
      modulePageStatic:{
        type:'edit',
        successTitle:'静态化栏目页面成功!',
        errorTitle:'静态化栏目页面失败!',
        ajaxSuccess:'moduleStaticSuccess',
        ajaxError:'ajaxError',
        ajaxParams:{
          url:'/portalPageStatic/modulePageStatic',
          method:'post'
        }
      },
    }
  },
  methods: {
    //初始化请求列表数据
    init(){

    },

    /*
     * 点击提交按钮 监听是否提交数据
     * @param isLoadingFun boolean  form表单验证是否通过
     * */
    listenSubEvent(isLoadingFun){
      if (!isLoadingFun) isLoadingFun = function () {};
      isLoadingFun(true)
      //this.indexPageStatic.ajaxParams.data = this.getFormData(this.formValidate);
      this.ajax(this.indexPageStatic, isLoadingFun)
    },

    indexStaticSuccess(){
      this.successMess("静态化门户首页成功!")
    },


    /*
     * 点击提交按钮 监听是否提交数据
     * @param isLoadingFun boolean  form表单验证是否通过
     * */
    listenSubEvent2(isLoadingFun){
      if (!isLoadingFun) isLoadingFun = function () {};
      isLoadingFun(true)
      //this.modulePageStatic.ajaxParams.data = this.getFormData(this.formValidate);
      this.ajax(this.modulePageStatic, isLoadingFun)
    },

    moduleStaticSuccess(){
      this.successMess("静态化栏目页面成功!")
    },

  },
  created(){
    this.init();
  },
  mounted(){
  },
  components: {}
}
</script>
