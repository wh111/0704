<template>

  <div>
    <el-form ref="formValidate"  :rules="rules" :model="formValidate" class="demo-form-inline" label-width="110px">
      <el-row>
        <el-col :span="15" :offset="1">
          <div id="allmap1" style="width:100%; height: 500px;"></div>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-col :span="24">
              <el-form-item label="经度：" prop="longitude">
                <el-input v-model="formValidate.longitude" @blur="pointModification" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="纬度：" prop="latitude">
                <el-input v-model="formValidate.latitude" @blur="pointModification" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="地点名称：" prop="placeName">
                <el-input v-model="formValidate.placeName" @blur="placeNameModification" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="可打卡范围：" prop="scope">
                <el-input v-model.number="formValidate.scope" @blur="setScope" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="可打卡对象：" prop="name9">
                <el-radio-group v-model="setType">

                  <el-row>
                    <el-col :span="24">
                      <div class="col-item" style="line-height: 30px">
                        <el-radio :label="'ALL'">所有人</el-radio>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="col-item" style="line-height: 30px">
                        <el-radio :label="'role'">指定角色</el-radio>
                      </div>
                    </el-col>
                  </el-row>
                  <search-select v-if="formValidate.setType=='role'" @setSltOptionValue="setSltRoles"></search-select>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>


        </el-col>
      </el-row>
      <el-radio-group v-model="effectiveType" style="display: block;">
        <el-row>
          <el-col :span="3" :offset="1">
            <div class="col-item">有效时间：</div>
          </el-col>
          <el-col :span="4">
            <div class="col-item">
              <el-radio :label="'ALL'">所有有效时间</el-radio>
            </div>
          </el-col>
          <el-col :span="3" :offset="1">
            <div class="col-item">
              <el-radio :label="'given'">特定时间：</el-radio>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col-item" v-if="formValidate.effectiveType=='given'">
              <el-date-picker
                v-model="formValidate.startDate"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions0"
                @change="handleStartTime"
              >
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="col-item" style="text-align: center" v-if="formValidate.effectiveType=='given'">到&nbsp;&nbsp;
            </div>
          </el-col>
          <el-col :span="5">
            <div class="col-item" v-if="formValidate.effectiveType=='given'">
              <el-date-picker
                v-model="formValidate.endDate"
                align="right"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions1"
                @change="handleEndTime">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
      </el-radio-group>
      <el-row>
        <el-col :span="23" :offset="1" class="el-form--inline clWorkTimeBox">
          <el-form-item label="打卡时间:">
            <time-quantum :range="range" :data="time"></time-quantum>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <br/>
    <el-row>
      <el-col :span="10" :offset="10">
        <load-btn @listenSubEvent="listenSubEvent" :btnData="loadBtn"></load-btn>
        <el-button @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss">
  .col-item {
    line-height: 50px;
    font-size: 16px;
  }

  .clWorkTimeBox {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
</style>
<script>
  //导入查询框
  import timeQuantum from '../../../common/timeQuantum.vue'
  import searchSelect from '../../../common/searchSelect.vue';
  import {checkLocation as rules} from '../rules';

  let map = null
  //当前组件引入全局的util
  let Util = null;
  export default {
    //props接收父组件传递过来的数据
    props: ['operailityData'],
    data() {
      return {
        rules,
        //保存按钮基本信息
        loadBtn: {title: '提交', callParEvent: 'listenSubEvent'},
        range: [],
        time: {
          start: '',
          end: '',
          time: '',
        },
        //form表单bind数据
        formValidate: {
          longitude: '116.404',
          latitude: '39.915',
          placeName: '北京',
          scope: '100',
          setType: "ALL",
          roleIds: "",
          effectiveType: "ALL",
          startDate: "",
          endDate: "",
          startToWorkTime: '',
          endOffWorkTime: '',
          status: "0",
        },
        addData: {
          longitude: ''
        },

        setType: "ALL",
        effectiveType: "ALL",


        //部分人员控制
        partPer: false,
        //指定人员控制
        designatedPer: false,
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        //当前组件提交(add)数据时,ajax处理的 基础信息设置
        addMessTitle: {
          type: 'add',
          successTitle: '添加成功!',
          errorTitle: '添加失败!',
          ajaxSuccess: 'ajaxSuccess',
          ajaxError: 'ajaxError',
          ajaxParams: {
            url: '/attendance/clockSet/add',
            method: 'post'
          }
        },
      }
    },
    watch: {
      setType: function (val, oldVal) {
        this.formValidate.setType = val;
        if (val == "ALL") {
          this.formValidate.roleIds = "";
        }
      },
      effectiveType: function (val, oldVal) {
        this.formValidate.effectiveType = val;
        if (val == "ALL") {
          [this.formValidate.startDate, this.formValidate.endDate] = ["", ""];
        }
      }
    },
    created() {
      //给当前组件注入全局util
      Util = this.$util;
    },
    mounted() {
      //初始化
      this.init();
    },
    methods: {
      /*
       * 组件初始化入口
       * */
      init() {
        //默认请求加载数据
        let that = this
        map = new BMap.Map("allmap1");
        let point = new BMap.Point(this.formValidate.longitude, this.formValidate.latitude)// 创建Map实例
        map.centerAndZoom(point, 18);  // 初始化地图,设置中心点坐标和地图级别
        map.setCurrentCity(this.formValidate.placeName);          // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true);
        that.setMarker(point)
        that.mapClick()
      },
      /*
       * 点击提交按钮 监听是否提交数据
       * @param isLoadingFun boolean  form表单验证是否通过
       * */
      listenSubEvent(isLoadingFun) {
        let isSubmit = this.submitForm("formValidate");
        if (isSubmit) {
          if (!isLoadingFun) isLoadingFun = function () {
          };
          let data = this.getFormData(this.formValidate);
          if (data.setType == 'role' && !data.roleIds) {// 有效角色
            this.errorMess('请选择角色');
            return;
          }
          if (data.effectiveType == 'given' &&(!data.startDate || !data.endDate) ) { //特定时间段
            this.errorMess('特定时间必填');
            return;
          }
          let start = this.time.start;
          let end = this.time.end;
          if (!start) {
            this.errorMess('请选择上班打卡时间');
            return;
          }
          if (!end) {
            this.errorMess('请选择下班打卡时间');
            return;
          }
          data.startToWorkTime =this.time._start+':00';
          data.endOffWorkTime = this.time._end+':00';
          this.addMessTitle.ajaxParams.data = data;
          this.ajax(this.addMessTitle, isLoadingFun);
        }
      },


      /*
       * 点击提交按钮 监听是否验证通过
       * @param formName string  form表单v-model数据对象名称
       * @return flag boolean   form表单验证是否通过
       * */
      submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            flag = true;
          }
        });
        return flag;
      },
      pointModification() {
        if (!!this.formValidate.longitude && !!this.formValidate.latitude) {
          this.getPoint()
        }
      },
      placeNameModification() {
        if (!!this.formValidate.placeName) {
          this.getGeo()
        }
      },
      setScope() {
        if (!!this.formValidate.longitude && !!this.formValidate.latitude) {
          this.getPoint()
        } else if (!!this.formValidate.placeName) {
          this.getGeo()
        } else if (typeof this.formValidate != 'number') {
          this.$message.warning('请输入数字');
        } else {
          this.$message.warning('请输入地址');
        }
      },


      /*
       * 当前组件发送事件给父组件
       * 发送关闭(cancel)模态事件给父组件,请求关闭当前模态窗
       * */
      cancel() {
        this.$emit('cancel', 'add');
      },


      //监听子组件选择--指定角色--已选中值的变化,并设置此值
      setSltRoles(val, id) {
        this.formValidate.roleIds = id.join(",");
      },


      /*
       * 获取表单数据
       * @return string  格式:id=0&name=aa
       * */
      getFormData(data) {
        let myData = Util._.defaultsDeep({}, data);
        if (this.effectiveType != "ALL") {
          myData = this.formDate(myData, ['startDate', 'endDate']);
        }
        return myData;
      },
      //地图点击监听时间
      mapClick() {
        let that = this
        let geoc = new BMap.Geocoder();
        map.addEventListener("click", function (e) {
          let pt = e.point;
          geoc.getLocation(pt, function (rs) {
            that.formValidate.placeName = rs.address;
            that.formValidate.longitude = rs.point.lng;
            that.formValidate.latitude = rs.point.lat;
            that.setMarker(rs.point)
          });
        });
      },

      //根据经纬度来定位
      getPoint() {
        let that = this
        let myGeo = new BMap.Geocoder();
        myGeo.getLocation(new BMap.Point(this.formValidate.longitude, this.formValidate.latitude), function (point) {
          if (point) {
            that.formValidate.placeName = point.address;
            that.setMarker(point.point);
          } else {
            this.$message.warning("您选择地址没有解析到结果!");
          }
        }, "中国");
      },
      //根据地址来定位
      getGeo() {
        let myGeo = new BMap.Geocoder();
        let that = this
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(this.formValidate.placeName, function (point) {
          if (point) {
            that.formValidate.longitude = point.lng;
            that.formValidate.latitude = point.lat;
            map.centerAndZoom(point, 18);
            that.setMarker(point)
          } else {
            this.$message.warning("您选择地址没有解析到结果!");
          }
        }, "中国");

      },
      //经纬度设置地图中心点，并添加标注
      setMarker(new_point) {
        // 用经纬度设置地图中心点
        new_point = new_point || new BMap.Point(this.formValidate.longitude, this.formValidate.latitude);
        map.clearOverlays();
        let marker = new BMap.Marker(new_point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中
        //添加圆
        let circle = new BMap.Circle(new_point, this.formValidate.scope || 100);
        map.addOverlay(circle);            //增加圆
      },

      addControl() {
        let navigationControl = new BMap.NavigationControl({
          // 靠左上角位置
          anchor: BMAP_ANCHOR_TOP_LEFT,
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          // 启用显示定位
          enableGeolocation: true
        });
        map.addControl(navigationControl);

        // 添加定位控件
      },
    },
    components: {
      searchSelect, timeQuantum
    }
  }
</script>
