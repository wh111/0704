<template>
  <!-- 评测与作业 - 试题查看 -->
  <div>
    <el-form v-if="getDta!=0" label-width="0">
      <div v-for="(item,index) in getDta" :key="index">
        <div class="eq-font">
          <el-row>
            <el-col :span="4">
              <span class="eq-index">{{index+1}}.</span>
              <el-button type="info" size="mini">{{item.types | typeText }}</el-button>
              <span>({{item.optionScore}}分)</span>
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
    </el-form>
    <div v-else style="text-align: center;line-height: 480px"> <strong>暂无试题</strong></div>
  </div>
</template>

<script>
  import api from './api'
  export default {
    props: ['eqData', 'getUrl', 'showData'],
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
      }
    },
    methods: {
      // 初始化
      init() {
        if (this.showData) { // 直接传输试题数据进行查看
          this.getDta = this.conductData(this.showData)
        } else if (this.getUrl) { // 通过接口请求数据试题数据进行查看
          this.getShowData()
        }
      },
      // 查看试题
      getShowData() {
        this.listMessTitle = {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.getUrl,
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
