<!--
****--@file     mcu
****--@date     2017/12/15 10:58
****--@author   YC
****--@describe 科达视讯
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
                    <el-option v-for="item in 15" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <template v-for="(item,index) in leftKey">
                <el-col align="center">
                  <el-button-group :key="index">
                    <el-button size="small" v-for="(text,cIndex) in item" :key="cIndex"
                               @mousedown.native="setStart(cIndex,text)"
                               @mouseup.native="setEnd(cIndex,text)">{{ text }}
                    </el-button>
                  </el-button-group>
                </el-col>
              </template>
            </el-col>

            <el-col :span="10" :offset="2">
              <template v-for="(item,index) in rightKey">
                <el-col align="center">
                  <el-button-group :key="index">
                    <el-button size="small" v-for="(text,cIndex) in item" :key="cIndex"
                               @mousedown.native="setStart(cIndex,text)"
                               @mouseup.native="setEnd(cIndex,text)">{{ text }}
                    </el-button>
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
     * onlyPlayer     是否只显示播放器
     */
    props: ['showConsole', 'configData', 'count', 'isDebug', 'onlyPlayer'],
    data() {
      return {
        leftKey: {
          a: {
            ENLARGE: "放大",
            STOPSCALING: "停止缩放",
            NARROW: "缩小",
          },
        },
        rightKey: {
          c: {
            UPLEFT: "上左",
            UP: "上",
            UPRIGHT: "上右",
          },
          d: {
            LEFT: "左",
            RESET: "复位",
            RIGHT: "右",
          },
          e: {
            DOWNLEFT: "下左",
            DOWN: "下",
            DOWNRIGHT: "下右",
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
        this.debugFormData.command = key;
        this.saveConfig(text);
        this.opinfo.unshift({
          time: this.getNowTime(),
          msg: '开始“' + text + '”操作！'
        })
      },
      setEnd(key, text) {
        this.debugFormData.command = 'STOP';
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
            if (params.command == 'STOP') {
              this.cbinfo.unshift({
                time: this.getNowTime(),
                msg: '“' + text + '”操作成功！'
              })
            }
          },
          ajaxParams: {
            url: "video/camera/mcu/control" + this.configData.id,
            params
          }
        }
        this.ajax(opt)
      },
      initPlayer(src) {
        let flashvars = {
          src,
          autoPlay: true,
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
