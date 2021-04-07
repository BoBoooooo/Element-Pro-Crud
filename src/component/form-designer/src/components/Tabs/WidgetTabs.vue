<!--
 * @file: 布局组件 tab
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020-12-25 20:35:40
-->

<template>
  <div
    class="widget-col widget-view"
    :class="{
      active: selectWidget.key == element.key,
    }"
  >
    <el-tabs class="tabs" v-model="activeName" :tab-position="element.options.position" :type="element.options.type" style="width: 100%">
      <el-tab-pane :key="item.name" v-for="item in element.items" :label="item.label" :name="item.name">
        <Draggable
          v-model="item.list"
          v-bind="{
            group: 'people',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.drag-widget',
          }"
          @add="handleWidgetAdd"
        >
          <transition-group name="fade" tag="div" class="widget-col-list">
            <template v-for="(el, i) in item.list">
              <WidgetLayout v-if="el.type.includes('grid') || el.type.includes('tabs')" :element="el" :select.sync="selectWidget" :index="i" :data="col" :key="el.key"></WidgetLayout>
              <WidgetFormItem v-else :element="el" :select.sync="selectWidget" :index="i" :data="data" :key="el.key"></WidgetFormItem>
            </template>
          </transition-group>
        </Draggable>
      </el-tab-pane>
    </el-tabs>
    <div class="widget-view-drag widget-col-drag" v-if="selectWidget && selectWidget.key == element.key">
      <i class="drag-widget el-icon el-icon-rank"></i>
    </div>
    <div class="widget-view-action" v-if="selectWidget && selectWidget.key == element.key">
      <i class="el-icon el-icon-delete-solid" @click.stop="handleWidgetDelete()"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Draggable from 'vuedraggable';

@Component({
  name: 'WidgetTabs',
  components: {
    Draggable,
    WidgetFormItem: () => import('../../WidgetFormItem.vue'),
    WidgetLayout: () => import('../../WidgetLayout.vue'),
  },
})
export default class WidgetTabs extends Vue {
  @Prop({
    type: Object,
    default: () => ({}),
  })
  select!: Object;

  @Prop({
    type: Object as () => {
      items: any;
    },
    default: () => ({}),
  })
  element!: {
    items: any[];
  };

  @Prop({
    type: Object,
    default: () => ({}),
  })
  data!: any;

  @Prop({
    type: Number,
    default: null,
  })
  index!: number;

  activeName = '标签页1';

  selectWidget = this.select;

  handleSelectWidget(element) {
    this.selectWidget = element;
  }

  handleWidgetColAdd($event, row, colIndex) {
    const { newIndex } = $event;
    const { oldIndex } = $event;
    const { item } = $event;
    console.log(item.className);
    // 防止布局元素的嵌套拖拽
    if (item.className.indexOf('data-grid') >= 0) {
      // 如果是列表中拖拽的元素需要还原到原来位置
      if (item.tagName === 'DIV') {
        this.data.list.splice(oldIndex, 0, row.columns[colIndex].list[newIndex]);
      }
      row.columns[colIndex].list.splice(newIndex, 1);
      return false;
    }
    this.selectWidget = row.columns[colIndex].list[newIndex];
    console.log(row.columns[colIndex].list[newIndex]);
    return null;
  }

  handleGridAdd(grid) {
    grid.columns.push({
      span: 24,
      list: [],
      key: `${grid}_${Math.ceil(Math.random() * 99999)}`,
    });
  }

  handleWidgetDelete(index = this.index) {
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
  }

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
  }

  handleWidgetAdd(evt) {
    // 找到当前标签页
    const currentTab = this.element.items.find((_) => _.name === this.activeName);
    const { newIndex, item, oldIndex } = evt;
    const { list } = currentTab;
    const newItem = list[newIndex];
    this.selectWidget = newItem;
    return null;
  }

  @Watch('selectWidget', {
    deep: true,
  })
  selectWidgetOnChange(val) {
    this.$emit('update:select', val);
  }

  @Watch('select')
  selectOnChange(val) {
    this.selectWidget = val;
  }
}
</script>
