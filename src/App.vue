<template>
  <div id="app">
    <Loading v-if="isLoading"></Loading>
    <router-view></router-view>
  </div>
</template>
<style lang="scss">
  html, body, #app {
    height: 100%;
  }
</style>
<script>
  import Loading from './components/common/Loading.vue';
  import { mapState } from 'vuex';

  export default {
    name: 'app',
    created () {
      if (this.$cookie.get('Token') != null) {
        this.$store.commit('setUserInfo', this);
        this.$store.commit('setEnvPath', this);
      }
    },
    computed: {
      ...mapState([
        'isLoading'
      ])
    },
    components: {
      Loading
    }
  }

</script>
