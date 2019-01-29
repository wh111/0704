<!--
****--@file     hikvision
****--@date     2017/12/15 10:57
****--@author   YC
****--@describe 海康威视
-->
<template>
  <div class="debugVideoBox">
    <div class="debugVideoBox-left">
      <div class="debugPlugin" ref="videoWrapper">
        <div :id="'livePlayer'+configData.id" class="livePlayer">
          <p>请允许Flash插件运行</p>
        </div>
        <!--<videojs-live :liveUrl="liveUrl" class="debugVideoBox-left"></videojs-live>-->
      </div>
    </div>
    <div class="debugVideoBox-right" v-if="!!onlyPlayer">
      <fieldset class="ptz">
        <legend>云台控制</legend>
        <el-row class="debugVideoBtnBox">
          <el-form labelWidth="60px" v-if="showConsole">
            <el-col :span="10" :offset="1">
              <el-col>
                <el-form-item label="速度：">
                  <el-select size="small" v-model="debugFormData.speed" placeholder="请选择">
                    <el-option v-for="item in 7" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <template v-for="(item,index) in leftKey">
                <el-col align="center">
                  <el-button-group :key="index">
                    <template v-for="(text,cIndex) in item">
                      <!--<el-button v-if="debugFormData.command == cIndex && debugFormData.stop=='0'" size="small" :key="cIndex"-->
                      <!--@click="setEnd(cIndex,text)">-->
                      <!--取消-->
                      <!--</el-button>-->
                      <!--<el-button v-else size="small" :key="cIndex" :disabled="debugFormData.stop == '0'"-->
                      <!--@click="setStart(cIndex,text)">-->
                      <!--{{ text }}-->
                      <!--</el-button>-->
                      <el-button size="small" :key="cIndex" @click="setStart(cIndex,text)">
                        {{ text }}
                      </el-button>
                    </template>
                  </el-button-group>
                </el-col>
              </template>
            </el-col>

            <el-col :span="10" :offset="2">
              <template v-for="(item,index) in rightKey">
                <el-col align="center">
                  <el-button-group :key="index">
                    <template v-for="(text,cIndex) in item">
                      <el-button
                        v-if="cIndex == 'PAN_AUTO' && debugFormData.command == 'PAN_AUTO' && debugFormData.stop=='0'"
                        size="small" :key="cIndex" @click="setEnd(cIndex,text)">
                        取消
                      </el-button>
                      <el-button v-else size="small" :key="cIndex"
                                 @click="setStart(cIndex,text)">
                        {{ text }}
                      </el-button>
                    </template>
                  </el-button-group>
                </el-col>
              </template>
            </el-col>

          </el-form>
          <p v-else class="hideConsole">暂无云台控制</p>
        </el-row>
      </fieldset>
      <fieldset class="operate">
        <legend>操作信息</legend>
        <ul ref="opinfo" class="opinfo">
          <li class="debugVideoInfoItem" v-for="(item,index) in opinfo" :key="index">
            <span class="dviTime">{{ item.time }}</span>
            <span class="dviMsg">{{ item.msg }}</span>
          </li>
        </ul>
      </fieldset>
      <fieldset class="callback">
        <legend>事件回调信息</legend>
        <ul ref="cbinfo" class="cbinfo">
          <li class="debugVideoInfoItem" v-for="(item,index) in cbinfo" :key="index">
            <span class="dviTime">{{ item.time }}</span>
            <span class="dviMsg">{{ item.msg }}</span>
          </li>
        </ul>
      </fieldset>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../../../../../assets/ambuf/css/hardware/layout";
