<template>
  <!-- 评测与作业 - 查看 -->
  <div>
    <el-row v-if="planDtoList!=0">
      <el-col v-for="(item,index) in planDtoList" :key="index">
        <h3>第{{ indexText(index) }}节：{{ item.content }}</h3>
        <el-collapse v-if="showInfo" v-model="EQActive" accordion class="eqViewItem">
          <el-collapse-item v-if="item.testingDtoList.before">
            <template slot="title">
              <span>课前评测</span>
              <el-button size="small" type="success" @click.stop="gotoTest(index,'BEFORE',item)" class="eqTestBtn">前往测验</el-button>
            </template>
            <el-col>
              <el-form>
                <el-form-item label="截止时间：">
                  {{ item.testingDtoList.before.expiredTime }}（超过截止时间再提交分数不再计分）
                </el-form-item>
                <el-form-item label="有效分数：">
                  {{ item.testingDtoList.before.validityScore }}/{{ item.testingDtoList.before.totalScore }}（你的每一次提交分数系统都会给你计分，并提取最高分作为你的分数）
                </el-form-item>
                <el-form-item label="有效提交次数：">
                  {{ item.testingDtoList.before.validitySubmits }}/{{ item.testingDtoList.before.totalSubmits }}
                </el-form-item>
              </el-form>
            </el-col>
          </el-collapse-item>
          <el-collapse-item v-if="item.testingDtoList.inProgress">
            <template slot="title">
              <span>课中评测</span>
              <el-button size="small" type="success" @click.stop="gotoTest(index,'IN_PROGRESS',item)" class="eqTestBtn">前往测验</el-button>
            </template>
            <el-col>
              <el-form>
                <el-form-item label="截止时间：">
                  {{ item.testingDtoList.inProgress.expiredTime }}（超过截止时间再提交分数不再计分）
                </el-form-item>
                <el-form-item label="有效分数：">
                  {{ item.testingDtoList.inProgress.validityScore }}/{{ item.testingDtoList.inProgress.totalScore }}（你的每一次提交分数系统都会给你计分，并提取最高分作为你的分数）
                </el-form-item>
                <el-form-item label="有效提交次数：">
                  {{ item.testingDtoList.inProgress.validitySubmits }}/{{ item.testingDtoList.inProgress.totalSubmits }}
                </el-form-item>
              </el-form>
            </el-col>
          </el-collapse-item>
          <el-collapse-item v-if="item.testingDtoList.after">
            <template slot="title">
              <span>课后评测</span>
              <el-button size="small" type="success" @click.stop="gotoTest(index,'AFTER',item)" class="eqTestBtn">前往测验</el-button>
            </template>
            <el-col>
              <el-form>
                <el-form-item label="截止时间：">
                  {{ item.testingDtoList.after.expiredTime }}（超过截止时间再提交分数不再计分）
                </el-form-item>
                <el-form-item label="有效分数：">
                  {{ item.testingDtoList.after.validityScore }}/{{ item.testingDtoList.after.totalScore }}（你的每一次提交分数系统都会给你计分，并提取最高分作为你的分数）
                </el-form-item>
                <el-form-item label="有效提交次数：">
                  {{ item.testingDtoList.after.validitySubmits }}/{{ item.testingDtoList.after.totalSubmits }}
                </el-form-item>
              </el-form>
            </el-col>
          </el-collapse-item>
        </el-collapse>
        <!-- 不显示详情信息 -->
        <template v-else>
          <el-col>
            <el-col :span="12">
              <p class="eqListTitle">课前评测</p>
            </el-col>
            <el-col :span="12">
              <el-button size="small" type="success" @click.stop="lookTest(index,'BEFORE',item)" class="eqTestBtn">查看</el-button>
            </el-col>
          </el-col>
          <el-col>
            <el-col :span="12">
              <p class="eqListTitle">课中评测</p>
            </el-col>
            <el-col :span="12">
              <el-button size="small" type="success" @click.stop="lookTest(index,'IN_PROGRESS',item)" class="eqTestBtn">查看</el-button>
            </el-col>
          </el-col>
          <el-col>
            <el-col :span="12">
              <p class="eqListTitle">课后评测</p>
            </el-col>
            <el-col :span="12">
              <el-button size="small" type="success" @click.stop="lookTest(index,'AFTER',item)" class="eqTestBtn">查看</el-button>
            </el-col>
          </el-col>
        </template>
      </el-col>
    </el-row>
    <div v-else style="font-size: 24px;text-align: center;line-height: 200px"> <strong>暂无测评与作业</strong></div>
  </div>
</template>

<script>
  export default {
    props: ['showInfo'],
    data() {
      return {
        EQActive: 0,
        planDtoList: [],
        id: '',
      }
    },
    methods: {
      // 初始化
      init() {
        this.planDtoList = this.$store.state.curriculum.look.planDtoList;
        this.id = this.$store.state.curriculum.look.course.id;
      },
      // 前往检测
      gotoTest(index, type, itemData) {
        this.$emit('show', 'subject', {
          type,
          itemData
        })
      },
      // 查看检测
      lookTest(index, type, itemData) {
        this.$emit('show', 'look', {
          type,
          itemData
        })
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

<style>
  /* 评测与作业 - 查看 */

  .eqViewItem {
    margin: 10px 0 20px 0;
  }

  .eqTestBtn {
    float: right;
    margin: 6px;
  }

  .eqListTitle {
    text-indent: 2em;
    line-height: 42px;
  }

</style>
