<!--
****--@file     deviceStorage_printCode
****--@date     2018/3/8 14:42
****--@author   wh
****--@describe   打印二维码
-->
<template>
  <div class="codePrint">
    <div class="showItem">
      <p>配置预览</p>
      <div class="showUi">
        <p class="title">{{show.mainTitle ? show.title : ''}}</p>
        <el-col>
          <img :src="'/api/file/download/'+codeList[0].qrcode"
               @error="e=>e.target.src='/static/image/qrImgLoadError.png'" class="qrImg">
        </el-col>
        <p v-if="show.name">设备名称：{{codeList[0].deviceTypeName}}</p>
        <p v-if="show.num">设备编号：{{codeList[0].deviceIdentifier}}</p>
        <p v-if="show.location">存放地点：{{codeList[0].storageLocation}}</p>
      </div>
      <div style="clear: both"></div>
    </div>
    <el-form ref="show" :rules="rules" :model="show" label-width="140px" style="width: 40%;float: left">
      <el-form-item label="是否显示主标题">
        <el-radio-group v-model="show.mainTitle">
          <el-radio :label="true">显示</el-radio>
          <el-radio :label="false">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="主标题" prop="title" v-if="show.mainTitle">
        <el-input type="text" v-model="show.title"></el-input>
      </el-form-item>
      <el-form-item label="是否显示设备名称">
        <el-radio-group v-model="show.name">
          <el-radio :label="true">显示</el-radio>
          <el-radio :label="false">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示设备编号">
        <el-radio-group v-model="show.num">
          <el-radio :label="true">显示</el-radio>
          <el-radio :label="false">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示存放地点">
        <el-radio-group v-model="show.location">
          <el-radio :label="true">显示</el-radio>
          <el-radio :label="false">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="clear: both "></div>
    <!-- 按钮 -->
    <el-row type="flex" class="row-bg" justify="center" solt="footer">
      <el-col :span="4" class="btnBox" align="center">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
      </el-col>
      <el-col :span="4" class="btnBox" :offset="2" align="center">
        <el-button @click="cancelPrint">取消</el-button>
      </el-col>
    </el-row>
    <!--打印弹窗-->
    <Modal :mask-closable="false" v-model="printDataModal" height="200" class-name="vertical-center-modal"
           :width="1000">
      <modal-header slot="header" :parent="self" :content="headerContent.printDataId"></modal-header>
      <print-data v-if="printDataModal" @cancel="cancel" @print="printDone">
        <div>
          <template v-for="(listItem,index) in codeListPage">
            <!-- 每页数据 -->
            <div style='page-break-after: always;' v-if="index < codeListPage.length && index > 0"></div>
            <div class="deviceStoragePrintCodePageItem" :key="index">
              <div v-for="(item,cIndex) in listItem" class="printBPMain-codePrint"
                   :class="{'firstRow':cIndex < 3 && index === 0}"
                   :key="index+'_'+cIndex">
                <div class="showUi">
                  <p class="title">{{show.mainTitle ? show.title : ''}}</p>
                  <el-col :span="24">
                    <img :src="'/api/file/download/'+item.qrcode"
                         @error="e=>e.target.src='/static/image/qrImgLoadError.png'" class="img">
                  </el-col>
                  <p :class="[!show.name? 'setShowClass':'']">设备名称：{{show.name ? item.deviceTypeName : ''}}</p>
                  <p :class="{'setShowClass':!show.num}">设备编号：{{show.num ? item.deviceIdentifier : ''}}</p>
                  <p :class="[!show.location ? 'setShowClass':'']">存放地点：{{show.location ? item.storageLocation :
                    ''}}</p>
                  <!--<p v-if="show.name">设备名称：{{item.deviceTypeName}}</p>-->
                  <!--<p v-if="show.num">设备编号：{{item.deviceIdentifier}}</p>-->
                  <!--<p v-if="show.location">存放地点：{{item.storageLocation}}</p>-->
                </div>
              </div>
              <div class="clearFloat"></div>
            </div>
          </template>
        </div>
      </print-data>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  /*当前组件必要引入*/
  import printData from '../../../../common/print.vue'
  import rules from './rules'

  let Util = null
  export default {
    props: ['codeList'],
    data() {
      return {
        rules,
        codeListPage: [],
        //保存按钮基本信息
        loadBtn: {
          loading: false,
          title: '打印预览',
          callParEvent: 'listenSubEvent'
        },
        show: {
          mainTitle: true,
          name: true,
          num: true,
          location: true,
          title: ''
        },
        printDataModal: false,
        headerContent: {
          printDataId: {
            id: "printDataId",
            title: '打印'
          },
        },
        self: this,
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        Util = this.$util;
        let num = 21; // 每页打印多少条数据
        let codeList = Util._.defaultsDeep([], this.codeList || []);
        let allLen = codeList.length;
        let page = parseInt(allLen / num);
        let last = allLen % num;

        '1'.repeat(page).split('').map(() => this.codeListPage.push(codeList.splice(0, num)));
        last && this.codeListPage.push(codeList.splice(0, last));
      },  // 打印完成
      printDone() {

      },
      // 取消
      cancel(targer) {

        this[targer + 'Modal'] = false;
      },//取消打印
      cancelPrint() {
        this.$emit('cancel', 'print');
      },
      /*
* 点击提交按钮 监听是否提交数据
* @param isLoadingFun boolean  form表单验证是否通过
* */
      listenSubEvent() {
        this.printDataModal = true;
//                let isSubmit = this.submitForm("formValidate");
//                if (isSubmit) {
//                    if (!isLoadingFun) isLoadingFun = function () {};
//                    isLoadingFun(true);
//                    this.addMessTitle.ajaxParams.data = this.getFormData(this.formValidate);
//                    let data = this.addMessTitle.ajaxParams.data;
//                    data.purchaseTime = this.conductDate(data.purchaseTime, 'yyyy-MM-dd hh:mm:ss');
//                    data.manufactureDate = this.conductDate(data.manufactureDate, 'yyyy-MM-dd');
//                    data.guaranteeDate = this.conductDate(data.guaranteeDate, 'yyyy-MM-dd');
//                    data.depId = this.depId;
//                    data.deviceTypeId = this.id;
//                    this.ajax(this.addMessTitle, isLoadingFun)
//                }
      },

    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      printData
    }
  }

