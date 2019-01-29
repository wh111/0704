<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-col :span="10" :offset="2">
          <el-form-item label="姓名：">{{ viewData.userName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="科室：">{{ viewData.depName }}
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-form-item label="入科时间：">{{ viewData.rotaryBeginTime }}
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <div align="center" style="margin-top:10px;">
        <el-col :span="6" :offset="6">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6">
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
  import api from './api';
  import selectUser from '../../../common/selectUser';

  export default {
    props: ['operailityData', 'signType'],
    data() {
      return {
        initUser: [],
        teacherIds: [],
        selectTeacherIds: [],
        teacherNames: [],
        selectTeacherNames: [],

        viewData: {},
        loadBtn: {
          title: '确定',
          callParEvent: 'listenSubEvent'
        },
        treeDefaults: {
          getTreeUrl: 'teacherType/tree?rootId=-101',
          getDataUrl: '',
          isShowMenus: true,
        },
        //搜索option
        selectOption: {
          url: '/archives/query/teachNoPage?typeId='
        },
        addMessTitle: {
          type: 'depSign',
          successTitle: '报到成功!',
          errorTitle: '报到失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: api.signDep.path + this.operailityData.podId,
            method: api.signDep.method
          }
        },
        selectUserModal: false,
        selectUserId: {
          id: 'selectUserId',
          title: '选择带教老师'
        }
      }
    },
    methods: {
      getInfo() {
        let opt = {
          ajaxSuccess: res => {
            this.viewData = res.data;
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.podId,
            method: api.get.method,
          }
        }
        this.ajax(opt)
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        if (!isLoadingFun) isLoadingFun = function () {
        };
        isLoadingFun(true);
        let messTitle = this.addMessTitle;
        messTitle.ajaxParams.data = {
          teacherIds: '',
          teacherNames: '',
          podId: this.operailityData.podId,
        };
        this.ajax(messTitle, isLoadingFun)
      },
      // 取消
      cancel() {
        this.$emit('cancel', this.addMessTitle.type)
      },
    },
    components: {
      selectUser
    },
    created() {
      this.getInfo()
    }
  }

</script>

<style lang="scss">
  .deptReported {
    margin-right: 10px;
    &:empty {
      margin-right: 0
    }
  }

</style>
