<!--
* @TODO
* @pageName workshopsManagement_list
* @description 工作坊-新建页面,用于湘雅三院会议直播
* @Author zyc 332533011@qq.com
* @Created by zyc on 2018-04-10 14:22
-->
<template>
  <div >
    <el-form ref="formValidate" :model="formValidate" :rules="rules" inline class="demo-form-inline" label-width="110px" >

      <el-row >
        <el-col :span="23" :offset="1">
          <el-form-item label="工作坊名称：" prop="workshopsName"  style="width: 820px">
            <el-input v-model="formValidate.workshopsName" style="width: 410px" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="23" :offset="1">
          <el-form-item label="关联房间：" prop="roomIdAndNum"  style="width: 820px">
            <el-select v-model="formValidate.roomIdAndNum" clearable placeholder="请选择">
              <el-option
                v-for="item in roomOption"
                :key="item.id"
                :label="item.roomNum"
                :value="item.id+'##'+item.roomNum">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="23" :offset="1">
          <el-form-item label="图片：" prop="workshopsImageList"  style="width: 820px">
            <upload-photo-wall type="picture" :actionUrl="'/file/upload/static'" @upladSuccess="upladSuccess"></upload-photo-wall>
          </el-form-item>
        </el-col >
      </el-row >
      <el-row >
        <el-col :span="23" :offset="1">
          <el-form-item label="工作坊简介：" prop="summary"  style="width: 820px">
            <viewUEditor style="width:700px;" :name="'ud1'" @storeUE="storeUE" @getUeditorVal="getUeditorVal" :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig"></viewUEditor>
          </el-form-item>
        </el-col >
      </el-row >
    </el-form>

    <el-row >
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button  @click="cancel">取消</el-button>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  //当前组件引入全局的util
  //引入--新建--组件
  import api from "./api";
  import viewUEditor from '../../common/showUeditor.vue';
  import uploadPhotoWall from '../../common/uploadPhotoWall';

  let Util=null;
  import {workshops as rules} from '../rules';
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        rules,
        //保存按钮基本信息
        loadBtn:{title:'提交',callParEvent:'listenSubEvent'},

        //form表单bind数据
        formValidate: {
          workshopsName: '',  //工作坊名称
          roomNum: '',  //房间号
          summary: '',  //工作坊简介
          roomId: '',  //房间ID
          workshopsImageList: [],  //工作坊简介图片
          roomIdAndNum:"",  //房id和间号  106##501

        },

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
            params:{

            }
          }
        },

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle:{
          type:'add',
          successTitle:'添加成功!',
          errorTitle:'添加失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url: api.workshopsAdd.path,
            method: api.workshopsAdd.method,
            jsonString:true,
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
      this.init();
    },
    methods:{
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.getAllRoom);
      },

      /**
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       */
      listenSubEvent(isLoadingFun){
        let isSubmit = this.submitForm("formValidate");
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)

          this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.addMessTitle, isLoadingFun)
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
        this.$emit('cancel','add');
      },


      /**
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       */
      getFormData(data){
        let myData = Util._.defaultsDeep({},data);
        myData.roomId = myData.roomIdAndNum.split("##")[0];
        myData.roomNum = myData.roomIdAndNum.split("##")[1];
        delete myData.roomIdAndNum;
        return myData;
      },
    },
    components:{
      viewUEditor,uploadPhotoWall
    }
  }
</script>
