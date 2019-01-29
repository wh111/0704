<template>
  <!-- 选项(单多选) -->
  <div>
    <el-row>
      <el-col v-for="(item,index) in optionsList" :key="index">
        <el-form label-width="30px">
          <el-form-item :label="options[index] + '.'">
            <view-u-editor name="content" @storeUE="storeUE" @getUeditorVal="getUeditorVal" style="width: 630px;display: inline-flex;"
                           :ueditor-val="item" :ueditor-config="ueditorConfig" :valKey="'content_'+index"></view-u-editor>
            <!--<el-input v-model="item.content" class="optionContentInput"></el-input>-->
            <el-button type="danger" @click="del(index)" :disabled="optionsList.length < 2">删除</el-button>
            <el-button type="success" @click="adds" v-if="(index === optionsList.length-1) && optionsList.length < 6">添加</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <p align="center" class="modelSaveBtn">
      <el-button @click="save" type="info">确定</el-button>
    </p>
  </div>
</template>

<script>
  import viewUEditor from '../../../../../common/showUeditor.vue';

  export default {
    props: ['operailityData', 'type'],
    data() {
      return {
        options: ['A', 'B', 'C', 'D', 'E', 'F'],
        optionsList: [],

        //富文本编译器
        UE: {},
        ueditorVal: {
          // content_0: '',
        },
        ueditorConfig: {
          //详细配置参考UEditor 官网api
          initialFrameHeight: 220  //初始化编辑器高度,默认320
        },
      };
    },
    methods: {
      // 保存
      save() {
        this.optionsList.map((item, index) => item.options = this.options[index]);
        console.log(this.optionsList)
        this.$emit('save', this.optionsList);
      },
      // 删除
      del(index) {
        this.optionsList.splice(index, 1);
      },
      // 添加
      adds() {
        this.ueditorVal['content_' + this.optionsList.length] = '';
        this.optionsList.push({
          options: '',
          content: '',
        });
        console.log('add',this.ueditorVal)
      },
      /**
       *
       * 存储编辑器的value值
       * @param name {string}  编辑器的name
       *
       * @param val  {string}  编辑器的内容
       *
       */
      getUeditorVal(name, val) {
        let contentIndex = name.split('_');
        console.log(contentIndex)
        this.optionsList[contentIndex[1]].content = val;
      },

      /**
       *
       * 存储编辑器的UE.editor对象
       * @param name {string}  编辑器的name
       *
       * @param editor {}      编辑器的对象
       *
       */
      storeUE(name, editor) {
        this.UE[name] = editor;
        // editor.setDisabled()
      },
      // 初始化富文本数据
      initUEVal() {
        console.log('初始化')
        this.$util._.sortBy(this.operailityData, 'options').map((item, index) => this.ueditorVal['content_' + index] = item.content);
        console.log(this.ueditorVal)
      },
    },
    created() {
      if (this.operailityData && this.operailityData.length) {
        this.initUEVal();
        this.optionsList = this.$util._.sortBy(this.operailityData, 'options');
      } else {
        this.adds();
      }
    },
    components: {
      viewUEditor,
    },
  };

</script>

<style>
  .optionContentInput {
    width: 280px;
  }

</style>
