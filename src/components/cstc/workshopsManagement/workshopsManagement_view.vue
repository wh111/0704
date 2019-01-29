<!--
* @TODO
* @pageName workshopsManagement_list
* @description 工作坊-查看页面,用于湘雅三院会议直播
* @Author zyc 332533011@qq.com
* @Created by zyc on 2018-04-10 14:22
-->
<template>
  <div >
    <el-form ref="formValidate" :model="formValidate" inline class="demo-form-inline" label-width="110px" >

      <el-row >
        <el-col :span="23" :offset="1">
          <el-form-item label="工作坊名称：" prop="workshopsName"  style="width: 820px">
            {{formValidate.workshopsName}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="23" :offset="1">
          <el-form-item label="关联房间：" prop="roomId"  style="width: 820px">
            {{formValidate.roomIdAndNum}}
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="23" :offset="1">
          <el-form-item label="图片：" prop="holidayName"  style="width: 820px">
            <upload-photo-wall type="picture" :actionUrl="'/file/upload/static'" :fileList="fileList" @upladSuccess="upladSuccess"></upload-photo-wall>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="23" :offset="1">
          <el-form-item label="工作坊简介：" prop="summary"  style="width: 820px">
            <viewUEditor style="width:600px;" :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
          </el-form-item>
        </el-col >
      </el-row >
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  //引入--新建--组件
  import api from "./api";
  import viewUEditor from '../../common/showUeditor.vue';
  import uploadPhotoWall from '../../common/uploadPhotoWall';

  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{

        //form表单bind数据
        fileList:[],
        staticPath: '', // 静态资源
        formValidate: {
          workshopsName: '',  //工作坊名称
          roomNum: '',  //房间号
          summary: '',  //工作坊简介
          roomId: '',  //房间ID
          workshopsImageList: [],  //工作坊简介图片
          roomIdAndNum:"",  //房id和间号  106##501

        },

        isGetSuccess:false,  //编辑器的数据是否获取成功
        UE:{},
        ueditorVal:{
          ud1:"",
        },  //
        ueditorConfig:{
          //详细配置参考UEditor 官网api
          initialFrameHeight:220,  //初始化编辑器高度,默认320
        },

        //获取房间信息
        roomOption:[],
        getAllRoom:{
          ajaxSuccess:'getAllRoomData',
          ajaxParams:{
            url: api.getAllRoom.path,
            params:{}
          }
        },


        //获取当前工作坊详情
        getWorkshopsDetail:{
          ajaxSuccess:'getAllRoomDetail',
          ajaxParams:{
            url: api.workshopsGet.path+this.operailityData.workshopsId,
            params:{}
          }
        },

        fileList: [],
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.staticPath = this.$store.getters.getEnvPath;
      this.init();
    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.getWorkshopsDetail);
      },

      /**
       * 获取当前工作坊的信息 getWorkshopesDetail
       * @param {} responseData 服务端返回的数据
       */

      getAllRoomDetail(responseData){
        let data = responseData.data;
        this.formValidate = Object.assign(this.formValidate,data)
        this.formValidate.roomIdAndNum = data.roomId+"##"+data.roomNum;
        this.ajax(this.getAllRoom);
        this.ueditorVal.ud1 = this.formValidate.summary;
        this.isGetSuccess = true;
        if (typeof this.formValidate.workshopsImageList != "undefined") {
          this.fileList = [];
          for (var i = 0, item; i < this.formValidate.workshopsImageList.length; i++) {
            item = this.formValidate.workshopsImageList[i];
            let obj = {
              name: "",
              url: (this.staticPath.http || '') + item.originalPath
            }
            this.fileList.push(obj);
          }
        }

      },

      /**
       * 获取技能中心的所有房间信息
       * @param {} responseData 服务端返回的数据
       */
      getAllRoomData(responseData){
        let data = responseData.data;
        this.roomOption = data;
      },

      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */

      getUeditorVal(name,val){
        this.ueditorVal[name] = val;
        this.formValidate.summary = this.ueditorVal.ud1;
      },

      storeUE(name,editor){
        this.UE[name] = editor;
      },

      setMyVal(name,v){
        this.UE[name].setContent(v);
      },

      // 图片上传
      upladSuccess(fileList, idx) {
        this.formValidate.workshopsImageList = [];
        for (var i = 0; i < fileList.length; i++) {
          let file = (fileList[i].src || '').match(/(static.*)(\..*)/);
          this.formValidate.workshopsImageList.push({
            originalPath: file[0],
            thumbnailPath: file[1] + "_MINI" + file[2]
          })
        }
      },



      /**
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
      },


      /**
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       */
      cancel(){
        this.$emit('cancel','show');
      },
    },
    components:{
      viewUEditor,uploadPhotoWall
    }
  }
</script>
