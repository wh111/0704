<!--参照：住院医师规范化培训系统http://192.168.1.100:8004/，-->
<template>
  <div class="loginMain" v-loading.fullscreen.lock="isLogin">
    <div class="loginLeft">
      <div class="login">
        <div v-if="isLogin" style="text-align: center">数据加载中!</div>
        <div v-if="!isLogin" class="loginBox">
          <h2 class="logo-text"><img class="logo-ambuf" src="/static/image/ambufLogo.png " alt="">{{ hospitalName
            }}教学管理系统</h2>
          <!--<h2>实习生管理系统-登录</h2>-->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="ruleForm.name" @keyup.enter.native="submitForm('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item label="密　码" prop="password">
              <el-input type="password" @keyup.enter.native="submitForm('ruleForm')"
                        v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center" label-width="0">
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
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
    position: absolute;
    left: 46%;
    top: 50%;
    width: 362px;
    height: 200px;
    margin: -100px 0 0 -150px;
  }

  .loginBox h2 {
    text-align: center;
  }

  .loginLeft {
    background-image: url(../assets/ambuf/images/loginBgLeft.gif);
    background-position: center center;
    background-repeat: repeat-x;
    width: 100%;
    height: 506px;
    margin: -253px 0 0 -50%;
    position: absolute;
    top: 50%;
    left: 50%;
  }

  .loginLeft .login {
    background-image: url(../assets/ambuf/images/loginEntry.gif);
    background-position: center center;
    background-repeat: no-repeat;
    width: 774px;
    height: 290px;
    margin: 0 0 0 -387px;
    position: absolute;
    top: 141px;
    left: 50%;
  }

  .loginLeft .login .logo-text {
    margin-bottom: 26px;
    height: 26px;
    line-height: 26px;
  }

  .loginLeft .logo-ambuf {
    float: left;
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
        if (index != "") {
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
          icon: "",
          id: -100,
          leaf: true,
          modName: "work",
          name: "工作台",
          url: "",
          children: [{
            expand: true,
            icon: "",
            id: -101,
            leaf: true,
            modName: "workbench",
            name: "工作台",
            url: "",
            children: [{
              expand: true,
              icon: "",
              id: -102,
              leaf: true,
              modName: "work",
              name: "工作台",
              url: ""
            }]
          }]
        })

        //将设置完成的structureIndex赋值给 navs
        let index = "/manage",
          myData = data[0].children || [];
        for (var i = 0; i < myData.length;) {
          if (typeof myData[i].children != "undefined") {
            index += "/" + myData[i]["modName"];
            myData = myData[i].children;
          } else {
            index += "/" + myData[i]["modName"];
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
        this.$store.commit("setToken", true);
        Util.setAjaxPostToken();

        setTimeout(() => {
          this.$store.commit("setUserInfo", this);
          this.$store.commit("setEnvPath", this);
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
          if (Util._.isObject(responseData["status"]) && responseData["status"]["code"] == 0) {
            that.setMeusData(responseData);
          } else {
            that.errorMess('获取数据失败!');
          }

        }).catch(function (response) {
          if (response instanceof Error) {
            that.errorMess(response.message);
          } else {
            that.errorMess(response.status + "错误!");
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
                method: "post",
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
            item["path"] = "/manage";
            item["level"] = 1;
          } else {
            if (parItem["path"] == -1) {
              item["path"] = parItem["modName"] + "/" + item.modName;
            } else {
              item["path"] = parItem["path"] + "/" + item.modName;
            }
            item["level"] = parItem["level"] + 1;
          }
          this.routerPath[item["path"]] = item["path"]
          if (typeof item.children != "undefined" && item.children.length > 0) {
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
