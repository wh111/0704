<template>
  <!-- 考生考核信息 -->
  <div class="exmUserContent">

    <div class="add-score-head"><span class="add-score-l">{{examUserData.sceneName}}</span> <span class="add-score-r">满分({{ totalScore }})</span>
    </div>
    <hr>
    <!-- 老师信息 -->
    <div class="teacherInfo " style="top: 31px;padding-top: 0">
      <!-- 教师头像 -->
      <p class="teacher-header">考官</p>
      <div class="phontoContent" style="border:none;">
        <img :src="getPhotoPath(examUserData.teacher.teacherUserPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
      </div>
      <!-- 其他内容 -->
      <p class="otherInfo ">姓名： {{examUserData.teacher.teacherUserName}}</p>
      <p class="otherInfo ">房间号： {{examUserData.roomNum}}</p>
    </div>
    <!-- 考核信息 -->
    <div class="exmContentMain " style="top: 31px;">
      <el-form :model="contentDataList" label-width="80px">
        <el-form-item label="选择试题 : " prop="contentList">
          <el-select v-model="selectContentId" @change="contentChange">
            <el-option v-for="(item,index) in examUserData.contentList" :key="index" :label="item.contentName" :value="item.contentId">
            </el-option>

          </el-select>
        </el-form-item>

        <hr>
        <!--列表数据-->
        <!--评分项-->
        <el-table align="center" max-height="300" show-summary :data="contentDataList.detailsList" tooltip-effect="dark" highlight-current-row
                  :summary-method="getSummaries" style="width: 100%;height: 100%" class="add-scope">
          <el-table-column prop="classify" label="项目" width="150">
          </el-table-column>
          <el-table-column prop="content" label="评分标准及要求">
          </el-table-column>
          <el-table-column prop="score" label="标准分" align="right" width="80">
          </el-table-column>
          <el-table-column prop="mark" label="得分" align="right" width="100">
            <template scope="scope">
              <el-form :model="scope.row" :rules="rules" :ref="'formValidate'+scope.row.id">
                <el-form-item prop="mark" error="cuo" label-width="0px">
                  <el-input @blur="markChange(scope.row)" type="number" min="0" :max="scope.row.score" v-model.number="scope.row.mark"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
        <!--扣分项-->
        <el-table v-if="contentDataList.deductList" align="center" max-height="200"
                  :data="contentDataList.deductList" tooltip-effect="dark" highlight-current-row
                  style="width: 100%;height: 100%" class="add-scope">
          <el-table-column prop="classify" label="项目" width="150">
          </el-table-column>
          <el-table-column prop="content" label="扣分标准及要求">
          </el-table-column>
          <el-table-column prop="score" label="标准分" align="right" width="80">
          </el-table-column>
          <el-table-column prop="mark" label="扣分" align="center" width="100">
            <template scope="scope">
              <el-form :model="scope.row">
                <el-form-item prop="mark" label-width="0px">
                  <el-checkbox v-model="scope.row.mark" :true-label="1" :false-label="0" @change="changeDeduct(scope.row)"></el-checkbox>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <el-form-item label="点评" prop="s">
          <el-row>
            <el-col :span="20">
              <el-input type="textarea" resize="none" v-model="contentDataList.evaluate" :rows="3"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="10" :offset="10">
          <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        </el-col>
      </el-row>
    </div>
    <!-- 考生信息 -->
    <div class="studentInfo" style="top: 31px;">
      <p class="studentInfoNum">考生</p>
      <div class="studentPhoto">
        <img :src="getPhotoPath(examUserData.examUser.userPhotoPath)" onerror="javascript:this.src='/static/image/defAvatar.png';">
      </div>
      <p class="otherInfo">姓名：{{examUserData.examUser.userName}}</p>
      <p class="otherInfo">性别：{{examUserData.examUser.userSex | typeText}}</p>
    </div>

  </div>
</template>

