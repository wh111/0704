<template>

  <div>
    <el-form ref="formValidate" class="demo-form-inline" :model="formValidate" :rules="rules" label-width="100px">

      <fieldset class="layui-elem-field">
        <legend>基本情况</legend>
        <div class="layui-field-box">
          <el-row class="table-back-one">
            <el-col :span="7" :offset="1">
              <el-form-item label="姓名:" prop="name" class="feildFontweight">
                {{basicBySelf.name}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="性别:" prop="name" class="feildFontweight">
                {{basicBySelf.sex|typeText}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="出生年月:" prop="name">
                {{basicBySelf.birth}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-two">
            <el-col :span="7" :offset="1">
              <el-form-item label="政治面貌:" prop="name" class="feildFontweight">
                {{basicBySelf.political}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="民族:" prop="name" class="feildFontweight">
                {{basicBySelf.nation}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="年级:" prop="name" class="feildFontweight">
                {{basicBySelf.grade}}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-one">
            <el-col :span="7" :offset="1">
              <el-form-item label="专业:" prop="name" class="feildFontweight">
                {{basicBySelf.specialty}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="学制:" prop="name" class="feildFontweight">
                {{basicBySelf.length}}
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系电话:" prop="name" class="feildFontweight">
                {{basicBySelf.mobile }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-two-d">
            <el-col :span="21" :offset="1">
              <el-form-item label="身份证号:" prop="name" class="feildFontweight">
                {{basicBySelf.idNumber }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </fieldset>

      <fieldset class="layui-elem-field">
        <legend>家庭经济情况</legend>
        <div class="layui-field-box">
          <el-row class="table-back-one">
            <el-col :span="7" :offset="1">
              <el-form-item label="家庭月总收入:" prop="grossIncome">
                <el-input v-model.number="formValidate.grossIncome" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="人均月收入:" prop="averageIncome" class="feildFontweight">
                <el-input v-model.number="formValidate.averageIncome" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="收入来源:" prop="sourceIncome" class="feildFontweight">
                <el-input v-model="formValidate.sourceIncome" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-two">
            <el-col :span="11" :offset="1">
              <el-form-item label="家庭户口:" prop="registerType" class="feildFontweight">
                <el-radio-group v-model="formValidate.registerType">
                  <el-radio label="VILLAGES">农村</el-radio>
                  <el-radio label="CITYS">城镇</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="家庭总人数:" prop="peopleNum" class="feildFontweight">
                <el-input v-model.number="formValidate.peopleNum" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-one-d">
            <el-col :span="11" :offset="1">
              <el-form-item label="家庭住址:" prop="address" class="feildFontweight">
                <el-input v-model="formValidate.address" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>


            <el-col :span="10">
              <el-form-item label="邮政编码:" prop="postCode" class="feildFontweight">
                <el-input v-model.number="formValidate.postCode" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </fieldset>

      <fieldset class="layui-elem-field">
        <legend>学习等情况</legend>
        <div class="layui-field-box">
          <el-row class="table-back-one">
            <el-col :span="11" :offset="1">
              <el-form-item label="成绩排名:" prop="name" class="feildFontweight">
                <el-input v-model.number="score.gradeRanking" type="number" style="width: 50px;"></el-input>
                /
                <el-input v-model.number="score.gradeCount" type="number" style="width: 50px;"></el-input>
                <div style="display:inline-block;width:150px;" name="footer">（名次/总人数）</div>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="实行综合考评排名:" prop="isComprehensive" class="feildFontweight">
                <el-radio-group v-model="formValidate.isComprehensive">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="table-back-two-d" style="line-height: 36px">
            <el-col :span="11" :offset="1">
              必修课
              <el-input v-model.number="formValidate.courseNum" type="number" style="width: 50px;"></el-input>
              门， 其中及格以上
              <el-input v-model.number="formValidate.passNum" type="number" style="width: 50px;"></el-input>
              门
            </el-col>
            <el-col :span="10">
              如是，排名
              <p v-show="formValidate.isComprehensive" style="display: inline-block;">
                <el-input type="number" v-model.number="score.compositeRanking" style="width: 50px;"></el-input>
                /
                <el-input v-model.number="score.compositeCount" type="number" style="width: 50px;"></el-input>
              </p>
              （名次/总人数）
            </el-col>
          </el-row>

        </div>
      </fieldset>

      <fieldset class="layui-elem-field  archivesEdit">
        <legend>获奖情况</legend>
        <el-row>
          <el-col :span="21" :offset="1">
            <div class="layui-field-box">
              <div id="nosocomialTable" ref="nosocomialTable">
                <el-table align="center" :height="200" :data="formValidate.awardList" tooltip-effect="dark"
                          style="width: 100%">
                  <el-table-column prop="winTime" label="日期" align="center" :editable="false" show-overflow-tooltip>
                    <template scope="scope">
                      <el-form-item prop="awardSituation" class="feildFontweight">
                        <el-date-picker v-model="scope.row.winTime" type="date" :editable="false" placeholder="选择日期"
                                        :picker-options="pickerOptions0">
                        </el-date-picker>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="awardSituation" label="奖项名称  " show-overflow-tooltip>
                    <template scope="scope">
                      <el-form-item prop="awardSituation" class="feildFontweight">
                        <el-input v-model="scope.row.awardSituation" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="awardUnit" label="颁奖单位" show-overflow-tooltip>
                    <template scope="scope">
                      <el-form-item prop="awardUnit" class="feildFontweight">
                        <el-input v-model="scope.row.awardUnit" placeholder="请输入内容"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="awardUnit" label="操作" width="120" show-overflow-tooltip>
                    <template scope="scope">
                      <el-button size="small" type="info" @click="removeAward(scope.$index,scope.row)">删除
                      </el-button>
                      <el-button size="small" type="info" v-if="scope.$index+1==formValidate.awardList.length"
                                 @click="addAward(scope.$index,scope.row)">添加
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-col>
        </el-row>
      </fieldset>

      <fieldset class="layui-elem-field">
        <legend>申请理由</legend>
        <div class="layui-field-box">
          <el-row>
            <el-col :span="21" :offset="1">
              <el-form-item prop="name" class="feildFontweight">
                <el-input type="textarea" v-model="formValidate.reason" :rows="8" resize="none"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </fieldset>
    </el-form>
    <el-row>
      <el-col :span="10" :offset="10  ">
        <div style="margin-top: 20px">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="saveBtn"></load-btn>
          <load-btn @listenSubEvent="reportedEvent" :btnData="reportedBtn"></load-btn>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { projectParticipate as rules } from '../../rules';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        countDate: 0,
        score: { //保存的是成绩排名和综合成绩排名
          gradeRanking: '', //成绩排名的名次
          gradeCount: '', //成绩排名的总人数
          compositeRanking: '', //综合排名的名次
          compositeCount: '', //综合排名的名次
        },
        basicBySelf: {

          "name": "", //申请人姓名
          "sex": "", //性别
          "nation": "", //民族
          "birth": "", //出生年月日
          "political": "", //政治面貌
          "specialty": "", //专业
          "length": "", //学制
          "mobile": "", //联系电话
          "idNumber": "", //身份证号
          "grade": "", //年级
        },
        //form表单bind数据
        formValidate: {
          id: '',
          "userId": "", //申请人id
          sellOneselfId: this.operailityData.id,
          registerType: 'CITYS', //家庭户口类型
          peopleNum: '', //家庭人口
          grossIncome: '', //家庭月总收入
          averageIncome: '', //人均月收入
          sourceIncome: '', //收入来源
          address: '', //家庭住址
          postCode: '', //邮政编码
          scoreRank: '', //成绩排名
          'isComprehensive': 1, //是否有综合排名
          comprehensiveRank: '', //综合排名
          courseNum: '', //必修课数量
          passNum: '', //是否实行综合排名
          reason: '', //申请理由
          "bonusAmount": "",
          "status": "",
          "opinion": "",
          "awardList": [
//            {
//              "id": "",
//              "bursaryId": "",
//              "winTime": "", //获奖时间
//              "awardSituation": "", //获奖情况
//              "awardUnit": "" //颁奖单位
//            }
          ]
        },
        tableData: [{
          '4': 4
        }],
        //保存按钮基本信息
        saveBtn: {
          title: '保存',
          callParEvent: 'listenSubEvent'
        },
        reportedBtn: {
          title: '上报',
          callParEvent: 'listenSubEvent'
        },

        isAdd: true, //判定是否为新建
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'write',
          successTitle: '保存成功',
          errorTitle: '保存失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: 'bursary/add',
            method: 'post',
          }
        },
        //当前组件提交(edit)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'write',
          successTitle: '保存成功',
          errorTitle: '保存失败',
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: 'bursary/modify/' + this.operailityData.bursaryId,
            method: 'put',
          }
        },
        listMessTitle: {
          ajaxSuccess: 'listDataSuccess',
          ajaxParams: {
            url: 'bursary/get/' + this.operailityData.bursaryId,
            params: {}
          }
        },
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //获取用户的基本信息，添加到basicBySelf
      let userInfo = this.$store.getters.getUserInfo;
      this.basicBySelf = this.getFormValidate(this.basicBySelf, userInfo);
      this.formValidate.userId = userInfo.id;
      //通过自荐人id来判断是否新建
      if (!this.operailityData.bursaryId) return;
      this.isAdd = false;
      this.init();
    },
    methods: {
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        console.log(isSubmit);
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true)
          let messTitle;
          let formValidate;
          messTitle = this.isAdd ? this.addMessTitle : this.editMessTitle;

          formValidate = this.getFormData(this.formValidate);
          formValidate.awardList = this.awardListConverter(this.formDate(formValidate.awardList, ['winTime'], this.yearMonthData)); //转换时间格式并转换成数组
          formValidate.winTimes = formValidate.awardList.winTimes.join(','); //拼接字符串；
          formValidate.awardNames = formValidate.awardList.awardNames.join(',');
          formValidate.awardUnits = formValidate.awardList.awardUnits.join(',');
          this.scoreConverter(formValidate); //合并成绩和综合排名
          messTitle.ajaxParams.data = formValidate //
          messTitle.ajaxParams.data.status = 'WSB';
          this.ajax(messTitle, isLoadingFun)
        }
      },

      reportedEvent(isLoadingFun) {

        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          isLoadingFun(true);
          let messTitle;
          let formValidate;
          messTitle = this.isAdd ? this.addMessTitle : this.editMessTitle;

          formValidate = this.getFormData(this.formValidate);
          formValidate.awardLists = this.awardListConverter(this.formDate(formValidate.awardList, ['winTime'], this.yearMonthData)); //转换时间格式并转换成数组
          formValidate.winTimes = formValidate.awardLists.winTimes.join(','); //拼接字符串；
          formValidate.awardNames = formValidate.awardLists.awardNames.join(',');
          formValidate.awardUnits = formValidate.awardLists.awardUnits.join(',');
          messTitle.ajaxParams.data = formValidate //
          this.scoreConverter(messTitle); //合并成绩和综合排名

          messTitle.successTitle = '上报成功';
          messTitle.errorTitle = '上报失败';
          messTitle.ajaxParams.data.status = 'DSH';
          this.ajax(messTitle, isLoadingFun)
        }
      },
      //转换获奖列表
      awardListConverter(data) {
        let obj = {
          winTimes: [], //获奖日期数组
          awardNames: [], //奖项名称数组
          awardUnits: [], //颁奖单位数组
        };
        for (let i = 0; i < data.length; i++) {
          obj.winTimes.push(data[i].winTime || '');
          obj.awardNames.push(data[i].awardSituation || '');
          obj.awardUnits.push(data[i].awardUnit || '');

        }
        return obj

      },
      //合并成绩
      scoreConverter(data) {
        data.scoreRank = this.score.gradeRanking + "/" + this.score.gradeCount;

        if (!data.isComprehensive) {
          data.comprehensiveRank = '';
          data.isComprehensive = data.isComprehensive + '';
          return;
        }
        ;
        data.comprehensiveRank = this.score.compositeRanking + "/" + this.score.compositeCount;

      },

      //通过get请求列表数据
      listDataSuccess(res) {
        let data = res.data;
        let comprehensiveRank;
        let scoreRank
        if (data.scoreRank) { //是否有成绩排名
          scoreRank = data.scoreRank.split('/');
          this.score.gradeRanking = scoreRank[0];
          this.score.gradeCount = scoreRank[1];
        }
        if (data.isComprehensive && data.comprehensiveRank) { //是否有综合排名，并综合排名不为空
          comprehensiveRank = data.comprehensiveRank.split('/');
          this.score.compositeRanking = comprehensiveRank[0];
          this.score.compositeCount = comprehensiveRank[1];
        }
        this.formValidate = this.getFormValidate(this.formValidate, data);
        this.basicBySelf = this.getFormValidate(this.basicBySelf, data);

      },
      setTableData(isLoading) {
        this.ajax(this.listMessTitle, isLoading)
      },
      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        console.log(formName);
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', this.addMessTitle.type);
      },
      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        return myData;
      },
      /*
       * 组件初始化入口
       * */
      init() {
        this.ajax(this.listMessTitle)
      },


      //添加
      addAward(index, data) {
        this.formValidate.awardList.push({
          "id": "",
          "bursaryId": "",
          "winTime": "", //获奖时间
          "awardSituation": "", //获奖情况
          "awardUnit": "" //颁奖单位
        });
      },


      //移除
      removeAward(index, data) {
        if (this.formValidate.awardList.length == 1) return;
        this.formValidate.awardList.splice(index, 1);
      },


      //从获取的Res中挑选出需要的名值对
      getFormValidate(data, res) {
        let length = arguments.length;
        var arr = Array.prototype.slice.call(arguments, 2);

        if (length < 2) return data
        var obj = {}
        this.$util._.forEach(data, function (val, key) {
          obj[key] = res[key];
        })

        if (length >= 3) obj = this.getFormValidate.apply(this, [].concat(obj, arr));
        return obj

      }


    }
  }

</script>

