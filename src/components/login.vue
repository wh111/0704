<template>
  <div class="loginMain" v-loading.fullscreen.lock="isLogin">
    <div class="loginLeft">
      <div class="login">
        <div style="text-align: center"><img class="logo-ambuf" src="/static/image/loginLogo.png" alt=""></div>
        <div v-if="isLogin" style="text-align: center">数据加载中!</div>
        <div v-if="!isLogin" class="loginBox">
          <div class="logo-text" style="margin-top: 20px;font-size: 22px;letter-spacing:3px;">{{ hospitalName }}教学管理系统
          </div>
          <div class="logo-text" style="margin-top: 13px;font-size: 12px;">
            T.C.M.TIAJIN CHNA
          </div>
          <div style="border-bottom: 1px solid #fff;margin: 21px 0 32px"></div>
          <!--<h2>实习生管理系统-登录</h2>-->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0" class="demo-ruleForm">
            <span style="font-size: 12px;color:#c4d9e9;">用户名</span>
            <el-form-item style="margin-bottom: 20px" prop="name">
              <el-input v-model="ruleForm.name" @keyup.enter.native="submitForm('ruleForm')">
                <Icon slot="prepend" type="person"></Icon>
              </el-input>
            </el-form-item>
            <span style="font-size: 12px;color:#c4d9e9;">密码</span>
            <el-form-item style="margin-bottom: 20px" prop="password">
              <el-input type="password" @keyup.enter.native="submitForm('ruleForm')"
                        v-model="ruleForm.password">
                <Icon slot="prepend" type="ios-locked-outline"></Icon>
              </el-input>
            </el-form-item>
            <el-form-item style="text-align: center" label-width="0">
              <el-button class="logo-button" type="primary" @click="submitForm('ruleForm')">点此进入</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
  .loginMain {
    width: 100%;
    height: 100%;
    position: relative;
    background: #f3f3f4;
  }

  .loginBox {
    height: 410px;
    width: 310px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -177px 0 0 -155px;
  }

  .loginBox h2 {
    text-align: center;
  }

  .loginLeft {
    background-image: url(../assets/ambuf/images/manageLogo/logoBG.jpg);
    background-position: center center;
    background-repeat: repeat-x;
    width: 100%;
    height: 100%;
    position: relative;
  }

  .loginLeft .login {
    background-image: url(../assets/ambuf/images/manageLogo/transparentBG.png);
    background-position: center center;
    background-repeat: no-repeat;
    width: 430px;
    height: 524px;
    margin: -262px 0 0 -215px;
    position: absolute;
    top: 50%;
    left: 50%;
  }

  .loginLeft .login .logo-text {
    color: #fff;
    text-align: center;

  }

  .loginLeft .logo-ambuf {
    position: relative;
    top: -23px;
  }

  .loginLeft .login .logo-button {
    display: inline-block;
    height: 51px;
    width: 100%;
    font-size: 15px;
    margin-top: 10px;
  }

</style>
<script>
  let Util;
  export default {
    data() {
      return {
        hospitalName: '',
        isLogin: false,
        loginUrl: '',
        routerPath: {},
        ruleForm: {
          name: '',
          password: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        },
        //获取菜单
        getMenusData: {
          ajaxSuccess: 'setMeusData',
          ajaxParams: {
            url: '/menu/query-tree-by-user',
            params: {}
          }
        }
      }
    },
    created() {
      Util = this.$util;
      let index = this.$store.getters.getIndexUrl;
      if (this.$cookie.get('Token') != null) {
        if (index != '') {
          this.$router.push(index);
        } else {
          this.isLogin = true;
          this.myPromise();
        }
      } else {
        this.getHospitalName()
      }
      /*if (this.$cookie.get('Token') != null) {
       this.isLogin = true;
       this.myPromise();
       }*/
    },
    methods: {
      setMeusData(responseData) {
        let data = responseData.data || [];
        if (data.length > 0) {
          data = data[0].children;
        }

        data.unshift({
          expand: true,
          icon: '',
          id: -100,
          leaf: true,
          modName: 'work',
          name: '工作台',
          url: '',
          children: [{
            expand: true,
            icon: '',
            id: -101,
            leaf: true,
            modName: 'workbench',
            name: '工作台',
            url: '',
            children: [{
              expand: true,
              icon: '',
              id: -102,
              leaf: true,
              modName: 'work',
              name: '工作台',
              url: ''
            }]
          }]
        })

        //将设置完成的structureIndex赋值给 navs
        let index = '/manage',
          myData = data[0].children || [];
        for (var i = 0; i < myData.length;) {
          if (typeof myData[i].children != 'undefined') {
            index += '/' + myData[i]['modName'];
            myData = myData[i].children;
          } else {
            index += '/' + myData[i]['modName'];
            break;
          }
        }

        this.setRouterPath(data, true);
        this.$store.commit('setIndexUrl', index);
        this.$store.commit('setRouterPath', this.routerPath);
        this.$router.push(index);
      },
      loginSuccess(responseData) {
        let token = responseData.data;
        this.$cookie.set('Token', token, 1);
        this.$store.commit('setToken', true);
        Util.setAjaxPostToken();

        setTimeout(() => {
          this.$store.commit('setUserInfo', this);
          this.$store.commit('setEnvPath', this);
        }, 100)

        setTimeout(() => {
          this.myPromise();
        }, 10)
      },
      myPromise() {
        let that = this;
        let myPromise = Util.queryData({
          url: '/menu/query-tree-by-user',
          method: 'get'
        })();
        myPromise.then(function (res) {
          let responseData = res.data;
          that.isLogin = false;
          if (Util._.isObject(responseData['status']) && responseData['status']['code'] == 0) {
            that.setMeusData(responseData);
          } else {
            that.errorMess('获取数据失败!');
          }

        }).catch(function (response) {
          if (response instanceof Error) {
            that.errorMess(response.message);
          } else {
            that.errorMess(response.status + '错误!');
          }
          that.isLogin = false;
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          let userName = Util._.trim(this.ruleForm.name);
          if (valid) {
            let options = {
              paramsData: 'listUrl',
              ajaxSuccess: 'loginSuccess',
              ajaxParams: {
                url: '/login',
                method: 'post',
                data: {
                  username: userName,
                  password: this.ruleForm.password
                }
              }
            }
            this.ajax(options)
          } else {
            return false;
          }
        });
      },

      /**
       * 获取所有后台配置的路由地址
       * @param data
       * @param first
       * @param parItem
       */
      setRouterPath(data, first, parItem) {
        for (var i = 0, item; i < data.length; i++) {
          item = data[i];
          if (first) {
            item['path'] = '/manage';
            item['level'] = 1;
          } else {
            if (parItem['path'] == -1) {
              item['path'] = parItem['modName'] + '/' + item.modName;
            } else {
              item['path'] = parItem['path'] + '/' + item.modName;
            }
            item['level'] = parItem['level'] + 1;
          }
          this.routerPath[item['path']] = item['path']
          if (typeof item.children != 'undefined' && item.children.length > 0) {
            this.setRouterPath(item.children, false, item);
          }
        }
      },
      // 动态获取结构名称
      getHospitalName() {
        let options = {
          ajaxSuccess: (res) => {
            this.hospitalName = res.data.hospitalName;
          },
          ajaxParams: {
            url: '/envs'
          }
        };
        this.ajax(options);
      }
    }
  }

</script>