</script>
<style lang="scss">
  .codePrint {
    .showItem {
      width: 60%;
      float: right;
      margin: 0 auto;
      text-align: center;
      padding: 10px;
      .showUi {
        border-radius: 10px;
        margin-top: 10px;
        height: 358px;
        border: 1px solid #CCCCCC;
        width: 304px;
        margin: 0 auto;
        .title {
          height: 30px;
          font-size: 20px;
          line-height: 30px;
          overflow: hidden;
        }
        .setShowClass {
          visibility: hidden;
        }
        p {
          font-size: 14px;
          line-height: 18px
        }
      }
      .qrImg {
        margin: -20px;
        margin-top: -30px;
      }
    }
    .deviceStoragePrintCodePageItem {
      overflow: hidden;
    }
    .clearFloat {
      clear: both;
      height: 0;
      width: 0;
      visibility: hidden;
    }
  }

  .printBPMain-codePrint {
    transform: rotate(270deg);
    float: left;
    text-align: center;
    width: 32.4%;
    min-height: 200px;
    margin: -38px auto;
    &.firstRow {
      margin-top: -50px;
    }
    &.splitPage {
      margin-top: -38px;
    }
    .img {
      width: 68%;
      margin: -12px -30px;
    }
    .title {
      height: 30px;
      font-size: 20px;
      line-height: 30px;
    }
    .setShowClass {
      visibility: hidden;
    }
    .firstRowBottom {
      /* margin-top: -6px; */
      /*// margin-bottom: 0px;*/
    }
  }
</style>
