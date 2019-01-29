<!--
****--@file     distributionTeach_delibution
****--@date     2018/9/20 16:29
****--@author   ZWT
****--@describe 删除带教老师
-->
<template>
  <div class="del">
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
            <span class="deptReported" v-for="(tag,index) in selectTeacherNames">{{tag}}
              <el-button type="text" @click="removeUser(index)">×</el-button>
            </span>
            <!--<el-tag-->
            <!--:key="index"-->
            <!--v-for="(tag,index) in selectTeacherNames"-->
            <!--closable-->
            <!--:disable-transitions="false"-->
            <!--@close="removeUser(index)">-->
            <!--{{tag}}-->
            <!--</el-tag>-->
          </el-form-item>
        </el-col>
      </el-form>
      <div align="center" style="margin-top:10px;">
        <el-col>
          <el-button type="primary" @click="$emit('cancel','delSign')"> 确定</el-button>
        </el-col>
      </div>
    </el-row>
    <!--删除弹窗-->
    <Modal
      close-on-click-modal="false"
      height="200"
      v-model="removeModal"
      title="对话框标题"
      class-name="vertical-center-modal"
      :width="500">
      <modal-header slot="header" :content="removeId"></modal-header>
      <remove v-if="removeModal" :delete-url="removeUrl" @remove="subCallback" @cancel="removeModal=false" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import api from '../deptReported/api';
  import getRotaryTeachers from './sign_getRotaryTeachers.vue';
  import selectUser from '../../../common/selectUser';

  export default {
    props: ['operailityData', 'signType'],
    data () {
      return {
        api,
        removeUrl: '',
        podId: '',
        initUser: [],
        teacherIds: [],
        selectTeacherIds: [],
        ids: [],
        number: '',
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
          isShowMenus: true
        },
        removeModal: false,
        removeId: {id: 'removeId', title: '删除'}
      };
    },
    methods: {
      getInfo () {
        let opt = {
          ajaxSuccess: res => {
            this.podId = res.data.podId;
            this.viewData = res.data;
            this.ids = res.data.ids && res.data.ids.split(',') || [];
            this.selectTeacherIds = res.data.teacherIds && res.data.teacherIds.split(',') || [];
            this.selectTeacherNames = res.data.teacherNames && res.data.teacherNames.split(',') || [];
          },
          ajaxParams: {
            url: api.get.path + this.operailityData.podId,
            method: api.get.method
          }
        };
        this.ajax(opt);
      },

      // 取消
      cancel () {
        this.$emit('cancel', this.addMessTitle.type);
      },
      //删除人员
      removeUser (index) {
        this.number = index;
        let id = this.ids[index];
        this.removeUrl = api.delTeacher.path + id + '-' + this.podId;
        this.removeModal = true;
      },
      //删除成功
      subCallback (target, title, updata) {
        let index = this.number;
        this.selectTeacherNames.splice(index, 1);
        this.ids.splice(index, 1);
        this.$emit('delSign', target, title, updata);
        this.removeModal = false;
      }

    },
    components: {
      selectUser, getRotaryTeachers
    },
    created () {
      this.getInfo();
    }
  };

</script>

<style lang="scss">
  /*.deptReported {*/
  /*margin-right: 10px;*/
  /*&:empty {*/
  /*margin-right: 0*/
  /*}*/
  /*}*/
  .del {
    .deptReported {
      display: inline-block;
      background-color: RGB(236, 245, 255);
      padding: 0 5px;
      line-height: 22px;
      font-size: 12px;
      color: #409EFF;
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid transparent;
      margin-right: 5px;
    }

  }

  .el-message-box__wrapper .el-message-box .el-message-box__title {
    color: #373d41;
    display: inline-block;
    margin-bottom: 10px;
  }

  .el-message-box__headerbtn .el-message-box__close {
    color: #999;
    font-size: 13px;
  }
</style>
