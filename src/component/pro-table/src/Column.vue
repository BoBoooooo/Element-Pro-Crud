<!--
 * @file: 表格列单独封装,便于支持多级表头配置
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2021-03-19 16:50:00
-->

<template>
  <el-table-column
    :column-key="column.columnKey"
    :prop="column.prop"
    :label="column.label"
    :width="column.minWidth ? '-' : column.width || 140"
    :min-width="column.minWidth || column.width || 140"
    :fixed="column.fixed"
    :render-header="column.renderHeader"
    :sortable="column.sortable == 'false' ? false : column.sortable"
    :sort-by="column.sortBy"
    :sort-method="column.method"
    :resizable="column.resizable"
    :formatter="column.formatter"
    :show-overflow-tooltip="column.showOverflowTooltip"
    :align="column.align"
    :header-align="column.headerAlign || column.align"
    :class-name="column.className"
    :label-class-name="column.labelClassName"
    :selectable="column.selectable"
    :reserve-selection="column.reserveSelection"
    :filters="column.filters"
    :filter-placement="column.filterPlacement"
    :filter-multiple="column.filterMultiple"
    :filter-method="column.filterMethod"
    :filtered-value="column.filteredValue"
  >
    <!-- 操作列表头插槽 -->
    <template slot="header" slot-scope="scope">
      <slot v-if="$scopedSlots[`${column.prop}_header`]" :name="`${column.prop}_header`" :column="scope.column"></slot>
      <span v-else>
        {{ column.label }}
      </span>
    </template>
    <!-- 插槽情况 -->
    <template slot-scope="scope">
      <!-- 自定义插槽 -->
      <span v-if="column.slotName">
        <slot :name="column.slotName" :row="scope.row" :prop="column.prop" :$index="scope.$index" />
      </span>
      <span v-else>
        {{ scope.row[column.prop] }}
      </span>
    </template>
    <!-- 列递归,便于支持多级表头 -->、
    <template v-if="column.children && column.children.length > 0">
      <Column :key="columnIndex" :column="column" v-for="(column, columnIndex) in column.children">
        <!-- 表格插槽 -->
        <template :slot="slotName" slot-scope="scope" v-for="slotName in Object.keys($scopedSlots)">
          <slot :name="slotName" :column="scope.column" :row="scope.row" :prop="scope.prop"></slot>
        </template>
      </Column>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { columnConfig } from '@/types/common';

export default defineComponent({
  name: 'Column',
  props: {
    column: {
      type: Object as PropType<columnConfig>,
      default: () => ({}),
      required: true,
    },
  },
});
</script>

<style></style>
