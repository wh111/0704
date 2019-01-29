<template>
  <!-- 评测与作业 - 查看试题 -->
  <div>
    <el-form v-if="getDta!=0" label-width="0">
      <div v-for="(item,index) in getDta" :key="index">
        <div class="eq-font">
          <el-row>
            <el-col :span="5">
              <span class="eq-index">{{index+1}}.</span>
              <el-button type="info" size="mini">{{item.types | typeText }}</el-button>
              <span>（{{item.optionScore}}分）</span>
            </el-col>

            <el-col :span="18" style="line-height: 40px">
              {{item.subject}}
            </el-col>
          </el-row>
          </br>

          <!--单选 或 判断-->
          <div v-if="item.types=='RADIO' || item.types=='JUDGMENT'">
            <el-form-item>
              <el-radio-group v-model="item.select">
                <div v-for="(option,i) in item.optionsDtoList" style="height: 40px;line-height: 40px;" :key="i">
                  <el-radio :label="option.options"> &nbsp;&nbsp;&nbsp;{{option.options}}. {{option.content}}</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <!--多选-->
          <div v-if="item.types=='CHECKBOX'">
            <el-form-item>
              <el-checkbox-group v-model="item.select">
                <div v-for="(option,i) in item.optionsDtoList" style="height: 40px;line-height: 40px;" :key="i">
                  <el-checkbox :label="option.options"> &nbsp;&nbsp;&nbsp;{{option.options}}. {{option.content}}</el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <!--问答-->
          <div v-if="item.types=='ANSWER'">
            <el-input type="textarea" v-model="item.select"></el-input>
          </div>

          <!--答案-->
          <div v-if="isNeedResult" style="margin: 20px 0; ">
            <el-row>
              <el-col :span="1">
                {{item.options}}
              </el-col>
              <el-col :span="16">
                答案解析: {{item.answerExplain}}
              </el-col>
            </el-row>
          </div>
          <div v-if="getDta.length != index+1" class="eq-dashed"></div>
          </br>
        </div>
      </div>
      <el-row>
        <el-col :span="10" :offset="10">
          <load-btn :disabled="isShowBut" @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-row>
    </el-form>
    <div v-else style="text-align: center;line-height: 480px"> <strong>暂无试题</strong></div>
  </div>
</template>

<script>
  import api from './api'
  export default {
    props: ['eqData', 'isShow', 'noResidue'],
    data() {
      return {
        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //初始化加载页面信息
        listMessTitle: '',
        isNeedResult: false,
        data: {},
        getDta: [],
        score: '',
        //todo 提交分数（还未有接口）
        addMessTitle: {},
      }
    },
    methods: {
      // 初始化
      init() {

        let courseId = this.$store.state.curriculum.look.course.id;
        let planId = this.eqData.itemData.id || '';
        let type = this.eqData.type;
        this.addMessTitle = {
            ajaxSuccess: 'svaeScore',
            ajaxParams: {
              url: api.submit.path,
              method: 'post',
              data: {
                courseId: courseId, //授课课程ID
                planId: planId, //教学计划ID（每节课对应的ID）
                testingId: '', //测评ID
                type: type, //上课类型
                score: '', //总得分
              }
            }
          },

          this.listMessTitle = {
            ajaxSuccess: 'updateListData',
            ajaxParams: {
              url: api.get.path,
              params: {
                courseId: this.$store.state.curriculum.look.course.id || '',
                planId: this.eqData.itemData.id || '',
                type: this.eqData.type,
              }
            }
          };
        this.ajax(this.listMessTitle);
      },

      //通过get请求列表数据并渲染表格数据
      updateListData(responseData) {
        let data = responseData.data;
        if (!data) return;
        this.addMessTitle.ajaxParams.data.testingId = data.testingId;
        this.getDta = this.conductData(data.questionsDtoList);
        this.tableData = [];
        this.score = data.score;
      },

      //处理数据
      conductData(dataList) {
        let tempArr = []; //处理数据集合
        let tempObj = {
          radio: [], //单选题数组
          checkbox: [], //多选题数组
          judgment: [], //判断题数组
          answer: [], //问答题数组
        };
        dataList.forEach(function (item, index) {
          let types = item.types.toLowerCase();
          item.select = '';
          if (types == 'checkbox') {
            item.select = [];
          }
          tempObj[types].push(item);
        });
        tempArr = tempArr.concat(tempObj.radio, tempObj.checkbox, tempObj.judgment, tempObj.answer);
        return tempArr;
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        // this.$emit('updateView')
        if (!isLoadingFun) isLoadingFun = function () {};
        let score = this.disposeData(this.getFormData(this.getDta)); //返回的只是分数或者'error'
        if (score == 'error') {
          return;
        }
        isLoadingFun(true);
        this.addMessTitle.ajaxParams.data.score = score;
        this.ajax(this.addMessTitle, isLoadingFun);
      },

      //保存分数成功
      svaeScore(res) {
        this.successMess('提交成功');
        this.$emit('updateView');
        this.$emit('callBack');
      },

      //处理要提交的数据
      disposeData(data) {
        let temArr = [];
        let score = 0;
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (!item.optionScore) item.optionScore = 0;
          let type = item.types;
          if (type == 'RADIO' || type == 'JUDGMENT') { //如果是判断题或者单选题
            if (!(item.select.trim())) {
              this.errorMess(`第${i+1}道题不能为空`);
              return 'error';
            }
            if (item.select == item.options) { //答题正确
              score += item.optionScore;
            }

          } else if (type == 'CHECKBOX') { //多选题
            if (item.select == 0) {
              this.errorMess(`第${i+1}道题不能为空`);
              return 'error'
            }
            let error = false;
            let selects = item.select; //用户选择的
            let len = selects.length
            let options = item.options.split('|'); //答案
            if (options.length != len) {
              continue;
            }
            for (let h = 0; h < len; h++) {
              let select = selects[h];
              if (!item.options.includes(select)) { //其中一项答案错误
                error = true;
              }
            }
            if (!error) {
              score += item.optionScore;
            }

          } else { //问答题
            if (!(item.select.trim())) {
              this.errorMess(`第${i+1}道题不能为空`)
              return 'error'
            }
            let countWeight = 0;
            let weight = 0;
            for (let l = 0; l < item.keyWords.length; l++) {
              let keyWord = item.keyWords[l];
              if (!keyWord.weight) keyWord.weight = 1;
              countWeight += keyWord.weight;
              if (item.select.includes(keyWord.tag)) { //如果里面有其中的一项，则本次正确
                weight += keyWord.weight;
              }
            }
            score += weight / countWeight * (item.optionScore).toFixed(2);
          }
        }
        if (!score) score = '0';
        return score;
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },

      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = this.$util._.defaultsDeep([], data);
        return myData;
      },

    },



    computed: {
      isShowBut() {
        if (this.isShow) {
          return true;
        } else {

          return this.noResidue;
        }
      }



    },




    created() {
      this.init();
    }
  }

</script>

<style>
  .eq-index {
    margin-left: -5px;
    font-size: 24px;
    padding: 0 20px 0 0;
  }

  .eq-font {
    font-size: 14px;
    padding: 0 20px;
  }

  .eq-dashed {
    margin-top: 10px;
    border: 1px dashed #bbbbbb;
  }

</style>
