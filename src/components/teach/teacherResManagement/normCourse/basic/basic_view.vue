<template>
  <!-- 基本信息 - 查看 -->
  <div>
    <el-row>
      <el-form class="editForm" label-width="120px">
        <el-col :span="19">
          <el-form-item label="课程名称：" prop="title">
            {{ course.title }}
          </el-form-item>
          <el-form-item label="标签：" prop="tags">
            <el-tag :key="tag" v-for="tag in dynamicTags" class="tagItem">
              {{tag}}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <img :src="getPicUrl(course.logo)" class="nBasicImg">
        </el-col>
        <el-col>
          <el-form-item label="应用方向说明：" prop="direction">
            {{ course.direction }}
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
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dynamicTags: [],
        course: {
          title: "", //课程名称
          tags: "", //标签，多个|分割
          direction: "", //应用方向说明
          logo: "", //缩略图
          operator: "", // 创建人
          createTime: "", // 创建时间
          status: "", //审核状态
        },
        splStr: '|', // 分隔符
      }
    },
    methods: {
      // 初始化
      init() {
        this.course = this.$store.state.curriculum.data.course;
        this.dynamicTags = this.course.tags.split(this.splStr);
      },
      // 获取图片
      getPicUrl(staticUrl) {
        let src = '';
        if (staticUrl) {
          src = this.$store.state.envPath.http + staticUrl
        }
        return src
      },
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 基本信息 - 查看 */

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
