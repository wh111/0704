<!--
****--摄像联调(showVideo)
****--@date     2017/8/17
****--@author   zyc<332533011@qq.com-->
<template>
  <div class="debugVideoBox">
    <div>
      <div id="divPlugin" class="plugin" style="margin-top:5px;margin-left:5px;"></div>
    </div>
    <div style="border: 1px solid;border-radius: 5px;">
      <div style="width: 27%;float: left;">
        <div style="padding: 5px"> 当前房间:{{params.roomNum}}</div>
        <div style="padding: 5px">直播摄像头:</div>
        <el-select :disabled="liveType=='startLive'" @change="videoChange" style="padding: 5px" v-model="cameraIp" placeholder="请选择">
          <el-option v-for="item in liveList" :key="item.ip" :label="item.ip" :value="item.ip">
          </el-option>
        </el-select>
        <div style="padding: 5px">直播状态: {{liveType=='startLive'?'正在直播':liveType=='pauseLive'?'暂停直播':'终止直播'}}</div>
        <div style="padding: 5px">
          <el-button type="success" :disabled="liveType=='startLive'" @click="startLive" size="mini">开始</el-button>
          <el-button type="warning" :disabled="liveType!='startLive'" @click="pauseLive" size="mini">暂停</el-button>
          <el-button type="danger" :disabled="liveType=='stopLive'" @click="stopLive" size="mini">终止</el-button>
        </div>

      </div>
      <div style="width: 68%;float: right;margin-right:15px;;">
        <div style="width: 100%;">
          <fieldset class="ptz" style="width:inherit;">
            <legend>云台控制</legend>
            <table cellpadding="0" cellspacing="3" border="0" class="left">
              <tr>
                <td>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="mouseDownPTZControl(5)" @mouseup.native="mouseUpPTZControl()">左上</el-button>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="mouseDownPTZControl(1)" @mouseup.native="mouseUpPTZControl()">上</el-button>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="mouseDownPTZControl(7)" @mouseup.native="mouseUpPTZControl()">右上</el-button>
                  <!--<input type="button" class="btn" value="左上" onmousedown="mouseDownPTZControl(5);" onmouseup="mouseUpPTZControl();" />
                <input type="button" class="btn" value="上" onmousedown="mouseDownPTZControl(1);" onmouseup="mouseUpPTZControl();" />
                <input type="button" class="btn" value="右上" onmousedown="mouseDownPTZControl(7);" onmouseup="mouseUpPTZControl();" />-->
                </td>
              </tr>
              <tr>
                <td>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="mouseDownPTZControl(3)" @mouseup.native="mouseUpPTZControl()">左</el-button>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="mouseDownPTZControl(9)">自动</el-button>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="mouseDownPTZControl(4)" @mouseup.native="mouseUpPTZControl()">右</el-button>
                  <!--<input type="button" class="btn" value="左" onmousedown="mouseDownPTZControl(3);" onmouseup="mouseUpPTZControl();" />
                <input type="button" class="btn" value="自动" onclick="mouseDownPTZControl(9);" />
                <input type="button" class="btn" value="右" onmousedown="mouseDownPTZControl(4);" onmouseup="mouseUpPTZControl();" />-->
                </td>
              </tr>
              <tr>
                <td>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="mouseDownPTZControl(6)" @mouseup.native="mouseUpPTZControl()">左下</el-button>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="mouseDownPTZControl(2)" @mouseup.native="mouseUpPTZControl()">下</el-button>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="mouseDownPTZControl(8)" @mouseup.native="mouseUpPTZControl()">右下</el-button>
                  <!--<input type="button" class="btn" value="左下" onmousedown="mouseDownPTZControl(6);" onmouseup="mouseUpPTZControl();" />
                <input type="button" class="btn" value="下" onmousedown="mouseDownPTZControl(2);" onmouseup="mouseUpPTZControl();" />
                <input type="button" class="btn" value="右下" onmousedown="mouseDownPTZControl(8);" onmouseup="mouseUpPTZControl();" />-->
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="3" border="0" class="left">
              <tr>
                <td class="tt">云台速度</td>
                <td>
                  <select :disabled="!isConsole" id="ptzspeed" class="sel">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option selected>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                </select>
                </td>
              </tr>
              <tr>
                <td class="tt">预置点号</td>
                <td>
                  <input :disabled="!isConsole" id="preset" type="text" class="txt" value="1" />
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-button :disabled="!isConsole" size="mini" @click="clickSetPreset">设置</el-button>
                  <el-button :disabled="!isConsole" size="mini" @click="clickGoPreset">调用</el-button>
                  <!--<input type="button" class="btn" value="设置" onclick="clickSetPreset();" />
                <input type="button" class="btn" value="调用" onclick="clickGoPreset();" />-->
                </td>
              </tr>
            </table>
            <table cellpadding="0" cellspacing="3" border="0" class="left">
              <tr>
                <td class="tt">
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="PTZZoomIn" @mouseup.native="PTZZoomStop">变倍+</el-button>
                  <!--<input type="button" class="btn2" value="变倍+" onmousedown="PTZZoomIn()" onmouseup="PTZZoomStop()">-->
                </td>
                <td>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="PTZZoomout" @mouseup.native="PTZZoomStop">变倍-</el-button>
                  <!--<input type="button" class="btn2" value="变倍-" onmousedown="PTZZoomout()" onmouseup="PTZZoomStop()">-->
                </td>
              </tr>
              <tr>
                <td class="tt">
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="PTZFocusIn" @mouseup.native="PTZFoucusStop">变焦+</el-button>
                  <!--<input type="button" class="btn2" value="变焦+" onmousedown="PTZFocusIn()" onmouseup="PTZFoucusStop()">-->
                </td>
                <td>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="PTZFoucusOut" @mouseup.native="PTZFoucusStop">变焦-</el-button>
                  <!--<input type="button" class="btn2" value="变焦-" onmousedown="PTZFoucusOut()" onmouseup="PTZFoucusStop()">-->
                </td>
              </tr>
              <tr>
                <td class="tt">
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="PTZIrisIn" @mouseup.native="PTZIrisStop">光圈+</el-button>
                  <!--<input type="button" class="btn2" value="光圈+" onmousedown="PTZIrisIn()" onmouseup="PTZIrisStop()">-->
                </td>
                <td>
                  <el-button :disabled="!isConsole" size="mini" @mousedown.native="PTZIrisOut" @mouseup.native="PTZIrisStop">光圈-</el-button>
                  <!--<input type="button" class="btn2" value="光圈-" onmousedown="PTZIrisOut()" onmouseup="PTZIrisStop()">-->
                </td>
              </tr>
            </table>
          </fieldset>
          <fieldset class="operate" style="width:inherit;">
            <legend>操作信息</legend>
            <div ref="opinfo" class="opinfo" style="height: 50px; "></div>
          </fieldset>
          <!--<fieldset class="callback">-->
          <!--<legend>事件回调信息</legend>-->
          <!--<div ref="cbinfo" class="cbinfo"></div>-->
          <!--</fieldset>-->
        </div>
      </div>
      <div style="clear:both; "></div>
    </div>

  </div>
