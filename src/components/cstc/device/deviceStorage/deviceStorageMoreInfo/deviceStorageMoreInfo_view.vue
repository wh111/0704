<template>
  <el-row class="deviceMoreInfoShow">
    <div class="qrImgs">
      <img :src="'/api/file/download/'+formValidate.qrcode"
           @error="e=>e.target.src='/static/image/qrImgLoadError.png'">
      <p>设备二维码</p>
    </div>
    <el-form :model="formValidate" ref="formValidate" label-width="124px">
      <el-col :span="9" :offset="2">
        <el-form-item label="设备名称：" prop="">
          {{ formValidate.deviceTypeName }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="设备编号：" prop="deviceIdentifier">
          {{ formValidate.deviceIdentifier || '-' }}
          <!--<el-input v-model="formValidate.deviceIdentifier" placeholder="请输入设备编号"></el-input>-->
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="设备状态：" prop="status">
          {{ formValidate.status | typeText }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="规格：" prop="specifications">
          {{ formValidate.specifications || '-' }}
          <!--<el-input v-model="formValidate.specifications" placeholder="请输入设备规格"></el-input>-->
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="型号：" prop="model">
          {{ formValidate.model || '-' }}
          <!--<el-input v-model="formValidate.model" placeholder="请输入设备型号"></el-input>-->
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="使用次数：" prop="useTime">
          {{ formValidate.useTime || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="单价（元）：" prop="price">
          {{ formValidate.price || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="供应商：" prop="supplier">
          {{ formValidate.supplier || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="使用方向：" prop="directionUse">
          {{ formValidate.directionUse || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="购置时间：" prop="purchaseDate">
          {{ formValidate.purchaseDate || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="使用部门：" prop="useDepartment">
          {{ formValidate.useDepartment || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="责任人：" prop="personLiable">
          {{ formValidate.personLiable || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="厂家：" prop="manufactor">
          {{ formValidate.manufactor || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="出厂编号：" prop="factoryNumber">
          {{ formValidate.factoryNumber || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="出厂日期：" prop="manufactureDate">
          {{ formValidate.manufactureDate || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="购置来源：" prop="purchaseSource">
          {{ formValidate.purchaseSource || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="保修截止日期：" prop="guaranteeDate">
          {{ formValidate.guaranteeDate || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="折旧方式：" prop="depreciationMethod">
          {{ formValidate.depreciationMethod || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="存放地点：" prop="storageLocation" style="margin-bottom: 23px">
          {{ formValidate.storageLocation || '-' }}
        </el-form-item>
      </el-col>
      <el-col :span="9" :offset="2">
        <el-form-item label="发票号：" prop="invoiceNumber">
          {{ formValidate.invoiceNumber || '-' }}
        </el-form-item>
      </el-col>

      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="购买时间：" prop="purchaseTime">-->
      <!--{{ formValidate.purchaseTime }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="使用次数：" prop="useTime">-->
      <!--{{ formValidate.useTime || '0' }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="单价：" prop="price">-->
      <!--{{ formValidate.price | money }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="维修电话：" prop="servicingPhone">-->
      <!--{{ formValidate.servicingPhone }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="厂商电话：" prop="manufacturerPhone">-->
      <!--{{ formValidate.manufacturerPhone }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="购买地址：" prop="buyAdderss">-->
      <!--{{ formValidate.buyAdderss }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="存放地点：" prop="storageLocation">-->
      <!--{{ formValidate.storageLocation }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="设备编号：" prop="deviceIdentifier">-->
      <!--{{ formValidate.deviceIdentifier }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="设备型号：" prop="model">-->
      <!--{{ formValidate.model }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="生产日期：" prop="manufactureDate">-->
      <!--{{ formValidate.manufactureDate }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="保修截止日期：" prop="guaranteeDate">-->
      <!--{{ formValidate.guaranteeDate }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="9" :offset="2">-->
      <!--<el-form-item label="设备状态：" prop="status">-->
      <!--{{ formValidate.status | typeText }}-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <el-col :span="20" :offset="2">
        <el-form-item label="备注：" prop="describes">{{ formValidate.describes }}</el-form-item>
      </el-col>
      <el-col :span="20" :offset="2">
        <viewPPT style="width: 100%" v-if="formValidate.imgList&&formValidate.imgList.length>0"
                 :docImages="formValidate.imgList||[]">
        </viewPPT>
      </el-col>

      <el-col :span="20" :offset="2">
        <el-row v-if="formValidate.videoList!=0">
          <el-col style="height:300px;background: #000;" :span="17">
            <myVideo v-if="videoShow" style="height:300px" :filePath="file._path" :isAutoPlay="true"
                     :videoType="file.type"></myVideo>
          </el-col>
          <el-col :span="7">
            <ul style="height:300px;background: #cecece;overflow: auto">
              <li v-for="(item,i) in formValidate.videoList" :key="i"
                  :class="{'my-video-list':(index==i)}" @click="changeIndex(item,i)"
                  style="color: #fff;height:40px;line-height: 40px;cursor: pointer;"
                  class="overflow-txt1"> {{item.fileName}}
              </li>
            </ul>
          </el-col>
        </el-row>

        <div v-else style="line-height: 200px;text-align: center;font-size: 18px">
          <strong>无视频文件</strong>
        </div>
      </el-col>
    </el-form>
  </el-row>
</template>
<style lang="scss">
  .deviceMoreInfoShow {
    position: relative;
    .qrImgs {
      width: 200px;
      position: absolute;
      right: -16px;
      top: -16px;
      img {
        width: 100%;
      }
      p {
        margin-top: -12px;
        text-align: center;
      }
    }
  }
</style>
<script>
  import api from './api';
  import myVideo from '../../../../common/video.vue';
  import viewPPT from './viewPPT.vue';

  export default {
    props: {
      id: {
        type: [Number, String],
        require: true,
      },
      // urlParams: { // 编辑
      //   type: Object,
      //   require: true
      // }
      // operailityData: {
      //   type: Object,
      //   required: true
      // }
    },
    data () {
      return {
        // 表单数据
        formValidate: {
//          model: "-", // 设备型号
//          deviceTypeName: "-",
//          deviceIdentifier: "-", // 设备编号
//          price: "-", // 单价
//          useTime: 0, // 使用次数 无
//          purchaseTime: "-", // 购买时间
//          manufacturerPhone: "-", // 厂商电话
//          servicingPhone: "-", // 维修电话
//          storageLocation: "-", // 存放地点
//          buyAdderss: "-", // 购买地点
//          manufactureDate: "-", // 生产日期
//          guaranteeDate: "-", // 保修截止日期
//          status: "-", // 状态
//          imgList: [], // 状态
//          describes: "-" // 描述

//          "id":"1",
          'deviceTypeId': '',
          'deviceIdentifier': '',
          'price': '',
          'useTime': '',
          'status': '',
          'manufactureDate': '',
          'purchaseTime': '',
          'buyAdderss': '',
          'manufacturerPhone': '',
          'guaranteeDate': '',
          'storageLocation': '',
          'describe': '',
          'QRCode': '',
          'model': '',
          'specifications': '',
          'supplier': '',
          'directionUse': '',
          'factoryNumber': '',
          'purchaseSource': '',
          'invoiceNumber': '',
          'depreciationMethod': '',
          'purchaseDate': '',
          'useDepartment': '',
          'personLiable': '',
          'manufactor': '',
          'videoList': [
//            {
//              "fileName":"",
//              "path":""
//            }
          ],
          'invoicePictureList': [
//            {
//              "originalPath":"*/*.jpg",
//              "thumbnailPath":"*/*.jpg"
//            }
          ],
        },
        videoShow: false,
        file: {id: ''},
      }
    },
    methods: {
      /**************************** 从服务器获取编辑的数据 *****************************************/
      getDataForServer () {
        this.ajax({
          ajaxSuccess: 'ajaxSuccess',
          ajaxParams: {
            url: api.get.path + this.id,
            method: api.get.method,
          },
        })
      },
      ajaxSuccess (res) {
        if (res.data.multimediaFileList != 0) {
          this.changeIndex(res.data.videoList[0], 0);
        }

        let http = '/server/' || this.$store.state.envPath.http;
        if (res.data.imgList && res.data.imgList.length > 0) {
          res.data.imgList = res.data.imgList.map((item, index) => {
            return http + item.originalPath
          })
        }
        console.log(res.data);
        this.formValidate = res.data // 初始化编辑数据
      },
      /*
       * 组件初始化入口
       * */
      init () {
        // 获取编辑数据
        this.getDataForServer();
      },

      //切换视频
      changeIndex (item, i) {

        this.index = i;
        if (item) {
          if (this.file.id == item.id) {
            return;
          }

          let env = this.$store.getters.getEnvPath;
          let http = env['http'];
          let file = {};
          this.videoShow = false;
          file = item;
          file._path = http + file.path;
          let type = file._path.split('.');
          file.type = type[type.length - 1];
          this.file = file
        }
        //页面dom稳定后调用
        this.$nextTick(function () {
          this.videoShow = true;
        })
      },
    },
    created () {
      // this.formValidate = this.operailityData
      this.init();
    },
    components: {
      myVideo, viewPPT,
    },
  }

</script>
