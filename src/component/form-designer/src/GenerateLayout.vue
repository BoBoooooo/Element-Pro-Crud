<!--
 * @file: 布局组件
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2021-03-28 19:21:19
-->
<template>
  <!-- 如果这一行时网格grid布局 -->
  <div v-if="item.type == 'grid'">
    <!-- 每一行元素与基于el-row和el-col生成 -->
    <el-row :key="item.key" type="flex" :gutter="item.options.gutter ? item.options.gutter : 0" :justify="item.options.justify" :align="item.options.align">
      <!-- 生成每一行中的每一列元素 -->
      <el-col
        v-for="(col, colIndex) in item.columns"
        :key="colIndex"
        :span="col.span"
        :style="{
          border: isNoBorder(col, item) ? 'none!important' : '',
        }"
      >
        <!-- 遍历生成该列所有组件 -->
        <template v-for="citem in col.list">
          <!-- 如果一个元素的type是blank就加载插槽 -->
          <el-form-item v-if="citem.type == 'blank'" :label-width="citem.options.hiddenLabel ? '0' : labelWidth(citem)" v-show="!citem.hidden" :prop="citem.model" :key="citem.key">
            <template slot="label">
              <template v-if="!citem.options.hiddenLabel">
                <span>{{ citem.name }}</span>
              </template>
            </template>
            <slot :name="citem.model" :widget="citem" :model="models"></slot>
          </el-form-item>
          <GenerateLayout
            v-if="citem.type.includes('grid') || citem.type.includes('tabs')"
            :item="citem"
            :readOnly="readOnly"
            :models="models"
            :rules="rules"
            :remote="remote"
            :formTableConfig="formTableConfig"
            :data="col"
            :deviceMode="deviceMode"
            :key="citem.key"
          ></GenerateLayout>
          <!-- 正常组件通过GenerateFormItem生成 -->
          <GenerateFormItem
            v-else
            @selection-change="getTableSelection($event, citem)"
            :key="citem.key"
            :models="models"
            :remote="remote"
            :widget="citem"
            :readOnly="readOnly"
            @btnOnClick="btnOnClick"
            @chartOnClick="chartOnClick"
            v-show="!citem.hidden"
            :formTableConfig="formTableConfig"
          >
          </GenerateFormItem>
        </template>
      </el-col>
    </el-row>
  </div>
  <!-- 表格布局 -->
  <div v-else-if="item.type === 'grid-table'">
    <table
      class="grid-table"
      :key="item.key"
      style="width: 100%; border: solid"
      :style="{
        'border-width': item.options.borderWidth.toString() + 'px',
        borderColor: item.options.borderColor,
      }"
    >
      <tr v-for="(row, rowIndex) in item.rows" :key="rowIndex">
        <td
          v-for="(col, colIndex) in row.columns"
          :key="colIndex"
          :colspan="col.options.colspan || 1"
          :rowspan="col.options.rowspan || 1"
          @click.stop="clickTdAutoFocus($event, col)"
          valign="middle"
          align="left"
          class="grid-table-td"
          :style="{
            'border-width': item.options.borderWidth.toString() + 'px',
            borderColor: item.options.borderColor,
            width: col.options.width,
            height: col.options.height,
            display: col.list.every((_) => _.hidden) ? 'none' : '',
          }"
        >
          <GenerateLayout
            v-if="citem.type.includes('grid') || citem.type.includes('tabs')"
            :item="citem"
            :readOnly="readOnly"
            :models="models"
            :rules="rules"
            :remote="remote"
            :formTableConfig="formTableConfig"
            :data="col"
            :deviceMode="deviceMode"
            :key="citem.key"
          ></GenerateLayout>
          <GenerateFormItem
            v-else
            v-for="citem in col.list"
            @selection-change="getTableSelection($event, citem)"
            :key="citem.key"
            :models="models"
            :remote="remote"
            :widget="citem"
            :readOnly="readOnly"
            @btnOnClick="btnOnClick"
            @chartOnClick="chartOnClick"
            v-show="!citem.hidden"
            :formTableConfig="formTableConfig"
          >
          </GenerateFormItem>
        </td>
      </tr>
    </table>
  </div>
  <!-- 普通行布局方式 -->
  <div v-else>
    <GenerateFormItem
      :key="item.key"
      :models="models"
      :remote="remote"
      @selection-change="getTableSelection($event, item)"
      :widget="item"
      :readOnly="readOnly"
      @chartOnClick="chartOnClick"
      @btnOnClick="btnOnClick"
      v-show="!item.hidden"
      :formTableConfig="formTableConfig"
    >
    </GenerateFormItem>
  </div>
</template>

<script>
import { defineComponent, ref, toRef, toRefs, watch, nextTick, watchEffect } from '@vue/composition-api';
import Draggable from 'vuedraggable';
import GenerateFormItem from './GenerateFormItem.vue';

export default defineComponent({
  name: 'GenerateLayout',
  emits: ['table-selections', 'btn-on-click', 'chart-on-click'],
  components: {
    Draggable,
    GenerateFormItem,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    models: {
      type: Object,
      default: () => ({}),
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    remote: {
      type: Object,
      default: () => ({}),
    },
    formTableConfig: {
      type: Object,
      default: () => ({}),
    },
    deviceMode: {
      type: String,
      default: 'pc',
    },
  },
  setup(props, { root, emit }) {
    // const { $message } = root;

    const getTableSelection = ($event, item) => {
      const tableSelections = {};
      tableSelections[item.model] = $event;
      emit('table-selections', tableSelections);
    };

    // 生成的按钮点击
    const btnOnClick = (event) => {
      emit('btn-on-click', {
        event,
        model: models.value,
      });
    };

    // 图表点击
    const chartOnClick = (chart) => {
      emit('chart-on-click', {
        chart,
        model: models.value,
      });
    };
    // 若为表格布局并且当前栅格内只有一个元素并且为隐藏状态,隐藏边框线
    const isNoBorder = (col, item) => {
      const { list } = col;
      return props.data.config && props.data.config.isTableClass && list.every((_) => _.hidden) && item.columns.length === 1;
    };

    return {
      getTableSelection,
      btnOnClick,
      chartOnClick,
      isNoBorder,
    };
  },
});
</script>
