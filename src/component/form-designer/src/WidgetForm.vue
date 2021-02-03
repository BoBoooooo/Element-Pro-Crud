<template>
  <div class="widget-form-container">
    <div v-if="data.list.length == 0" class="form-empty">
      拖拽左侧组件添加字段!
    </div>
    <el-form
      :label-position="data.config.labelPosition"
      :label-width="
        data.config.labelWidth ? data.config.labelWidth + 'px' : '140px'
      "
      :size="data.config.size"
    >
      <Draggable
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
              <div
                v-if="element && element.key"
                class="widget-grid-container data-grid"
                :key="element.key"
                style="position: relative;"
              >
                <el-row
                  class="widget-col widget-view"
                  type="flex"
                  :class="{ active: selectWidget.key == element.key }"
                  :gutter="element.options.gutter ? element.options.gutter : 0"
                  :justify="element.options.justify"
                  :align="element.options.align"
                  @click.native="handleSelectWidget(index)"
                >
                  <el-col
                    v-for="(col, colIndex) in element.columns"
                    :key="colIndex"
                    :span="col.span ? col.span : 0"
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
                      @add="handleWidgetColAdd($event, element, colIndex)"
                    >
                      <transition-group
                        name="fade"
                        tag="div"
                        class="widget-col-list"
                      >
                        <WidgetFormItem
                          v-for="(el, i) in col.list"
                          :key="el.key"
                          :element="el"
                          :select.sync="selectWidget"
                          :index="i"
                          :data="col"
                        ></WidgetFormItem>
                      </transition-group>
                    </Draggable>
                  </el-col>
                  <div
                    class="widget-view-action widget-col-action"
                    v-if="selectWidget.key == element.key"
                  >
                    <!-- 栅格布局自动加减 -->
                    <template v-if="element.type === 'grid'">
                      <i
                        class="el-icon el-icon-circle-plus"
                        @click.stop="handleGridAdd(element)"
                      ></i>
                      <i class="el-icon el-icon-document-copy" @click.stop="handleGridClone(index)"></i>
                    </template>
                    <i
                      class="el-icon el-icon-delete-solid"
                      @click.stop="handleWidgetDelete(index)"
                    ></i>
                  </div>

                  <div
                    class="drag-widget widget-view-drag widget-col-drag"
                    v-if="selectWidget.key == element.key"
                  >
                    <i class="el-icon el-icon-rank"></i>
                  </div>
                </el-row>
              </div>
            </template>
            <template v-else-if="element.type === 'form'">
            <WidgetSubForm
                  v-if="element && element.key"
                  :key="element.key"
                  :element="element"
                  :select.sync="selectWidget"
                  :index="index"
                  :data="data"
                  @click.native.stop="handleSelectWidget(index)"></WidgetSubForm>
            </template>
            <template v-else-if="element.type === 'tabs'">
              <WidgetTabs
                    v-if="element && element.key"
                    :key="element.key"
                    :element="element"
                    :select.sync="selectWidget"
                    :index="index"
                    :data="data"
                    @click.native.stop="handleSelectWidget(index)"></WidgetTabs>
            </template>
            <template v-else>
              <WidgetFormItem
                v-if="element && element.key"
                :key="element.key"
                :element="element"
                :select.sync="selectWidget"
                :index="index"
                :data="data"
              ></WidgetFormItem>
            </template>
          </template>
        </transition-group>
      </Draggable>
    </el-form>

  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import WidgetFormItem from './WidgetFormItem.vue';
import WidgetSubForm from './components/SubForm/WidgetSubForm.vue';
import WidgetTabs from './components/Tabs/WidgetTabs.vue';

export default {
  components: {
    Draggable,
    WidgetFormItem,
    WidgetSubForm,
    WidgetTabs,
  },
  // 这里的data从父组件接收和设计器实时对应的json
  props: ['data', 'select'],
  data() {
    return {
      selectWidget: this.select,
    };
  },
  methods: {
    handleSelectWidget(index) {
      console.log(`子项被点击:${index}`);
      this.selectWidget = this.data.list[index];
    },
    handleWidgetAdd(evt) {
      // console.log('元素被拖到外层handleWidgetAdd，evt:', evt);
      const { newIndex } = evt;
      console.log(this.data.list[newIndex]);
      this.selectWidget = this.data.list[newIndex];
    },
    handleWidgetColAdd($event, row, colIndex) {
      const { newIndex, oldIndex, item } = $event;
      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        if (item.tagName === 'DIV') {
          this.data.list.splice(
            oldIndex,
            0,
            row.columns[colIndex].list[newIndex],
          );
        }
        row.columns[colIndex].list.splice(newIndex, 1);
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
