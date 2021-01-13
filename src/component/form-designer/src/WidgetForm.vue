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
      <draggable
        v-model="data.list"
        v-bind="{
          group: 'people',
          ghostClass: 'ghost',
          animation: 200,
          handle: '.drag-widget',
        }"
        @end="handleMoveEnd"
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
                    <draggable
                      v-model="col.list"
                      v-bind="{
                        group: 'people',
                        ghostClass: 'ghost',
                        animation: 200,
                        handle: '.drag-widget',
                      }"
                      :no-transition-on-drag="true"
                      @end="handleMoveEnd"
                      @add="handleWidgetColAdd($event, element, colIndex)"
                    >
                      <transition-group
                        name="fade"
                        tag="div"
                        class="widget-col-list"
                      >
                        <widget-form-item
                          v-for="(el, i) in col.list"
                          :key="el.key"
                          v-if="el.key"
                          :element="el"
                          :select.sync="selectWidget"
                          :index="i"
                          :data="col"
                        ></widget-form-item>
                      </transition-group>
                    </draggable>
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
                <!-- <el-button title="删除"
                         style="bottom: -20px;"
                         @click.stop="handleWidgetDelete(index)"
                         class="widget-action-delete"
                         v-if="selectWidget.key == element.key"
                         circle
                         plain
                         type="danger">
                <Icon name="regular/trash-alt"
                      style="width: 12px;height: 12px;"></Icon>
              </el-button> -->
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
            <template v-else>
              <widget-form-item
                v-if="element && element.key"
                :key="element.key"
                :element="element"
                :select.sync="selectWidget"
                :index="index"
                :data="data"
              ></widget-form-item>
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>

  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import WidgetFormItem from './WidgetFormItem.vue';
import WidgetSubForm from './components/SubForm/WidgetSubForm.vue';

export default {
  components: {
    Draggable,
    WidgetFormItem,
    WidgetSubForm,
  },
  // 这里的data从父组件接收和设计器实时对应的json
  props: ['data', 'select'],
  data() {
    return {
      selectWidget: this.select,
    };
  },
  methods: {
    // 参数：{ newIndex, oldIndex }
    handleMoveEnd() {
      // console.log(`拖拽完成，从${oldIndex}行到${newIndex}行`);
    },
    handleSelectWidget(index) {
      console.log(`el-row被点击:${index}`);
      this.selectWidget = this.data.list[index];
    },
    handleWidgetAdd(evt) {
      // console.log('元素被拖到外层handleWidgetAdd，evt:', evt);
      const { newIndex } = evt;
      // const { to } = evt;
      // console.log(to);
      // 获取之前的数据key
      const { model, type } = this.data.list[newIndex];
      // 为拖拽到容器的元素添加唯一 key
      const key = model
        || `${type}_${Math.ceil(Math.random() * 99999)}`;
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: `func_${key}`,
        },
        key,
        // 绑定键值
        // model: this.data.list[newIndex].type + '_' + key,
        model: key,
        rules: [],
      });

      if (
        this.data.list[newIndex].type === 'radio'
        || this.data.list[newIndex].type === 'checkbox'
      ) {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          options: {
            ...this.data.list[newIndex].options,
            options: this.data.list[newIndex].options.options.map(item => ({
              ...item,
            })),
          },
        });
      }

      if (this.data.list[newIndex].type === 'grid') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          columns: this.data.list[newIndex].columns.map(item => ({
            ...item,
          })),
        });
      }

      this.selectWidget = this.data.list[newIndex];
    },
    handleWidgetColAdd($event, row, colIndex) {
      // console.log('元素被拖到内层handleWidgetAdd`);
      const { newIndex } = $event;
      const { oldIndex } = $event;
      const { item } = $event;
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
      // 获取之前的数据key
      const { model, type } = row.columns[colIndex].list[newIndex];
      const key = model
        || `${type}_${Math.ceil(Math.random() * 99999)}`;
      const { remoteFunc } = row.columns[colIndex].list[newIndex].options;
      this.$set(row.columns[colIndex].list, newIndex, {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options,
          remoteFunc: `func_${key}`,
        },
        key,
        // 绑定键值
        // model: row.columns[colIndex].list[newIndex].type + '_' + key,
        model: key,
        rules: [],
      });
      // 避免拖动后remoteFunc被重置问题
      if (remoteFunc) {
        row.columns[colIndex].list[newIndex].options.remoteFunc = remoteFunc;
      }
      if (
        row.columns[colIndex].list[newIndex].type === 'radio'
        || row.columns[colIndex].list[newIndex].type === 'checkbox'
      ) {
        this.$set(row.columns[colIndex].list, newIndex, {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            options: row.columns[colIndex].list[newIndex].options.options.map(
              o => ({
                ...o,
              }),
            ),
          },
        });
      }

      this.selectWidget = row.columns[colIndex].list[newIndex];
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
