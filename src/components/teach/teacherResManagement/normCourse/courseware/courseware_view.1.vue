<template>
  <!-- 课件 - 查看 -->
  <div>
    <el-row>
      <el-form>
        <el-collapse v-model="coursewareActive" accordion>
          <el-collapse-item v-for="(item,index) in planDtoList" :name="index" :key="index">
            <template slot="title">
              第{{ indexText(index) }}节：{{ item.content }}
            </template>
            <el-col>
              <h4>课前资料：</h4>
              <div v-if="item.wareDtoListTemp.before.length">
                <el-col v-for="(bcItem,cIndex) in item.wareDtoListTemp.before" :key="cIndex" class="coursewareViewItem">
                  <el-col :span="6">
                    <p> {{ cIndex + 1 }}.{{ bcItem.title }}</p>
                  </el-col>
                  <el-col :span="14">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="70" class="coursewareParogress"></el-progress>
                  </el-col>
                  <el-col :span="4" align="center">
                    <span class="viewCoursewareBtn" :class="[bcItem.fileType]"></span>
                  </el-col>
                </el-col>
              </div>
              <p v-else class="coursewareNoItemTips">暂无课件</p>

              <h4>课中资料：</h4>
              <div v-if="item.wareDtoListTemp.in_progress.length">
                <el-col v-for="(bcItem,cIndex) in item.wareDtoListTemp.in_progress" :key="cIndex" class="coursewareViewItem">
                  <el-col :span="6">
                    <p> {{ cIndex + 1 }}.{{ bcItem.title }}</p>
                  </el-col>
                  <el-col :span="14">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="70" class="coursewareParogress"></el-progress>
                  </el-col>
                  <el-col :span="4" align="center">
                    <span class="viewCoursewareBtn" :class="[bcItem.fileType]"></span>
                  </el-col>
                </el-col>
              </div>
              <p v-else class="coursewareNoItemTips">暂无课件</p>

              <h4>课后资料：</h4>
              <div v-if="item.wareDtoListTemp.after.length">
                <el-col v-for="(bcItem,cIndex) in item.wareDtoListTemp.after" :key="cIndex" class="coursewareViewItem">
                  <el-col :span="6">
                    <p> {{ cIndex + 1 }}.{{ bcItem.title }}</p>
                  </el-col>
                  <el-col :span="14">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="70" class="coursewareParogress"></el-progress>
                  </el-col>
                  <el-col :span="4" align="center">
                    <span class="viewCoursewareBtn" :class="[bcItem.fileType]"></span>
                  </el-col>
                </el-col>
              </div>
              <p v-else class="coursewareNoItemTips">暂无课件</p>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        coursewareActive: 0,
        planDtoList: [],
      }
    },
    methods: {
      // 初始化
      init() {
        this.planDtoList = this.$store.state.curriculum.data.planDtoList;
      },
      // 索引数字转换
      indexText(index) {
        index += 1;
        let text = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        let str = [];
        let bit = index % 10; // 个位
        let ten = (index - bit) / 10; // 十位
        ten > 1 && (str[0] = text[ten - 1]);
        index > 9 && (str[1] = text[9]);
        str[2] = (text[bit - 1]) || '';
        return str.join('')
      },
    },
    created() {
      this.init()
    }
  }

</script>

<style lang="scss">
  /* 课件 - 查看 */

  .coursewareViewItem {
    margin-bottom: 10px;
    p {
      line-height: 30px;
    }
  }

  .coursewareParogress {
    margin-top: 6px;
  }

  .coursewareNoItemTips {
    line-height: 30px;
    text-align: center;
  }

  .viewCoursewareBtn {
    width: 30px;
    height: 30px;
    display: block;
    background-image: url(~@/assets/ambuf/css/videoStudy/images/icons.png); // background-color: red;
    background-position: -377px -184px;
    cursor: pointer;
    &.MP4,
    &.FLV,
    &.RMVB,
    &.RM,
    &.AVI {
      // mp4|flv|rmvb|rm|avi
      background-position: -377px -160px;
    }
    &.PPT,
    &.pptx {
      background-position: -329px -184px;
    }
    &.PDF {
      background-position: -353px -184px;
    }
    &.XLSX,
    &.XLS {
      background-position: -305px -184px;
    }
    &.DOCX,
    &.DOC {
      background-position: -280px -184px;
    }
  }

</style>
