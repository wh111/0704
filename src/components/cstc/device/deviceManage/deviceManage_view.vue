<template>
  <div>
    <el-row class="editForm">
      <el-form :model="formValidate" ref="formValidate" :rules="rules" label-width="100px">
        <el-col :span="12" :offset="2">
          <el-form-item label="设备名称：" prop="deviceTypeName">
            {{ formValidate.deviceTypeName }}
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="设备图片：">
            <upload-photo-wall v-if="fileList && fileList.length" type="picture" :actionUrl="'/file/upload/static'" :fileList="fileList" :show="true"></upload-photo-wall>
            <span v-else>暂无图片</span>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="多媒体文件:" class="feildFontweight">
            <upload-file v-if="videoList && videoList.length" :accept="'mp4,flv,rmvb,rm,avi'" :noFirstCallBack="true" :uploadUrl="url.multimedia.path" :size="500*1024"
                         :uploadFiles="videoList"
                         @setUploadFiles="setMultimediaFileIds" downServer="/server/" :show="true"></upload-file>
            <span v-else>暂无相关文件</span>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="附件:" class="feildFontweight">
            <upload-file v-if="formValidate.fileList && formValidate.fileList.length" :size="500*1024" :uploadFiles="formValidate.fileList||[]"
                         @setUploadFiles="setUploadFiles" :show="true"></upload-file>
            <span v-else>暂无附件</span>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="设备描述：" prop="describes">
            {{ formValidate.describes || '暂无设备描述' }}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 按钮 -->
    <!--<el-row type="flex" class="row-bg" justify="center" solt="footer">-->
    <!--<el-col :span="4" class="btnBox" align="center">-->
    <!--<load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>-->
    <!--</el-col>-->
    <!--&lt;!&ndash;<el-col :span="4" class="btnBox" :offset="2" align="center">&ndash;&gt;-->
    <!--&lt;!&ndash;<el-button @click="resetForm('formValidate')">重置</el-button>&ndash;&gt;-->
    <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
    <!--</el-row>-->
  </div>
</template>

<script>
  let Util = null;
  import { deviceStorage as rules } from '../../rules'; // 表单验证规则
  import uploadPhotoWall from '../../../common/uploadPhotoWall';

  export default {
    props: {
      id: {
        type: [Number, String],
        required: true
      },
      urlParams: { // 编辑
        type: Object,
        required: true
      },
      url: { // 编辑
        type: Object,
        required: true
      },
      getUrlParams: { // 获取房间信息
        type: Object,
        required: true
      }
    },
    data () {
      return {
        rules,
        // 表单数据
        formValidate: {},
        //从服务器端获取的已上传的图片存储
        fileList: [ //
          // {
          //   name: "",
          //   url: ""
          // }
        ],
        staticPath: '', // 静态资源
        //保存按钮基本信息
        loadBtn: {
          loading: false,
          title: '保存设备',
          callParEvent: 'listenSubEvent'
        },
        videoList: [],
        //当前组件提交数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功',
          errorTitle: '修改失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            jsonString: true,
            url: `${this.urlParams.path}/${this.id}`,
            method: this.urlParams.method
          }
        }
      };
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm('formValidate');
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          if (this.formValidate.fileIds) {
            this.formValidate.isAttachment = 1;
          } else {
            this.formValidate.isAttachment = 0;
          }
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          this.ajax(this.editMessTitle, isLoadingFun);
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
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
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData (data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields();
      },
      // 图片上传
      upladSuccess (fileList, idx) {
        this.formValidate.imgList = [];
        for (var i = 0; i < fileList.length; i++) {
          let file = (fileList[i].src || '').match(/(static.*)(\..*)/);
          this.formValidate.imgList.push({
            originalPath: file[0],
            thumbnailPath: file[1] + '_MINI' + file[2]
          });
        }
      },
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        this.ajax({
          ajaxSuccess: 'getDataSuccess',
          ajaxParams: {
            url: `${this.getUrlParams.path}/${this.id}`,
            method: this.getUrlParams.method
          }
        });
      },
      getDataSuccess (res) {
        (res.data.fileList || []).map((item => {
          item.name = item.oldName;
        }));
        this.formValidate = res.data; // 初始化编辑数据
        if (typeof this.formValidate.imgList != 'undefined') {
          this.fileList = [];
          for (var i = 0, item; i < this.formValidate.imgList.length; i++) {
            item = this.formValidate.imgList[i];
            let obj = {
              name: '',
              url: (this.staticPath.http || '') + item.originalPath
            };
            this.fileList.push(obj);
          }
        }
        res.data.videoList = res.data.videoList || [];
        for (let i = 0; i < res.data.videoList.length; i++) {
          let item = res.data.videoList[i];
          item.fileId = item.path;
        }
        this.videoList = res.data.videoList;
      },
      /*
       * 组件初始化入口
       * */
      init () {
        this.staticPath = this.$store.getters.getEnvPath;
        // 获取编辑数据
        this.getDataForServer();
      },

      //多媒体附件
      setMultimediaFileIds (ids, lists) {
        let multimediaFileList = [];
        lists.map((item) => {
          multimediaFileList.push({
            fileName: item.name,
            path: item.id
          });
        });
        this.formValidate.videoList = multimediaFileList;
      },

      //附件
      setUploadFiles (ids) {
        this.formValidate.fileIds = ids;
      }

    },
    components: {
      uploadPhotoWall
    },
    created () {
      //给当前组件注入全局util
      Util = this.$util;
      this.init();
    }
  };

</script>

<style lang="scss">
  @import '../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
