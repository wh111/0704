<!--
****--@name     ${*}
****--@role     ${*}
****--@date     2017/9/6
****--@author   yc
-->
<template>
  <div style="width: 100%;height: 100%">
    <layout @contentData="getContentData">
      <template slot="diploma" v-if="canView">
        <div class="diplomaBg" @click.self="selectDiploma('config')" :style="getStyle(diploma.config.style)">
          <!--<div class="diplomaBg" @click.self="selectDiploma('config')" :style="getStyle(diploma.config.style)">-->
          <!-- 结业证书 -->
          <vue-draggable-resizable class="diplomaMoveItem" :parent="true" :active="false"
                                   :class="{'select': selectType == 'title' }"
                                   :w="diploma.title.style.width" :h="diploma.title.style.height"
                                   :x="diploma.title.style.x" :y="diploma.title.style.y"
                                   @resizestop="resizStop" @dragstop="dragStop"
                                   @mousedown.native="selectDiploma('title')">
            <div class="diplomaTitle diplomaTodoItem"
                 :style="getStyle(diploma.title.style)">{{ diploma.title.text }}
            </div>
          </vue-draggable-resizable>

          <!-- 左侧照片框 -->
          <vue-draggable-resizable class="diplomaMoveItem" :parent="true" :active="false" :resizable="false"
                                   :w="diploma.photoBox.style.width" :h="diploma.photoBox.style.height"
                                   :x="diploma.photoBox.style.x" :y="diploma.photoBox.style.y"
                                   @resizestop="resizStop" @dragstop="dragStop"
                                   @mousedown.native="selectDiploma('photoBox')">
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
          </vue-draggable-resizable>

          <!-- 右侧证书内容 -->
          <vue-draggable-resizable class="diplomaMoveItem" :parent="true" :active="false"
                                   :class="{'select': selectType == 'content' }"
                                   :w="diploma.content.style.width" :h="diploma.content.style.height"
                                   :x="diploma.content.style.x" :y="diploma.content.style.y"
                                   @resizestop="resizStop" @dragstop="dragStop"
                                   @mousedown.native="selectDiploma('content')">
            <div class="diplomaContent diplomaTodoItem"
                 :style="getStyle(diploma.content.style)" v-html="diplomaReader('content',diploma.content.text)">
            </div>
          </vue-draggable-resizable>

          <!-- 左侧底部证书内容（教学信息） -->
          <vue-draggable-resizable class="diplomaMoveItem" :parent="true" :active="false"
                                   :class="{'select': selectType == 'eduInfo' }"
                                   :w="diploma.eduInfo.style.width" :h="diploma.eduInfo.style.height"
                                   :x="diploma.eduInfo.style.x" :y="diploma.eduInfo.style.y"
                                   @resizestop="resizStop" @dragstop="dragStop"
                                   @mousedown.native="selectDiploma('eduInfo')">
            <div class="diplomaEduInfo diplomaTodoItem"
                 :style="getStyle(diploma.eduInfo.style)" v-html="diplomaReader('eduInfo',diploma.eduInfo.text)">
            </div>
          </vue-draggable-resizable>

          <!-- 左侧底部证书内容（有效性） -->
          <vue-draggable-resizable class="diplomaMoveItem" :parent="true" :active="false"
                                   :class="{'select': selectType == 'validity' }"
                                   :w="diploma.validity.style.width" :h="diploma.validity.style.height"
                                   :x="diploma.validity.style.x" :y="diploma.validity.style.y"
                                   @resizestop="resizStop" @dragstop="dragStop"
                                   @mousedown.native="selectDiploma('validity')">
            <div class="diplomaTodoItem"
                 :style="getStyle(diploma.validity.style)">{{ diploma.validity.text }}
            </div>
          </vue-draggable-resizable>

          <!-- 右侧底部证书内容（教育部名称） -->
          <vue-draggable-resizable class="diplomaMoveItem" :parent="true" :active="false"
                                   :class="{'select': selectType == 'edu' }"
                                   :w="diploma.edu.style.width" :h="diploma.edu.style.height"
                                   :x="diploma.edu.style.x" :y="diploma.edu.style.y"
                                   @resizestop="resizStop" @dragstop="dragStop"
                                   @mousedown.native="selectDiploma('edu')">
            <div class="diplomaTodoItem"
                 :style="getStyle(diploma.edu.style)">{{ diploma.edu.text }}
            </div>
          </vue-draggable-resizable>

          <!-- 右侧底部证书内容（日期信息） -->
          <vue-draggable-resizable class="diplomaMoveItem" :parent="true" :active="false"
                                   :class="{'select': selectType == 'printDate' }"
                                   :w="diploma.printDate.style.width" :h="diploma.printDate.style.height"
                                   :x="diploma.printDate.style.x" :y="diploma.printDate.style.y"
                                   @resizestop="resizStop" @dragstop="dragStop"
                                   @mousedown.native="selectDiploma('printDate')">
            <div class="diplomaPrintDate diplomaTodoItem"
                 :style="getStyle(diploma.printDate.style)" v-html="diplomaReader('printDate',diploma.printDate.text)">
            </div>
          </vue-draggable-resizable>
        </div>
      </template>
      <!--<div slot="left"></div>-->
      <template slot="right">
        <el-row class="editForm">
          <template v-if="selectType && selectType!='config'">
            <!-- 有文字才可编辑 -->
            <template v-if="diploma[selectType].text != null">
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">文字：</p>
                <el-select v-model="diploma[selectType].style.fontFamily" placeholder="请选择">
                  <el-option v-for="(name,index) in fontFamilyOptions" :key="index" :label="name"
                             :value="name"></el-option>
                </el-select>
              </el-col>
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">编辑：</p>
                <el-input v-model="diploma[selectType].text" v-if="!diploma[selectType]['placeStr']"></el-input>
                <template v-else>
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 9}"
                            placeholder="请输入内容(点击下方的标签可插入对应的动态内容，也可手动输入标签代码)"
                            v-model="diploma[selectType].text"></el-input>
                  <div class="diplomaContentTags">
                    <span>可使用的标签(点击插入对应的标签)：</span>
                    <el-tag type="success" v-for="(item,key) in diploma[selectType].placeStr" :key="key"
                            @click.native="addContentTag(key)">{{ item.text }}({{ item.title }})
                    </el-tag>
                  </div>
                </template>
              </el-col>
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">大小：{{ diploma[selectType].style.fontSize }}</p>
                <el-slider v-model="diploma[selectType].style.fontSize"></el-slider>
              </el-col>
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">行高：{{ diploma[selectType].style.lineHeight }}</p>
                <el-slider v-model="diploma[selectType].style.lineHeight" :min="1" :max="10" :step="0.05"></el-slider>
              </el-col>
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">间距：{{ diploma[selectType].style.letterSpacing }}</p>
                <el-slider v-model="diploma[selectType].style.letterSpacing"></el-slider>
              </el-col>
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">样式：</p>
                <el-button-group>
                  <el-button :type="editBtnStyleType('fontWeight')" @click="toggleDiplomaStyle('fontWeight')"
                             size="small">加粗
                  </el-button>
                  <el-button :type="editBtnStyleType('fontStyle')" @click="toggleDiplomaStyle('fontStyle')"
                             size="small">
                    斜体
                  </el-button>
                  <el-button :type="editBtnStyleType('textDecoration')" @click="toggleDiplomaStyle('textDecoration')"
                             size="small">下划线
                  </el-button>
                </el-button-group>
                <el-button type="danger" size="small" @click="clearToggleStyle">清除</el-button>
              </el-col>
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">对齐：</p>
                <el-button-group>
                  <el-button :type="editBtnStyleType('textAlign','left')" @click="setTextAlign('left')" size="small">左对齐
                  </el-button>
                  <el-button :type="editBtnStyleType('textAlign','center')" @click="setTextAlign('center')"
                             size="small">
                    居中
                  </el-button>
                  <el-button :type="editBtnStyleType('textAlign','right')" @click="setTextAlign('right')" size="small">
                    右对齐
                  </el-button>
                </el-button-group>
              </el-col>
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">颜色：</p>
                <el-color-picker class="diplomaSelectColor" v-model="diploma[selectType].style.color"
                                 show-alpha></el-color-picker>
              </el-col>
            </template>
            <!-- 有边框属性才可编辑边框样式 -->
            <template v-if="diploma[selectType].style['borderWidth']">
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">边框线条：</p>
                <el-select v-model="diploma[selectType].style.borderStyle" placeholder="请选择">
                  <el-option v-for="(item,index) in borderStyleOptions" :key="index" :label="item.name"
                             :value="item.val"></el-option>
                </el-select>
              </el-col>
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">线条宽度：{{ diploma[selectType].style.borderWidth }}</p>
                <el-slider v-model="diploma[selectType].style.borderWidth" :min="1" :max="10"></el-slider>
              </el-col>
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">线条颜色：</p>
                <el-color-picker class="diplomaSelectColor" v-model="diploma[selectType].style.borderColor"
                                 show-alpha></el-color-picker>
              </el-col>
            </template>
            <!-- 有背景颜色属性才可以设置背景颜色 -->
            <template v-if="diploma[selectType].style['backgroundColor']">
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">背景颜色：</p>
                <el-color-picker class="diplomaSelectColor" v-model="diploma[selectType].style.backgroundColor"
                                 show-alpha></el-color-picker>
              </el-col>
            </template>
            <!-- 有背景图片属性才可以设置背景颜色 -->
            <template v-if="diploma[selectType].style['backgroundImage']">
              <el-col :span="20" :offset="2" class="diplomaEditItem">
                <p class="diplomaEditTitle">背景图片：</p>
                <el-color-picker class="diplomaSelectColor" v-model="diploma[selectType].style.backgroundImage"
                                 show-alpha></el-color-picker>
              </el-col>
            </template>
            <!-- 保存与还原 -->
            <el-col :span="20" :offset="2" class="diplomaEditItem diplomaBtnBox" align="center">
              <el-button type="success" @click="save">保存设置</el-button>
              <el-button type="danger" @click="reset(true)">恢复默认</el-button>
            </el-col>
          </template>
          <div v-else class="diplomaNoEditTips">请选择编辑项</div>
        </el-row>
      </template>
    </layout>
    <!-- 恢复默认 -->
    <Modal :mask-closable="false" v-model="resetModal" height="200" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="resetId"></modal-header>
      <template v-if="resetModal">
        <p class="remove">是否恢复默认数据？</p>
        <div align="center">
          <el-button type="success" @click="getInitData(selectType)">恢复当前编辑项</el-button>
          <el-button type="info" @click="getInitData(false)">恢复全部</el-button>
          <el-button @click="reset(false)">取消</el-button>
        </div>
      </template>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style lang="scss">
  @import "../../../../assets/ambuf/css/manage_v1.0/editForm";

  $selectBorderColor: darkolivegreen; // 过节元素边框颜色
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
    .el-slider__button-wrapper{z-index: 2;}
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
        width: 50px;
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

  .diplomaBg {
    width: 100%;
    height: 100%;
  }

  .diplomaBtnBox {
    margin-top: 20px;
  }
