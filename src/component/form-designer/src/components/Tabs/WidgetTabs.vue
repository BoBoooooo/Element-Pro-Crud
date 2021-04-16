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
              <WidgetLayout v-if="el.type.includes('grid') || el.type.includes('tabs')" :element="el" :select.sync="selectWidget" :index="i" :data="data" :key="el.key"></WidgetLayout>
              <WidgetFormItem v-else :element="el" :select.sync="selectWidget" :index="i" :data="data" :customListField="item.list" :key="el.key"></WidgetFormItem>
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
