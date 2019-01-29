<!--
****--@file     view
****--@date     2018/2/28 15:01
****--@author   YC
****--@describe 理论考试试题预览
-->
<template>
  <div class="paperShow">
    <el-form v-if="getDta!=0" label-width="0">
      <div v-for="(item,index) in getDta" :key="index">
        <div class="eq-font">
          <el-row>
            <el-col class="eq-info">
              <span class="eq-index">{{index+1}}.</span>
              <el-button type="info" size="mini">{{item.types | typeText }}</el-button>
              <span>({{item.optionScore}}分)</span>
            </el-col>

            <el-col class="eq-questionMain">
              <div class="eq-qusetionHtmlBox" v-html="item.subject"></div>
            </el-col>
          </el-row>
          <br>
          <!--单选 或 判断-->
          <div v-if="item.types=='RADIO' || item.types=='JUDGMENT'">
            <el-form-item>
              <el-radio-group v-model="item.userSelect" @change="userSelected" :disabled="optionDisabled">
                <div v-for="(option,i) in item.optionsDtoList" class="selectItem" :key="i">
                  <el-radio :label="option.options">
                    <div class="eq-optionContent">
                      <p class="eq-optionText">{{option.options}}.</p>
                      <div class="eq-optionContentBox eq-qusetionHtmlBox" v-html="option.content"></div>
                    </div>
                  </el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
          <!--多选-->
          <div v-if="item.types=='CHECKBOX'">
            <el-form-item>
              <el-checkbox-group v-model="item.userSelect" @change="userSelected">
                <div v-for="(option,i) in item.optionsDtoList" class="selectItem" :key="i">
                  <el-checkbox :label="option.options" :disabled="optionDisabled">
                    <div class="eq-optionContent">
                      <p class="eq-optionText">{{option.options}}.</p>
                      <div class="eq-optionContentBox eq-qusetionHtmlBox" v-html="option.content"></div>
                    </div>
                  </el-checkbox>
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
          <el-col class="eq-questionMain-ighr paperAnswerInfo" style="line-height: 20px">
            <template v-if="['studentOption','answer'].includes(showType) && showRight=='Show'">
              <template v-if="item.types!='ANSWER'">
                <span>正确答案：{{ (item.options || '-').replace(/\|/g,'、') }}　</span>
                <template v-if="showType=='studentOption'">
                  <span>考生答案：{{ (item.userOptions || '-').replace(/\|/g,'、') }}</span>
                  <template v-if="item.userOptions !== null">
                    <span v-if="item.options==item.userOptions" style="color: #42d885;"> <i class="el-icon-success"></i> 正确</span>
                    <span style="color: red;" v-else> <i class="el-icon-error"></i> 错误</span>
                  </template>
                </template>
              </template>
            </template>
            <template v-if="showType=='answer'">
              <el-form>
                <el-form-item label="答案解析：">
                  <div class="eq-qusetionHtmlBox" v-html="item.answerExplain"></div>
                </el-form-item>
              </el-form>
            </template>
          </el-col>
          <div style="clear: both"></div>
          <div v-if="getDta.length != index+1" class="eq-dashed"></div>
          <br>
        </div>

        <br/>
      </div>
    </el-form>
    <div v-else style="text-align: center;line-height: 480px"><strong>暂无试题</strong></div>
  </div>
</template>

<script>
  export default {
    props: ['eqData', 'getUrl', 'showData', 'type', 'disabled', 'showType', 'showRight'],
    data () {
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
        optionDisabled: true // 选项禁选(默认)
      };
    },
    methods: {
      // 初始化
      init () {
        console.log(this.disabled);
        if (this.disabled !== undefined) {
          this.optionDisabled = this.disabled;
        }
        if (this.showData) { // 直接传输试题数据进行查看
          this.conductData(this.showData);
        } else if (this.getUrl) { // 通过接口请求数据试题数据进行查看
          this.getShowData();
        }
      },
      // 用户选择之后及时返回所有数据
      userSelected () {
        this.$emit('selected', this.$util._.defaultsDeep([], this.getDta));
      },
      // 查看试题
      getShowData () {
        this.listMessTitle = {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.getUrl,
            params: {
              courseId: this.$store.state.curriculum.look.course.id || '',
              planId: this.eqData.itemData.id || '',
              type: this.eqData.type
            }
          }
        };
        this.ajax(this.listMessTitle);
      },

      //通过get请求列表数据并渲染表格数据
      updateListData (responseData) {
        let data = responseData.data;
        console.log(data);
        if (!data) return;
        this.conductData(data.questionsDtoList);
        this.tableData = [];
        this.score = data.score;
      },

      //处理数据
      conductData (list) {
        let dataList = this.$util._.defaultsDeep([], list);
        dataList.map(item => {
          // showType 为 studentOption 时显示学生原来选择的答案
          if (item.types.toLowerCase() == 'checkbox') {
            item.userSelect = ['answer', 'studentOption'].includes(this.showType) ? (item.userOptions ? item.userOptions.split('|') : []) : [];
          } else {
            item.userSelect = ['answer', 'studentOption'].includes(this.showType) ? item.userOptions || '' : '';
          }
          item.optionsDtoList = item.optionsDtoList || item.optionsList;
        });
        this.getDta = dataList;

        if (this.showType == 'studentOption') {
          this.userSelected();
        }
//        console.log(dataList)
      }
    },
    created () {
      this.init();
    },
    watch: {
      showData (val) {
        console.log(val);
        this.init();
      },
      disabled () {
        this.optionDisabled = this.disabled;
      }
    }
  };

</script>

<style lang="scss">
  .eq-index {
    margin-left: -5px;
    font-size: 18px;
    padding: 0 12px 0 0;
  }

  .eq-font {
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    .eq-info {
      position: absolute;
      left: 0;
      top: 0;
    }
    .eq-questionMain {
      padding-left: 138px;
      position: relative;
      line-height: 24px;
    }
  }

  .eq-dashed {
    margin-top: 10px;
    border: 1px dashed #bbbbbb;
  }

  .eq-optionContent {
    position: relative;
  }

  .eq-optionText {
    position: absolute;
    top: 0px;
    left: 10px;
  }

  .eq-optionContentBox {
    padding-left: 30px;
  }

  .paperShow {
    .selectItem {
      line-height: normal;
      margin-bottom: 20px;
    }
    .el-checkbox, .el-radio, .el-radio-group {
      &, span {
        max-width: 100%;
      }
      span {
        white-space: normal;
      }
    }
    .paperAnswerInfo {
      .el-form-item__label {
        padding-top: 0;
        padding-bottom: 0;
        line-height: 18px;
      }
    }
    .el-radio__input, .el-checkbox__input {
      position: absolute;
      top: 0;
      left: 0;
    }
    .el-radio__label, .el-checkbox__label {
      padding-left: 20px;
    }
    /*.el-radio__input {*/
    /*&.is-disabled {*/
    /*&.is-checked {*/
    /*.el-radio__inner {*/
    /*background-color: #20a0ff;*/
    /*border-color: #20a0ff;*/
    /*}*/
    /*.el-checkbox__inner {*/
    /*background-color: #20a0ff;*/
    /*border-color: #20a0ff;*/
    /*}*/
    /*}*/
    /*&+.el-radio__label{*/
    /*color: initial;*/
    /*}*/
    /*.el-radio__inner {*/
    /*background-color: #fff;*/
    /*border-color: #bfcbd9;*/
    /*}*/
    /*.el-checkbox__inner {*/
    /*background-color: #fff;*/
    /*border-color: #bfcbd9;*/
    /*}*/
    /*}*/
    /*}*/
  }

</style>
