<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div style="width: 100%;height: 100%" class="diplomaView">
    <layout @contentData="getContentData" v-if="canView" :edit="false" :showRuler="false">
      <template slot="diploma">
        <div class="diplomaBg" @click.self="selectDiploma('config')" :style="getStyle(diploma.config.style)">
          <!-- 结业证书 -->
          <div class="diplomaTitle diplomaTodoItem"
               :style="getStyle(diploma.title.style)">{{ diploma.title.text }}
          </div>

          <!-- 左侧照片框 -->
          <div class="diplomaPhotoBox diplomaTodoItem"
               :style="getStyle(diploma.photoBox.style)">
            <div class="diplomaPhotoItem">
              <div class="diplomaTodoItem"
                   :style="getStyle(diploma.photoInfo.style)"
                   @click.stop.prevent="selectDiploma('photoInfo')">
                {{ diploma.photoInfo.text }}
              </div>
            </div>
            <div class="diplomaPhotoItem">
              <div class="diplomaTodoItem"
                   :style="getStyle(diploma.photoStamp.style)"
                   @click.stop.prevent="selectDiploma('photoStamp')">
                {{ diploma.photoStamp.text }}
              </div>
            </div>
          </div>

          <!-- 右侧证书内容 -->
          <div class="diplomaContent diplomaTodoItem"
               :style="getStyle(diploma.content.style)" v-html="diplomaReader('content',diploma.content.text)">
          </div>

          <!-- 左侧底部证书内容（教学信息） -->
          <div class="diplomaEduInfo diplomaTodoItem"
               :style="getStyle(diploma.eduInfo.style)" v-html="diplomaReader('eduInfo',diploma.eduInfo.text)">
          </div>

          <!-- 左侧底部证书内容（有效性） -->
          <div class="diplomaTodoItem"
               :style="getStyle(diploma.validity.style)">{{ diploma.validity.text }}
          </div>

          <!-- 右侧底部证书内容（教育部名称） -->
          <div class="diplomaTodoItem"
               :style="getStyle(diploma.edu.style)">{{ diploma.edu.text }}
          </div>

          <!-- 右侧底部证书内容（日期信息） -->
          <div class="diplomaPrintDate diplomaTodoItem"
               :style="getStyle(diploma.printDate.style)" v-html="diplomaReader('printDate',diploma.printDate.text)">
          </div>
        </div>
      </template>
    </layout>
  </div>
</template>
<style lang="scss">
  @import "../../../../assets/ambuf/css/manage_v1.0/editForm";

  $selectBorderColor: darkolivegreen; // 过节元素边框颜色

  .diplomaView {
    .diplomaTitle {
      display: inline-block;
    }

    .diplomaNoEditTips {
      text-align: center;
      margin-top: 20px;
    }

    .diplomaTodoItem {
      cursor: pointer;
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: absolute;
    }

    .diplomaMoveItem.active {
      border: 1px dashed $selectBorderColor;
      .diplomaTodoItem {
        cursor: move;
      }
    }

    .diplomaMoveItem.select {
      border: 1px dashed $selectBorderColor;
    }

    .diplomaEditItem {
      margin-bottom: 20px;
      & ~ .diplomaBtnBox {
        margin-top: 0;
      }
    }

    .diplomaEditTitle {
      vertical-align: middle;
      font-size: 14px;
      color: #48576a;
      line-height: 1;
      padding: 11px 12px 11px 0;
      box-sizing: border-box;
    }

    div.diplomaSelectColor {
      display: block;
      .el-color-picker__trigger {
        display: block;
      }
      .el-color-picker__color {
        display: block;
        width: 100%;
        cursor: pointer;
        border: none;
      }
      .el-color-picker__icon {
        display: none;
      }
    }

    .diplomaPhotoBox {
      display: flex;
      padding: 10px 0;
    }

    .diplomaPhotoItem {
      flex: 1;
      .diplomaTodoItem {
        width: 20px;
        margin: 0 auto;
        position: relative;
      }
    }

    .diplomaContent {
      text-indent: 2em;
      span {
        display: inline;
        margin: 0 10px;
        line-height: inherit;
        font-weight: bold;
      }
    }

    .diplomaContentTags {
      .el-tag {
        margin-right: 10px;
        margin-top: 6px;
        cursor: pointer;
      }
    }

    .diplomaEduInfo {
      span {
        display: inline;
        margin: 0 10px;
        line-height: inherit;
        font-weight: bold;
        &:empty {
          width: 70px;
          display: inline-block;
        }
      }
    }

    .diplomaPrintDate {
      span {
        display: inline;
        margin: 0 10px;
        line-height: inherit;
        &:empty {
          width: 30px;
          display: inline-block;
        }
      }
    }

    .ebsDiploma {
      border: none;
    }

    .diplomaBg {
      width: 100%;
      height: 100%;
    }

    .diplomaBtnBox {
      margin-top: 20px;
    }
  }
