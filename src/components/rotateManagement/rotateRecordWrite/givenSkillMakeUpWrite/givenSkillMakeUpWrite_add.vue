<!--
****--@file     givenSkillMakeUpWrite_add
****--@date     2018/2/6 15:04
****--@author   YC
****--@describe 出科技能补考填写
-->
<template>
  <div>
    <h3 align="center">添加出科考核补考</h3>
    <el-row style="margin-top:20px;">
      <el-form label-width="120px">
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名：">
            {{ viewData.userName }}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="科室：">
            <el-select @change="getViewData" v-model="formValidate.podId" placeholder="请选择">
              <el-option v-for="item in optionData" :key="item.id" :label="item.label" :value="item.podId">
              </el-option>
            </el-select>
            <!--{{ viewData.depName }}-->
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="入科时间：">
            {{ viewData.rotaryBeginTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="出科时间：">
            {{ viewData.rotaryEndTime }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="周期：">
            {{ viewData.makeupTs }}{{userType=='SXS'?'周':'月'}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="技能成绩：">
            {{ viewData.skillExamScore }}
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2" v-if="optionData.length">
          <el-form-item label="技能操作视频：">
            <upload-file @setUploadFiles="setUploadFiles" :length="1" :uploadFiles="uploadFiles" :size="2048*1024"
                         accept="mp4"></upload-file>
          </el-form-item>
        </el-col>
      </el-form>
      <div style="padding-top:16px;clear:both;">
        <el-col align="center">
          <load-btn v-if="formValidate.podId" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </div>
    </el-row>
  </div>
</template>
<script>
  import api from './api';

  export default {
    data() {
      return {
        self: this,
        userId: this.$store.state.userInfo.id || '',
        userType: this.$store.state.userInfo.studentTypes || '',
        viewData: {
          userName: this.$store.state.userInfo.account.name,
          skillExamScore: '',
          makeupTs: '', // 补轮转周期
          rotaryBeginTime: '', // 轮转开始时间
          rotaryEndTime: '', // 轮转结束时间
        },
        optionData: [],
        uploadFiles: [],
        //form表单bind数据
        formValidate: {
          fileId: '',
          podId: '',
          type: 'DEP', // DEP 小科 | BIG_DEP 出大科
        },
        //保存按钮基本信息
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
      }
    },
    methods: {
      // 初始化
      init() {
        this.getPodIdOption()
      },

      getPodIdOption() {
        let opt = {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: api.getPodId.path + `${this.userType}-${this.userId}`,
            method: api.getPodId.method
          }
        }
        this.ajax(opt)
      },
      updateListData(res) {
        let data = res.data;
        if (!data) return;
        data = this.getQTBObj(res.data);
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.arrangeDepState == 'P') {
            data.splice(i, 1);
            i--;
          } else {
            if (item.podState == 99) {
              this.formValidate.podId = item.podId; //给depid绑定podId 因为poied唯一
            }
          }
        }
        this.optionData = data
      },

      // 处理科室数据结构（三级以下）
      getQTBObj(arr, res, depth = -1) {
        depth++;
        let t = res || [];
        if (arr && arr.length) {
          arr.map(item => {
            item.label = '　'.repeat(depth) + item.depName + '(' + (item.beginTime || '') + ')';
            t.push(item);
            if (item.childList) {
              return t.concat(this.getQTBObj(item.childList, t, depth))
            }
          })
        }
        return t
      },

      // 获取预览数据
      getViewData(podId) {
        this.ajax({
          ajaxSuccess: res => this.viewData = res.data,
          ajaxParams: {
            url: api.get.path + podId,
            method: api.get.method
          }
        })
      },

      // 上传附件
      setUploadFiles(ids) {
        this.formValidate.fileId = ids;
      },

      // 取消
      cancel() {
        this.$emit('cancel', 'add')
      },

      // 提交
      listenSubEvent(isLoadingFun) {
        if (!this.formValidate.fileId) {
          this.errorMess('请上传技能操作视频')
          return
        }
        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);
        this.ajax({
          type: 'add',
          successTitle: '补考提交成功',
          errorTitle: '补考提交失败',
//          ajaxSuccess: 'getDataSuccess',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.add.path,
            method: api.add.method,
            data: this.formValidate
          }
        }, isLoadingFun)
      },
    },
    components: {},
    created() {
      this.init()
    },
  }

</script>
