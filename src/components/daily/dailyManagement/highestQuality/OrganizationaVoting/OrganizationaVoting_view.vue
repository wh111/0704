<template>

  <div class="showWrapper leaveManagement-show">
    <el-form ref="formValidate" class="demo-form-inline" label-width="100px">
      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item label="标题：" prop="name" class="feildFontweight">
            {{data.title}}
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="2">
          <el-form-item label="开始时间：" class="feildFontweight">
            {{data.startDate}}
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="结束时间：" class="feildFontweight">
            {{data.endDate}}
          </el-form-item>
        </el-col>

        <el-col :span="7" :offset="2">
          <el-form-item label="年级：" class="feildFontweight">
            {{data.grade}}
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="班级：" class="feildFontweight">
            {{data.voteGroup}}
          </el-form-item>
        </el-col>

        <el-col :span="17" :offset="2">
          <el-form-item label="投票人：" class="feildFontweight">
            {{voterScope[data.voterScope]}}{{data.voterScope!=='GROUP'?'(':''}}
            <el-tag
              v-for="(tag,index) in data.appraisingVoteScopeDtoList"
              :key="index"
              style="margin: 5px"
              type="primary">
              {{tag.scopeName}}
            </el-tag>
            {{data.voterScope!=='GROUP'?')':''}}
          </el-form-item>
        </el-col>
        <el-col :span="17" :offset="2" >
          <el-form-item label="票权：" prop="votePower">
            {{data.votePower}}
          </el-form-item>
        </el-col>

        <el-col :span="17" :offset="2">
          <el-form-item type="" label="投票规则：" class="feildFontweight">
            <el-input v-model="data.voteRule" type="textarea" readonly resize="none" :rows="8"></el-input>

          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="17" :offset="2">
          <el-form-item type="" label="被投对象：" class="feildFontweight">
            <span v-for="(item,index) in data.userList" :key="index"> {{item.userName}} </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util = null;
  import {voterScope} from './voterScope';
  console.log(voterScope);
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        voterScope,
        "data": {
          "id": "",
          "title": "",
          "startDate": "",
          "endDate": "",
          "voterScope": "",
          "grade": "",
          "voteGroup": "",
          "depId": "",
          "depName": "",
          "voteRule": "",
          votePower:'',
          "userList": [
            {
              "userName": ""
            }
          ]
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        showData: {},
        listMessTitle: {
          paramsData: 'listUrl',
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: 'appraising/vote/project/get/' + this.operailityData.id,
          }
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData) {
        let data = responseData.data;
        this.data = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'show');
      },
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
<style>
  .showWrapper {
    height: 100%;
    padding: 20px;
    border: 1px solid #eee;
  }

  .feildFontweight {
    font-weight: bold;
  }
</style>
