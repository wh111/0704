<template>
  <!-- 课件播放 -->
  <div class="coursewarePlayer">
    <!-- 课件选择 -->
    <el-row>
      <el-col>
        <el-select v-model="selectObj.planIndex" placeholder="请选择" @change="getCWData(true)">
          <el-option v-for="(item,index) in planDtoList" :key="item.id" :label="'第'+indexText(index)+'节'"
                     :value="index">
          </el-option>
        </el-select>
        <el-select v-model="selectObj.types" placeholder="请选择" @change="getCWData(true)">
          <el-option v-for="item in theCWTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col v-if="cwSelectList.length">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item,index) in cwSelectList" :key="index" :label="item.title"
                       :name="index+''"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <div class="cmPlayerBox" v-if="cwSelectList.length">
      <video-view v-if="resourceType === 'video' && changePlayer" :filePath="viewData.filePath"
                  :videoType="viewData.videoType" @currentTime="setVideoCurrentTime" @ended="setViewIsEnd"
                  style="height: 100%; overflow: hidden;"></video-view>
      <pdf-view v-if="resourceType === 'pdf' && changePlayer" :pdfSrc="viewData.pdfSrc"></pdf-view>
      <!--<atlas-view v-if="resourceType === 'atlas'" :operaility-data="viewData" style="width: 584px"></atlas-view>-->
      <p v-if="resourceType === 'atlasShow'" class="coursewareViewError">
        <span v-if="showModal">图谱课件预览中...</span>
        <el-button v-else type="text" @click="showModal=true">继续预览</el-button>
      </p>
      <p v-if="resourceType === 'error'" class="coursewareViewError">该课件不支持预览或者该课件数据不完整</p>
    </div>
    <p v-else class="noCoursewareTips">暂无课件</p>
    <!-- 图谱弹窗 -->
    <Modal :mask-closable="false" v-model="showModal" class-name="vertical-center-modal" :width="1040">
      <modal-header slot="header" :content="showId"></modal-header>
      <atlas-view style="height: 600px;" v-if="showModal" :operaility-data="viewData"></atlas-view>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import videoView from '../../../../../common/video';
  import pdfView from '../../../../../study/common/view_pdf'; // pdf
  import atlasView from '../../../../teacherResManagement/resMedicalAtlas/resMedicalAtlas_view'; // 图谱
  export default {
    /**
     * progress 是否上传进度
     */
    props: ['cwData', 'saveProgress'],
    data () {
      return {
        showModal: false,
        showId: {
          id: 'showId',
          title: '查看图谱'
        },
        theCWTypes: [{
          value: 'before',
          label: '课前'
        }, {
          value: 'inProgress',
          label: '课中'
        }, {
          value: 'after',
          label: '课后'
        }],
        activeName: '0', // 课件索引
        planDtoList: [],
        cwSelectList: [],
        selectCWObj: {},
        selectObj: {
          planIndex: 0, // 教学计划索引
          types: 'before' // 上课类型
        },

        // 查看数据
        viewData: {},
        changePlayer: true,
        showResourceType: '', // 当前查看资源类型
        resourceType: '', // 查看资源类型
        playerType: ['video', 'pdf', 'atlas'], // 预览类型
        playerRules: [ // 文件后缀对应的预览类型
          ['mp4', 'ogg', 'webm'], // MP4|FLV|RMVB|RM|AVI
          ['pdf']
        ],
        videoCurrentTime: 0, // 视频播放时间（单位秒）
        viewIsEnd: false, // 是否播放结束
        resourceId: '' // 资源id
      };
    },
    methods: {
      // 初始化
      init () {
        this.planDtoList = this.$store.state.curriculum.look.planDtoList;
        if (this.cwData.types) {
          this.selectObj.planIndex = this.cwData.planIndex;
          this.selectObj.types = this.cwData.types;
          this.activeName = this.cwData.viewIndex.toString();
        }
        this.getCWData();
      },
      // 选择资源
      handleClick () {
        this.changePlayer = false;
        setTimeout(() => this.showFile(this.cwSelectList[this.activeName]), 10);
      },

      // 预览
      showFile (row) {
        let fileType = '';
        if (this.resourceId && this.resourceId != row.resourceId) { // 如果切换课件，那么保存上一个课件的查看进度
          this.saveUserHistory();
        }
        this.showResourceType = row.resourceType || '';
        this.resourceId = row.resourceId || '';
        console.log(row);
        if (row.filePath) { // 根据文件路径的后缀获取预览类型
          this.resourceType = '';
          fileType = row.filePath.split('.').pop();
          fileType = fileType ? fileType.toLocaleLowerCase() : null;
          for (let i in this.playerRules) {
            if (this.playerRules[i].indexOf(fileType) > -1) {
              this.resourceType = this.playerType[i];
              break;
            }
          }
          if (!this.resourceType) { // 检测是否支持预览
            this.resourceType = 'error';
          } else { // 根据类型进行预览数据初始化
            switch (this.resourceType) {
              case 'video':
                this.viewIsEnd = false;
                this.videoCurrentTime = 0;
                this.viewData = {
                  filePath: this.getPath(row.filePath),
                  videoType: fileType
                };
                break;
              case 'pdf':
                this.videoCurrentTime = 1;
                this.viewData = {
                  pdfSrc: this.getPath(row.filePath)
                };
                // 静态资源直接为结束
                this.setViewIsEnd();
                break;
              default:
                this.viewData = {};
            }
          }
        } else if (row.resourceType === 'ATLAS') { // 是否是医学图谱
          // this.resourceType = 'atlas';
          this.videoCurrentTime = 1;
          this.viewData = {
            id: row.resourceId
          };
          // 静态资源直接为结束
          this.setViewIsEnd();
          this.openModel('show');
          this.resourceType = 'atlasShow';
        } else {
          this.resourceType = 'error';
        }
        this.changePlayer = true;
      },
      // 索引数字转换
      indexText (index) {
        index += 1;
        let text = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        let str = [];
        let bit = index % 10; // 个位
        let ten = (index - bit) / 10; // 十位
        ten > 1 && (str[0] = text[ten - 1]);
        index > 9 && (str[1] = text[9]);
        str[2] = (text[bit - 1]) || '';
        return str.join('');
      },
      // 获取课件
      getCWData (init) {
        this.changePlayer = false;
        if (init) {
          this.activeName = '0';
        }
        this.cwSelectList = this.planDtoList[this.selectObj.planIndex].wareDtoList[this.selectObj.types] || [];

        console.log('课件列表：', this.cwSelectList);

        if (this.cwSelectList.length) {
          setTimeout(() => this.showFile(this.cwSelectList[this.activeName]), 10);
        }
      },
      // 获取路径
      getPath (staticUrl) {
        return staticUrl ? (this.$store.state.envPath.http + staticUrl) : staticUrl;
      },
      /**
       * 设置视频播放时间
       */
      setVideoCurrentTime (time) {
        console.log(time);
        this.videoCurrentTime = parseInt(time || 0);
      },
      setViewIsEnd () {
        console.log('资源播放结束');
        this.viewIsEnd = true;
        this.saveUserHistory();
      },
      /**
       * 保存用户附件预览进度
       */
      saveUserHistory () {
        let opt = null;
        if (this.saveProgress) {
          opt = {
            ajaxSuccess: () => {
            },
            ajaxParams: {
              url: '/userHistory/save',
              method: 'post',
              data: {
                resourceId: this.resourceId || '',
                progress: this.videoCurrentTime,
                types: this.showResourceType || '',
                status: this.viewIsEnd ? '1' : '0'
              }
            }
          };
          this.ajax(opt);
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel (options) {
        this[options + 'Modal'] = true;
      }
    },
    components: {
      videoView,
      pdfView,
      atlasView
    },
    created () {
      console.log('3', this.saveProgress);
      this.init();
    },
    beforeDestroy () {
      console.log('销毁了');
      this.saveUserHistory();
      // 如果是查看模式（学生学习时），在组件注销后重新获取数据更新相关进度
      if (this.saveProgress) {
        this.$emit('updateView');
      }
    }
  };

</script>

<style>
  /* 课件播放 */
  .cmPlayerBox {
    height: 420px;
  }

  .noCoursewareTips,
  .coursewareViewError {
    line-height: 300px;
    text-align: center;
  }

</style>
