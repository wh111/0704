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
        <el-col :span="10" :offset="2">
          <el-form-item label="报到时间：">{{ viewData.registerTime }}
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="2">
          <el-form-item label="带教老师：">
            <span class="deptReported">{{ teacherNames.join('，') }}</span>
            <el-button type="success" size="mini" @click="selectUser">选择带教老师</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div align="center" style="margin-top:10px;">
        <el-col :span="6" :offset="6">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
        <el-col :span="6">
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </div>
    </el-row>
    <!--选择考场管理员-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <!-- 此处人员还未对应 -->
      <select-user v-if="selectUserModal" @cancel="closeSltUser" @setUsers="setUsers" :initUser="initUser"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from './api';
  import selectUser from '../../../common/selectUser';
  export default {
    props: ['operailityData'],
    data() {
      return {
        initUser: [],
        teacherIds: [],
        teacherNames: [],
        viewData: {},
        loadBtn: {
          title: '确定',
          callParEvent: 'listenSubEvent'
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
            this.teacherIds = res.data.teacherIds && res.data.teacherIds.split(',') || [];
            this.teacherNames = res.data.teacherNames && res.data.teacherNames.split(',') || [];
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
        if (!this.teacherIds.length) {
          this.errorMess('请选择带教老师！')
          return
        }
        if (!isLoadingFun) isLoadingFun = function () {};
        isLoadingFun(true);
        let teacherIds = this.teacherIds.join(',');
        let teacherNames = this.teacherNames.join(',');
        this.addMessTitle.ajaxParams.data = {
          teacherIds,
          teacherNames
        };
        this.ajax(this.addMessTitle, isLoadingFun)
      },
      // 取消
      cancel() {
        this.$emit('cancel', this.addMessTitle.type)
      },
      // 取消选择带教老师
      closeSltUser() {
        this.selectUserModal = false
      },
      // 选择人员
      selectUser() {
        let teacherIds = this.teacherIds;
        let teacherNames = this.teacherNames;
        this.initUser.length = 0;
        if (teacherIds.length) {
          teacherIds.map((key, index) => {
            this.initUser.push({
              key,
              label: teacherNames[index],
              description: '人员id---' + key + '的描述信息',
              disabled: false
            })
          })
        }
        this.selectUserModal = true;
      },
      // 选择人员
      setUsers(res) {
        this.teacherIds.length = 0;
        this.teacherNames.length = 0;
        res.map(item => {
          this.teacherIds.push(item.key)
          this.teacherNames.push(item.label)
        })
        this.closeSltUser()
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