<script>
  import rules from '../rules';

  let Util;
  export default {
    props: ['url', 'operailityData'],
    data () {
      return {
        rules,
        //保存按钮基本信息

        loadBtn: {
          title: '提交',
          callParEvent: 'listenSubEvent'
        },
        //选择内容id
        selectContentId: '',
        //获取考生详情Form
        examUserForm: {
          scheduleId: this.operailityData.scheduleId, //教师评分id
          teacherId: this.operailityData.teacherId, //教师id
          arrangementId: this.operailityData.arrangementId //考核安排id
        },
        //获取的考生详情数据
        examUserData: {
          'teacher': {},
          'examUser': {},
          'contentList': []
        },
        // 总分
        totalScore: 0,
        //当前组件默认请求 学生数据,ajax处理的 基础信息设置
        examUserMessTitle: {
          ajaxSuccess: 'updateListData',
          ajaxParams: {
            url: this.url.addExamUserGet.path,
            params: {}
          }
        },
        //获取的内容列表数据 （会合并成）
        contentDataList: {
          detatilsList: []
        },
        //当前组件默认请求 学生数据,ajax处理的 基础信息设置
        contentMessTitle: {
          ajaxSuccess: 'contentData',
          ajaxParams: {
            url: this.url.contentGet.path,
            params: {}
          }
        },

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '评分成功!',
          errorTitle: '评分失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: this.url.teacherSubmit.path,
            jsonString: true, //  //使用Content-Type: application/json
            method: 'post',
            data: {}
          }
        },
        contentIds: [], // 当前选择试题的所有评分项id

        deductSumScore: 0 // 总扣分
      };

    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        //ajax请求参数设置
        this.setTableData();
      },

      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent (isLoadingFun) {
        let isSubmit = this.submitForm();
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {};
          isLoadingFun(true);
          this.addMessTitle.ajaxParams.data = this.getSaveData();
          this.addMessTitle.ajaxParams.data.scoreType = 'manage'; // 作为标识使用
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },

      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm () {
        let flag = false;
        let isBlack = false;
        let refArr = this.contentIds;
        for (let i = 0; i < refArr.length; i++) { // 只检测当前选择试题的评分项
          this.$refs['formValidate' + refArr[i]].validate((valid) => {
            if (valid) {
              flag = true;
            } else {
              isBlack = true;
            }
          });
          if (isBlack) {
            flag = false;
          }
        }
        return flag;
      },

      //通过get请求列表数据
      updateListData (responseData) {
        let data = responseData.data;
        if (!data) return;
        this.examUserData = data;
        if (!data.contentList[0]) {
          this.showMess('获取内容失败');
          return;
        }
        this.selectContentId = data.contentList[0].contentId;
      },
      setTableData () {
        this.examUserMessTitle.ajaxParams.params = Object.assign(this.examUserMessTitle.ajaxParams.params, this.examUserForm);
        this.ajax(this.examUserMessTitle);
      },

      //获取内容列表数据
      contentData (responseData) {
        let data = responseData.data;
        if (!data) return;
        this.totalScore = data.totalScore;
        this.contentDataList = this.conductListData(data);
      },

      getSaveData () {
        let res = Util._.defaultsDeep({}, this.contentDataList);
        res.detailsList = res.detailsList.concat(res.deductList);
        delete res.deductList;
        return res;
      },

      //处理获取到列表数据，为添加评分服务
      conductListData (data) {
        let contentIds = [];
        let operailityData = this.operailityData;
        let teacherId = operailityData.teacherId;
        let scheduleId = operailityData.scheduleId;
        let userId = operailityData.userId;
        let arrangementId = operailityData.arrangementId;
        let scoreTableId = data.detatilsList[0].scoreTableId;
        let sceneId = this.examUserData.sceneId;
        let listData = {
          'teacherId': teacherId,
          'scheduleId': scheduleId,
          'markId': '',
          'sceneId': sceneId,
          'arrangementId': arrangementId,
          'scoreTableId': scoreTableId,
          'userId': userId,
          'mark': '',
          'evaluate': '',
          'detailsList': []
        };
        //处理列表外层数据
        let deductListArr = []; // 扣分项
        let detailsListArr = []; // 评分项
        let detailsList = data.detatilsList;
        let length = detailsList.length;
        for (let i = 0; i < length; i++) {
          let temp = detailsList[i];
          temp.sceneId = sceneId;
          temp.scoreTableId = scoreTableId;
          temp.detailsId = detailsList[i].id; // 评分表id
          temp.mark = '';
          temp.teacherId = teacherId;
          temp.userId = userId;
          Array.push.call(null, temp.isPoints ? deductListArr : detailsListArr, temp);
        }
        contentIds = (detailsListArr || []).map(item => item.id);
        this.contentIds = contentIds;
        listData.detailsList = detailsListArr;
        listData.deductList = deductListArr;
        return listData;
      },
      //获取内容请求
      setContentList () {
        this.contentMessTitle.ajaxParams.url = this.url.contentGet.path + this.selectContentId;
        this.contentMessTitle.ajaxParams.params.teacherId = this.operailityData.teacherId;
        this.ajax(this.contentMessTitle);
      },

      //改变内容则改变列表数据
      contentChange (val) {
        this.selectContentId = val;
        this.setContentList();
      },

      // 切换扣分项
      changeDeduct (obj) {
        if (obj.mark) {
          this.deductSumScore += obj.score;
        } else {
          this.deductSumScore -= obj.score;
        }
        console.log(this.deductSumScore);
      },

      //最后一行总计
      getSummaries (param) {
        const {
          columns,
          data
        } = param;
        const sums = [];
        let poor = 0;
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总分';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += '';
          } else {
            sums[index] = ' ';
          }
        });
        poor = sums[sums.length - 1] - this.deductSumScore; // 总得分减去扣分项的分
        sums[sums.length - 1] = poor > 0 ? poor : 0; // 小于0就等于0
        this.contentDataList.mark = sums[sums.length - 1];
        return sums;
      },

      //mark 得分验证
      markChange (row) {
        if (row.mark > row.score) {
//          row.mark = row.score;
          row.mark = '';
        } else if (row.mark < 0 || !row.mark) {
          row.mark = 0;
        }
      },

      // 获取头像地址
      getPhotoPath (path) {
        return path && this.$store.getters.getEnvPath.http + path || '/static/image/defAvatar.png';
      }
    },
    created () {
      this.init();
    }
  };

</script>

<style lang="scss">
  @import '~@/assets/ambuf/css/examineMonitor_v1.0/studentInfo';

</style>
