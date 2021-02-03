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
            <WidgetFormItem
              v-for="(element, index) in item.list"
              :key="element.key"
              :element="element"
              :customListField="item.list"
              :select.sync="selectWidget"
              :index="index"
              :data="data"
              @click.native="handleSelectWidget(index)"
            ></WidgetFormItem>
          </transition-group>
        </Draggable>
      </el-tab-pane>
    </el-tabs>
    <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
      <i class="drag-widget el-icon el-icon-rank"></i>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import Draggable from 'vuedraggable';

@Component({
  name: 'WidgetTabs',
  components: {
    Draggable,
    WidgetFormItem: () => import('../../WidgetFormItem.vue'),
  },
})
export default class WidgetTabs extends Vue {
  @Prop({
    type: Object,
    default: () => ({}),
  })
  select!: Object

  @Prop({
    type: Object as () => {
      items: any
    },
    default: () => ({}),
  })
  element!: {
    items: any[]
  }

  @Prop({
    type: Object,
    default: () => ({}),
  })
  data!: any

  activeName = '标签页1'

  selectWidget = this.select

  handleSelectWidget(index) {
    const currentTab = this.element.items.find(_ => _.name === this.activeName);
    this.selectWidget = currentTab.list[index];
  }

  handleWidgetAdd(evt) {
    // 找到当前标签页
    const currentTab = this.element.items.find(_ => _.name === this.activeName);
    const { newIndex } = evt;
    const { list } = currentTab;
    const newItem = list[newIndex];
    this.$set(list, newIndex, {
      ...newItem,
      rules: [],
    });
    this.selectWidget = newItem;
  }

  get items() {
    return this.element.items;
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