</style>
<script>
  import api from './api';
  /*当前组件必要引入*/
  import layout from './components/layout.vue'; // 布局
  import VueDraggableResizable from 'vue-draggable-resizable';

  // 证书配置
  import {diploma, toggleStyle, fontFamilyOptions, borderStyleOptions, tagConfig} from './diploma';
  //当前组件引入全局的util
  let Util = null;
  let regs = {};
  export default {
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
              this.canView = true;
            } else {
              this.getInitData();
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
      /********************************* 计算属性 *****************************/
      // 获取配置数据
      getInitData(key) {
        let o = this.$util._.defaultsDeep({}, diploma);
        let hospitalName = this.$store.state.envPath.hospitalName;
        let _this = this;
        o.validity.text = `（未经${hospitalName}验证无效）`;
        o.edu.text = `${hospitalName}教育处`;

        if(this.canView){
          this.canView = false;
        }

        if (key) {
          this.diploma[key] = o[key];
        } else {
          this.diploma = o;
        }

        setTimeout(()=>{
          _this.canView = true;
        },10)

        this.resetModal = false;
      },
      // 渲染初始化数据
      getContentData(obj) {
        this.ruler = obj.rulers.s; // 比例
      },
      // 获取样式
      getStyle(styleObj) {
        let rulerKey = ['fontSize', 'letterSpacing', 'borderWidth'];
        let style = {};
        for (let key in styleObj) {
          if (~rulerKey.indexOf(key)) {
            style[key] = styleObj[key] + 'px'
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
          str = str.replace(item.reg, '<span>' + this.diploma[type].placeStr[item.key].text + '</span>')
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
        this.diploma[this.selectType].style.width = w;
        this.diploma[this.selectType].style.height = h;
      },
      // 拖动
      dragStop(x, y) {
        this.diploma[this.selectType].style.x = x;
        this.diploma[this.selectType].style.y = y;
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
              configValue:JSON.stringify(configValue),
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
      VueDraggableResizable,
    }
  }

</script>
