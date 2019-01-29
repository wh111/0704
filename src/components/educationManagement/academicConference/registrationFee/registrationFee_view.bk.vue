<!--
****--@name     费用查看
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div>
    <el-row class="editForm">
      <!-- 表单 -->
      <el-form label-width="90px">
        <el-col :span="12">
          <el-form-item label="会务费：" prop="conferenceFee">
            {{ formValidate.conferenceFee || '-' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="差旅费：" prop="travelFee">
            {{ formValidate.travelFee || '-' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="住宿费：" prop="hotelFee">
            {{ formValidate.hotelFee || '-' }}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="附件：">
            <uploadFile  :uploadFiles="files" :show="true"></uploadFile>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import uploadFile from '../../../common/uploadFile.vue';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: {
      operailityData: {
        type:Object,
        default: () => ({id:''})
      }
    },
    data() {
      return {
        files: [],
        // 表单数据
        formValidate: {
          id: '',
          conferenceFee: '', // 会务费
          travelFee: '', // 差旅费
          hotelFee: '', // 住宿费
          files: '', // 附件ID，多个逗号隔开
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        //给当前组件注入全局util
        Util = this.$util;

        if (this.operailityData.id) {
          this.getEditData()
        }
      },
      // 获取编辑数据
      getEditData(){
        let opt = {
          ajaxSuccess: "getEditDataSuccess",
          ajaxParams:{
            url: api.get.path + this.operailityData.id,
            method:api.get.method
          }
        };
        this.ajax(opt)
      },
      // 初始化编辑数据
      getEditDataSuccess(res){
        if(!res.data || !res.data.id){
          return
        }

        for(let key in this.formValidate){
          if(res.data[key]){
            this.formValidate[key] = res.data[key]
          }
        }

        // 附件
        let filesIds = [];
        (res.data.files || []).map(item => {
          this.files.push({
            fileId: item.id,
            fileName: item.oldName,
            filePath: '/api/file/download/' + item.id
          })
          filesIds.push(item.id);
        });

        this.formValidate.files = filesIds.join(',')
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      uploadFile,
    }
  }

</script>