</template>

<script>
  /*当前组件必要引入*/
  //import $ from 'jquery'
  //当前组件引入全局的util
  let Util = null;
  import api from './api'
  // 全局保存当前选中窗口
  let g_iWndIndex = 0; //可以不用设置这个变量，有窗口参数的接口中，不用传值，开发包会默认使用当前选
  export default {
    props: ["ip", "port", "loginName", "password", "isShowRight", "count", "width", "height", 'getData', 'liveList', 'courseId'],
    data() {
      return {
        camera: '',
        g_bPTZAuto: false,
        showRight: this.isShowRight,
        id: '',
        params: {
          id: '0',
          courseId: this.courseId,
          planId: this.getData.id,
          ip: '',
          loginName: '', //设备账号
          password: '', //设备密码
        },
        temParams: {},
        cameraIp: '',
        liveType: 'stopLive',
        stopLiveMessTitle: { //终止直播
          ajaxSuccess: 'stopLiveSuccess',
          ajaxParams: {
            url: api.stopLive.path,
            method: api.stopLive.method,
            data: {
              id: '0',
              courseId: this.courseId,
              planId: '',
              ip: '',
              loginName: '', //设备账号
              password: '', //设备密码
            }
          }
        },

        pauseLiveMessTitle: { //终止直播
          ajaxSuccess: 'pauseLiveSuccess',
          ajaxParams: {
            url: api.pauseLive.path,
            method: api.pauseLive.method,
            data: {
              courseId: this.courseId,
              planId: '',
              ip: '',
              loginName: '', //设备账号
              password: '', //设备密码
            }
          }
        },
        isConsole: true,

        startLiveMessTitle: { //终止直播
          ajaxSuccess: 'startLiveSuccess',
          ajaxParams: {
            url: api.startLive.path,
            method: api.startLive.method,
            data: {
              courseId: this.courseId,
              planId: '',
              ip: '',
              loginName: '', //设备账号
              password: '', //设备密码
            }
          }
        },


      }
    },
    watch: {
      liveList(val) {
        if (val != 0) {
          this.cameraIp = val[0].ip;
          this.params = Object.assign(this.params, val[0]);

        }

      },
    },
    methods: {
      //初始化请求列表数据
      init() {
        if (this.liveList != 0) {
          this.cameraIp = this.liveList[0].ip;
          this.params = Object.assign(this.params, this.liveList[0]);
          this.isConsole = this.params.isConsole;
          this.$nextTick(function () {
            this.initVideo("divPlugin", this.width, this.height);
            setTimeout(() => {
              this.clickLogin(this.params.ip, this.params.port, this.params.loginName, this.params.password);
            }, 1);
          })
        }
        //      this.$nextTick(function(){
        //          this.initVideo("divPlugin",this.width,this.height);
        //          setTimeout(()=>{
        //            this.clickLogin(this.ip,this.port,this.loginName,this.password)
        //          },1);
        //      })
      },

      //切换直播
      videoChange(val) {

        for (let i = 0; i < this.liveList.length; i++) {
          if (this.liveList[i].ip == val) {
            this.params = Object.assign(this.params, this.liveList[i]);
          }
          this.isConsole = this.temParams.isConsole;
        }
        this.initVideo("divPlugin", this.width, this.height);
        this.$nextTick(function () {
          setTimeout(() => {
            this.clickLogin(this.params.ip, this.params.port, this.params.loginName, this.params.password);
          }, 1);
        })
      },


      //点击开始直播
      startLive() {
        if (this.liveList != 0) {
          this.startLiveMessTitle.ajaxParams.data = this.params;
          this.ajax(this.startLiveMessTitle);
          this.$nextTick(function () {
            this.initVideo("divPlugin", this.width, this.height);
            setTimeout(() => {
              this.clickLogin(this.params.ip, this.params.port, this.params.loginName, this.params.password);
            }, 1);
          })
        } else {
          this.showMess('当前房间没有摄像头');
        }

      },


      //点击暂停直播
      pauseLive() {
        this.pauseLiveMessTitle.ajaxParams.data = this.params;
        this.ajax(this.pauseLiveMessTitle)
      },


      //点击结束直播
      stopLive() {
        this.stopLiveMessTitle.ajaxParams.data = this.params;
        this.ajax(this.stopLiveMessTitle)
      },


      //开始成功
      startLiveSuccess(res) {
        let data = res.data;
        this.params.id = data;
        this.liveType = 'startLive';
        //      this.$nextTick(function(){
        //        this.initVideo("divPlugin",this.width,this.height);
        //        setTimeout(()=>{
        //          this.clickLogin(this.params.ip,this.params.port,this.params.loginName,this.params.password);
        //        },1);
        //      })
      },


      //终止成功
      stopLiveSuccess(res) {
        let data = res.data;
        this.liveType = 'stopLive'
      },


      //暂停成功
      pauseLiveSuccess(res) {
        let data = res.data;
        this.liveType = 'pauseLive';
      },

      clickStartRealPlay(szIP, val) {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
          //szIP = $("#loginip").val(),
          //$("#streamtype").val()
          iStreamType = parseInt("1", 10),
          //parseInt($("#channels").val(), 10)
          iChannelID = parseInt("1", 10), //通道
          bZeroChannel = false,
          szInfo = "";
        let iWndIndex = 0; //播放窗口 默认0
        if ("" == szIP) {
          return;
        }
        if (oWndInfo != null) { // 已经在播放了，先停止
          WebVideoCtrl.I_Stop();
        }

        let iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
          iStreamType: iStreamType,
          iChannelID: iChannelID,
          iWndIndex: iWndIndex,
          bZeroChannel: bZeroChannel
        });

        if (0 == iRet) {
          szInfo = "开始预览成功！";
          //        if(val){
          //          this.params = this.temParams;
          //          this.startLiveMessTitle.ajaxParams.data  = this.params;
          //          this.ajax(this.startLiveMessTitle);
          //        }
        } else {
          szInfo = "开始预览失败！";
        }

        this.showOPInfo(szIP + " " + szInfo);
      },


      //登录
      clickLogin(szIP, szPort, szUsername, szPassword, val) {
        let WebVideoCtrl = this.webVideoCtrl;
        let that = this;
        if ("" == szIP || "" == szPort) {
          return;
        }
        let iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {

          success: function (xmlDoc) {
            that.showOPInfo(szIP + " 登录成功！");
            that.clickStartRealPlay(szIP, val);
          },
          error: function () {
            that.showOPInfo(szIP + " 登录失败！");
          }
        });

        if (-1 == iRet) {
          this.showOPInfo(szIP + " 已登录过！");
          this.clickStartRealPlay(szIP);
        }
      },

      // PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
      mouseDownPTZControl(iPTZIndex) {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
          //$("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
          bZeroChannel = false,
          //iPTZSpeed = 4,
          iPTZSpeed = $("#ptzspeed").val(),
          bStop = false;

        if (bZeroChannel) { // 零通道不支持云台
          return;
        }

        if (oWndInfo != null) {
          if (9 == iPTZIndex && this.g_bPTZAuto) {
            iPTZSpeed = 0; // 自动开启后，速度置为0可以关闭自动
            bStop = true;
          } else {
            this.g_bPTZAuto = false; // 点击其他方向，自动肯定会被关闭
            bStop = false;
          }

          WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
            iPTZSpeed: iPTZSpeed,
            success: (xmlDoc) => {
              if (9 == iPTZIndex) {
                this.g_bPTZAuto = !this.g_bPTZAuto;
              }
              this.showOPInfo(oWndInfo.szIP + " 开启云台成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + " 开启云台失败！");
            }
          });
        }
      },

      mouseUpPTZControl() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(1, true, {
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 停止云台成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + " 停止云台失败！");
            }
          });
        }
      },
      // 设置预置点
      clickSetPreset() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
          //iPresetID = parseInt(1, 10);
          iPresetID = parseInt($("#preset").val(), 10);

        if (oWndInfo != null) {
          WebVideoCtrl.I_SetPreset(iPresetID, {
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 设置预置点成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + " 设置预置点失败！");
            }
          });
        }
      },

      // 调用预置点
      clickGoPreset() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
          //iPresetID = parseInt(1, 10);
          iPresetID = parseInt($("#preset").val(), 10);

        if (oWndInfo != null) {
          WebVideoCtrl.I_GoPreset(iPresetID, {
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 调用预置点成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + " 调用预置点失败！");
            }
          });
        }
      },

      PTZZoomIn() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(10, false, {
            iWndIndex: g_iWndIndex,
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 调焦+成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + "  调焦+失败！");
            }
          });
        }
      },

      PTZZoomout() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(11, false, {
            iWndIndex: g_iWndIndex,
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 调焦-成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + "  调焦-失败！");
            }
          });
        }
      },

      PTZZoomStop() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(11, true, {
            iWndIndex: g_iWndIndex,
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 调焦停止成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + "  调焦停止失败！");
            }
          });
        }
      },

      PTZFocusIn() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(12, false, {
            iWndIndex: g_iWndIndex,
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 聚焦+成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + "  聚焦+失败！");
            }
          });
        }
      },

      PTZFoucusOut() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(13, false, {
            iWndIndex: g_iWndIndex,
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 聚焦-成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + "  聚焦-失败！");
            }
          });
        }
      },

      PTZFoucusStop() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(12, true, {
            iWndIndex: g_iWndIndex,
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 聚焦停止成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + "  聚焦停止失败！");
            }
          });
        }
      },

      PTZIrisIn() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(14, false, {
            iWndIndex: g_iWndIndex,
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 光圈+成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + "  光圈+失败！");
            }
          });
        }
      },

      PTZIrisOut() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(15, false, {
            iWndIndex: g_iWndIndex,
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 光圈-成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + "  光圈-失败！");
            }
          });
        }
      },

      PTZIrisStop() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

        if (oWndInfo != null) {
          WebVideoCtrl.I_PTZControl(14, true, {
            iWndIndex: g_iWndIndex,
            success: (xmlDoc) => {
              this.showOPInfo(oWndInfo.szIP + " 光圈停止成功！");
            },
            error: () => {
              this.showOPInfo(oWndInfo.szIP + "  光圈停止失败！");
            }
          });
        }
      },


      //显示操作信息
      showOPInfo(szInfo) {
        szInfo = "<div>" + this.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
        this.$refs.opinfo.innerHTML += szInfo;
      },
      showCBInfo(szInfo) {
        szInfo = "<div>" + this.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
        this.$refs.cbinfo.innerHTML += szInfo;
      },

      dateFormat(oDate, fmt) {
        let o = {
          "M+": oDate.getMonth() + 1, //月份
          "d+": oDate.getDate(), //日
          "h+": oDate.getHours(), //小时
          "m+": oDate.getMinutes(), //分
          "s+": oDate.getSeconds(), //秒
          "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
          "S": oDate.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          }
        }
        return fmt;
      },

      //初始化展示视频
      initVideo(divId, w, d) {
        let WebVideoCtrl = this.webVideoCtrl;
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin(w, d, {
          iWndowType: 2,
          cbSelWnd: (xmlDoc) => {
            g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
            let szInfo = "当前选择的窗口编号：" + g_iWndIndex;
            this.showCBInfo(szInfo);
          }
        });


        WebVideoCtrl.I_InsertOBJECTPlugin(divId);
        // 窗口分割数
        this.changeWndNum(1);

        // 检查插件是否最新
        if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
          this.showMess("检测到新的插件版本，双击开发包目录里的WebComponents.exe升级！");
          return;
        }

        // 窗口事件绑定
        /*$(window).bind({
          resize: function () {
            var $Restart = $("#restartDiv");
            if ($Restart.length > 0) {
              var oSize = getWindowSize();
              $Restart.css({
                width: oSize.width + "px",
                height: oSize.height + "px"
              });
            }
          }
        });*/

        //初始化日期时间
        /*var szCurTime = dateFormat(new Date(), "yyyy-MM-dd");
        $("#starttime").val(szCurTime + " 00:00:00");
        $("#endtime").val(szCurTime + " 23:59:59");*/
      },
      changeWndNum(iType) {
        iType = parseInt(iType, 10);
        WebVideoCtrl.I_ChangeWndNum(iType);
      },
      clickLogout(szIP) {
        let WebVideoCtrl = this.webVideoCtrl;
        szIP = szIP,
          //szIP = szIP?szIP:$("#ip").val(),
          szInfo = "";

        if (szIP == "") {
          return;
        }

        let iRet = WebVideoCtrl.I_Logout(szIP);
        //	if (0 == iRet) {
        //		szInfo = "退出成功！";
        //
        //		$("#ip option[value='" + szIP + "']").remove();
        //		getChannelInfo();
        //	} else {
        //		szInfo = "退出失败！";
        //	}
        //	showOPInfo(szIP + " " + szInfo);
      },

      clickStopRealPlay() {
        let WebVideoCtrl = this.webVideoCtrl;
        let oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
          szInfo = "";

        if (oWndInfo != null) {
          let iRet = WebVideoCtrl.I_Stop();
          //		if (0 == iRet) {
          //			szInfo = "停止预览成功！";
          //		} else {
          //			szInfo = "停止预览失败！";
          //		}
          //showOPInfo(oWndInfo.szIP + " " + szInfo);
        }
      },
    },
    beforeDestroy() {
      this.stopLive();
      //this.clickStopRealPlay();
      //this.clickLogout(this.ip);
    },
    computed: {
      webVideoCtrl() {
        return WebVideoCtrl;
      }
    },
    created() {
      this.init();
    },
    mounted() {},
    components: {}
  }

</script>
<style lang="scss">
  @import'/static/video/hikvision/demo.css';
  @import'../../../../../assets/ambuf/css/manage_v1.0/editForm';

</style>
