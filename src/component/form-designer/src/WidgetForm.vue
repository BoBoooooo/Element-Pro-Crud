<template>
  <div class="widget-form-container"
  :class="{
    'pad': deviceMode === 'pad',
    'mobile': deviceMode ==='mobile'
  }">
    <div v-if="data.list.length == 0" class="form-empty"><SvgIcon icon-class="form_empty" class="form-empty-icon"></SvgIcon> 拖拽 或 点击 添加组件至此处!</div>
    <el-form :label-position="data.config.labelPosition" :label-width="data.config.labelWidth ? data.config.labelWidth + 'px' : '140px'" :size="data.config.size" class="widget-form">
      <Draggable
        class="widget-form"
        v-model="data.list"
        v-bind="{
          group: 'people',
          ghostClass: 'ghost',
          animation: 200,
          handle: '.drag-widget',
        }"
        @add="handleWidgetAdd"
      >
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list">
            <template v-if="element.type == 'grid'">
              <div v-if="element && element.key" class="widget-grid-container data-grid" :key="element.key" style="position: relative;">
                <el-row
                  class="widget-col widget-view"
                  type="flex"
                  :class="{ active: selectWidget && selectWidget.key == element.key }"
                  :gutter="element.options.gutter ? element.options.gutter : 0"
                  :justify="element.options.justify"
                  :align="element.options.align"
                  @click.native="handleSelectWidget(index)"
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
                        <WidgetFormItem v-for="(el, i) in col.list" :key="el.key" :element="el" :select.sync="selectWidget" :index="i" :data="col"></WidgetFormItem>
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
            </template>
            <template v-else-if="element.type === 'tabs'">
              <WidgetTabs
                v-if="element && element.key"
                :key="element.key"
                :element="element"
                :select.sync="selectWidget"
                :index="index"
                :data="data"
                @click.native.stop="handleSelectWidget(index)"
              ></WidgetTabs>
            </template>
            <template v-else-if="element.type === 'grid-table'">
              <div
                class="data-grid widget-grid-table-container widget-col widget-view"
                :key="element && element.key"
                :class="{ active: selectWidget.key == element.key }"
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
                        height: col.options.height
                      }"
                      align="left"
                      :class="{ active: selectWidget.key == col.key }"
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
                          <WidgetFormItem v-for="(el, i) in col.list" :key="el.key" :element="el" :select.sync="selectWidget" :index="i" :data="col"></WidgetFormItem>
                        </transition-group>
                      </Draggable>
                      <!-- td设置 -->
                      <div class="widget-td-setting" v-if="selectWidget.key == col.key">
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
                            <el-dropdown-item command="merge-right" :disabled="!row.columns[colIndex + 1]|| col.options.rowspan > 1">向右合并</el-dropdown-item>
                            <el-dropdown-item command="merge-bottom" :disabled="rowIndex + col.options.rowspan >= element.rows.length || col.options.colspan > 1">向下合并</el-dropdown-item>
                            <el-divider class="widget-td-setting-divider"></el-divider>
                            <el-dropdown-item command="split-row" :disabled="col.options.rowspan === 1">拆分为行</el-dropdown-item>
                            <el-dropdown-item command="split-col" :disabled="col.options.colspan === 1">拆分为列</el-dropdown-item>
                            <el-divider class="widget-td-setting-divider"></el-divider>
                            <el-dropdown-item command="remove-col" :disabled="col.options.colspan>1">删除当前列</el-dropdown-item>
                            <el-dropdown-item command="remove-row" :disabled="row.columns.length !== element.options.sumColSpan ||col.options.rowspan>1">删除当前行</el-dropdown-item>
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
            </template>
            <template v-else>
              <WidgetFormItem v-if="element && element.key" :key="element.key" :element="element" :select.sync="selectWidget" :index="index" :data="data"></WidgetFormItem>
            </template>
          </template>
        </transition-group>
      </Draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import SvgIcon from '@/icons/SvgIcon.vue';
import WidgetFormItem from './WidgetFormItem.vue';
import WidgetTabs from './components/Tabs/WidgetTabs.vue';

