<template>
  <!-- 问答题 -->
  <div>
    <el-row>
      <el-form label-width="10px">
        <el-col v-for="(item,index) in anList" :key="index">
          <el-form-item :label="(index+1) + '.'">
            <el-col :span="15">
              <el-form label-width="80px" :inline="true">
                <el-form-item label="关键字：">
                  <el-input v-model="item.tag" class="anContentInput"></el-input>
                </el-form-item>
                <el-form-item label="得分比：">
                  <el-input v-model="item.weight" class="anContentInput"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8">
              <el-button type="danger" @click="del(index)" :disabled="anList.length < 2">删除</el-button>
              <el-button type="success" @click="adds" v-if="(index === anList.length-1) && anList.length < 6">添加</el-button>
            </el-col>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <p align="center" class="modelSaveBtn">
      <el-button @click="save" type="info">确定</el-button>
    </p>
  </div>
</template>

<script>
  export default {
    props: ['operailityData', 'rowData'],
    data() {
      return {
        anList: [],
      }
    },
    methods: {
      // 保存
      save() {
        this.$emit('save', this.anList)
      },
      // 删除
      del(index) {
        this.anList.splice(index, 1)
      },
      // 添加
      adds() {
        this.anList.push({ //问答题，该项不能为空
          "tag": "", //得分关键词
          "weight": "" //得分权重、比重
        })
      }
    },
    created() {
      if (this.operailityData && this.operailityData.length) {
        this.anList = this.operailityData
      } else {
        this.adds()
      }
    }
  }

</script>

<style>


</style>
