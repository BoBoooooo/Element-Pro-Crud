<!--
 * @file: 布局组件
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2021-03-28 19:21:19
-->
<template>
  <div v-if="element && element.key && element.type == 'grid'" class="widget-grid-container data-grid" :key="element.key" style="position: relative">
    <el-row
      class="widget-col widget-view"
      type="flex"
      :class="{ active: selectWidget && selectWidget.key == element.key }"
      :gutter="element.options.gutter ? element.options.gutter : 0"
      :justify="element.options.justify"
      :align="element.options.align"
      @click.native.stop="handleSelectWidget(index)"
    >
      <el-col v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">
        <Draggable
          v-model="col.list"
          v-bind="{
            group: 'people',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.drag-widget',
          }"
          :no-transition-on-drag="true"
          @add="handleWidgetColAdd($event, element, colIndex)"
        >
          <transition-group name="fade" tag="div" class="widget-col-list">
            <template v-for="(el, i) in col.list">
              <WidgetLayout v-if="el.type.includes('grid') || el.type.includes('tabs')" :element="el" :select.sync="selectWidget" :index="i" :data="col" :key="el.key"></WidgetLayout>
              <WidgetFormItem v-else :element="el" :select.sync="selectWidget" :index="i" :data="col" :key="el.key"></WidgetFormItem>
            </template>
          </transition-group>
        </Draggable>
      </el-col>
      <div class="widget-view-action widget-col-action" v-if="selectWidget && selectWidget.key == element.key">
        <!-- 栅格布局自动加减 -->
        <template v-if="element.type === 'grid'">
          <i class="el-icon el-icon-circle-plus" title="添加列" @click.stop="handleGridAdd(element)"></i>
          <i class="el-icon el-icon-document-copy" title="复制" @click.stop="handleGridClone(index)"></i>
        </template>
        <i class="el-icon el-icon-delete-solid" title="删除" @click.stop="handleWidgetDelete(index)"></i>
      </div>

      <div class="drag-widget widget-view-drag widget-col-drag" v-if="selectWidget && selectWidget.key == element.key">
        <i class="el-icon el-icon-rank"></i>
      </div>
    </el-row>
  </div>
  <div
    v-else-if="element.type === 'grid-table'"
    class="data-grid widget-grid-table-container widget-col widget-view"
    :key="element && element.key"
    :class="{ active: selectWidget && selectWidget.key == element.key }"
    @click="handleSelectWidget(index)"
  >
    <table
      class="widget-grid-table"
      :style="{
        'border-width': element.options.borderWidth.toString() + 'px',
        borderColor: element.options.borderColor,
      }"
    >
      <tr v-for="(row, rowIndex) in element.rows" :key="rowIndex">
        <td
          v-for="(col, colIndex) in row.columns"
          :key="colIndex"
          :colspan="col.options.colspan || 1"
          @click.stop="handleSelectTdWidget(col)"
          :rowspan="col.options.rowspan || 1"
          valign="middle"
          :style="{
            width: col.options.width,
            height: col.options.height,
          }"
          align="left"
          :class="{ active: selectWidget && selectWidget.key == col.key }"
          class="widget-grid-table__td"
        >
          <Draggable
            v-model="col.list"
            v-bind="{
              group: 'people',
              ghostClass: 'ghost',
              animation: 200,
              handle: '.drag-widget',
            }"
            :no-transition-on-drag="true"
            @add="handleWidgetTdAdd($event, col)"
          >
            <transition-group name="fade" tag="div" class="widget-col-list">
              <template v-for="(el, i) in col.list">
                <WidgetLayout v-if="el.type.includes('grid') || el.type.includes('tabs')" :element="el" :select.sync="selectWidget" :index="i" :data="col" :key="el.key"></WidgetLayout>
                <WidgetFormItem v-else :element="el" :select.sync="selectWidget" :index="i" :data="col" :key="el.key"></WidgetFormItem>
              </template>
            </transition-group>
          </Draggable>
          <!-- td设置 -->
          <div class="widget-td-setting" v-if="selectWidget && selectWidget.key == col.key">
            <el-dropdown size="mini" trigger="click" @command="handleTdSettingCommand($event, element, row, rowIndex, col, colIndex)">
              <span class="el-dropdown-link">
                <i class="el-icon-setting el-icon--right" title="详细设置"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="left-col">左插入列</el-dropdown-item>
                <el-dropdown-item command="right-col">右插入列</el-dropdown-item>
                <el-dropdown-item command="top-row">上插入行</el-dropdown-item>
                <el-dropdown-item command="bottom-row">下插入行</el-dropdown-item>
                <el-divider class="widget-td-setting-divider"></el-divider>
                <el-dropdown-item command="merge-right" :disabled="!row.columns[colIndex + 1] || col.options.rowspan > 1">向右合并</el-dropdown-item>
                <el-dropdown-item command="merge-bottom" :disabled="rowIndex + col.options.rowspan >= element.rows.length || col.options.colspan > 1">向下合并</el-dropdown-item>
                <el-divider class="widget-td-setting-divider"></el-divider>
                <el-dropdown-item command="split-row" :disabled="col.options.rowspan === 1">拆分为行</el-dropdown-item>
                <el-dropdown-item command="split-col" :disabled="col.options.colspan === 1">拆分为列</el-dropdown-item>
                <el-divider class="widget-td-setting-divider"></el-divider>
                <el-dropdown-item command="remove-col" :disabled="col.options.colspan > 1">删除当前列</el-dropdown-item>
                <el-dropdown-item command="remove-row" :disabled="row.columns.length !== element.options.sumColSpan || col.options.rowspan > 1">删除当前行</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </td>
      </tr>
    </table>

    <div class="widget-view-action widget-col-action" v-if="selectWidget && selectWidget.key == element.key">
      <!-- 栅格布局自动加减 -->
      <template v-if="element.type === 'grid-table'">
        <i class="el-icon el-icon-document-add" title="添加列" @click.stop="handleColAdd(element)"></i>
        <i class="el-icon el-icon-folder-add" title="添加行" @click.stop="handleRowAdd(element)"></i>
        <i class="el-icon el-icon-document-copy" title="复制" @click.stop="handleTableClone(index)"></i>
      </template>
      <i class="el-icon el-icon-delete-solid" title="删除" @click.stop="handleWidgetDelete(index)"></i>
    </div>
    <div class="drag-widget widget-view-drag widget-col-drag" v-if="selectWidget && selectWidget.key == element.key">
      <i class="el-icon el-icon-rank"></i>
    </div>
  </div>
  <div v-else-if="element.type === 'tabs'">
    <WidgetTabs v-if="element && element.key" :key="element.key" :element="element" :select.sync="selectWidget" :index="index" :data="data" @click.native.stop="handleSelectWidget(index)"></WidgetTabs>
  </div>
