<template>
  <!-- 授课安排 -->
  <div>
    <el-row>
      <el-form class="editForm" :model="teach" ref="teach" :rules="rules" label-width="120px">
        <el-form-item label="课程名称：" prop="title">
          <el-input v-model="teach.title"></el-input>
        </el-form-item>
        <el-form-item label="授课老师：" required>
          <el-radio-group v-model="teach.teacherType" @change="changeTeacherType">
            <div class="thProjectBox">
              <div class="thProjectItem">
                <el-radio label="IN">本院</el-radio>
                <template v-if="teach.teacherType === 'IN'">
                  <el-input v-model="teach.teacher" readonly></el-input>
                  <el-button type="info" size="small" style="margin-left:10px;" @click="selectUser('teacher')">选择人员</el-button>
                </template>
              </div>
              <div class="thProjectItem">
                <el-radio label="OUT">外院</el-radio>
                <template v-if="teach.teacherType === 'OUT'">
                  <el-input v-model="teach.teacher"></el-input>
                </template>
              </div>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授课对象：" required>
          <el-radio-group v-model="teach.teachType" @change="changeTeachType" class="thProjectRedio">
            <div class="thProjectBox">
              <div class="thProjectItem">
                <el-radio label="ALL">全体人员</el-radio>
              </div>
              <div class="thProjectItem">
                <el-radio label="ROLE">指定角色</el-radio>
                <el-checkbox-group v-model="teachTypeId" v-if="teach.teachType === 'ROLE'">
                  <el-checkbox v-for="item in teachTypeOption" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="thProjectItem">
                <el-radio label="PART">部分人员</el-radio>
                <template v-if="teach.teachType === 'PART'">
                  <el-tag type="success" class="thUserItem" :closable="true" v-for="(item,index) in teach.userList" @close="removeUser(index)" :key="item.id">{{ item.name }}</el-tag>
                  <el-button type="info" size="small" style="margin-left:10px;" @click="selectUser('teach')">选择人员</el-button>
                </template>
              </div>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授课说明：">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" v-model="teach.teachTimeRemark"></el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <!--选择人员-->
    <Modal :mask-closable="false" width="890" v-model="selectUserModal" title="添加人员" class-name="vertical-center-modal">
      <modal-header slot="header" :content="selectUserId"></modal-header>
      <select-user v-if="selectUserModal" @cancel="cancel" @setUsers="selectUserCall" :initUser="initUser" :isOnlyOne="isOnlyOne"></select-user>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import selectUser from '../../../../common/selectUser'; // 选择人员
  import {
    teach as rules
  } from '../rules';
  export default {
    props: ['selectCourse'],
    data() {
      return {
        rules,
        isInitCT: true,
        isInitCTR: true,
        isOnlyOne: false,
        selectUserType: '',
        curriculum: {},
        isFirst:false,
        initUser: [],
        teachTypeId: [], //授课人
        teachTypeOption: [],
        teach: {
          "title": "",
          "criterionId": null, //所选择的标准课程ID，如果没选标准课程，赋值null
          "teacherType": "IN", // 本院IN/外院 OUT
          "teacherId": "", //当teacherType选择的是本院IN，赋值所选择的本院老师ID
          "teacher": "", //老师姓名，本院为所选姓名，外院为输入。
          "teachType": "ALL", //授课对象类型：ALL所有人、PART部分人、ROLE指定角色
          "teachTypeId": '', //授课人，当teachType选择ALL所有人，该项传值[]空数组。当teachType选择PART部分人，该项传值所选的部分人员ID。当teachType选择ROLE指定角色，该项传值所选角色ID。
          "teachTimeRemark": "", // 授课时间
          "userList": [], // 人员列表
        },
        selectUserModal: false,
        selectUserId: {
          id: 'selectUserId',
          title: '选择人员'
        },
      }
    },
    methods: {
      // 初始化
      init() {
        this.isReadOnly = this.readOnly !== undefined;
        this.curriculum = this.$store.state.curriculum.data.course;
        this.getTeachTypeOption();
      },
      // 初始化数据
      initData() {
        let state = this.$store.state;
        if(state.teacherType!=='IN'){ //如果为为外援的，标记为第一次，切换授课老师不用刷新
          this.isFirst = true
        }
        // 只取有用的字段
        for (let key in this.teach) {
          this.teach[key] = state.curriculum.data.course[key]
        }
        if (this.teach.teachType === 'ROLE') {
          this.teach.userList.length = 0;
          let dataArr = [];
          this.teach.teachTypeId.split(',').map(item => item && (dataArr.push(parseInt(item))));
          this.teachTypeId = dataArr;
        }
        if (this.selectCourse) {
          this.teach.criterionId = this.selectCourse.id;
        }
      },
      // 保存数据
      saveToStore() {
        if (!this.checkData()) {
          return false;
        }
        if (this.teach.teachType === 'ROLE') {
          this.teach.teachTypeId = this.teachTypeId.join(',');
        }
        if (this.teach.teachType === 'PART') {
          this.teach.teachTypeId = '';
          let userIds = [];
          this.teach.userList.map(item => userIds.push(item.id));
          this.teach.teachTypeId = userIds.join(',');
        }
        let data = this.$util._.defaultsDeep({}, this.teach);
        this.$store.commit('curriculum/data/updateCourse', data);
        return true
      },
      // 检测数据完整性
      checkData() {
        let flag = false;
        this.$refs.teach.validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        if (flag && !this.teach.teacher) {
          flag = false;
          this.errorMess('请输入或者选择授课老师！');
        }
        return flag;
      },
      // 选择人员
      selectUser(type) {
        this.selectUserType = type;
        this.initUser = [];
        if (type === 'teach') {
          this.isOnlyOne = false;
          this.teach.userList.map(item => this.initUser.push({
            key: item.id,
            label: item.name,
            disabled: false
          }))
        } else {
          this.isOnlyOne = true;
          if (this.teach.teacherId) {
            this.initUser[0] = {
              key: this.teach.teacherId,
              label: this.teach.teacher,
              disabled: false
            }
          }
        }
        this.selectUserModal = true;
      },
      // 选择人员回调
      selectUserCall(res) {
        if (this.selectUserType === 'teach') {
          this.teach.userList.length = 0;
          res.map(item => this.teach.userList.push({
            id: item.key,
            name: item.label
          }))
        } else {
          this.teach.teacherId = res[0].key;
          this.teach.teacher = res[0].label;
        }
        this.cancel()
      },
      // 删除人员
      removeUser(index) {
        this.teach.userList.splice(index, 1)
      },
      // 切换选择老师
      changeTeacherType() {
        if (!this.isFirst) {
          this.teach.teacherId = '';
          this.teach.teacher = '';
        }else {
          this.isFirst = false
        }
      },
      // 切换角色
      changeTeachType() {
        if (!this.isInitCT) {
          this.teachTypeId.length = 0;
          this.teach.userList.length = 0;
          this.isInitCT = true
        } else {
          this.isInitCT = false
        }
      },
      // 获取角色
      getTeachTypeOption() {
        this.ajax({
          ajaxSuccess: res => this.teachTypeOption = res.data || [],
          ajaxParams: {
            url: '/role/list',
          }
        })
      },
      // 关闭选择人员
      cancel() {
        this.selectUserModal = false;
      },
    },
    watch: {
      curriculum(val) {
        this.initData()
      }
    },
    components: {
      selectUser
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  @import"../../../../../assets/ambuf/css/manage_v1.0/editForm";
  .editForm .thProjectRedio {
    width: 100%;
    .el-select {
      width: 280px;
      .el-input {
        width: 260px;
      }
    }
  }

  .thProjectBox {
    width: 100%;
    display: inline-block; // padding-top: 10px;
    .thProjectItem {
      // height: 36px;
      line-height: 36px;
      .el-input {
        width: 250px;
        margin-left: 20px;
        display: inline-block;
      } // &~.thProjectItem {
      //   margin-top: 16px;
      // }
    }
    .thUserItem {
      margin-left: 6px;
      margin-top: -9px;
    }
  }

</style>