export default {
  components: {
    Draggable,
    WidgetFormItem,
    WidgetTabs,
    SvgIcon,
  },
  // 这里的data从父组件接收和设计器实时对应的json
  props: ['data', 'select', 'deviceMode'],
  data() {
    return {
      selectWidget: this.select,
    };
  },
  methods: {
    // 处理TD设置
    handleTdSettingCommand(command, table, row, rowIndex, col, colIndex) {
      switch (command) {
        case 'left-col': this.handleColAdd(table, row, 'left'); break;
        case 'right-col': this.handleColAdd(table, row, 'right'); break;
        case 'top-row': this.handleRowAdd(table, 'top'); break;
        case 'bottom-row': this.handleRowAdd(table, 'bottom'); break;
        case 'merge-right': this.handleTdSpanMerge(table, row, rowIndex, col, colIndex, 'right'); break;
        case 'merge-bottom': this.handleTdSpanMerge(table, row, rowIndex, col, colIndex, 'bottom'); break;
        case 'split-col': this.handleTdSplitToCol(table, row, rowIndex, col, colIndex); break;
        case 'split-row': this.handleTdSplitToRow(table, row, rowIndex, col, colIndex); break;
        case 'remove-col': this.handleTdRemove(table, row, rowIndex, col, colIndex, 'col'); break;
        case 'remove-row': this.handleTdRemove(table, row, rowIndex, col, colIndex, 'row'); break;
        // eslint-disable-next-line no-unused-expressions
        default: () => this.$message('暂无此功能');
          break;
      }
    },
    generateNewTd() {
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
    },
    handleTdSplitToRow(table, row, rowIndex, col, colIndex) {
      const { rowspan } = col.options;
      const rows = table.rows.slice(rowIndex + 1, rowIndex + rowspan);
      rows.forEach((_) => {
        const newCol = this.generateNewTd();
        _.columns.splice(colIndex, 0, newCol);
      });
      col.options.rowspan = 1;
    },
    handleTdSplitToCol(table, row, rowIndex, col, colIndex) {
      const { colspan } = col.options;
      for (let i = 0; i < colspan - 1; i += 1) {
        const newCol = this.generateNewTd();
        row.columns.splice(colIndex, 0, newCol);
      }
      col.options.colspan = 1;
    },
    // 处理删除当前行/当前列
    handleTdRemove(table, row, rowIndex, col, colIndex, direction) {
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
          if (leftCols.every(_ => _.options.colspan === 1)) {
            relativeIndex = colIndex;
          } else {
            // 如果左侧存在合并列 通过各列colspan求和得到当前列的相对序号
            relativeIndex = leftCols.map(_ => _.options.colspan).reduce((preValue, curValue) => preValue + curValue);
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
        if (row.columns.find(_ => _.options.rowspan > 1)) {
          // 需要逐列拆分行
          for (let j = 0; j < row.columns.length; j += 1) {
            if (row.columns[j].options.rowspan > 1) {
              this.handleTdSplitToRow(table, row, rowIndex, row.columns[j], j);
            }
          }
        }
        table.rows.splice(rowIndex, 1);
        table.options.sumRowSpan -= 1;
      }
    },
    // 处理TD合并问题
    handleTdSpanMerge(table, row, rowIndex, col, colIndex, direction) {
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
          this.$message.error('当前列已是最后一列');
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
          this.$message.error('当前行已是最后一行');
        }
      }
    },
    handleSelectWidget(index) {
      console.log(`子项被点击:${index}`);
      this.selectWidget = this.data.list[index];
    },
    handleSelectTdWidget(col) {
      console.log(`td项被点击:${col.key}`);
      this.selectWidget = col;
    },
    handleWidgetAdd(evt) {
      // console.log('元素被拖到外层handleWidgetAdd，evt:', evt);
      const { newIndex } = evt;
      console.log(this.data.list[newIndex]);
      this.selectWidget = this.data.list[newIndex];
    },
    handleWidgetTdAdd($event, col) {
      const { newIndex, oldIndex, item } = $event;
      const newItem = col.list[newIndex];
      // 防止布局元素的嵌套拖拽
      if (['tabs', 'grid', 'grid-table'].includes(newItem.type)) {
        col.list.splice(newIndex, 1);
        this.$message.warning('布局元素暂不支持嵌套');
        return false;
      }

      this.selectWidget = newItem;
      return null;
    },
    handleWidgetColAdd($event, row, colIndex) {
      const { newIndex, oldIndex, item } = $event;
      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        if (item.tagName === 'DIV') {
          this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex]);
        }
        row.columns[colIndex].list.splice(newIndex, 1);
        this.$message.warning('布局元素暂不支持嵌套');
        return false;
      }
      this.selectWidget = row.columns[colIndex].list[newIndex];
      console.log(row.columns[colIndex].list[newIndex]);
      return null;
    },
    handleWidgetDelete(index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = this.data.list[index - 1];
        }
      } else {
        this.selectWidget = this.data.list[index + 1];
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1);
      });
    },
    handleColAdd(table, rowIndex, direction = 'right') {
      const { rows } = table;
      rows.forEach((row) => {
        const { columns } = row;
        const newCol = this.generateNewTd();
        // 此处判断是左添加列还是右添加列
        if (direction === 'right') {
          columns.push(newCol);
        } else {
          columns.unshift(newCol);
        }
      });
      table.options.sumColSpan += 1;
    },
    handleRowAdd(table, direction = 'bottom') {
      const row = {
        columns: [],
      };
      for (let i = 0; i < table.options.sumColSpan; i += 1) {
        const newCol = this.generateNewTd();
        row.columns.push(newCol);
      }
      // 此处判断是上方添加行还是下方添加行
      if (direction === 'bottom') {
        table.rows.push(row);
      } else {
        table.rows.unshift(row);
      }
      table.options.sumRowSpan += 1;
    },
    handleGridAdd(grid) {
      grid.columns.push({
        span: 24,
        list: [],
        key: `${grid}_${Math.ceil(Math.random() * 99999)}`,
      });
    },
    handleGridClone(index) {
      const grid = JSON.parse(JSON.stringify(this.data.list[index]));
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
      this.data.list.splice(index + 1, 0, cloneData);
      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1];
      });
    },
    handleTableClone(index) {
      const table = JSON.parse(JSON.stringify(this.data.list[index]));
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
      this.data.list.splice(index + 1, 0, cloneData);
      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1];
      });
    },
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
};
</script>
