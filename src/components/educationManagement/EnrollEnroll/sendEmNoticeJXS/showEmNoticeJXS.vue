<!--
****--@file     showEmNoticeJXS
****--@date     2018/8/25 9:45
****--@author   ${王恒}
****--@describe   发送进修生模块
-->
<template>
  <div class="showEmNoticeJXS">
    <el-button @click="printDataModal=true" v-if="type=='show'">打印</el-button>
    <div v-if="message" v-html="message"></div>
    <p style="text-align: center;">
      <el-button v-if="type=='change'" style="margin: 0 auto;text-align: center" @click="getNewMessage" type="primary">获取最新模板</el-button>
      <el-button v-if="type=='change'" style="margin: 0 auto;text-align: center" @click="change" type="primary">修改</el-button>
      <el-button v-if="type=='change'" style="margin: 0 auto;text-align: center" @click="send" type="primary">发送</el-button>
    </p>
    <!--打印弹窗-->
    <Modal :mask-closable="false" v-model="printDataModal" height="200" class-name="vertical-center-modal"
           :width="1000">
      <modal-header slot="header" :parent="self" :content="headerContent.printDataId"></modal-header>
      <print-data v-if="printDataModal" @cancel="cancel" @print="printDone" >
        <div class="default_font" v-html="message"></div>
      </print-data>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import api from './api'
  import printData from '../../../common/print.vue'
  let Util = null
  export default {
    props: ['operailityData', 'type'],
    data () {
      return {
        self:this,
        printDataModal: false,
        headerContent: {
          printDataId: {
            id: "printDataId",
            title: '打印'
          },
        },
        message: '',
        conifgId: '',
        formData: {
          'noticeId':"",
          'subjectId': '',
          'hospitalName': '',
          'doctorName': '',
          'department': '',
          'trainingTime': '',
          'startTime': '',
          'endTime': '',
          'trainingFee': '',
          'otherFee': '',
          'totalFee': '',
          'depositFee': '',
          "wordDoc":'',
        },
      }
    },
    methods: {
      printDone() {

      },
      send () {
        let opt = {
          ajaxSuccess: (res) => {
              this.successMess('发送成功');
              this.$emit('cancel','show');
          },
          ajaxParams: {
            url: api.batchSendNotice.path + this.operailityData.subjectsId,
            method: 'put',
          },
        }
        this.ajax(opt)
      },
      change(){
        this.formData.subjectId=this.operailityData.subjectsId;
        for(var i in this.formData){
          let temp = document.getElementById('formData.'+i);
          if(temp){
            if(!temp.value){
              this.errorMess('请填写完整')
              return
            }
            if(temp.value.length>100){
              this.errorMess('不能超过一百个字符')
              return
            }
            this.formData[i]=temp.value;
          }
        }
        let opt = {
          ajaxSuccess: (res) => {
            this.successMess('修改成功')
            this.$emit('cancel','show');
          },
          ajaxParams: {
            url: api.modify.path,
            method:  api.modify.method,
            jsonString:true,
            data:this.formData,
          },
        }
        this.ajax(opt)
      },
      setMessage (str) {
        let reg = /\{[0-9]+\}/g
        str=str.replace(reg, (item)=> {
          let m =Number(item.match(/[0-9]+/)[0]);
          switch (m)
          {
            case 1:
              item = this.type == 'show' ? `<span class="text-docration">${this.formData.hospitalName}</span>` : '<input type="text" id="formData.hospitalName"/>'
              break
            case 2:
              item = this.type == 'show' ?  `<span class="text-docration">${this.formData.doctorName}</span>` : '<input type="text"  id="formData.doctorName"/>'
              break
            case 3:
              item = this.type == 'show' ? `<span class="text-docration">${this.formData.department}</span>` : '<input type="text" id="formData.department"/>'
              break
            case 4:
              item = this.type == 'show' ? `<span class="text-docration">${this.formData.trainingTime}</span>` : '<input type="text"   id="formData.trainingTime"/>'
              break
            case 5:
              item = this.type == 'show' ? `<span class="text-docration">${this.formData.startTime}</span>` : '<input type="text"   id="formData.startTime"/>'
              break
            case 6:
              item = this.type == 'show' ? `<span class="text-docration">${this.formData.endTime}</span>` : '<input type="text"   id="formData.endTime"/>'
              break
            case 7:
              item = this.type == 'show' ? `<span class="text-docration">${this.formData.trainingFee}</span>` : '<input type="text"   id="formData.trainingFee"/>'
              break
            case 8:
              item = this.type == 'show' ? `<span class="text-docration">${this.formData.otherFee}</span>`: '<input type="text"  id="formData.otherFee"/>'
              break
            case 9:
              item = this.type == 'show' ?  `<span class="text-docration">${this.formData.totalFee}</span>` : '<input type="text"  id="formData.totalFee"/>'
              break
//            case 10:
//              item = this.type == 'show' ? `<span class="text-docration">${this.formData.depositFee}</span>` : '<input type="text"   id="formData.depositFee"/>'
//              break
          }
          return item
        })
         this.message=str;

      },
      //初始化请求列表数据
      init () {
        Util = this.$util
        let opt = {
          ajaxSuccess: (res) => {
            if(!res.data){
              this.message="<p style='text-align: center;font-size: 20px;font-weight: bolder;position: absolute;left: 0;top: 0;right: 0;bottom: 0;margin: auto;height: 20px'>暂无进修通知</p>"
              return
            }
            for (var i in this.formData) {
              this.formData[i] = res.data[i]
            }
            if (res.data.noticeId) {
              this.setMessage(res.data.wordDoc)
            } else {
              this.getMessage()
            }
//                  let reg=/\{[0-9]+\}/;
//                  res.data.replace(reg,function (item) {
//                    return item=`<input type="text" style="width: 100px;"/>`
//                  })

          },
          ajaxParams: {
            url: this.operailityData? api.get.path + this.operailityData.subjectsId:api.getMySubjectNotice.path,
            method: 'get',
          },
        }
        this.ajax(opt)
      },
      getMessage (type) {
        let opt = {
          ajaxSuccess: (res) => {
            this.setMessage(res.data.configValue);
            if(type){
              setTimeout(()=> {
                this.$nextTick(() => {
                  for(var i in this.formData){
                    let temp = document.getElementById('formData.'+i);
                    console.log(temp)
                    if(temp){
                      temp.value= this.formData[i];
                    }
                  }
                })

              },1000)
            }
            this.formData.wordDoc=res.data.configValue;
          },
          ajaxParams: {
            url: '/rotaryConfig/getByKey/jxs_emNotice_config-JXS',
            method: 'get',
          },
        }
        this.ajax(opt)
      },
      getNewMessage(){
        this.getMessage('new')
      },

    },
    created () {
      this.init()
    },
    mounted () {
      setTimeout(()=> {
        this.$nextTick(() => {
          for(var i in this.formData){
            let temp = document.getElementById('formData.'+i);
            console.log(temp)
            if(temp){
              temp.value= this.formData[i];
            }
          }
        })

      },1000)
    },
    components: {
      printData
    },
  }

</script>
<style lang="scss">
      .showEmNoticeJXS {
        span{
          display: inline;
          font-size: 16px;
        }
        strong{
          font-size: 16px;
        }
      input{
        border: none;
        border-bottom: 1px solid #657180;
        width: 100px;
        padding: 0 10px;
        outline: none;
        font-size: 16px;
      }
        .text-docration{
          border-bottom:1px solid #657180;
          padding: 0 10px;
        }
      }
      .default_font{
        font-size: 16px;
        span{
          display: inline;
          font-size: 16px;
        }
        strong{
          font-size: 16px;
        }
      }
</style>
