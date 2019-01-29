<template>
  <!-- 课件 -->
  <el-row class="nFileTable">
    <el-form class="editForm" inline="" ref="item" v-for="(item,index) in planDtoList" :model="item" :rules="rules"
             label-width="100px" :key="index">
      <fieldset class="nPlanItem">
        <legend style="font-size:16px">&nbsp;&nbsp;第{{ indexText(index) }}节：{{ item.content || '未填写' }}&nbsp;&nbsp;
        </legend>
        <el-col>
          <el-form-item label="课前资料：">
            <template v-if="!isReadOnly">
              <el-button type="info" size="small" @click="uploadFile('before',index)">上传资料</el-button>
              <el-button type="primary" size="small" @click="selectFile('before',index)">选择资源</el-button>
            </template>
          </el-form-item>
        </el-col>
        <el-table ref="singleTable" :data="item.wareDtoListTemp.before">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column property="title" label="操作" width="120" align="center">
            <template scope="scope">
              <el-button type="warning" size="mini" @click="showFile(scope.row)">预览</el-button>
              <el-button v-if="!isReadOnly" type="danger" size="mini" @click="removeFile('before',index,scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column property="title" label="显示名称">
            <template scope="scope">
              <el-input v-model="scope.row.title" :readonly="isReadOnly"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="fileName" label="文件名称" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.fileName || '-' }}
            </template>
          </el-table-column>
          <el-table-column property="fileType" label="文件格式" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.fileType || '-' }}
            </template>
          </el-table-column>
          <el-table-column property="fileSize" label="文件大小" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.fileSize | formatSize }}
            </template>
          </el-table-column>
          <!-- <el-table-column property="title" label="转化状态">
          </el-table-column> -->
        </el-table>
        <el-col>
          <el-form-item label="课中资料：">
            <template v-if="!isReadOnly">
              <el-button type="info" size="small" @click="uploadFile('in_progress',index)">上传资料</el-button>
              <el-button type="primary" size="small" @click="selectFile('in_progress',index)">选择资源</el-button>
            </template>
          </el-form-item>
        </el-col>
        <el-table ref="singleTable" :data="item.wareDtoListTemp.in_progress">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column property="title" label="操作" width="120" align="center">
            <template scope="scope">
              <el-button type="warning" size="mini" @click="showFile(scope.row)">预览</el-button>
              <el-button v-if="!isReadOnly" type="danger" size="mini"
                         @click="removeFile('in_progress',index,scope.$index)">删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column property="title" label="显示名称">
            <template scope="scope">
              <el-input v-model="scope.row.title" :readonly="isReadOnly"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="fileName" label="文件名称" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.fileName || '-' }}
            </template>
          </el-table-column>
          <el-table-column property="fileType" label="文件格式" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.fileType || '-' }}
            </template>
          </el-table-column>
          <el-table-column property="fileSize" label="文件大小" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.fileSize | formatSize }}
            </template>
          </el-table-column>
          <!-- <el-table-column property="title" label="转化状态" >
          </el-table-column> -->
        </el-table>
        <el-col>
          <el-form-item label="课后资料：">
            <template v-if="!isReadOnly">
              <el-button type="info" size="small" @click="uploadFile('after',index)">上传资料</el-button>
              <el-button type="primary" size="small" @click="selectFile('after',index)">选择资源</el-button>
            </template>
          </el-form-item>
        </el-col>
        <el-table ref="singleTable" :data="item.wareDtoListTemp.after">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column property="title" label="操作" width="120" align="center">
            <template scope="scope">
              <el-button type="warning" size="mini" @click="showFile(scope.row)">预览</el-button>
              <el-button v-if="!isReadOnly" type="danger" size="mini" @click="removeFile('after',index,scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
          <el-table-column property="title" label="显示名称">
            <template scope="scope">
              <el-input v-model="scope.row.title" :readonly="isReadOnly"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="fileName" label="文件名称" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.fileName || '-' }}
            </template>
          </el-table-column>
          <el-table-column property="fileType" label="文件格式" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.fileType || '-' }}
            </template>
          </el-table-column>
          <el-table-column property="fileSize" label="文件大小" show-overflow-tooltip>
            <template scope="scope">
              {{ scope.row.fileSize | formatSize }}
            </template>
          </el-table-column>
          <!-- <el-table-column property="title" label="转化状态">
          </el-table-column> -->
        </el-table>
      </fieldset>
    </el-form>
    <!-- 上传课件 -->
    <Modal :mask-closable="false" v-model="uploadModal" class-name="vertical-center-modal" :width="500">
      <modal-header slot="header" :content="uploadId"></modal-header>
      <courseware-upload v-if="uploadModal" @cancel="cancel" @upload="uploadFileCall" :operaility-data="operailityData"
                         :accept="'doc|docx|xls|xlsx|ppt|pptx|pdf|mp4'"></courseware-upload>
      <div slot="footer"></div>
    </Modal>
    <!-- 选择课件 -->
    <Modal :mask-closable="false" v-model="selectModal" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="selectId"></modal-header>
      <courseware-select v-if="selectModal" @cancel="cancel" @select="selectFileCall"
                         :operaility-data="operailityData"></courseware-select>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看弹窗 -->
    <Modal :mask-closable="false" v-model="showModal" height="200" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="showId"></modal-header>
      <video-view v-if="resourceType === 'video'" :filePath="viewData.filePath" :videoType="viewData.videoType"
                  style="height:600px"></video-view>
      <pdf-view v-if="resourceType === 'pdf'" :pdfSrc="viewData.pdfSrc"></pdf-view>
      <atlas-view v-if="resourceType === 'atlas'" :operaility-data="viewData"></atlas-view>
      <div slot="footer"></div>
    </Modal>
  </el-row>