</style>
<script>
  import api from './api';
  /*当前组件必要引入*/
  import layout from './components/layout.vue'; // 布局

  // 证书配置
  import {diploma, toggleStyle, fontFamilyOptions, borderStyleOptions, tagConfig} from './diploma';
  //当前组件引入全局的util
  let Util = null;
  let regs = {};
  export default {
    props: ['operailityData'],
    data() {
      return {
        configId: '',
        canView: false,
        resetModal: false,
        resetId: {
          id: "resetId",
          title: "恢复默认"
        },
        ruler: 1, // 比例
        selectType: '', // 当前选择的项
        fontFamilyOptions,
        borderStyleOptions,
        diploma: {},
        toggleStyle,
        readerData: { // 动态获取的数据
          content: {
            userName: "",
            subject: "",
            startYear: "",
            startMonth: "",
            endYear: "",
            endMonth: "",
          },
          eduInfo: {
            eduName: "",
            eduNumber: "",
          },
          printDate: {
            year: "",
            month: "",
            day: ""
          }
        },
      }
    },
    methods: {
      //初始化请求列表数据
      init() {
        this.getDiplomaConfig()
      },
      // 从服务器获取配置数据
      getDiplomaConfig() {
        let opt = {
          ajaxSuccess: res => {
            this.configId = res.data.configId;
            if (res.data.configValue) {
              this.diploma = JSON.parse(res.data.configValue);
            } else {
              this.getInitData();
            }
            if (this.operailityData) {
              this.getStudentInfo()
            }
          },
          ajaxError: () => this.errorMess('获取证书配置数据失败，请重试!'),
          ajaxParams: {
            url: api.getDiplomaConfig.path,
            method: api.getDiplomaConfig.method
          }
        };
        this.ajax(opt)
      },
      // 获取学生信息
      getStudentInfo() {
        let opt = {
          ajaxSuccess: res => {
            let startTime = res.data.checkInTime.split('-');
            startTime = this.getDateNextMonth(startTime[0], +startTime[1] + 1); // 报到时间的下一个月开始
            let endTime = this.getDateNextMonth(startTime.y, startTime.m, res.data.studyTime == 'HALF_YEAR' ? 6 : 12);
            this.readerData.content.userName = res.data.userName;
            this.readerData.content.subject = res.data.courseNames;
            this.readerData.content.startYear = startTime.y;
            this.readerData.content.startMonth = startTime.m;
            this.readerData.content.endYear = endTime.y;
            this.readerData.content.endMonth = endTime.m;
            this.canView = true;
          },
          ajaxError: () => this.errorMess('获取用户数据失败'),
          ajaxParams: {
            url: api.getStudentInfo.path + this.operailityData.userId,
            method: api.getStudentInfo.method,
            params: {
              type: "user"
            }
          }
        };
        this.ajax(opt)
      },
      // 计算日期
      getDateNextMonth(year, month, num = 1) {
        let y = +year;
        let m = +month;
        if (m + num > 12) {
          y += 1;
          m = (m + num) - 12;
        }
        return {y, m}
      },
      /********************************* 计算属性 *****************************/
      // 获取配置数据
      getInitData(key) {
        let o = this.$util._.defaultsDeep({}, diploma);
        let hospitalName = this.$store.state.envPath.hospitalName;
        o.validity.text = `（未经${hospitalName}验证无效）`;
        o.edu.text = `${hospitalName}教育处`;

        if (key) {
          this.diploma[key] = o[key];
        } else {
          this.diploma = o;
          this.canView = true;
        }

        this.resetModal = false;
      },
      // 渲染初始化数据
      getContentData(obj) {
        this.ruler = obj.rulers.s; // 比例
      },
      // 获取样式
      getStyle(styleObj) {
        let rulerKey = ['fontSize', 'letterSpacing', 'borderWidth', 'x', 'y', 'width', 'height'];
        let mapObj = {x: 'left', y: 'top'};
        let style = {};
        for (let key in styleObj) {
          if (~rulerKey.indexOf(key)) {
            style[mapObj[key] || key] = styleObj[key] + 'px';
          } else {
            style[key] = styleObj[key]
          }
        }
        return style
      },
      // 编辑按钮激活样式
      editBtnStyleType(key, val) {
        return this.diploma[this.selectType].style[key] === (val || this.toggleStyle[key].val) ? 'info' : ''
      },
      // 标签代码替换文本显示
      diplomaReader(type, str) {
        if (!regs[type]) {
          regs[type] = [];
          for (let key in this.diploma[type].placeStr) { // 缓存对应的正则表达式
            regs[type].push({reg: new RegExp(tagConfig.start + key + tagConfig.end, 'g'), key})
          }
        }
        regs[type].map(item => { // 根据正则表达式替换标签代码
          if (this.operailityData) {
            str = str.replace(item.reg, '<span>' + this.readerData[type][item.key] + '</span>')
          } else {
            str = str.replace(item.reg, '<span>' + this.diploma[type].placeStr[item.key].text + '</span>')
          }
        })
        return str
      },
      /******************************* 常规事件 *********************************/
      // 选中
      selectDiploma(type) {
        this.selectType = type;
//        console.log(type)
      },
      // 调整大小
      resizStop(x, y, w, h) {
        this.dragStop(x, y);
        this.diploma[this.selectType].width = w;
        this.diploma[this.selectType].height = h;
//        console.log('设置宽度')
      },
      // 拖动
      dragStop(x, y) {
        this.diploma[this.selectType].x = x;
        this.diploma[this.selectType].y = y;
//        console.log('设置位置')
      },
      /****************************** 编辑事件 **********************************/
      // 样式设置（默认与目标值切换）
      toggleDiplomaStyle(key) {
        if (this.diploma[this.selectType].style[key] === this.toggleStyle[key].val) {
          this.diploma[this.selectType].style[key] = this.toggleStyle[key].def
        } else {
          this.diploma[this.selectType].style[key] = this.toggleStyle[key].val
        }
      },
      // 清除切换样式
      clearToggleStyle() {
        for (let key in this.toggleStyle) {
          if (this.diploma[this.selectType].style[key]) {
            this.diploma[this.selectType].style[key] = this.toggleStyle[key].def
          }
        }
      },
      // 设置文字对齐方式
      setTextAlign(type) {
        this.diploma[this.selectType].style.textAlign = type;
      },
      // 插入内容标签
      addContentTag(tagKey) {
        this.diploma[this.selectType].text += tagConfig.start + tagKey + tagConfig.end;
      },
      // 保存
      save() {
        let configValue = this.$util._.defaultsDeep({}, this.diploma);
        let opt = {
          ajaxSuccess: () => this.successMess('保存成功'),
          ajaxError: () => this.errorMess('保存失败'),
          ajaxParams: {
            url: api.saveDiplomaConfig.path + this.configId,
            method: api.saveDiplomaConfig.method,
            data: {
              configValue: JSON.stringify(configValue),
              remark: "进修生结业证书"
            }
          }
        };
        this.ajax(opt)
      },
      // 恢复默认
      reset(open = false) {
        this.resetModal = open;
      },
    },
    created() {
      this.init();
    },
    mounted() {
    },
    components: {
      layout,
    }
  }

</script>
