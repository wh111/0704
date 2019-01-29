<template>
  <div>
    <el-form :model="formValidate" ref="formValidate" :rules="rules" class="roomUsageFrom" label-width="100px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="房间：">
            <!--<el-select v-model="formValidate.roomId" placeholder="请选择">
              <el-option v-for="item in roomIdOption" :key="item.id" :label="item.roomNum" :value="item.id">
              </el-option>
            </el-select>-->
            {{ (formValidate.roomNums||'-').replace(/,/g,'、') }}
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="使用类型：" prop="employType" required>
            <el-select v-model="formValidate.employType" placeholder="请选择">
              <!--<el-option v-for="item in typeOption" v-if="item.value!==''" :key="item.value" :label="item.label" :value="item.value">-->
              <!--</el-option>-->
              <el-option v-for="item in useType" :key="item.code" :label="item.value" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <date-group :dateGroup="{text:'',startDate:formValidate.startTime,endDate:formValidate.endTime}">

          <el-col :span="12" name="start">
            <el-form-item label="开始时间：" prop="startTime" required>
              <el-date-picker v-model="formValidate.startTime" :editable="false" type="datetime" placeholder="选择日期" :picker-options="pickerOptions0"
                              @change="handleStartTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" name="end">
            <el-form-item label="结束时间：" prop="endTime">
              <el-date-picker v-model="formValidate.endTime" :editable="false" type="datetime" placeholder="选择日期" :picker-options="pickerOptions1"
                              @change="handleEndTime">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </date-group>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="用途：" prop="purpose">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入内容" v-model="formValidate.purpose"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="房间图片：">
            <upload-file :fileList="fileList" @upladSuccess="upladSuccess"></upload-file>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row>
      <el-col align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;

  import {
    roomUsage as rules
  }                 from '../../rules'; // 表单验证规则
  import selectApi  from '../roomManage/api';
  import api        from './api';
  // 使用类型
  import typeOption from './typeOption';
  import uploadFile from '../uploadFile';

  export default {
    props: {
      id: {
        type: [Number, String],
        required: true
      }
    },
    data () {
      return {
        rules,
        useType: {},
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        countDate: 0,
        //form表单bind数据
        formValidate: {
          roomIds: '',
          roomNums: '',
          // roomId: '', // 房间
          employType: '', // 使用类型
          startTime: '', // 开始时间
          endTime: '', // 结束时间
          purpose: '', // 用途
          imageIds: '' // 房间图片 | 多个id以逗号分隔 ---> 1,2
        },
        // 静态资源
        staticPath: '',
        // 已上传的图片
        fileList: [],
        // 房间选项
        roomIdOption: [],
        // 使用类型选项
        typeOption,
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.modify.path + '/' + this.id,
            method: api.modify.method
          }
        },
        // 图片上传
        imgUpload: {
          dialogImageUrl: '',
          dialogVisible: false
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
          this.editMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
          let data = this.editMessTitle.ajaxParams.data;
          data.startTime = this.conductDate(data.startTime, 'yyyy-MM-dd HH:mm:ss');
          data.endTime = this.conductDate(data.endTime, 'yyyy-MM-dd HH:mm:ss');
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
        if (!this.formValidate.roomIds.length) {
          flag = false;
          this.errorMess('请至少选择一个房间！');
        }
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
      // 图片上传
      upladSuccess (ids) {
        this.formValidate.imageIds = ids;
      },
      // 获取已上传图片的数据
      getUploadFiles (res) {
        this.fileList = [];
        for (let i = 0, list = res.data.fileList, l = list.length; i < l; i++) {
          this.fileList.push({
            name: list[i].id,
            url: api.down.path + list[i].id
          });
        }
      },
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        let roomId = this.id;
        this.ajax({
          ajaxSuccess: res => {
            this.formValidate = res.data;
            this.getUploadFiles(res);
          },
          ajaxParams: {
            url: api.get.path + roomId,
            method: api.get.method
          }
        });
      },
      // 获取选择数据
      getSelectData () {
        let opt = {
          errorTitle: '获取房间失败',
          ajaxSuccess: res => {
            this.roomIdOption = res.data;
            this.getDataForServer();
          },
          ajaxParams: {
            url: selectApi.select.path,
            method: selectApi.select.method
          }
        };
        this.ajax(opt);
      },
      // 获取使用类型
      getTypeOption () {
        let opt = {
          ajaxSuccess: res => {
            if (!res.data.length) {
              return;
            }
            let useType = {};
            res.data.map(item => {
              useType[item.code] = item;
            });
            this.useType = useType;
            this.getDataForServer();
          },
          ajaxParams: {
            url: api.getAffairType.path,
            method: api.getAffairType.method
          }
        };
        this.ajax(opt);
      },
      /*
       * 组件初始化入口
       * */
      init () {
        Util = this.$util;
        this.staticPath = this.$store.getters.getEnvPath.http;
        // this.getSelectData()
        this.getTypeOption();

      }
    },
    created () {
      this.init();
    },
    components: {
      uploadFile
    }
  };

</script>
<style>
  .date {
    line-height: 25px;
  }

  .date .countDate {
    display: inline-block;
    width: 70px;
    text-align: center;
    border-bottom: 1px solid;
  }

</style>
