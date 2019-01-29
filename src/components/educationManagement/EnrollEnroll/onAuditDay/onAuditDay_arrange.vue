<template>
  <div class="inStudyRegister">
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
        <th width="80px"></th>
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
        <td>
          <div class="cell">
            健康状况
          </div>
        </td>
        <td>
          <p class="cell">{{ userInfo.health }}</p>
        </td>

        <!--<td colspan="2" rowspan="4">-->
          <!--<div class="pic">-->
            <!--<img v-if="userInfo.photo" :src="getPicUrl(userInfo.photo)">-->
          <!--</div>-->
        <!--</td>-->
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
        <td>
          <div class="cell">
            是否党员
          </div>
        </td>
        <td>
          <p class="cell">{{ userInfo.partyMember | typeText }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">邮箱</div>
        </td>
        <td  colspan="3">
          <p class="cell">{{ userInfo.email }}</p>
        </td>
        <td>
          <div class="cell">职务</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.position }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">手机号</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.phone }}</p>
        </td>
        <td>
          <div class="cell">进修科目</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.courseNames }}</p>
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
          <div class="cell">是否住宿</div>
        </td>
        <td colspan="3">
          <p class="cell">{{ userInfo.whehterAccommodation | typeText }}</p>
        </td>
      </tr>

      <tr>
        <td>
          <div class="cell">医教处（科）电话</div>
        </td>
        <td colspan="7">
          <p class="cell">{{ userInfo.psychiatryPhone }}</p>
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
      </tbody>
    </table>
    <p class="right">
      <el-button @click="show" type="text">查看申请书</el-button>
    </p>
    <div style="margin-top: 20px;" align="center">
      <el-button type="primary" @click="pass('Y')">通过</el-button>
      <el-button @click="pass('N')">不通过</el-button>
    </div>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
           :width="1000">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :operaility-data="operailityData"></show>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
    /*当前组件必要引入*/
    import api from '../OnlinePrequalification/api';
    import thisApi from './api';
    import show from '../OnlinePrequalification/OnlinePrequalification_view.vue';
    //当前组件引入全局的util
    let Util = null;
    export default {
        props: ['operailityData'],
        data() {
            return {
              modal:{
                type:''
              },
              button: {
                showId: {
                  id: 'showId',
                  title: '查看'
                }
              },
              self:this,
              userInfo: {
                "userName": "", // "姓名",
                "gender": "", // "性别  BOY 男,GIRL 女",
                "age": "", // "年龄",
                "recordSchooling": "", // "学历",
                "title": "", // "职称",
                "professionalQualification": "", // "职业资格",
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
                "doctorCertificateNumber": "", // "职业医师证书编号",
                "institutionsRegistrationNumber": "", // "职业机构登记证号",
                "whehterAccommodation": "", // "是否住宿",
                "woirkTime": "", // "何时参加工作",
                "workLevel": "", // "现工作单位等级",
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
            }
          },
          // 查看
          show() {
            this.openModel('show');
          },
          // 增加回调
          subCallback(target, title, updata) {
            this.cancel(target);
            if (title) {
              this.successMess(title);
            }
            if (!updata) {
              this.setTableData();
            }
          },
          /*
           * 打开指定的模态窗体
           * @param options string 当前指定的模态:"add"、"edit"
           * */
          openModel(options) {
            this[options + 'Modal'] = true;
          },
          // 取消
          cancel() {
            this.$emit('cancel', 'add')
          },
          //审核
          pass(data){
            let id = this.operailityData.subjectsId;
            let opt = {
              type:"add",
              successTitle:"操作成功",
              errorTitle:"操作失败",
              ajaxSuccess: "ajaxSuccess",
              ajaxError: "ajaxError",
              ajaxParams: {
                url: thisApi.modify.path + id,
                method: thisApi.modify.method,
                data:{
                  instudyConfirmation:data
                }
              }
            };
            this.ajax(opt)
          },
        },
        created() {
            this.init();
        },
        mounted() {
        },
        components: {
          show,
        }
    }
</script>
