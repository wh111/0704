// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import store from './vuex/store';
import router, { menus } from './router';
import App from './App';
import iView from 'iview';
import VueCookie from 'vue-cookie';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VideoPlayer from 'vue-video-player';

//import VueQuillEditor from 'vue-quill-editor'
//import $ from 'jquery'

import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-default/index.css';
import './assets/ambuf/css/manage_v1.0/handleExtraUi.css';
import './assets/ambuf/css/manage_v1.0/message.css';
import './assets/ambuf/css/manage_v1.0/workbench.css';
import './assets/ambuf/css/manage_v1.0/daily.scss';
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';
import './assets/ambuf/css/fontIcon/style.scss';

import ElementUI from 'element-ui';

import Util from './libs/util';
import Filters from './libs/filters';
import Directives from './libs/directives';

Filters(Vue);
Directives(Vue);
Vue.use(Util);
Vue.use(iView);
Vue.use(ElementUI);
Vue.use(VueCookie);
Vue.use(VueAwesomeSwiper);
Vue.use(VideoPlayer);
//Vue.use(VueQuillEditor)

Vue.config.productionTip = false;

import { utils } from './libs/util';

//路由拦截配置
router.beforeEach((to, from, next) => {
  /*if (utils.getCookie("Token")) {
   store.commit("setToken", true);
   } else {
   store.commit("setToken", false);
   }*/
  utils.setAjaxPostToken();

  // if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
  //   if (utils.getCookie("Token")) { // 通过vuex state获取当前的token是否存在
  //     next({
  //       path: from.query.redirect || to.query.redirect,
  //     });
  //   } else {
  //     next();
  //   }
  // } else {
  //   if (utils.getCookie("Token")) { // 通过vuex state获取当前的token是否存在
  //     next();
  //   } else {
  //     next({
  //       path: '/login',
  //       query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
  //     })
  //   }
  // }
  // console.log(to)
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (to.fullPath == '/login') {
      next();
    } else if (utils.getCookie('Token')) { // 通过vuex state获取当前的token是否存在
      //store.dispatch("onLoading",true);
      next({
        path: from.query.redirect || to.query.redirect
      });
    } else {
      next({
        path: '/login'
        //   //query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    store.dispatch('onLoading', true);
    iView.LoadingBar.start();
    next();
    // if (utils.getCookie("Token")) { // 通过vuex state获取当前的token是否存在
    //   store.dispatch("onLoading", true);
    //   iView.LoadingBar.start();
    //   next();
    // } else {
    // next({
    //   path: '/login'
    //   //query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
    // })
    // }
  }
});

// 这里为了让效果明显一些加了延时
router.afterEach((to, from) => {
  store.dispatch('onLoading', false);
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App />',
  components: {App},
  created () {
//    let userInfo = this.$store.getters.getUserInfo;
    //console.log(userInfo);
  }
});