</template>

<script>
  // import {
  //   plan as rules
  // } from '../rules';
  import coursewareUpload from './courseware_upload';
  import coursewareSelect from './courseware_select';

  // 预览
  import videoView from '../../../../common/video'; // 视频
  import pdfView from '../../../../study/common/view_pdf'; // pdf
  import atlasView from '../../../teacherResManagement/resMedicalAtlas/resMedicalAtlas_view'; // 图谱

  export default {
    props: ['readOnly'],
    data() {
      return {
        rules: {}, // 验证输入规则
        operailityData: '',
        uploadModal: false,
        selectModal: false,
        isReadOnly: false, // 只读
        planDtoList: [],
        uploadId: {
          id: 'uploadId',
          title: '上传课件'
        },
        selectId: {
          id: 'selectId',
          title: '选择资源'
        },
        showId: {
          id: 'showId',
          title: '课件预览'
        },

        viewData: {},
        resourceType: '', // 查看资源类型
        playerType: ['video', 'pdf', 'atlas'], // 预览类型
        playerRules: [ // 文件后缀对应的预览类型
          ["mp4", "ogg", "webm"],
          ['pdf'],
        ],
      }
    },
    methods: {
      // 初始化
      init() {
        this.isReadOnly = this.readOnly !== undefined;
        this.planDtoList = this.$store.state.curriculum.data.planDtoList;
      },
      /******************************************** 按钮事件 ***************************************/
      // 上传
      uploadFile(type, planIndex) {
        this.openModel('upload');
        this.operailityData = {
          type,
          planIndex
        };
      },
      // 上传回调
      uploadFileCall(uploadDataArr) {
        console.log(uploadDataArr)
        uploadDataArr.map(item => {
          item = item.id;
          //上传视频  视频：传递  VIDEO 非视频：传递 LITERATURE
          let resourceType = 'LITERATURE'
          if (['mp4', 'webm', 'ogg'].includes(item.type.toLocaleLowerCase())) {
            resourceType = 'VIDEO';
          }

          let fileObj = {
            title: item.oldName, // 课件显示名称
            fileId: item.id, // 文件ID
            fileName: item.oldName, //文件名称
            filePath: item.pdfPath || item.path || '', //文件名称
            fileType: item.type, //文件类型
            fileSize: item.size, //文件大小
            resourceId: item.id, // 资源主键id
            resourceType: resourceType, // 资源类型
            type: this.operailityData.type, // 类型
          };
          this.addFile(fileObj);
        })
        this.cancel('upload')
      },
      // 选择
      selectFile(type, planIndex) {
        this.openModel('select');
        this.operailityData = {
          type,
          planIndex
        };
      },
      // 选择资源回调
      selectFileCall(selectArr) {
        selectArr.map(item => this.addFile(item));
        this.cancel('select')
      },
      // 添加课件
      addFile(fileObj) {
        console.log(fileObj)
        this.$store.commit('curriculum/data/addWareDto', {
          type: this.operailityData.type,
          planIndex: this.operailityData.planIndex,
          list: [{
            title: fileObj.title, // 课件显示名称
            fileId: fileObj.fileId, // 文件ID
            fileName: fileObj.fileName, //文件名称
            filePath: fileObj.filePath, //文件路径
            fileType: fileObj.fileType, //文件类型
            fileSize: fileObj.fileSize, //文件大小
            resourceId: fileObj.resourceId, // 资源主键id
            resourceType: fileObj.resourceType, // 资源类型
            type: this.operailityData.type.toUpperCase(), // 类型
          }]
        })
      },
      // 预览
      showFile(row) {
        let fileType = '';
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
            this.$notify({
              title: '提示',
              message: '该文件不支持预览',
              type: 'warning'
            });
          } else { // 根据类型进行预览数据初始化
            switch (this.resourceType) {
              case "video":
                this.viewData = {
                  filePath: this.getPath(row.filePath),
                  videoType: fileType
                };
                break;
              case "pdf":
                this.viewData = {
                  pdfSrc: this.getPath(row.filePath)
                };
                break;
              default:
                this.viewData = {}
            }
            this.openModel('show');
          }
        } else if (row.resourceType === 'ATLAS') { // 是否是医学图谱
          this.resourceType = 'atlas';
          this.viewData = {
            id: row.resourceId
          };
          this.openModel('show');
        } else {
          this.$notify({
            title: '提示',
            message: '该文件不支持预览',
            type: 'warning'
          });
        }
      },
      /**
       * 删除
       * type 资料类型 课前|课中|课后
       * planIndex 第几节课索引
       * delIndex 需要删除的文件索引
       */
      removeFile(type, planIndex, delIndex) {
        this.$store.commit('curriculum/data/removeWareDtoList', {
          type,
          planIndex,
          delIndex
        })
      },
      // 获取路径
      getPath(staticUrl) {
        return staticUrl ? (this.$store.state.envPath.http + staticUrl) : staticUrl;
      },
      /****************************************** 弹窗相关 ********************************************/
      /*
       * 监听子组件通讯的方法
       * 作用:根据不同的参数关闭对应的模态
       * @param targer string example:"add"、"edit"
       * */
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },

      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
      /******************************************** 数据提交 ***************************************/
      // 保存
      saveToStore() {
        if (!this.checkData()) {
          return false;
        }
        this.$store.commit('curriculum/data/updatePlanDto', this.planDtoList);
        return true
      },
      // 检测数据完整性
      checkData() {
        // let flag = true;
        // if (this.$refs.item) {
        //   for (let i = 0; i < this.$refs.item.length; i++) {
        //     this.$refs.item[i].validate((valid) => {
        //       if (!valid) {
        //         flag = false;
        //       }
        //     });
        //   }
        // }
        let data = this.planDtoList;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          // 课前
//          for(let c = 0; c < data[i].wareDtoListTemp.before.length; c++){
//            if (!data[i].wareDtoListTemp.before[b].title) {
//              console.log(b);
//              this.errorMess(`第${this.indexText(i)}节课的课前第${(+b+1)}个资料未填写显示名称`)
//              return false
//            }
//          }
          for (let b = 0; b < data[i].wareDtoListTemp.before.length; b++) {
            if (data[i].wareDtoListTemp.before[b].title == '') {
              this.errorMess(`第${this.indexText(i)}节课的课前第${(+b + 1)}个资料未填写显示名称`)
              return false
            }
          }
          // 课中
          for (let p = 0; p < data[i].wareDtoListTemp.in_progress.length; p++) {
            if (data[i].wareDtoListTemp.in_progress[p].title == '') {
              this.errorMess(`第${this.indexText(i)}节课的课中第${(+p + 1)}个资料未填写显示名称`)
              return false
            }
          }
          // 课后
          for (let a = 0; a < data[i].wareDtoListTemp.after.length; a++) {
            if (data[i].wareDtoListTemp.after[a].title == '') {
              this.errorMess(`第${this.indexText(i)}节课的课后第${(+a + 1)}个资料未填写显示名称`)
              return false
            }
          }
        }
        // return flag;
        return true;
      },

      // 索引数字转换
      indexText(index) {
        index += 1;
        let text = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        let str = [];
        let bit = index % 10; // 个位
        let ten = (index - bit) / 10; // 十位
        ten > 1 && (str[0] = text[ten - 1]);
        index > 9 && (str[1] = text[9]);
        str[2] = (text[bit - 1]) || '';
        return str.join('')
      },
    },
    components: {
      coursewareUpload,
      coursewareSelect,

      videoView,
      pdfView,
      atlasView,
    },
    watch: {
      showModal(val) {
        if (!val) {
          this.resourceType = ''
        }
      }
    },
    created() {
      this.init()
    },
  }

</script>

<style lang="scss">
  /* 课件 */

  .nFileTable {
    // padding-left: 16px;
    .el-form-item {
      margin: 4px 0;
    }
  }

</style>
