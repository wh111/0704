<template>

  <div class="showWrapper">
    <el-row>
      <el-col :span="10" :offset="10" class="lose-margin2">
        职业防护
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2" class="lose-margin2">

        职业防护

        什么叫职业暴露  职业暴露是指医务人员从事诊疗、护理等工作过 程意外被各种感染性疾病病毒感染者或者病人的 血液、体液包括（羊水、心包液、胸腔液、腹腔 液、滑液，阴道分泌物等人体物质）污染了皮肤 、黏膜或者被含有病毒的血液、体液污染的针 头及其它锐器刺破皮肤，有可能被感染的情况。   流行病学中将职业危害称作职业暴露 医务人员面临的主要职业危害 生物性危害  化学性危害：化疗药物、消毒剂、麻醉药物等通过黏膜和皮肤接触危害健康 物理性危害：射线、腰背疼痛等  心理、社会性危害：超负荷工作、压力大等  护理工作职业防护的重要性 护理工作的对象是病人，其中许多是急慢性传染病和没有症状的病原携带者，护士经常同他们接触，如防护不当则极易被感染。常见而又易感的有流感、流行性腮腺炎、麻疹等呼吸道传染病，和痢疾、伤寒、肝炎等消化道传染病。调查发现，尤以乙型肝炎的感染率最高，约为30％左右，占各种行业人员之首。这主要是由于护理工作同乙肝感染者接触密切造成的。    要有职业安全防范意识，采取防范措施，减少职业危害 职业危害  医务人员面临的主要职业危害   物理危害：针刺伤，噪声，射线、腰背疼痛等      生物性危害：指传染病包括SARS、乙型肝炎病毒   、丙型肝炎病毒、艾滋病毒、结核杆菌、流感病毒   （禽流感）等  1）针刺伤（医疗锐器伤）  文献报道，护士是发生针刺伤的高危人群。   针刺伤：是一种皮肤深部的足以使受伤者出血的意外伤害。护士是医务人员中最易接受的血液、体液的人群且多为危险性接触，刺伤后存在发生经血液、体液传播疾病的危险性。   2006年一个周五下午，中国医学科学院输血研究所卫  生部艾滋病确诊实验室刚上班，一个20多岁的女孩来到实验 室，女孩的面容憔悴，满脸惶恐，她怯生生地告诉实验室工 作人员：自己是四川某县的一名护士，在医院注射室工作。 今年7月，她给一个患者打针，刚把针头拔出来，一个朋友 和她开玩笑，在身后猛一拍她的肩膀，她大惊之下，拿针的手一哆嗦
      </el-col>
    </el-row>
    <el-form  ref="formValidate"   class="demo-form-inline" label-width="90px" >

    <el-row >
      <el-col :span="8" :offset="2">
        <el-form-item type="附件" label="相关证明材料:" class="feildFontweight">
          <a href="">上传附件</a>
        </el-form-item>
      </el-col >
    </el-row >
    </el-form>
  </div>
</template>
<script>
  //当前组件引入全局的util
  let Util=null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data (){
      return{
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        showData:{},
        tableData1:[],
        listMessTitle:{
          paramsData:'listUrl',
          ajaxSuccess:'SuccessGetCurrData',
          ajaxParams:{
            url:'/api/role/get/'+this.operailityData.id,
          }
        }
      }
    },
    created(){
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted(){
      //初始化
      this.init();
    },
    methods:{
      /*
       * 默认组件第一次请求数据
       * @param res JSON  数据请求成功后返回的数据
       * */
      SuccessGetCurrData(responseData){
        let type = [];
        let data = responseData.data;
        this.showData = data;
      },
      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel(){
        this.$emit('cancel','show');
      },
      /*
       * 组件初始化入口
       * */
      init(){
        //默认请求加载数据
        this.ajax(this.listMessTitle);
      },
    }
  }
</script>
<style>
  .showWrapper{
    height: 100%;
    padding: 20px;
    border: 1px solid #eee;
  }
  .feildFontweight{
    font-weight: bold;
  }
</style>
