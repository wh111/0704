<template>
  <div>
    <el-row class="tableMoreInfo">
      <template v-for="item in rowData">
        <div class="tableMoreOneInfo">
          <el-col :span="20">
            <div class="tableMoreInfoTitle">
              <span>买入日期：{{ item.buyDate }}</span>
              <span>买入数量：{{ item.buyNum }}</span>
              <span>单价：{{ item.price | money}}</span>
              <span>存放地点：{{ item.storageLocation }}</span>
            </div>
          </el-col>
          <el-col :span="4" class="buttonListBox">
            <el-button size="small" type="primary" @click="show(item.id)">详情</el-button>
            <el-button size="small" type="warning" @click="edit(item.id)">修改</el-button>
            <el-button size="small" type="danger" @click="remove(item.id)">删除</el-button>
          </el-col>
        </div>
      </template>
    </el-row>
    <!-- 模态框 编辑（edit） -->
    <Modal :mask-closable="false" v-model="editModal" height="200" title="对话框标题" class-name="vertical-center-modal" :width="1100">
      <modal-header slot="header" :content="button.editId"></modal-header>
      <edit v-if="editModal" @cancel="cancel" @edit="subCallback" :operaility-data="operailityData" :id="todoId" :url-params="api.modify"
        :get-url-params="api.get"></edit>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 查看（view） -->
    <Modal :mask-closable="false" v-model="showModal" height="200" title="对话框标题" class-name="vertical-center-modal" :loading="true"
      :width="800">
      <modal-header slot="header" :parent="self" :content="button.showId"></modal-header>
      <show v-if="showModal" @cancel="cancel" :id="todoId" :url-params="api.get"></show>
      <div slot="footer"></div>
    </Modal>
    <!-- 模态框 删除（del） -->
    <Modal close-on-click-modal="false" height="200" v-model="removeModal" title="对话框标题" class-name="vertical-center-modal" :loading="loading"
      :width="500">
      <modal-header slot="header" :content="button.removeId"></modal-header>
      <remove v-if="removeModal" :deleteUrl="api.delete" @remove="subCallback" @cancel="cancel" :operaility-data="operailityData"></remove>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  // 模态框
  import edit from './consumablesManageInfo_edit'; // 增加
  import show from './consumablesManageInfo_view'; // 增加

  import api from './api';

  export default {
    props: {
      rowData: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        api,
        self: this,
        loading: false,
        operailityData: '',
        button: {
          showId: {
            id: 'showId',
            title: '查看耗材信息'
          },
          editId: {
            id: 'editId',
            title: '修改耗材信息'
          },
          removeId: {
            id: 'removeId',
            title: '删除耗材信息'
          }
        },
        todoId: ''
      }
    },
    methods: {
      /*----------- 模态框 -------------*/
      // 增加
      add() {
        this.openModel('add')
      },
      // 编辑
      edit(id) {
        this.todoId = id;
        this.openModel('edit');
      },
      // 查看
      show(id) {
        this.todoId = id;
        this.openModel('show');
      },
      // 取消
      cancel(targer) {
        this[targer + 'Modal'] = false;
      },
      // 删除
      /*--点击--删除--按钮--*/
      remove(id) {
        this.operailityData = [{
          id
        }];
        this.openModel('remove')
      },
      // 增加回调
      subCallback(target, title, updata) {
        this.cancel(target);
        if (title) {
          this.successMess(title);
        }
        if (!updata) {
          this.$emit('edit', '', '', updata);
        }
      },
      /*
       * 打开指定的模态窗体
       * @param options string 当前指定的模态:"add"、"edit"
       * */
      openModel(options) {
        this[options + 'Modal'] = true;
      },
    },
    components: {
      edit,
      show
    }
  }

</script>

<style lang="scss">
  @import '../../../../../assets/ambuf/css/manage_v1.0/tableMoreInfo';
  .tableMoreOneInfo {
    height: 43px;
    &:hover {
      background-color: #eef1f6
    }
    .buttonListBox {
      margin-top: 5px;
    }
  }

</style>
