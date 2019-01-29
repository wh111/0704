<!----------------------------------
****--@name     进修通知配置
****--@role     ${*}
****--@date     2018/8/23
****--@author   gx
----------------------------------->
<template>
  <div class="emNoticeConfig" ref="emNoticeConfig">
    <div class="emNoticeConfig-r">
      <h3 class="emNoticeConfig-r-header">*说明*</h3>
      <ul style="height:372px ">
        <li class="emNoticeConfig-r-li" v-for="(item,index) in replace" key="index"><span
          style="color: #FF4949">{{item.key}}</span>
          : {{item.value}}
        </li>
      </ul>
      <br>
      <div class="emNoticeConfig-r-bottom" align="center">
        <el-button type="primary" @click="listenSubEvent">保存</el-button>
        <el-button type="warning" @click="refresh">重置</el-button>
      </div>
    </div>
    <div class="emNoticeConfig-l">
      <Ueditor name="value" @storeUE="storeUE" @getUeditorVal="getUeditorVal" v-if="ueditorVal.value"
               :ueditor-val="ueditorVal" :ueditor-config="ueditorConfig" style="width:100%"></Ueditor>
    </div>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api';
  import replace from './replace'
  import Ueditor from '../../../common/showUeditor'
  //当前组件引入全局的util
  let Util = null;
  export default {
    data() {
      return {
        replace,
        api,
        conifgId:'',
        UE: {}, // 编辑器
        ueditorVal: {
          value: "",
        },  //
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          // zIndex: 9,
//          autoHeightEnabled:true,
          initialFrameHeight: '100%' //初始化编辑器高度,默认320
        },
        oldValue: '',//保存的一份老数据

        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        editMessTitle: {
          type: 'edit',
          successTitle: '修改成功!',
          errorTitle: '修改失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
//            url: api.save.path,
//            method: api.save.method,
            data: {}
          }
        },
        //当前组件默认请求(list)数据时,ajax处理的 基础信息设置
        initMessTitle: {
          ajaxSuccess: 'SuccessGetCurrData',
          ajaxParams: {
            url: api.get.path
          }
        },

      }
    },
    methods: {
      //初始化请求列表数据
      init() {
//         this.ajax(this.initMessTitle)
        // this.ueditorVal.value='<p style="text-align:center"><strong><span style="font-family: 宋体;font-size: 19px"><span style="font-family:宋体">进修通知</span></span></strong></p><p><strong><span style="font-family: 宋体;font-size: 19px"><span style="font-family:宋体"><span style="color:#ff0000">{1}</span>：</span></span></strong></p><p><span style=";font-family:宋体;font-size:16px">&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-family:宋体">经审核同意贵院</span></span><strong><span style="font-family: 宋体;color: rgb(255, 0, 0);font-size: 16px"><span style="font-family:宋体">{2}</span></span></strong><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">医师来我院</span></span><strong><span style="font-family: 宋体;color: rgb(255, 0, 0);font-size: 16px">{3}</span></strong><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">进修<span style="color:#ff0000">{4}</span></span></span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">个月，服从科室工作安排。报到时间：</span></span><span style=";font-family:宋体;color:rgb(255,0,0);font-size:16px">{5}</span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">，结业时间：</span></span><span style=";font-family:宋体;color:rgb(255,0,0);font-size:16px"></span><span style="color: rgb(255, 0, 0); font-family: 宋体;">{6}</span><span style=";font-family:宋体;color:rgb(255,0,0);font-size:16px"><span style="font-family:宋体"></span></span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">。如贵院同意以上安排，</span></span><strong><span style="font-family: 宋体;font-size: 16px"><span style="font-family:宋体">请进修生收到通知后一周内速发邮件告知来否（邮箱</span>:1036908478@qq.com<span style="font-family:宋体">）</span></span></strong><span style=";font-family:宋体;font-size:16px">2.</span><strong><span style="font-family: 宋体;font-size: 16px"><span style="font-family:宋体">填写进修回执，发送至上述邮箱。</span></span></strong><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">现将有关报到事宜通知如下：</span></span></p><p><span style="font-family:宋体;font-size:16px">一、</span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">应带证件：</span></span></p><p><span style="font-family:宋体;font-size:16px">1.</span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">报到时出具进修通知及身份证、执业证、资格证、最后学历证、职称证书原件；进修通知自行下载打印，报到时需加盖我院公章；</span></span></p><p><span style="font-family:宋体;font-size:16px">2.</span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">报到时交加盖单位公章的复印件（</span>1<span style="font-family:宋体">）进修人员管理规定（</span><span style="font-family:Calibri">2</span><span style="font-family:宋体">）医师执业证书、资格证书、学历证书、职称证书和身份证复印件</span></span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">（执业证书、资格证书照片面和内容面均需复印并加盖单位公章）。</span></span></p><p><span style="font-family:宋体;font-size:16px">二、</span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">费用：</span></span></p><p><span style=";font-family:宋体;font-size:16px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-family:宋体">进修费<span style="color:#ff0000">{7}</span></span></span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">元，杂支<span style="color:#ff0000">{8}</span></span></span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">元，合计人民币<span style="color:#ff0000">{9}</span></span></span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">元。交款方式：单位汇款或个人汇款，不收现金。</span></span><strong><span style="font-family: 宋体;font-size: 16px"><span style="font-family:宋体">为便于开发票署名请个人汇款者在汇款留言上注明单位，单位汇款者在汇款留言上注明进修人员姓名。为便于您报到时能拿到发票请尽量提前</span>2<span style="font-family:宋体">周汇款并保留汇款凭证。</span></span></strong><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">请勿从邮局汇款，我院财务处银行账号见下，另请备<span style="color:#ff0000">{10}</span></span></span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">元现金交押金。</span></span></p><p><span style=";font-family:宋体;font-size:16px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-family:宋体">开户名：南京鼓楼医院</span></span></p><p><span style=";font-family:宋体;font-size:16px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-family:宋体">账</span> &nbsp;<span style="font-family:宋体">号：</span>4301011309001101669</span></p><p><span style=";font-family:宋体;font-size:16px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-family:宋体">开户行：工行汉口路分理处</span></span></p><p><span style="font-family:宋体;font-size:16px">三、</span><span style=";font-family:宋体;font-size:16px"><span style="font-family:宋体">要求：</span></span></p><p><span style=";font-family:宋体;font-size:16px">&nbsp;&nbsp;1.</span><strong><span style="font-family: 宋体;font-size: 16px"><span style="font-family:宋体">为保证进修时间和质量，有晋升、学习、考试、结婚、怀孕及身体状况不佳等情况请勿外派；</span></span></strong></p><p><strong><span style="font-family: 宋体;font-size: 16px">&nbsp;&nbsp;2.<span style="font-family:宋体">进修期间不得随便请假，无论何种原因中途退学者，收费一律不退，不发结业证书；</span></span></strong></p><p><strong><span style="font-family: 宋体;font-size: 16px">&nbsp;&nbsp;3.<span style="font-family:宋体">进修期间进修科目不得随意改变。</span></span></strong></p><p><span style=";font-family:宋体;font-size:16px">&nbsp;&nbsp;<span style="font-family:宋体">教育处联系电话：</span>025-68182132</span></p><p><span style=";font-family:宋体;font-size:16px">&nbsp;&nbsp;<span style="font-family:宋体">联系人：徐老师</span></span></p><p style="text-indent:32px"><strong><span style="font-family: 宋体;font-size: 16px"><span style="font-family:宋体">特别提示：</span></span></strong></p><p><strong><span style="font-family: 宋体;font-size: 16px">&nbsp;&nbsp;&nbsp;<span style="font-family:宋体">请自行下载并仔细阅读进修通知和报到须知及进修生管理规定，报到时加盖我院公章。来进修者请在收到邮件后</span>1<span style="font-family:宋体">周内速发邮件回复，计划有变不能来进修者请及时电话或速回邮件告知，我院将另行安排其他进修人员，我院进修人员住宿床位有限，若影响我院招生工作，下次将重新申请并不再优先考虑，谢谢您配合我院的进修招生工作。</span></span></strong></p><p><span style=";font-family:宋体;font-size:16px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p><p style="text-indent:392px"><span style=";font-family:宋体;font-size:16px">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><strong><span style="font-family: 宋体;font-size: 16px"><span style="font-family:宋体">南京鼓楼医院教育处</span></span></strong></p><p><strong><span style="font-family: 宋体;font-size: 16px">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span></strong><strong><span style="font-family: 宋体;color: rgb(255, 0, 0);font-size: 16px">{11}</span></strong></p><p><br/></p>'
//        let reg=/\{[0-9]+\}/g;
//        let m=this.ueditorVal.value.replace(reg,function (item) {console.log(item);  return  item =`<input type="text"/>`})
//        console.log(m)
        let opt = {
          ajaxSuccess: (res) =>{
            this.ueditorVal.value=res.data.configValue;
            this.conifgId=res.data.configId;
//            let reg=/\{[0-9]+\}/;
//            res.data.replace(reg,function (item) {
//              return item=`<input type="text" style="width: 100px;"/>`
//            })

          } ,
          ajaxParams: {
            url: api.getByKey.path,
            method:'get'
          }
        };
        this.ajax(opt)
      },

      //提交
      listenSubEvent() {
        let value = this.ueditorVal.value;
        let temp=true;
//        console.log(value.match(/\{1\}/g));
        let explains = ['来源单位', '姓名 ', '科目', '时长', '报到时间 ', '结业时间', '进修费 ', '杂支', '合计'];
        explains.some((item, index) => {
          let reg = new RegExp(`\\{${index + 1}\\}`, 'g');
          let arr = value.match(reg) || []
          console.log(arr);
          if (arr.length != 1) {
            temp=false
            this.errorMess(`{${index + 1}} : ${item}  :必须并且只能存在一个`);
            return true;
          }
        })
        if(temp){
          this.changModel();
        }



      },
      changModel(){
        let opt = {
          ajaxSuccess: (res) =>{
            this.successMess('保存成功')
//            let reg=/\{[0-9]+\}/;
//            res.data.replace(reg,function (item) {
//              return item=`<input type="text" style="width: 100px;"/>`
//            })

          } ,
          ajaxParams: {
            url: api.changBykey.path+this.conifgId,
            method:'put',
            jsonString:true,
            data:{
              configValue:this.ueditorVal.value,
              remark:""
            }
          }
        };
        this.ajax(opt)
      },
      //重置
      refresh() {
        this.setMyVal('value', this.oldValue)
      },
      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */
      storeUE(name, editor) {
        this.UE[name] = editor;
        this.setTableDynHeight()
      },

      setMyVal(name, v) {
        this.UE[name].setContent(v);
      },
      /**
       *
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       *
       * @param val  {string}  编辑器的内容
       *
       */
      getUeditorVal(name, val) {
        this.ueditorVal[name] = val;
      },

      //设置表格及分页的位置
      setTableDynHeight() {
        let content = this.$refs.emNoticeConfig;
        let parHt = content.parentNode.offsetHeight - 130;

        this.setUeditorHeight('value', parHt)
        this.ueditorConfig.initialFrameHeight = parHt;
      },
      setUeditorHeight(name, height) {
        if (this.UE[name]) this.UE[name].setHeight(height);
        console.log(height);
      },
    },
    created() {
      this.init();
    },
    mounted() {
      //页面dom稳定后调用
      this.$nextTick(function () {
        //初始表格高度及分页位置
        this.setTableDynHeight();
        //为窗体绑定改变大小事件
        let Event = this.$util.events;
        Event.addHandler(window, "resize", this.setTableDynHeight);
      })
    },
    components: {
      Ueditor
    }
  }
</script>
<style lang="scss">
  .emNoticeConfig {
    padding: 10px;
    height: 100%;
    .emNoticeConfig-r {
      float: right;
      width: 300px;
      height: 100%;
      border: 1px solid #ccc;
      position: relative;
      overflow: auto;
      .emNoticeConfig-r-header {
        color: #FF4949;
        text-align: center;
        font-size: 20px;
        padding: 15px;
      }

      .emNoticeConfig-r-li {
        font-size: 16px;
        font-weight: 600;
        padding: 5px;
      }
      .emNoticeConfig-r-bottom {
        /*position: absolute;*/
        /*bottom: 10px;*/
        /*right: 0;*/
        /*left: 0;*/
      }
    }
    .emNoticeConfig-l {
      height: 100%;
      margin-right: 310px;
    }

  }
</style>
