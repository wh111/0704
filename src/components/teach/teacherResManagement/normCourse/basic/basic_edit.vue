<template>
  <!-- 课程基本信息 -->
  <el-row>
    <el-form class="editForm" :model="course" ref="course" :rules="rules" label-width="120px">
      <el-col :span="19">
        <el-form-item label="课程名称：" prop="title">
          <el-input v-model="course.title" :readonly="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="标签：" prop="tags">
          <template v-if="isReadOnly">
            <template v-if="dynamicTags.length > 0">
              <el-tag :key="tag" v-for="tag in dynamicTags">
                {{tag}}
              </el-tag>
            </template>
            <span v-else>暂无标签</span>
          </template>
          <template v-else>
            <el-tag :key="tag" v-for="tag in dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" class="tagInput"></el-input>
            <el-button v-else @click="showInput" size="mini">创建标签</el-button>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="4" :offset="1">
        <img :src="getPicUrl(course.logo)" class="nBasicImg" onerror="this.src='/static/image/noPicture.png'"
             v-if="isReadOnly">
        <upload-header v-else @upladSuccess="upladSuccess" actionUrl="/file/upload/study" :img-file="getPicUrl(course.logo)" class="uploadBookLogo"></upload-header>
      </el-col>

      <el-col v-if="theTodoType === 'teach'">
        <el-form-item label="分类：" prop="typeName">
          <el-input v-model="course.typeName" @focus="selectType"></el-input>
        </el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="应用方向说明：" prop="direction">
          <el-input v-model="course.direction" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" :readonly="isReadOnly"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="创建人：">{{ course.operator }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="创建时间：" label-width="90px">{{ course.createTime | formatDate('yyyy-MM-dd hh:mm:ss') }}</el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="课程状态：">{{ course.status | courseStatus }}</el-form-item>
      </el-col>
    </el-form>
    <!-- 选择分类 -->
    <select-tree :getTreeUrl="'/criterionCourseType/tree'" ref="selectTypes" @selectTree="selectTreeCall"></select-tree>
  </el-row>
</template>

<script>
  import {
    basic as rules
  } from '../rules';
  import uploadHeader from '../../../../common/uploadHeader';
  import selectTree from '../../../../common/selectTree';
  export default {
    props: ['readOnly', 'operailityData', 'todoType'],
    data() {
      return {
        self: this,
        rules, // 验证输入规则
        isReadOnly: false, // 只读
        dynamicTags: [],
        curriculum: {},
        course: {
          title: "", //课程名称
          typeId: "", // 所属分类
          typeName: "", // 所属分类名称
          tags: "", //标签，多个|分割
          direction: "", //应用方向说明
          logo: "", //缩略图
          operator: "", // 创建人
          createTime: "", // 创建时间
          status: "DXD", // 保存草稿 传  带修订DXD，提交审核 传 待审核DSH
        },
        splStr: '|', // 分隔符
        inputVisible: false,
        inputValue: '',
        theTodoType: '', // 是否是创建课程（非标准课程）
        selectId: {
          id: 'selectId',
          title: '选择分类'
        }
      }
    },
    methods: {
      // 初始化
      init() {
        this.curriculum = this.$store.state.curriculum.data.course;
        this.isReadOnly = this.readOnly !== undefined;
        if (this.todoType) {
          this.theTodoType = this.todoType
        }
      },
      // 初始化数据
      initData() {
        let state = this.$store.state;
        // 只取有用的字段
        for (let key in this.course) {
          this.course[key] = state.curriculum.data.course[key]
        }

        if (this.course.tags) {
          this.dynamicTags = this.course.tags.split(this.splStr);
        }

        !this.course.operator && (this.course.operator = state.userInfo.name); // 创建人
        !this.course.createTime && (this.course.createTime = new Date()); // 创建时间
        if (this.operailityData && this.operailityData.deptId) {
          !this.course.typeId && (this.course.typeId = this.operailityData.deptId); // 分类
        }
      },
      // 保存数据
      saveToStore() {
        if (!this.checkData()) {
          return false;
        }

        this.course.tags = this.dynamicTags.join(this.splStr);
        let data = this.$util._.defaultsDeep({}, this.course);
        this.$store.commit('curriculum/data/updateCourse', data);
        return true
      },
      // 检测数据完整性
      checkData() {
        let flag = false;
        this.$refs.course.validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      // 选择所属分类
      selectType() {
        this.$refs.selectTypes.openModal()
      },
      // 移除tag
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },
      // 显示tag输入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      // 输入数组追加到tag数组中
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      // 上传封面
      upladSuccess(res, url) {
        this.course.logo = res.path
      },
      // 获取图片
      getPicUrl(staticUrl) {
        let src = '';
        if (staticUrl) {
          src = this.$store.state.envPath.http + staticUrl
        }
        return src
      },
      cancel() {
        this.selectModal = false
      },
      selectTreeCall(id, name) {
        this.course.typeId = id;
        this.course.typeName = name;
      },
    },
    components: {
      uploadHeader,
      selectTree,
    },
    watch: {
      curriculum(val) {
        this.initData()
      }
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 课程基本信息 */

  @import"../../../../../assets/ambuf/css/manage_v1.0/editForm";
  .nBasicImg {
    width: 96px;
    height: 96px;
    margin: 0 auto;
    display: block;
  }

  .tagItem {
    margin-right: 10px;
  }

  .tagInput {
    width: 100px;
  }

  .uploadBookLogo {
    margin: 0 auto;
    &,
    .avatar,
    .avatar-uploader-icon {
      width: 96px;
      height: 96px;
    }
    .avatar-uploader-icon {
      line-height: 96px;
    }
  }

</style>
