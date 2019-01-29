<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styleObject">
    <colgroup>
      <col v-for="(column, index) in columns[0]" :width="setCellWidth(column, index, false)" :key="index">
    </colgroup>
    <tbody :class="[prefixCls + '-tbody']">
      <tr v-for="(row, index) in data" :key="row" :class="rowClasses(row._index)" @mouseenter.stop="handleMouseIn(row._index)"
        @mouseleave.stop="handleMouseOut(row._index)" @click.stop="clickCurrentRow(row._index)" @dblclick.stop="dblclickCurrentRow(row._index)">

        <td v-if="row[column.key]" :style="{height:row[column.key+'Row']*48+'px'}" :rowspan="row[column.key+'Row']" v-for="(column,tdIndex) in columns[columns.length-1]" :key="tdIndex"
          :class="alignCls(column, row)">
          <Cell :fixed="fixed" :prefix-cls="prefixCls" :row="row" :column="column" :natural-index="index" :index="row._index" :checked="rowChecked(row._index)"
            :disabled="rowDisabled(row._index)"></Cell>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  // todo :key="row"
  import Cell from 'iview/src/components/table/cell.vue';
  import Mixin from 'iview/src/components/table/mixin';

  export default {
    name: 'TableBody',
    mixins: [Mixin],
    components: {
      Cell
    },
    props: {
      prefixCls: String,
      styleObject: Object,
      columns: Array,
      data: Array, // rebuildData
      objData: Object,
      columnsWidth: Object,
      height: Number,
      fixed: {
        type: [Boolean, String],
        default: false
      }
    },
    methods: {
      rowClasses(_index) {
        return [
          `${this.prefixCls}-row`,
          this.rowClsName(_index),
          {
            [`${this.prefixCls}-row-highlight`]: this.objData[_index] && this.objData[_index]._isHighlight,
            [`${this.prefixCls}-row-hover`]: this.objData[_index] && this.objData[_index]._isHover
          }
        ];
      },
      setCellWidth(column, index, top) {
        let width = '';
        if (column.width) {
          width = column.width;
        } else if (this.columnsWidth[column._index]) {
          width = this.columnsWidth[column._index].width;
        }
        // when browser has scrollBar,set a width to resolve scroll position bug
        if (this.columns.length === index + 1 && top && this.$parent.bodyHeight !== 0) {
          width += this.$parent.scrollBarWidth;
        }
        // when fixed type,reset first right fixed column's width
        if (this.fixed === 'right') {
          // const firstFixedIndex = this.columns.findIndex((col) => col.fixed === 'right');
          if (firstFixedIndex === index) width += this.$parent.scrollBarWidth;
        }
        // console.log(width)
        return width;
      },
      rowChecked(_index) {
        return this.objData[_index] && this.objData[_index]._isChecked;
      },
      rowDisabled(_index) {
        return this.objData[_index] && this.objData[_index]._isDisabled;
      },
      rowClsName(_index) {
        return this.$parent.rowClassName(this.objData[_index], _index);
      },
      handleMouseIn(_index) {
        //this.$parent.handleMouseIn(_index);
      },
      handleMouseOut(_index) {
        this.$parent.handleMouseOut(_index);
      },
      clickCurrentRow(_index) {
        this.$parent.clickCurrentRow(_index);
      },
      dblclickCurrentRow(_index) {
        this.$parent.dblclickCurrentRow(_index);
      }
    }
  };

</script>
