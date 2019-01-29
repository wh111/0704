<template>
  <!-- 表格数据 -->
  <div id="studentList" ref="studentList">
    <el-table align="center" :height="dynamicHt" :context="self" :data="showList" tooltip-effect="dark" class="tableShowMoreInfo"
              style="width: 100%">
      <el-table-column label="时间" show-overflow-tooltip width="170px">
        <template scope="scope">
          {{ getTimeText(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="考生" prop="userName" show-overflow-tooltip></el-table-column>
      <el-table-column label="考核内容" prop="contentName" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="examStatus" show-overflow-tooltip>
        <template scope="scope">
          <span :class="{'error':scope.row.examStatus==='NOTEXAM'}">{{ scope.row.examStatus | typeText }}</span>
        </template>
      </el-table-column>
      <el-table-column label="得分" prop="totalMark" show-overflow-tooltip width="70px">
        <template scope="scope">
          {{ scope.row.totalMark || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template scope="scope">
          <el-button size="small" type="info" @click="show(scope.row.nowIndex)">查看评分情况</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    props: ['list'],
    data () {
      return {
        showList: this.list || [],
        dynamicHt: 100,
        self: this
      };
    },
    methods: {
      // 查看考生考试详情
      show (index) {
        this.$emit('lookStudent', index);
      },
      // 设置表格高度
      setTableDynHeight () {
        let contenHeight = this.$refs.studentList.parentNode.offsetHeight;
        let listHeight = this.$refs.studentList.offsetTop;
        this.dynamicHt = contenHeight - listHeight;
      },
      // 时间转换
      getTimeText (row) {
        return this.conductDate(row.startTime, 'HH:mm:ss') + ' - ' + this.conductDate(row.endTime, 'HH:mm:ss');
      }
    },
    mounted () {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, 'resize', this.setTableDynHeight);
      });
    },
    watch: {
      list (val) {
        this.showList = val;
      }
    }
  };

</script>

<style>


</style>
