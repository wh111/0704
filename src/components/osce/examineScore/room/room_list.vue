<template>
  <!-- 列表数据 -->
  <div class="msiListContent">
    <template v-if="!hasList()">
      <div class="msiListContentItem" v-for="(item,index) in list" @click="show(item.nowIndex)" :key="index">
        <img :src="getPhotoPath(item.userPhotoPath)">
        <p>{{ item.userName }}</p>
        <p>{{ getTimeText(item) }}</p>
        <p>得分：{{ item.mark || 0}}</p>
      </div>
    </template>
    <p v-else>暂无数据</p>
  </div>
</template>

<script>
  export default {
    props: ['list'],
    methods: {
      // 查看考生考试详情
      show(index) {
        this.$emit('lookStudent', index)
      },
      // 是否有值
      hasList() {
        return this.$util.isEmptyObject(this.list)
      },
      // 时间转换
      getTimeText(row) {
        return this.conductDate(row.startTime, 'HH:mm') + ' - ' + this.conductDate(row.endTime, 'HH:mm')
      },
      // 获取头像地址
      getPhotoPath(path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png'
      },
    }
  }

</script>
