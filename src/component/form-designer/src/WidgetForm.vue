<template>
  <div
    class="widget-form-container"
    :class="{
      pad: deviceMode === 'pad',
      mobile: deviceMode === 'mobile',
    }"
  >
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
            <WidgetLayout
              v-if="element && element.key && (element.type.includes('grid') || element.type.includes('tabs'))"
              :key="element.key"
              :element="element"
              :data="data"
              :select.sync="selectWidget"
              :index="index"
            ></WidgetLayout>
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
import Vue from 'vue';
import WidgetTabs from './components/Tabs/WidgetTabs.vue';

export default {
  components: {
    Draggable,
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
    handleWidgetAdd(evt) {
      // console.log('元素被拖到外层handleWidgetAdd，evt:', evt);
      const { newIndex } = evt;
      console.log(this.data.list[newIndex]);
      this.selectWidget = this.data.list[newIndex];
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
