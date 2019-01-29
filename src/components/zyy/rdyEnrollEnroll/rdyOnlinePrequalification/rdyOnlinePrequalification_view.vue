<template>
  <div class="printTable">
    <table class="el-table">
      <thead>
      <tr class="place">
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="80px"></th>
        <th width="80px"></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td><p class="cell">应聘培训专业：</p></td>
        <td colspan="2"><p class="cell">{{ userInfo.trainingSpecialty }}</p></td>
        <td><p class="cell">次选专业：</p></td>
        <td colspan="2"><p class="cell">{{ userInfo.secondarySpecialty }}</p></td>
        <td><p class="cell">是否同意调济：</p></td>
        <td><p class="cell">{{ userInfo.whetherSwap | typeText }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">姓名</p></td>
        <td><p class="cell">{{ userInfo.name }}</p></td>
        <td><p class="cell">性别</p></td>
        <td><p class="cell">{{ userInfo.gender | typeText }}</p></td>
        <td><p class="cell">民族</p></td>
        <td><p class="cell">{{ userInfo.nation }}</p></td>
        <td rowspan="5" colspan="2">
          <div class="pic"><img width="132px" style="height: 176px;" v-if="userInfo.headPhoto"
                                :src="getUrlForPath(userInfo.headPhoto)"></div>
        </td>
      </tr>

      <tr>
        <td><p class="cell">出生年月</p></td>
        <td><p class="cell">{{ userInfo.birthday }}</p></td>
        <td><p class="cell">政治面貌</p></td>
        <td><p class="cell">{{ userInfo.political }}</p></td>
        <td><p class="cell">学历学位</p></td>
        <td><p class="cell">{{ userInfo.highestEdu }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">毕业院校</p></td>
        <td><p class="cell">{{ userInfo.school }}</p></td>
        <td><p class="cell">专业</p></td>
        <td><p class="cell">{{ userInfo.specialty }}</p></td>
        <td><p class="cell">毕业时间</p></td>
        <td><p class="cell">{{ userInfo.graduationTime }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">职称、执（职）业资格</p></td>
        <td><p class="cell">{{ userInfo.professionalQualification }}</p></td>
        <td><p class="cell">是否应届毕业生</p></td>
        <td><p class="cell">{{ userInfo.isCurrent | typeText }}</p></td>
        <td><p class="cell">取得时间</p></td>
        <td><p class="cell">{{ userInfo.qualificationTime }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">英语水平</p></td>
        <td><p class="cell">{{ userInfo.englishLevel }}</p></td>
        <td><p class="cell">英语水平成绩</p></td>
        <td><p class="cell">{{ userInfo.englishScore }}</p></td>
        <td><p class="cell">计算机水平</p></td>
        <td><p class="cell">{{ userInfo.computerLevel }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">户籍所在地</p></td>
        <td colspan="2"><p class="cell">{{ userInfo.placeOrigin }}</p></td>
        <td><p class="cell">婚姻状况</p></td>
        <td><p class="cell">{{ userInfo.whetherMarry | marry }}</p></td>
        <td><p class="cell">档案保管单位</p></td>
        <td colspan="2"><p class="cell">{{ userInfo.archivesKeepunit }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">身份证号</p></td>
        <td colspan="3"><p class="cell">{{ userInfo.idNumber }}</p></td>
        <td><p class="cell">特长</p></td>
        <td colspan="3"><p class="cell">{{ userInfo.specialSkill }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">通讯地址</p></td>
        <td colspan="3"><p class="cell">{{ userInfo.postalAddress }}</p></td>
        <td><p class="cell">邮政编码</p></td>
        <td colspan="3"><p class="cell">{{ userInfo.zipCode }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">联系电话</p></td>
        <td><p class="cell">{{ userInfo.phone }}</p></td>
        <td><p class="cell">E-mail</p></td>
        <td colspan="2"><p class="cell">{{ userInfo.email }}</p></td>
        <td><p class="cell">QQ</p></td>
        <td colspan="2"><p class="cell">{{ userInfo.tencentQq }}</p></td>
      </tr>

      <tr>
        <td colspan="2"><p class="cell">是否与区县签订就业合同</p></td>
        <td><p class="cell">{{ userInfo.whetherContract | typeText }}</p></td>
        <td><p class="cell">区县名</p></td>
        <td colspan="4"><p class="cell">{{ userInfo.countyName }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">简历</p></td>
        <td colspan="7"><p class="cell">{{ userInfo.resume }}</p></td>
      </tr>

      <tr>
        <td><p class="cell">与应聘岗位相关的实践经历或取得的成绩</p></td>
        <td colspan="7"><p class="cell">{{ userInfo.honorExperience }}</p></td>
      </tr>

      <tr>
        <td>
          <div class="cell single"><p>应聘人员承诺</p></div>
        </td>
        <td colspan="3">
          <div class="cell indent">
            本人承诺所提供的材料真实有效，符合应聘岗位所需的资格条件。如有弄虚作假，承诺自动放弃考试和聘用资格。
          </div>
        </td>
        <td>
          <div class="cell single"><p>资格审查意见</p></div>
        </td>
        <td colspan="3 indent">
          <p class="cell">经审查，符合应聘资格条件。</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell single"><p>备注</p></div>
        </td>
        <td colspan="7">
          <div class="cell indent">
            我院招聘过程中所有考务通知均通过鼓楼医院教学平台发布，请及时留意鼓楼医院教学平台通知，未及时查看通知导致应聘者错过我院招聘考试考核责任自负，认可以上通知请确认签名：
          </div>
        </td>
      </tr>

      </tbody>
    </table>
    <!-- 身份证 -->
    <div class="idPic">
      <div class="left face"><img v-if="userInfo.card1Photo" :src="getUrlForPath(userInfo.card1Photo)"></div>
      <div class="right con"><img v-if="userInfo.card2Photo" :src="getUrlForPath(userInfo.card2Photo)"></div>
    </div>
    <div class="files">
      <span>附件：</span>
      <a v-if="files" :href="getPicUrl(userInfo.fileInfo)">
        <el-button type="text">{{ files }}</el-button>
      </a>
      <el-button v-else type="text">暂无附件</el-button>
    </div>
  </div>
</template>
<style lang="scss">
  @import '../../../../assets/ambuf/css/printTable/public.scss';
</style>
<script>
  /*当前组件必要引入*/
  import api from './api';
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data() {
      return {
        files: "",
        userInfo: {
          id: "",
          userId: "",
          name: "", // "姓名",
          gender: "", // "性别  BOY 男,GIRL 女",
//          age: "", // "年龄",
          nation: "", // 民族
          birthday: "", // 出生年月

          political: '', // "党员",
          highestEdu: '', // "学历学位",
          school: '', // "毕业院校",
          graduationTime: '', // "2017-08-09",
          specialty: '', // "专业",
          trainingSpecialtyId: '', // 1,
          trainingSpecialty: '', // "计算机专业",
          secondarySpecialtyId: '', // 1,
          secondarySpecialty: '', // "土木工程专业",
          whetherSwap: '', // "Y",
          professionalQualification: '', // "职称、执业资格",
          isCurrent: '',
          qualificationTime: '', // "2017-02-02",
          englishLevel: '', // "one",
          englishScore: '',
          computerLevel: '', // "two",
          placeOrigin: '', // "户籍所在地",
          whetherMarry: '', // "N",
          archivesKeepunit: '', // "档案保管单位",
          idNumber: '', // "410422199209091234",
          specialSkill: '', // "特长a",
          postalAddress: '', // "通讯地址",
          zipCode: '', // "451245",
          phone: '', // "13140193952",
          email: '', // "373827048@qq.com",
          tencentQq: '', // "373827048",
          whetherContract: '', // "Y",
          countyName: '', // "区县",
          resume: '', // "简历",
          honorExperience: '', // "与应聘岗位相关的实践经历或取得的成绩",
          headPhoto: '', // "www.1233.com/url",
          card1Photo: '', // "www.222.com/url",
          card2Photo: '', // "www.233.com/url",
          createTime: '', // "2017-10-19",
          ysState: '', // "SUBMIT",
          ysTime: '', // null,
          xcState: '', // "SUBMIT",
          xcTime: '', // null,
          zskstzState: '', // "N",
          zskstzTime: '', // null,
          examMark: '', // null,
          lqexamMarkState: '', // "SUBMIT",
          lqexamMarkTime: '', // null
          fileInfo: '',
        },
        http: '',
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.http = this.$store.state.envPath.http;
        this.getViewData()
      },
      getViewData() {
        let id = this.operailityData.id;
        let type = 'sq';
        if (this.operailityData.userId && this.operailityData.userId != 'null') {
          id = this.operailityData.userId;
          type = 'user';
        }
        let opt = {
          ajaxSuccess: "getViewDataSuccess",
          ajaxError: () => this.errorMess('获取数据失败，请重试'),
          ajaxParams: {
            url: api.get.path + id,
            method: api.get.method,
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
          this.files = (res.data.fileInfo || '').split('/').pop();
        }
      },
      // 获取路径
      getUrlForPath(staticUrl) {
        let src = '';
        if (staticUrl) {
          src = this.http + staticUrl
        }
        return src
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
