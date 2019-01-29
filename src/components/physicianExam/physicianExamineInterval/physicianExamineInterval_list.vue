<!--
****--@file     physicianExamineInterval_list
****--@date     2018/5/21 11:43
****--@author   YC
****--@describe 国家医师考核-考核管理
-->
<template>
  <el-row class="physicianExamBox">
    <el-col class="thereFloorBox">
      <div class="thereFloor">
        <h2>多媒体考试、笔试</h2>
        <br>
        <hr>
        <br>
        <el-row>
          <el-col>
            <el-form :inline="true">
              <el-form-item>
                <el-button>303</el-button>
              </el-form-item>
              <el-form-item>
                <el-button>305</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <hr>
        <br>
      </div>
    </el-col>
    <el-col :span="11" class="physicianExams left">
      <div class="fiveFloor">
        <h2>技能操作</h2>
        <br>
        <hr>
        <br>
        <div class="physicianExamContentBox">
          <el-col v-for="(item,index) in formValidate.one" :key="index">
            <el-form :rules="rules" ref="stations" :model="item">
              <el-col :span="10">
                <el-form-item label="房间号：" prop="roomNum" label-width="88px">
                  <el-input v-model="item.roomNum" :disabled="isGet"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="考站名称：" prop="name" label-width="98px">
                  <el-input v-model="item.name" :disabled="isGet"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" align="right">
                <el-button :disabled="isGet" type="success" @click="add('one')" v-if="index === formValidate.one.length - 1 || !formValidate.one.length">添加
                </el-button>
                <el-button :disabled="isGet" type="danger" @click="remove('one',index)" v-else>删除</el-button>
              </el-col>
            </el-form>
          </el-col>
        </div>
      </div>
    </el-col>
    <p class="lineBox"></p>
    <el-col :span="11" class="physicianExams right">
      <div class="fiveFloor">
        <h2>体格检查</h2>
        <br>
        <hr>
        <br>
        <div class="physicianExamContentBox">
          <el-col v-for="(item,index) in formValidate.two" :key="index">
            <el-form :rules="rules" ref="stations" :model="item">
              <el-col :span="10">
                <el-form-item label="房间号：" prop="roomNum" label-width="88px">
                  <el-input :disabled="isGet" v-model="item.roomNum"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="考站名称：" prop="name" label-width="98px">
                  <el-input :disabled="isGet" v-model="item.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" align="right">
                <el-button :disabled="isGet" type="success" @click="add('two')" v-if="index === formValidate.two.length - 1 || !formValidate.two.length">添加
                </el-button>
                <el-button :disabled="isGet" type="danger" @click="remove('two',index)" v-else>删除</el-button>
              </el-col>
            </el-form>
          </el-col>
        </div>
      </div>

      <el-col align="right" class="physicianExamBtns">
        <el-button type="danger" @click="clear">清空</el-button>
        <el-button type="info" @click="edit" v-if="isGet">编辑</el-button>
        <load-btn @listenSubEvent="listenSubEvent" type="success" v-if="!isGet" :btnData="loadBtn"></load-btn>
      </el-col>
    </el-col>

    <!--安排弹窗-->
    <Modal close-on-click-modal="false" height="200" v-model="addModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="headerContent.addId"></modal-header>
      <el-row v-if="addModal">
        <el-col>
          <p style="line-height: 30px;font-size: 16px;text-indent: 2em;margin-bottom: 20px;">该操作将会清空三楼和五楼的考试状态并恢复默认状态；确认进行清除吗？</p>
        </el-col>
        <el-col align="right">
          <el-button @click="cancel('add')">取消</el-button>
          <el-button type="success" @click="clearCall()">确认</el-button>
        </el-col>
      </el-row>
      <div slot="footer"></div>
    </Modal>
  </el-row>
</template>
<style lang="scss">
  @import "../style";
</style>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import { physicianExamineInterval as rules } from '../rules'
  import { getSaveData } from './formatData'
  //当前组件引入全局的util
  let Util = null;
  export default {
    name: 'physicianExamineIntervalList',
    data () {
      return {
        rules,
        isGet: false,
        formValidate: {
          one: [
            {roomNum: '', name: ''}
          ],
          two: [
            {roomNum: '', name: ''}
          ]
        },
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent',
          type: 'success'
        },
        headerContent: {
          addId: {
            id: 'addId',
            title: '重要操作提示'
          }
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init () {
        this.getInfo()
      },
      add (type) {
        this.formValidate[type].push({roomNum: '', name: ''})
      },
      remove (type, index) {
        this.formValidate[type].splice(index, 1)
      },
      edit () {
        this.isGet = false
      },
      clear () {
        this.openModel('add')
      },
      clearCall () {
        this.cancel('add')
        let opt = {
          ajaxSuccess: res => {
            this.successMess('清空成功！');
            this.formValidate = {
              one: [
                {roomNum: '', name: ''}
              ],
              two: [
                {roomNum: '', name: ''}
              ]
            }
            this.isGet = false
          },
          ajaxParams: {
            url: api.remove.path,
            method: api.remove.method
          }
        }
        this.ajax(opt)
      },
      getInfo () {
        let opt = {
          ajaxLoading: false,
          ajaxSuccess: res => {
            if (res.data instanceof Object && res.data.one) {
              this.formValidate = res.data;
              this.isGet = true;
            }
          },
          ajaxParams: {
            url: api.get.path,
            method: api.get.method
          }
        }
        this.ajax(opt)
      },
      /*
       * 点击提交按钮 监听是否提交数据 (评分)
       * @param isLoadingFun boolean  form表单验证是否通过
       * autoSubmitData 自动提交分数的数据
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm();
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let data = getSaveData(this.$util._.defaultsDeep({}, this.formValidate))
          let opt = {
            ajaxSuccess: res => {
              this.successMess('保存成功！')
              this.isGet = true
            },
            ajaxParams: {
              jsonString: true,
              url: api.set.path,
              method: api.set.method,
              data
            }
          }
          this.ajax(opt, isLoadingFun)
        }
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm () {
        let flag = false;
        let len = this.$refs.stations.length
        for (let i = 0; i < len; i++) {
          this.$refs.stations[i].validate((valid) => {
            if (valid) {
              flag = true;
            }
          });
        }
        return flag;
      },
      /********************************* 弹窗相关 *****************************/
      // 取消
      cancel (targer) {
        this[targer + 'Modal'] = false
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  }

</script>
<style>

</style>
