<template>
  <!-- 教学计划 - 查看 -->
  <div>
    <el-row>
      <el-form class="editForm" ref="item" v-for="(item,index) in planDtoList" label-width="100px" :key="index">
        <fieldset class="nPlanItem">
          <legend style="font-size:16px">&nbsp;&nbsp;第{{ indexText(index) }}节&nbsp;&nbsp;</legend>
          <el-col>
            <el-form-item label="课时：" prop="duration">
              {{ item.duration }}小时
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="教学内容：" prop="content">
              {{ item.content }}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="详细介绍：">
              {{ item.remark }}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="所需道具：">
              {{ item.realia }}
            </el-form-item>
          </el-col>
        </fieldset>
      </el-form>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        planDtoList: [],
      }
    },
    methods: {
      // 初始化
      init() {
        this.planDtoList = this.$store.state.curriculum.look.planDtoList;
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
  /* 教学计划 - 查看 */

</style>
