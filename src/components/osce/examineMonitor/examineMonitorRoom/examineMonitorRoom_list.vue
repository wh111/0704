<template>
  <!-- 列表数据 -->
  <div class="msiListContent">
    <template v-if="showList.length">
      <div class="msiListContentItem" v-for="item in showList" @click="show(item.nowIndex)" :key="item.userId"
           :class="{'notexamError':item.examStatus==='NOTEXAM'}">
        <img :src="getPhotoPath(item.userPhotoPath)">
        <p>{{ item.userName }}</p>
        <p v-html="getTimeText(item)"></p>
        <p>{{ item.contentName }}</p>
        <p>得分：{{ item.totalMark || 0 }}</p>
      </div>
    </template>
    <p v-else class="msgTips">暂无数据</p>
  </div>
</template>

<script>
  export default {
    props: ['list'],
    data () {
      return {
        showList: this.list || null
      };
    },
    methods: {
      // 查看考生考试详情
      show (index) {
        this.$emit('lookStudent', index);
      },
//      // 是否有值
//      hasList () {
//        return this.showList instanceof Array && this.showList.length;
//      },
      // 时间转换
      getTimeText (row) {
        return '起：' + this.conductDate(row.startTime, 'HH:mm:ss') + '<br>止：' + this.conductDate(row.endTime, 'HH:mm:ss');
      },
      // 获取头像地址
      getPhotoPath (path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png';
      }
    },
    watch: {
      list (val) {
        this.showList = val;
      }
    }
  };

</script>