</template>

<script>
import { defineComponent, ref, toRef, toRefs, watch, nextTick, watchEffect } from '@vue/composition-api';
import Draggable from 'vuedraggable';
import WidgetFormItem from './WidgetFormItem.vue';
import WidgetTabs from './components/Tabs/WidgetTabs.vue';

export default defineComponent({
  name: 'WidgetLayout',
  emits: ['update:select'],
  components: {
    Draggable,
    WidgetFormItem,
    WidgetTabs,
  },
  props: {
    select: {
      type: Object,
      default: () => ({}),
    },
    element: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: null,
    },
  },
  setup(props, { root, emit }) {
    const { $message } = root;

    const selectWidget = ref({});

    const handleSelectWidget = (index) => {
      // console.log(`子项被点击`, index, props.data.list[index]);
      selectWidget.value = props.data.list[index];
    };

    const handleGridAdd = (grid) => {
      grid.columns.push({
        span: 24,
        list: [],
        key: `${grid}_${Math.ceil(Math.random() * 99999)}`,
      });
    };
    const handleGridClone = (index) => {
      const grid = JSON.parse(JSON.stringify(props.data.list[index]));
      for (const col of grid.columns) {
        for (const row of col.list) {
          row.key = `${row.type}_${Math.ceil(Math.random() * 99999)}`;
          row.model = row.key;
        }
      }
      const cloneData = {
        ...grid,
        key: `grid_${Math.ceil(Math.random() * 99999)}`,
      };
      props.data.list.splice(index + 1, 0, cloneData);
      nextTick(() => {
        selectWidget.value = props.data.list[index + 1];
      });
    };

    const handleWidgetColAdd = ($event, row, colIndex) => {
      const { newIndex, oldIndex, item } = $event;

      // hack方法此处需要改为动态赋值
      selectWidget.value = row.columns[colIndex].list[newIndex];
      return null;
    };

    //  add----
    // 处理TD设置
    const handleTdSettingCommand = (command, table, row, rowIndex, col, colIndex) => {
      switch (command) {
        case 'left-col':
          handleColAdd(table, row, rowIndex, col, colIndex, 'left');
          break;
        case 'right-col':
          handleColAdd(table, row, rowIndex, col, colIndex, 'right');
          break;
        case 'top-row':
          handleRowAdd(table, row, rowIndex, 'top');
          break;
        case 'bottom-row':
          handleRowAdd(table, row, rowIndex, 'bottom');
          break;
        case 'merge-right':
          handleTdSpanMerge(table, row, rowIndex, col, colIndex, 'right');
          break;
        case 'merge-bottom':
          handleTdSpanMerge(table, row, rowIndex, col, colIndex, 'bottom');
          break;
        case 'split-col':
          handleTdSplitToCol(table, row, rowIndex, col, colIndex);
          break;
        case 'split-row':
          handleTdSplitToRow(table, row, rowIndex, col, colIndex);
          break;
        case 'remove-col':
          handleTdRemove(table, row, rowIndex, col, colIndex, 'col');
          break;
        case 'remove-row':
          handleTdRemove(table, row, rowIndex, col, colIndex, 'row');
          break;
        // eslint-disable-next-line no-unused-expressions
        default:
          $message('暂无此功能');
          break;
      }
    };
    const generateNewTd = () => {
      const key = `td_${Math.ceil(Math.random() * 99999)}`;
      return {
        type: 'td',
        options: {
          colspan: 1,
          rowspan: 1,
          align: 'left',
          valign: 'middle',
          width: '',
          height: '',
        },
        list: [],
        key,
        model: key,
      };
    };
    const handleTdSplitToRow = (table, row, rowIndex, col, colIndex) => {
      const { rowspan } = col.options;
      const rows = table.rows.slice(rowIndex + 1, rowIndex + rowspan);
      rows.forEach((_) => {
        const newCol = generateNewTd();
        _.columns.splice(colIndex, 0, newCol);
      });
      col.options.rowspan = 1;
    };
    const handleTdSplitToCol = (table, row, rowIndex, col, colIndex) => {
      const { colspan } = col.options;
      for (let i = 0; i < colspan - 1; i += 1) {
        const newCol = generateNewTd();
        row.columns.splice(colIndex, 0, newCol);
      }
      col.options.colspan = 1;
    };
    // 处理删除当前行/当前列
    const handleTdRemove = (table, row, rowIndex, col, colIndex, direction) => {
      if (direction === 'col') {
        // 1. 找出当前列相对sumColSpan位置
        let relativeIndex;
        // 如果当前行列数跟总列数相等,表名该行所有列没有合并列
        if (row.columns.length === table.options.sumColSpan) {
          relativeIndex = colIndex;
        } else {
          // 判断该列的左侧是否有合并列
          const leftCols = row.columns.slice(0, colIndex);
          // 如果没有默认为当前列index
          if (leftCols.every((_) => _.options.colspan === 1)) {
            relativeIndex = colIndex;
          } else {
            // 如果左侧存在合并列 通过各列colspan求和得到当前列的相对序号
            relativeIndex = leftCols.map((_) => _.options.colspan).reduce((preValue, curValue) => preValue + curValue);
          }
        }
        table.rows.forEach((_) => {
          const lastCol = _.columns[_.columns.length - 1];
          // 判断是否存在相对位置列,存在则直接删除,不存在则直接读取最后一列
          const currentCol = _.columns[relativeIndex] || lastCol;
          if (currentCol) {
            if (currentCol.options.colspan === 1) {
              _.columns.splice(colIndex, 1);
            } else {
              currentCol.options.colspan -= 1;
            }
          }
        });
        table.options.sumColSpan -= 1;
      }

      if (direction === 'row') {
        if (row.columns.find((_) => _.options.rowspan > 1)) {
          // 需要逐列拆分行
          for (let j = 0; j < row.columns.length; j += 1) {
            if (row.columns[j].options.rowspan > 1) {
              handleTdSplitToRow(table, row, rowIndex, row.columns[j], j);
            }
          }
        }
        table.rows.splice(rowIndex, 1);
        table.options.sumRowSpan -= 1;
      }
    };
    // 处理TD合并问题
    const handleTdSpanMerge = (table, row, rowIndex, col, colIndex, direction) => {
      // 当前td向右合并
      if (direction === 'right') {
        const { length } = row.columns;
        const nextColIndex = colIndex + 1;
        if (nextColIndex < length) {
          // 当前td colspsan改为2
          row.columns[nextColIndex].options.colspan += col.options.colspan;
          // 删除右侧元素
          row.columns.splice(colIndex, 1);
        } else {
          $message.error('当前列已是最后一列');
        }
      } else {
        const { length } = table.rows;
        // 注意此处不能直接+1,否则删除的td一直是第二行的,在合并了之后继续向下合并时会有问题
        const nextRowIndex = rowIndex + col.options.rowspan;
        if (nextRowIndex < length) {
          // 当前td rowspan改为2
          // 删除下一行当前列元素
          const removeColumnIndex = table.rows[nextRowIndex].columns.length < table.options.sumColSpan ? 0 : colIndex;
          col.options.rowspan += table.rows[nextRowIndex].columns[removeColumnIndex].options.rowspan;
          table.rows[nextRowIndex].columns.splice(removeColumnIndex, 1);
        } else {
          $message.error('当前行已是最后一行');
        }
      }
    };
    const handleSelectTdWidget = (col) => {
      console.log(`td项被点击:${col.key}`);
      selectWidget.value = col;
    };
    const handleWidgetAdd = (evt) => {
      // console.log('元素被拖到外层handleWidgetAdd，evt:', evt);
      const { newIndex } = evt;
      selectWidget.value = props.data.list[newIndex];
    };
    const handleWidgetTdAdd = ($event, col) => {
      const { newIndex, oldIndex, item } = $event;
      const newItem = col.list[newIndex];
      selectWidget.value = newItem;
      return null;
    };

    const handleWidgetDelete = (index) => {
      if (props.data.list.length - 1 === index) {
        if (index === 0) {
          selectWidget.value = {};
        } else {
          selectWidget.value = props.data.list[index - 1];
        }
      } else {
        selectWidget.value = props.data.list[index + 1];
      }

      nextTick(() => {
        props.data.list.splice(index, 1);
      });
    };
    const handleColAdd = (table, row, rowIndex, col, colIndex = null, direction = 'right') => {
      const { rows } = table;
      rows.forEach((_row, _index) => {
        const { columns } = _row;
        const newCol = generateNewTd();
        // 此处判断是左添加列还是右添加列
        if (direction === 'right') {
          // eslint-disable-next-line no-unused-expressions
          colIndex !== null ? columns.splice(colIndex + 1, 0, newCol) : columns.push(newCol);
        } else {
          // eslint-disable-next-line no-unused-expressions
          colIndex !== null ? columns.splice(colIndex, 0, newCol) : columns.unshift(newCol);
        }
      });
      table.options.sumColSpan += 1;
    };
    const handleRowAdd = (table, row, rowIndex = null, direction = 'bottom') => {
      const _row = {
        columns: [],
      };
      for (let i = 0; i < table.options.sumColSpan; i += 1) {
        const newCol = generateNewTd();
        _row.columns.push(newCol);
      }
      // 此处判断是上方添加行还是下方添加行
      if (direction === 'bottom') {
        // eslint-disable-next-line no-unused-expressions
        rowIndex !== null ? table.rows.splice(rowIndex + 1, 0, _row) : table.rows.push(_row);
      } else {
        // eslint-disable-next-line no-unused-expressions
        rowIndex !== null ? table.rows.splice(rowIndex, 0, _row) : table.rows.unshift(_row);
      }
      table.options.sumRowSpan += 1;
    };
    const handleTableClone = (index) => {
      const table = JSON.parse(JSON.stringify(props.data.list[index]));
      for (const row of table.rows) {
        for (const col of row.columns) {
          col.key = `td_${Math.ceil(Math.random() * 99999)}`;
          for (const item of col.list) {
            item.key = `${item.type}_${Math.ceil(Math.random() * 99999)}`;
            item.model = item.key;
          }
        }
      }
      const cloneData = {
        ...table,
        key: `grid_${Math.ceil(Math.random() * 99999)}`,
      };
      props.data.list.splice(index + 1, 0, cloneData);
      nextTick(() => {
        selectWidget.value = props.data.list[index + 1];
      });
    };

    return {
      selectWidget,
      handleSelectWidget,
      handleGridAdd,
      handleGridClone,
      handleWidgetColAdd,
      handleTdSettingCommand,
      generateNewTd,
      handleTdSplitToRow,
      handleTdSplitToCol,
      handleTdRemove,
      handleTdSpanMerge,
      handleSelectTdWidget,
      handleWidgetAdd,
      handleWidgetTdAdd,
      handleWidgetDelete,
      handleColAdd,
      handleRowAdd,
      handleTableClone,
    };
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val);
      },
      deep: true,
    },
  },
});
</script>
