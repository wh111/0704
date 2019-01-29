<!--
****--@file     login
****--@date     2018/2/28 11:21
****--@author   YC
****--@describe 理论考核考生登录页面
-->
<template>
  <el-row class="osceTheoryExamineLogin">
    <el-col align="right" class="set">
      <router-link to="/osceTheoryExamine/set">设置</router-link>
    </el-col>
    <el-col class="loginBox">
      <!--<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">-->
      <!--<el-form-item label="用户名" prop="name">-->
      <!--<el-input v-model="ruleForm.name" @keyup.enter.native="submitForm('ruleForm')"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="密　码" prop="password">-->
      <!--<el-input type="password" @keyup.enter.native="submitForm('ruleForm')" v-model="ruleForm.password"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item>-->
      <!--<el-button type="primary" @click="submitForm('ruleForm')" :disabled="!hasConfig">登录</el-button>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <el-button type="primary" @click="start">进入考核</el-button>
    </el-col>
  </el-row>
</template>
<style lang="scss">
  .osceTheoryExamineLogin {
    width: 100%;
    height: 100%;
    position: relative;
    background: #f3f3f4;
    .loginBox {
      position: absolute;
      left: 50%;
      top: 50%;
      /*
      width: 300px;
      height: 156px;
      margin: -78px 0 0 -150px;
      */
      width: 88px;
      height: 38px;
      margin: -44px 0 0 -19px;
    }
    .set {
      padding: 10px;
    }
  }
</style>
<script>
  /*当前组件必要引入*/

  //当前组件引入全局的util
  let Util = null
  export default {
    data () {
      return {
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
        hasConfig: false
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        this.hasConfig = !!Util.getLocalStorage('osceTheoryExamineConfig');
        if (!this.hasConfig) {
          this.tipsConfig()
        }
      },
      start () {
        if (!this.hasConfig) {
          this.tipsConfig()
          return
        }
        this.$router.push('/osceTheoryExamine/examine')
      },
      tipsConfig () {
        this.$notify.error({
          title: '提示',
          message: '当前未检测到考场配置数据，请点击“设置”进行考场配置！',
          offset: 40
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          let userName = Util._.trim(this.ruleForm.name)
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
            return false
          }
        })
      },
      loginSuccess (res) {
        let token = res.data
        this.$cookie.set('Token', token, 1)
        this.$store.commit('setToken', true)
        Util.setAjaxPostToken()
        setTimeout(() => {
          this.$store.commit('setUserInfo', this)
        }, 100)
        this.$router.push('/osceTheoryExamine/examine')
      }
    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {}
  }

</script>
