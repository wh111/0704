<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styles">
    <colgroup>
      <col v-for="(column, index) in columns[0]" :width="setCellWidth(column, index, true, columns[0].length)" :key="index">
    </colgroup>
    <thead>
      <tr v-for="(item, trIndex) in columns" :key="trIndex">
        <th v-for="(column, index) in item" :title="renderHeader(column, index)" :class="alignCls(column)" :key="index">
          <div :class="cellClasses(column)" style="overflow:hidden;white-space: nowrap;height:26px;">
            <template v-if="column.type === 'selection'">
              <Checkbox :value="isSelectAll" @on-change="selectAll"></Checkbox>
            </template>
            <template v-else>
              <span v-html="renderHeader(column, index)"></span>
              <span :class="[prefixCls + '-sort']" v-if="column.sortable">
                                <i class="ivu-icon ivu-icon-arrow-up-b" :class="{on: column._sortType === 'asc'}" @click="handleSort(index, 'asc')"></i>
                                <i class="ivu-icon ivu-icon-arrow-down-b" :class="{on: column._sortType === 'desc'}" @click="handleSort(index, 'desc')"></i>
                            </span>
              <Poptip v-if="isPopperShow(column)" v-model="column._filterVisible" placement="bottom" @on-popper-hide="handleFilterHide(index)">
                <span :class="[prefixCls + '-filter']">
                                    <i class="ivu-icon ivu-icon-funnel" :class="{on: column._isFiltered}"></i>
                                </span>
                <div slot="content" :class="[prefixCls + '-filter-list']" v-if="column._filterMultiple">
                  <div :class="[prefixCls + '-filter-list-item']">
                    <checkbox-group v-model="column._filterChecked">
                      <checkbox v-for="item in column.filters" :key="item" :label="item.value">{{ item.label }}</checkbox>
                    </checkbox-group>
                  </div>
                  <div :class="[prefixCls + '-filter-footer']">
                    <i-button type="text" size="small" :disabled="!column._filterChecked.length" @click.native="handleFilter(index)">{{ t('i.table.confirmFilter') }}</i-button>
                    <i-button type="text" size="small" @click.native="handleReset(index)">{{ t('i.table.resetFilter') }}</i-button>
                  </div>
                </div>
                <div slot="content" :class="[prefixCls + '-filter-list']" v-else>
                  <ul :class="[prefixCls + '-filter-list-single']">
                    <li :class="itemAllClasses(column)" @click="handleReset(index)">{{ t('i.table.clearFilter') }}</li>
                    <li :class="itemClasses(column, item)" v-for="item in column.filters" @click="handleSelect(index, item.value)">{{ item.label }}</li>
                  </ul>
                </div>
              </Poptip>
            </template>
          </div>
        </th>
      </tr>
    </thead>
  </table>
</template>
<script>
  import CheckboxGroup from 'iview/src/components/checkbox/checkbox-group.vue';
  import Checkbox from 'iview/src/components/checkbox/checkbox.vue';
  import Poptip from 'iview/src/components/poptip/poptip.vue';
  import iButton from 'iview/src/components/button/button.vue';
  import Mixin from 'iview/src/components/table/mixin';
  import Locale from 'iview/src/mixins/locale';

  export default {
    name: 'TableHead',
    mixins: [Mixin, Locale],
    components: {
      CheckboxGroup,
      Checkbox,
      Poptip,
      iButton
    },
    props: {
      prefixCls: String,
      styleObject: Object,
      columns: Array,
      objData: Object,
      data: Array, // rebuildData
      columnsWidth: Object,
      fixed: {
        type: [Boolean, String],
        default: false
      }
    },
    computed: {
      styles() {
        const style = Object.assign({}, this.styleObject);
        const width = this.$parent.bodyHeight === 0 ? parseInt(this.styleObject.width) : parseInt(this.styleObject.width);
        //+this.$parent.scrollBarWidth;
        style.width = `${width}px`;
        return style;
      },
      isSelectAll() {
        let isSelectAll = true;
        if (!this.data.length) isSelectAll = false;
        for (let i = 0; i < this.data.length; i++) {
          if (!this.objData[this.data[i]._index]._isChecked && !this.objData[this.data[i]._index]._isDisabled) {
            isSelectAll = false;
            break;
          }
        }

        return isSelectAll;
      }
    },
    methods: {
      cellClasses(column) {
        return [
          `${this.prefixCls}-cell`,
          {
            [`${this.prefixCls}-hidden`]: !this.fixed && column.fixed && (column.fixed === 'left' || column.fixed ===
              'right')
          }
        ];
      },
      setCellWidth(column, index, top, colsLen) {
        let width = '';
        if (column.width) {
          width = column.width;
        } else if (this.columnsWidth[column._index]) {
          width = this.columnsWidth[column._index].width;
        }
        width = parseInt(width)
        // when browser has scrollBar,set a width to resolve scroll position bug
        if (this.columns.length === index + 1 && top && this.$parent.bodyHeight !== 0) {
          width += this.$parent.scrollBarWidth;

        }
        // when fixed type,reset first right fixed column's width
        if (this.fixed === 'right') {
          const firstFixedIndex = this.columns.findIndex((col) => col.fixed === 'right');
          if (firstFixedIndex === index) width += this.$parent.scrollBarWidth;
        }
        width = 150;
        let d = 0;
        if (width * colsLen > this.$parent.tableWidth) {
          d = 17
        }
        // console.log(this.$parent.tableWidth)
        if (index == (colsLen - 1)) {
          width += d;
        }
        return width;
      },
      itemClasses(column, item) {
        return [
          `${this.prefixCls}-filter-select-item`,
          {
            [`${this.prefixCls}-filter-select-item-selected`]: column._filterChecked[0] === item.value
          }
        ];
      },
      itemAllClasses(column) {
        return [
          `${this.prefixCls}-filter-select-item`,
          {
            [`${this.prefixCls}-filter-select-item-selected`]: !column._filterChecked.length
          }
        ];
      },
      renderHeader(column, $index) {
        for (let i = 0; i < this.columns.length; i++) {
          if ('renderHeader' in this.columns[i][$index]) {
            return this.columns[i][$index].renderHeader(column, $index);
          } else {
            return column.title || '#';
          }
        }

      },
      selectAll() {
        const status = !this.isSelectAll;
        this.$parent.selectAll(status);
      },
      handleSort(index, type) {
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i][index]._sortType === type) {
            type = 'normal';
          }
          this.$parent.handleSort(index, type);
        }
      },
      handleFilter(index) {
        this.$parent.handleFilter(index);
      },
      handleSelect(index, value) {
        this.$parent.handleFilterSelect(index, value);
      },
      handleReset(index) {
        this.$parent.handleFilterReset(index);
      },
      handleFilterHide(index) {
        this.$parent.handleFilterHide(index);
      }
    }
  };

</script>
