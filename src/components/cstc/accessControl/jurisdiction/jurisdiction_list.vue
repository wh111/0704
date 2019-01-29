<template>
  <!-- 权限管理 -->
  <div>
    <user-list v-if="activeName === 'user'" :id="id" @show="show"></user-list>
    <device-list v-else @show="show"></device-list>
  </div>
</template>

<script>
  import deviceList from './jurisdiction_deviceList';
  import userList from './jurisdiction_userList';
  export default {
    data() {
      return {
        activeName: "device", // 视图
        id: "", // 门禁设备id
      }
    },
    methods: {
      // 视图切换
      show(name, id) {
        this.activeName = name;
        this.id = id || "";
      }
    },
    components: {
      userList,
      deviceList,
    }
  }

</script>

<style>
  /* 权限管理 */

</style>
