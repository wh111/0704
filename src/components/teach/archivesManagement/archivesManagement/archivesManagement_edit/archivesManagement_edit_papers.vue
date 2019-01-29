<!--档案管理修改-->
<!--证件复印件-->

<template>

  <div >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>执业医师资格证书复印件:</legend>
          <div class="layui-field-box">
            <upload-photo-wall :index="0" @upladSuccess="setUploadHeaderSuccessUrl" :actionUrl="uploadHeaderUrl" :fileList="photoData['1']"></upload-photo-wall>
          </div>
        </fieldset>
      </el-col >
    </el-row >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>执业医师执业证书复印件:</legend>
          <div class="layui-field-box">
            <upload-photo-wall :index="1" @upladSuccess="setUploadHeaderSuccessUrl" :actionUrl="uploadHeaderUrl" :fileList="photoData['2']"></upload-photo-wall>
          </div>
        </fieldset>
        </fieldset>
      </el-col >
    </el-row >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>专业技术职称证书复印件:</legend>
          <div class="layui-field-box">
            <upload-photo-wall :index="2" @upladSuccess="setUploadHeaderSuccessUrl" :actionUrl="uploadHeaderUrl" :fileList="photoData['3']"></upload-photo-wall>
          </div>
        </fieldset>
        </fieldset>
      </el-col >
    </el-row >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>其它证书复印件:</legend>
          <div class="layui-field-box">
            <upload-photo-wall :index="3" @upladSuccess="setUploadHeaderSuccessUrl" :actionUrl="uploadHeaderUrl" :fileList="photoData['4']"></upload-photo-wall>
          </div>
        </fieldset>
        </fieldset>
      </el-col >
    </el-row >
    <el-row >
      <el-col :span="22" :offset="1" class="lose-margin2">
        <fieldset class="layui-elem-field layui-field-title">
          <legend>身份证复印件:</legend>
          <div class="layui-field-box">
            <upload-photo-wall :index="4" @upladSuccess="setUploadHeaderSuccessUrl" :actionUrl="uploadHeaderUrl" :fileList="photoData['5']"></upload-photo-wall>
          </div>
        </fieldset>
        </fieldset>
      </el-col >
    </el-row >

    <el-row >
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="saveCurrData" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row >
  </div>
</template>
<script>
  import uploadPhotoWall from '../../../../common/uploadPhotoWall.vue';
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['dataId'],
    data (){
      return{
        //上传证件图片
        uploadHeaderUrl:'/file/upload/static',
        //保存按钮基本信息
        loadBtn:{title:'保存',callParEvent:'listenSubEvent'},
        //表格数据
        photoData:{
            '1':[],
            '2':[],
            '3':[],
            '4':[],
            '5':[],
        },

        //cerType
        currCerType:1,
        cerTypeArr:[],

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle:{
          type:'add',
          successTitle:'修改成功!',
          errorTitle:'修改失败!',
          ajaxSuccess:'ajaxSuccess',
          ajaxError:'ajaxError',
          ajaxParams:{
            url:'/archives/files/save/'+this.dataId,
            method:'post',
            jsonString:'jsonString',
            data:{}
          }
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
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      saveCurrData(isLoadingFun){
        let isSubmit = true;
        if(isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true)
          this.editMessTitle.ajaxParams.data = this.getFormData(this.cerTypeArr);
          this.ajax(this.editMessTitle, isLoadingFun);
        }
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName){
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag= true;
          }
        });
        return flag;
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
          let tempObj = {'1':[],'2':[],'3':[],'4':[],'5':[]};
          for(var i=0,item,obj;i<data.length;i++){
            item = data[i];
            obj = {
              name:"",
              url:item.cerCopies
            }
            if(typeof this.photoData[item.cerType]=="undefined"){
              this.photoData[item.cerType] = [];
              tempObj[item.cerType] = [];
            }
            this.photoData[item.cerType].push(obj);
            tempObj[item.cerType].push({
              "cerCopies":item.cerCopies,
              "cerType":item.cerType
            });
          }
          let that = this;

          Util._.forEach(tempObj,function (n,k) {
            let m = parseInt(k)
            that.cerTypeArr[m-1] = n || [];
          })
      },


      /*
       * 设置上传照片的图片
       * @param imgList [{}]   {"relativePathFile":"static/img/2017/05/26/20170526170737310.JPG","staticUrl":"http://192.168.1.116:9090/server/""http://192.168.1.116:9090/server/"}
       * @param idx  {number}  如果多个上传返回当前上传组件自定的索引
       * */
      setUploadHeaderSuccessUrl(imgList,idx){
        let tempArr = [];
        for (var i=0,item;i<imgList.length;i++){
          item = imgList[i];
          tempArr.push({
            "cerCopies":"/"+item.src,
            "cerType":(idx+1)
          })
        }
        this.cerTypeArr[idx] = tempArr;
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','edit');
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data){
        let myData = Util._.flattenDeep(data);
        let tempArr = [];
        for (var i=0;i<myData.length;i++){
            if(typeof myData[i]!="undefined"){
              tempArr.push(myData[i])
            }
        }
        return tempArr;
      },

    },
    components:{
      uploadPhotoWall
    }
  }
</script>


