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
              <div v-if="item.wareDtoList.before.length">
                <el-col v-for="(cItem,cIndex) in item.wareDtoList.before" :key="cIndex" class="coursewareViewItem">
                  <template v-if="showProgress">
                    <el-col :span="6">
                      <p class="overflow-txt1"> {{ cIndex + 1 }}.{{ cItem.title }}</p>
                    </el-col>
                    <el-col :span="14">
                      <el-progress :text-inside="true" :stroke-width="18"
                                   :percentage="getPercentageNUm(cItem.length,cItem.progress)"
                                   class="coursewareParogress"></el-progress>
                    </el-col>
                  </template>
                  <el-col :span="20" v-else>
                    <p class="overflow-txt1"> {{ cIndex + 1 }}.{{ cItem.title }}</p>
                  </el-col>
                  <el-col :span="4" align="center">
                    <span class="viewCoursewareBtn" :class="[(cItem.resourceType || '').toLocaleLowerCase()]"
                          @click="goPlayer(index,cIndex,'before')"></span>
                  </el-col>
                </el-col>
              </div>
              <p v-else class="coursewareNoItemTips">暂无课件</p>

              <h4>课中资料：</h4>
              <div v-if="item.wareDtoList.inProgress.length">
                <el-col v-for="(cItem,cIndex) in item.wareDtoList.inProgress" :key="cIndex" class="coursewareViewItem">
                  <template v-if="showProgress">
                    <el-col :span="6">
                      <p class="overflow-txt1"> {{ cIndex + 1 }}.{{ cItem.title }}</p>
                    </el-col>
                    <el-col :span="14">
                      <el-progress :text-inside="true" :stroke-width="18"
                                   :percentage="getPercentageNUm(cItem.length,cItem.progress)"
                                   class="coursewareParogress"></el-progress>
                    </el-col>
                  </template>
                  <el-col :span="20" v-else>
                    <p class="overflow-txt1"> {{ cIndex + 1 }}.{{ cItem.title }}</p>
                  </el-col>
                  <el-col :span="4" align="center">
                    <span class="viewCoursewareBtn" :class="[(cItem.resourceType || '').toLocaleLowerCase()]"
                          @click="goPlayer(index,cIndex,'inProgress')"></span>
                  </el-col>
                </el-col>
              </div>
              <p v-else class="coursewareNoItemTips">暂无课件</p>

              <h4>课后资料：</h4>
              <div v-if="item.wareDtoList.after.length">
                <el-col v-for="(cItem,cIndex) in item.wareDtoList.after" :key="cIndex" class="coursewareViewItem">
                  <template v-if="showProgress">
                    <el-col :span="6">
                      <p class="overflow-txt1"> {{ cIndex + 1 }}.{{ cItem.title }}</p>
                    </el-col>
                    <el-col :span="14">
                      <el-progress :text-inside="true" :stroke-width="18"
                                   :percentage="getPercentageNUm(cItem.length,cItem.progress)"
                                   class="coursewareParogress"></el-progress>
                    </el-col>
                  </template>
                  <el-col :span="20" v-else>
                    <p class="overflow-txt1"> {{ cIndex + 1 }}.{{ cItem.title }}</p>
                  </el-col>
                  <el-col :span="4" align="center">
                    <span class="viewCoursewareBtn" :class="[(cItem.resourceType || '').toLocaleLowerCase()]"
                          @click="goPlayer(index,cIndex,'after')"></span>
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
    // 是否显示进度条
    props: ['showProgress'],
    data () {
      return {
        coursewareActive: 0,
        planDtoList: []
      };
    },
    methods: {
      // 初始化
      init () {
        this.planDtoList = this.$store.state.curriculum.look.planDtoList;
      },
      // 索引数字转换
      indexText (index) {
        index += 1;
        let text = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        let str = [];
        let bit = index % 10; // 个位
        let ten = (index - bit) / 10; // 十位
        ten > 1 && (str[0] = text[ten - 1]);
        index > 9 && (str[1] = text[9]);
        str[2] = (text[bit - 1]) || '';
        return str.join('');
      },
      /**
       * 播放
       * planIndex 第几节课索引
       * viewIndex 课件索引
       * types 课件类型（课前中后）
       */
      goPlayer (planIndex, viewIndex, types) {
        this.$emit('show', 'player', {
          planIndex,
          viewIndex,
          types
        });
      },
      getPercentageNUm (length = 0, num = 0) {
        let p = ((num || 0) / (length || 0)) * 100;
        p = p > 100 ? 100 : p;
        return Number(p.toFixed(2));
      }
    },
    created () {
      this.init();
    }
  };

</script>

<style lang="scss">
  /* 课件 - 查看 */

  .coursewareViewItem {
    margin-bottom: 10px;
    p {
      text-indent: 2em;
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
    background-position: -377px -184px; // 文档文献
    cursor: pointer;
    &.video { // 教学视频
      background-position: -401px -184px;
    }
    &.atlas { // 医学图谱
      background-position: -328px -160px;
    }
    /*
    &.course,
    &.PPT,
    &.PPTX {
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
    */
  }

</style>
