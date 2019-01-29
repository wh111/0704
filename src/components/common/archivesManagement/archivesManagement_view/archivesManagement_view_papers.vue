<!--档案管理查看-->
<!--证件复印件-->

<template>

  <div >
    <el-col :span="24" class="lose-margin2" style="text-align: center">
      <span class="table-headline ">证件复印件</span>
    </el-col >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>执业医师资格证书复印件:</legend>
          <div class="layui-field-box">
            <ul class="el-upload-list el-upload-list--picture-card">
              <li v-for="(item,index) in photoData['1']" :key="index" class="el-upload-list__item is-success">
                <img :src="item.cerCopiesHttp" alt="" class="el-upload-list__item-thumbnail">
                <span v-if="hide" class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i class="el-icon-view"></i></span></span>
              </li>
            </ul>
            <div style="text-align: center" v-if="photoData['1'].length==0">还没有上传复印件(图片)</div>
          </div>
        </fieldset>
      </el-col >
    </el-row >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>执业医师执业证书复印件:</legend>
          <div class="layui-field-box">
            <ul class="el-upload-list el-upload-list--picture-card">
              <li v-for="(item,index) in photoData['2']" :key="index" class="el-upload-list__item is-success">
                <img :src="item.cerCopiesHttp" alt="" class="el-upload-list__item-thumbnail">
                <span v-if="hide" class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i class="el-icon-view"></i></span></span>
              </li>
            </ul>
            <div style="text-align: center" v-if="photoData['2'].length==0">还没有上传复印件(图片)</div>
          </div>
        </fieldset>
      </el-col >
    </el-row >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>专业技术职称证书复印件:</legend>
          <div class="layui-field-box">
            <ul class="el-upload-list el-upload-list--picture-card">
              <li v-for="(item,index) in photoData['3']" :key="index" class="el-upload-list__item is-success">
                <img :src="item.cerCopiesHttp" alt="" class="el-upload-list__item-thumbnail">
                <span v-if="hide" class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i class="el-icon-view"></i></span></span>
              </li>
            </ul>
            <div style="text-align: center" v-if="photoData['3'].length==0">还没有上传复印件(图片)</div>
          </div>
        </fieldset>
      </el-col >
    </el-row >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>其它证书复印件:</legend>
          <div class="layui-field-box">
            <ul class="el-upload-list el-upload-list--picture-card">
              <li v-for="(item,index) in photoData['4']" :key="index" class="el-upload-list__item is-success">
                <img :src="item.cerCopiesHttp" alt="" class="el-upload-list__item-thumbnail">
                <span v-if="hide" class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i class="el-icon-view"></i></span></span>
              </li>
            </ul>
            <div style="text-align: center" v-if="photoData['4'].length==0">还没有上传复印件(图片)</div>
          </div>
        </fieldset>
      </el-col >
    </el-row >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>身份证复印件:</legend>
          <div class="layui-field-box">
            <ul class="el-upload-list el-upload-list--picture-card">
              <li v-for="(item,index) in photoData['5']" :key="index" class="el-upload-list__item is-success">
                <img :src="item.cerCopiesHttp" alt="" class="el-upload-list__item-thumbnail">
                <span v-if="hide" class="el-upload-list__item-actions"><span class="el-upload-list__item-preview"><i class="el-icon-view"></i></span></span>
              </li>
            </ul>
            <div style="text-align: center" v-if="photoData['5'].length==0">还没有上传复印件(图片)</div>
          </div>
        </fieldset>
      </el-col >
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['dataId'],
    data (){
      return{
        //表格数据
        hide:false,
        photoData:{
          '1':[],
          '2':[],
          '3':[],
          '4':[],
          '5':[],
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle:{
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/archives/list/files/'+this.dataId
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
      //初始化
      this.init();
    },
    mounted(){

    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.initMessTitle);
      },

      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let data = responseData.data;
        this.setPhotos(data);
      },


      //修改时设置已经上传动的图片
      setPhotos(data){
        for(var i=0,item,obj;i<data.length;i++){
          item = data[i];
          if(typeof this.photoData[item.cerType]=="undefined"){
            this.photoData[item.cerType] = [];
          }
          this.photoData[item.cerType].push(item);
        }
      },



    }
  }
</script>


