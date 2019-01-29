<!--
****--@file     set
****--@date     2018/2/28 11:22
****--@author   YC
****--@describe 理论考核设置
-->
<template>
  <el-row class="osceTheoryExamineSet">
    <div class="setBox">
      <h2>设置</h2>
      <el-form :model="setData" label-width="80px" class="setForm" :rules="rules" ref="setData">
        <el-form-item label="场　次：" prop="sceneId">
          <el-select v-model="setData.sceneId" placeholder="请选择场次" style="width: 100%">
            <el-option v-for="item in sceneArr" :key="item.id" :label="item.sceneName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间号：" prop="roomNum">
          <el-input v-model="setData.roomNum" placeholder="请输入房间号"></el-input>
        </el-form-item>
        <el-col align="right">
          <el-button type="info" @click="saveSet">保存并返回</el-button>
          <el-button @click="goToLogin">返回</el-button>
        </el-col>
      </el-form>
    </div>
  </el-row>
</template>
<style lang="scss">
  .osceTheoryExamineSet {
    height: 100%;
    position: relative;
    .setBox {
      width: 500px;
      height: 300px;
      padding: 30px;
      border: 1px solid #ccc;
      border-radius: 6px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -150px;
      margin-left: -250px;
    }
    .setForm {
      margin-top: 20px;
    }
  }
</style>
<script>
  /*当前组件必要引入*/
  import { set as rules } from './rules'
  //当前组件引入全局的util
  let Util = null
  export default {
    data () {
      return {
        rules,
        sceneArr: [],
        setData: {
          sceneId: '',
          roomNum: ''
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util
        let config = Util.getLocalStorage('osceTheoryExamineConfig')
        if (config) {
          this.setData = config
        }
        this.getScen()
      },
      // 获取场次
      getScen () {
        let opt = {
          ajaxSuccess: res => {
            this.sceneArr = res.data
          },
          ajaxParams: {
            url: 'scene/monitor/list'
          }
        }
        this.ajax(opt)
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm (formName) {
        let flag = false
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true
          }
        })
        return flag
      },
      saveSet () {
        if (!this.submitForm('setData')) {
          return false
        }
        Util.setLocalStorage('osceTheoryExamineConfig', this.setData)
        this.goToLogin()
      },
      goToLogin () {
        this.$router.push({name: 'osceTheoryExamine'})
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