</style>
<script>
  /*当前组件必要引入*/
  //当前组件引入全局的util
  let Util = null;
  export default {
    /**
     * showConsole    是否显示云控制台
     * configData     摄像头配置信息
     * count          计数器（调试模式下统计登录使用）
     * isDebug        获取视频流是否是调试模式
     * onlyPlayer     只显示播放器
     */
    props: ['showConsole', 'configData', 'count', 'isDebug', 'onlyPlayer'],
    data() {
      return {
        leftKey: {
          // LIGHT_PWRON: "打开灯光光源",
          // WIPER_PWRON: "接通雨刷",
          // FAN_PWRON: "风扇",
          // HEATER_PWRON: "加热",
          // AUX_PWRON1: "辅助设备1",
          // AUX_PWRON2: "辅助设备2",
          a: {
            FOCUS_NEAR: "焦点前调",
            ZOOM_IN: "焦距变大",
            ZOOM_OUT: "焦距变小",
          },
          b: {
            FOCUS_FAR: "焦点后调",
            IRIS_OPEN: "光圈扩大",
            IRIS_CLOSE: "光圈缩小",
          },
        },
        rightKey: {
          c: {
            UP_LEFT: "上左",
            TILT_UP: "上",
            UP_RIGHT: "上右",
          },
          d: {
            PAN_LEFT: "左",
            PAN_AUTO: "自动",
            PAN_RIGHT: "右",
          },
          e: {
            DOWN_LEFT: "下左",
            TILT_DOWN: "下",
            DOWN_RIGHT: "下右",
          }
        },
        stop: true,
        opinfo: [],
        cbinfo: [],
        debugFormData: {
          id: '',
          command: '',
          speed: 1, // 速度 1-7
          stop: '1',// 开始终止  0开始，1停止
          // 摄像头信息
          nvrIp: "",
          port: "",
          loginName: "",
          password: "",
          brand: "",
          ip: "",
        },
        streamData: {
          id: "",
          brand: "",
          loginName: "",
          password: "",
          ip: ""
        }
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.initDebugData();
      },
      initDebugData() {
        let keys = ['id', 'nvrIp', 'port', 'loginName', 'password', 'brand', 'ip'];
        keys.map(key => this.debugFormData[key] = this.configData[key]);
        for (let key in this.streamData) {
          this.streamData[key] = this.configData[key]
        }
        this.getStreamData()
      },
      getStreamData() {
        let params = this.isDebug ? this.$util.getFormData(this.streamData) : {id: this.streamData.id};
        let api = this.isDebug ? 'video/camera/debug/getStream/' : 'video/camera/getStream/';
        let opt = {
          error: (res) => {
            this.cbinfo.unshift({
              time: this.getNowTime(),
              msg: '登录失败！'
            })
          },
          ajaxSuccess: res => {
            this.cbinfo.unshift({
              time: this.getNowTime(),
              msg: '登录成功！'
            })

            this.initPlayer(res.data.stream || '');
          },
          ajaxParams: {
            url: api + this.configData.id,
            params
          }
        }
        this.ajax(opt)
      },
      getNowTime() {
        let now = new Date();
        return now.getHours() + ':' + now.getMinutes() + ':' + now.getMilliseconds()
      },
      setStart(key, text) {
        this.debugFormData.stop = '0';
        this.debugFormData.command = key;
        this.saveConfig(text);
        this.opinfo.unshift({
          time: this.getNowTime(),
          msg: '开始“' + text + '”操作！'
        })
      },
      setEnd(key, text) {
        this.debugFormData.stop = '1';
        this.debugFormData.command = key;
        this.saveConfig(text);
        this.opinfo.unshift({
          time: this.getNowTime(),
          msg: '结束“' + text + '”操作！'
        })
      },
      saveConfig(text) {
        let params = this.$util.getFormData(this.debugFormData);
        let opt = {
          ajaxSuccess: res => {
            if (params.stop) {
              this.cbinfo.unshift({
                time: this.getNowTime(),
                msg: '“' + text + '”操作成功！'
              })
            }
          },
          ajaxParams: {
            url: "video/camera/hkvision/control/" + this.configData.id,
            params
          }
        }
        this.ajax(opt)
      },
      initPlayer(src) {
        let flashvars = {
          src,
          autoPlay: true
        };
        let params = {
          allowFullScreen: true, allowScriptAccess: "always", bgcolor: "#000000"
        };
        let attrs = {
          dataId: this.configData.id
        };
        let w = this.$refs.videoWrapper.offsetWidth;
        let h = this.$refs.videoWrapper.offsetHeight;
        swfobject.embedSWF("/static/player/swfobject/GrindPlayer.swf", "livePlayer" + this.configData.id, w && w - 10 || 490, h && h - 10 || 350, "10.2", null, flashvars, params, attrs);
      },
    },
    created() {
      this.init();
    },
    mounted() {
      this.$nextTick(() => {
        this.initPlayer()
      })
    },
    beforeDestroy() {
    },
    components: {},
    watch: {
      count(val) {
        this.init()
      }
    }
  }

</script>
