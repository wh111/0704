<template>
  <div class="inStudyRegister printTable">
    <table class="el-table">
      <thead>
      <tr class="place">
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="90px"></th>
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="60px"></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>
          <p class="cell">姓名</p>
        </td>
        <td>
          <p class="cell">{{ userInfo.userName }}</p>
        </td>
        <td>
          <p class="cell">性别</p>
        </td>
        <td>
          <p class="cell">{{ userInfo.gender | typeText }}</p>
        </td>
        <td>
          <p class="cell">年龄</p>
        </td>
        <td>
          <p class="cell">{{ userInfo.age }}</p>
        </td>
        <td colspan="2" rowspan="5">
          <div class="pic">
            <img width="150px" v-if="userInfo.photo" :src="getPicUrl(userInfo.photo)">
          </div>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">
            学历
          </div>
        </td>
        <td>
          <p class="cell">{{ userInfo.recordSchooling }}</p>
        </td>
        <td>
          <div class="cell">
            职称
          </div>
        </td>
        <td>
          <p class="cell">{{ userInfo.title }}</p>
        </td>
        <td>
          <div class="cell">
            执业资格
          </div>
        </td>
        <td>
          <p class="cell">{{ userInfo.professionalQualification }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">
            健康状况
          </div>
        </td>
        <td>
          <p class="cell">{{ userInfo.health }}</p>
        </td>
        <td>
          <div class="cell">
            政治面貌
          </div>
        </td>
        <td>
          <p class="cell">{{ userInfo.politicsStatus }}</p>
        </td>
        <td>
          <div class="cell">职务</div>
        </td>
        <td>
          <p class="cell">{{ userInfo.position }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">邮箱</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.email }}</p>
        </td>
        <td>
          <div class="cell">手机号</div>
        </td>
        <td>
          <p class="cell">{{ userInfo.phone }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">进修科目</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.courseNames }}</p>
        </td>
        <td>
          <div class="cell">是否住宿</div>
        </td>
        <td>
          <p class="cell">{{ userInfo.whehterAccommodation | typeText }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">单位</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.workName }}</p>
        </td>
        <td>
          <div class="cell">单位地址</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.workAddress }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">邮政编码</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.zipCode }}</p>
        </td>
        <td>
          <div class="cell">医教处（科）电话</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.psychiatryPhone }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">执业医师证书编号</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.doctorCertificateNumber }}</p>
        </td>
        <td>
          <div class="cell">执业机构登记证号</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.institutionsRegistrationNumber }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">何时参加工作</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.woirkTime }}</p>
        </td>
        <td>
          <div class="cell">现在工作单位等级</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.workLevel }}</p>
        </td>
      </tr>

      <tr>
        <td rowspan="4">
          <div class="cell">主学历</div>
        </td>
        <td colspan="2">
          <div class="cell">起止年月</div>
        </td>
        <td colspan="3">
          <div class="cell">学校名称</div>
        </td>
        <td colspan="2">
          <div class="cell">备注</div>
        </td>
      </tr>

      <tr v-for="(item,si) in schoolList" :key="'s' + si">
        <td colspan="2">
          <p class="cell">{{ item.beiginEndTime }}</p>
        </td>
        <td colspan="3">
          <p class="cell">{{ item.name }}</p>
        </td>
        <td colspan="2">
          <p class="cell">{{ item.note }}</p>
        </td>
      </tr>

      <tr>
        <td rowspan="4">
          <div class="cell">主要经历</div>
        </td>
        <td colspan="2">
          <div class="cell">起止年月</div>
        </td>
        <td colspan="3">
          <div class="cell">工作单位名称</div>
        </td>
        <td colspan="2">
          <div class="cell">职称</div>
        </td>
      </tr>

      <tr v-for="(item,wi) in workList" :key="'w' + wi">
        <td colspan="2">
          <p class="cell">{{ item.beiginEndTime }}</p>
        </td>
        <td colspan="3">
          <p class="cell">{{ item.name }}</p>
        </td>
        <td colspan="2">
          <p class="cell">{{ item.title }}</p>
        </td>
      </tr>

      <!-- 政治表现 -->
      <tr>
        <td>
          <div class="cell">政治表现</div>
        </td>
        <td colspan="7">
          <p class="cell">{{ userInfo.politicalPerformance }}</p>
        </td>
      </tr>
      <tr>
        <td>
          <div class="cell">现有业务能力</div>
        </td>
        <td colspan="7">
          <p class="cell">{{ userInfo.existingBusinessAbility }}</p>
        </td>
      </tr>
      <tr>
        <td>
          <div class="cell">进修专业及要求</div>
        </td>
        <td colspan="7">
          <p class="cell">{{ userInfo.studyRequirements }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">外语水平计算机等级</div>
        </td>
        <td colspan="7">
          <p class="cell">{{ userInfo.languageLevelComputerLevel }}</p>
        </td>
      </tr>

      <tr>
        <td colspan="8" align="center">
          <div class="cell">
            进修期限：
            {{ userInfo.studyTime | recruit }}
            <span style="margin-left: 10px">年份：</span>
            {{ userInfo.studyTimeYear }}
            <span style="margin-left: 10px">进修时间：</span>
            {{ userInfo.studyTimeMonth==3?'三月':'九月'}}
            <span style="margin-left: 10px">报到时间：</span>
            {{ userInfo.checkInTime }}
          </div>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">
            备注
          </div>
        </td>
        <td colspan="7">
          <div class="cell">
            1.寄进修表时请附医师执业证书、资格证书、职称证书、学历证书复印件；进修妇产科还需要加寄助产资格证书。<br>
            2.欲知进修科目详情请上网查询，点击南京鼓楼医院（www.njglyy.com）-教学培训-进修指南-进修科目、进修生管理规定、进修表格。
          </div>
        </td>
      </tr>

      </tbody>
    </table>
    <!-- 身份证 -->
    <div class="idPic">
      <div class="left face">
        <img v-if="userInfo.cdimg1Url" :src="getPicUrl(userInfo.cdimg1Url)">
      </div>
      <div class="right con">
        <img v-if="userInfo.cdimg2Url" :src="getPicUrl(userInfo.cdimg2Url)">
      </div>
    </div>
    <!-- 证书 -->
    <div class="idPic">
      <div class="left dc">
        <img v-if="userInfo.doctorCertificateUrl" :src="getPicUrl(userInfo.doctorCertificateUrl)">
      </div>
      <div class="right ir">
        <img v-if="userInfo.institutionsRegistrationUrl" :src="getPicUrl(userInfo.institutionsRegistrationUrl)">
      </div>
    </div>
    <!-- 附件 -->
    <div class="files">
      <span>附件：</span>
      <a v-if="files" :href="getPicUrl(userInfo.fileInfo)"><el-button type="text">{{ files }}</el-button></a>
      <el-button v-else type="text">暂无附件</el-button>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        files:"",
        schoolList:[
          {"beiginEndTime":"","type":"SCHOOL","name":"","note":""},
          {"beiginEndTime":"","type":"SCHOOL","name":"","note":""},
          {"beiginEndTime":"","type":"SCHOOL","name":"","note":""},
//          {"beiginEndTime":"","type":"SCHOOL","name":"","note":""},
        ],
        workList:[
          {"beiginEndTime":"","type":"WORK","name":"","title":""},
          {"beiginEndTime":"","type":"WORK","name":"","title":""},
          {"beiginEndTime":"","type":"WORK","name":"","title":""},
//          {"beiginEndTime":"","type":"WORK","name":"","title":""},
        ],
        userInfo: {
          "userName": "", // "姓名",
          "gender": "", // "性别  BOY 男,GIRL 女",
          "age": "", // "年龄",
          "recordSchooling": "", // "学历",
          "title": "", // "职称",
          'professionalQualification': '', // "执业资格",
          "health": "", // "健康状况",
          "partyMember": "", // "是否党员(Y 是  N 否)",
          "email": "", // "邮箱",
          "position": "", // "职务",
          "phone": "", // "手机号",
          "managementIds": "", // "进修科目Ids(多个逗号分隔)",
          "courseNames": "", // "进修科目名称",
          "workName": "", // "单位",
          "workAddress": "", // "单位地址",
          "zipCode": "", // "邮政编码",
          "psychiatryPhone": "", // "医教处电话",
          'doctorCertificateNumber': '', // "执业医师证书编号",
          'institutionsRegistrationNumber': '', // "执业机构登记证号",
          "whehterAccommodation": "", // "是否住宿",
          "woirkTime": "", // "何时参加工作",
          "workLevel": "", // "现工作单位等级",
          "politicalPerformance": "", // "政治表现",
          "existingBusinessAbility": "", // "现有业务能力",
          "studyRequirements": "", // "进修专业及要求",
          "languageLevelComputerLevel": "", // "外语水平计算机等级",
          "studyTime": "", // "进修时间(HALFTYEAR 半年 AYEAR一年)",
          studyTimeYear: '',
          studyTimeMonth: '',
          "checkInTime": "", // "报到时间(yyyy-MM-dd)",
          "eduStudySubjectsDetails": [
            {
              "type": "", // "类型(学历 SCHOOL 、WORK 主要经历)",
              "beiginEndTime": "", // "起止时间",
              "name": "", // "名称",
              "title": "", // "职称",
              "note": "", // "备注"
            }
          ],
          "photo": "", // "头像地址",
          "code": "", // "验证码",
          "cdimg1Url": "", // "身份证正面照",
          "cdimg2Url": "", // "身份证反面照",
          "doctorCertificateUrl":"",//证件
          "institutionsRegistrationUrl":"",//证件
          "fileIds": "", // 11
          "fileInfo":"", // 附件地址
        },
        http:'',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.http = this.$store.state.envPath.http;
        this.getViewData()
      },
      getViewData() {
        let id = this.operailityData.subjectsId;
        let type = 'sq';
        if (this.operailityData.userId && this.operailityData.userId != 'null') {
          id = this.operailityData.userId;
          type = 'user';
        }
        let opt = {
          ajaxSuccess: "getViewDataSuccess",
          ajaxError: () => this.errorMess('获取数据失败，请重试'),
          ajaxParams: {
            url: api.getUserInfo.path + id,
            method: api.getUserInfo.method,
            params: {
              type
            }
          }
        };
        this.ajax(opt)
      },
      getViewDataSuccess(res) {
        if (res.data) {
          for (let key in this.userInfo) {
            if (res.data[key] != null) {
              this.userInfo[key] = res.data[key]
            }
          }
          let school = [];
          let work = [];
          for (let item in res.data.eduStudySubjectsDetails){
            if(!res.data.eduStudySubjectsDetails[item].type){
              continue
            }
            if ((res.data.eduStudySubjectsDetails[item].type || '').toLocaleUpperCase() === 'SCHOOL'){
              school.push(res.data.eduStudySubjectsDetails[item])
            }else {
              work.push(res.data.eduStudySubjectsDetails[item])
            }
          }

          for (let i in school){
            this.schoolList[i]=school[i]
          }

          for (let j in work){
            this.workList[j]=work[j]
          }

          this.workList.length = 3;
          this.schoolList.length = 3;
          this.files = (res.data.fileInfo || '').split('/').pop();
        }
      },
      // 获取图片
      getPicUrl(staticUrl) {
        let src = '';
        if (staticUrl) {
          src = this.http + staticUrl
        }
        return src
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {}
  }
</script>

<style lang="scss">
  @import'../../../../assets/ambuf/css/printTable/public.scss';
</style>
