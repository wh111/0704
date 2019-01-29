<!----------------------------------
****--进修回执填写须知(EducationReceiptWrite_index)
****--@date     2017/9/14
****--@author   zyc<332533011@qq.com
----------------------------------->
<template>
  <div style="width: 100%;height: 100%;">
    <h2 class="engageNotice-title">进修须知</h2>
    <div class="engageNotice-content" ref="engageNoticeContent">
      <p class="engageNotice-content-item">如果您已收到我院录取通知，请仔细阅读以下我院进修生管理有关细则，若能保证遵守执行，
        请按进修通知和报到须知要求认真准备，准时报到。并请下载此规定一式两份签字并盖单位公章，
        报到时交我院教育处盖章，一份我院教育处留存，一份自己留存。</p>
      <p class="engageNotice-content-item">1. 进修人员必须具备良好的职业素质和一定的业务能力，在进修期间应以主人翁的姿态和救死扶伤的崇高信念做好本职工作；</p>
      <p class="engageNotice-content-item">2. 进修人员进修期间的业务学习、工作分配，行政及生活管理均需服从医院教育处和科室安排。
        须和本院医师一样遵守医院各项规章制度和各项诊疗常规。完成我院病房和门急诊多项医疗工
        作，参加一线值班，接收并管理病人，认真书写病历，对病人要体现爱心、细心、耐心，不能以
        任何理由与病人及其家属发生争执；</p>
      <p class="engageNotice-content-item">3. 为加强对进修人员管理，调动进修人员积极性，提高医院医疗质量，保证医院服务水准，凡
        经教育处招生进修半年以上(含半年)的进修生实行岗位津贴制。根据每月考核情况，发放进修津
        贴，减或免费进修者不享受进修津贴；</p>
      <p class="engageNotice-content-item">4. 各科室负责对本科室轮转的进修生进行管理和考核,考核内容包括医德医风、医疗质量、和劳
        动纪律等方面。若违反有关规定则不享受津贴。具体考核办法,来院时下发有关规定和考核手册；</p>
      <p class="engageNotice-content-item">5. 进修人员来院后，须统一参加教育处举办的岗前培训方能进岗。进修期间为保证我院病历质
        量，临床医师须参加院“医疗文件书写”的培训，如住院病历书写不合格、工作表现不符合要求，
        科室可提出意见，经教育处同意，可终止进修；</p>
      <p class="engageNotice-content-item">6.考勤制度：上课与日常工作不得迟到、早退，不得无故旷工，未经批准不上班者勒令退学并通
        知原单位。进修期间不享受探亲假，原则上不得请假，有特殊情况必须请假者，需有选送单位出
        具证明或来公涵联系，任何个人涵电均视为无效。请假累计数达20 天/年或10 天/半年者，不发
        结业证书；</p>
      <p class="engageNotice-content-item">7. 进修人员患病一律在我院保健科就诊，医药费回原单位报销；</p>
      <p class="engageNotice-content-item">8. 任何原因中途终止进修，需原单位出具书面申请，电话、电报无效。不发结业证书，进修、
        住宿等费用一律不退；</p>
      <p class="engageNotice-content-item">9.进修期间因违反我院规章制度者、病历质量丙级，经多次帮助无效者、由于服务态度等原因造
        成医院医疗纠纷者，不发结业证书，情节严重者按有关规定及纪律处理并将情况反馈至原单位；</p>
      <p class="engageNotice-content-item">10. 进修期满认真做好自我鉴定，省级进修班学员须书写论文或综述一篇，参加结业考试。院
        级进修班学员须参加出科考试，合格者发给结业证书；</p>
      <p class="engageNotice-content-item">11.进修生在进修结束前三天，本人到教育处领取进修表做结业总结并按规定时间办理离院手续，
        不得由他人代办或补办，所借公物全部归还；</p>
      <p class="engageNotice-content-item">12. 请选送单位严格掌握、全面考虑派出进修人员的业务能力及身体情况等，是否能坚持为期
        一年或半年的进修，不能勉强，我院将严格执行上述规定。</p>
      <div class="lkBox">
        <div class="lkBox-left"><p>选送单位盖章： </p></div>
        <div class="lkBox-right"><p ref="hospitalName">南京鼓楼医院教育处</p></div>
      </div>
      <p ref="studentInfo">进修生签名：{{operailityData.userName}}</p>
    </div>
    <br/>
    <el-row>
      <el-col :span="24" style="text-align: center;">
        <el-checkbox v-model="checked">同意管理要求，并准时报到参加培训</el-checkbox>
      </el-col>
    </el-row>

    <br/>
    <el-row>
      <el-col :span="24" style="text-align: center;">
        <el-button type="primary" :disabled="!checked" @click="add">填写回执
        </el-button>
        <a :href="downURL">
          <el-button type="primary">下载进修须知为PDF</el-button>
        </a>
        <el-button type="primary" @click="printPDF">打印进修须知</el-button>
      </el-col>
      <iframe frameborder="0" class="pdfPrivew" ref="pdfPrivew"></iframe>
    </el-row>
  </div>
</template>
<style>
  .engageNotice-title {
    color: #000000;
    text-align: center;
    padding: 20px;
  }

  .engageNotice-content {
    color: #000000;
    width: 90%;
    height: 70%;
    margin: 0 auto;
    border: 1px solid rgb(224, 230, 237);
    padding: 20px;
    background: #F9FAFC;
    overflow: auto;
  }

  .engageNotice-content p {
    color: #475669;
    font-size: 14px;
    padding-bottom: 20px;
    line-height: 22px;
  }

  .lkBox {
    overflow: hidden;
    padding: 20px 0 20px 0;
  }

  .lkBox-left {
    float: left;
  }

  .lkBox-right {
    float: right;
  }

  .pdfPrivew {
    display: none;
  }
</style>

<script>
  /*当前组件必要引入*/
  //当前组件引入全局的util
  let Util = null;
  export default {
    props: ['operailityData'],
    data () {
      return {
        checked: false,
        userId: this.$store.getters['getUserInfo'].id,
        downURL: '',
      };
    },
    methods: {
      //初始化请求列表数据
      init () {
        Util = this.$util;
        this.downURL = '/api/inStudy/returnReceipt/downLoadPDF?time=' + new Date().getTime() + '&userId=' + this.userId;
      },
      add () {
        if (!this.checked) {
          this.showMess('请勾选同意管理要求!');
          return;
        }
        this.$emit('setShow', 'add');
      },
      printPDF () {
        let pdfPrivew = this.$refs.pdfPrivew;
        if (pdfPrivew.src) {
          pdfPrivew.contentWindow.print();
        } else {
          pdfPrivew.src = this.downURL;
          pdfPrivew.onload = function () {
            pdfPrivew.contentWindow.print();
          };
        }
      }
    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };
</script>
