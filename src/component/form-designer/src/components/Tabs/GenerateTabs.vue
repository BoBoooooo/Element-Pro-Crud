<!--
 * @file: 布局组件 tab
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020-12-25 20:35:40
-->

<template>
  <el-tabs class="tabs" v-model="activeName" :tab-position="widget.options.position" :type="widget.options.type" style="width: 100%">
    <el-tab-pane :key="widget.name" v-for="widget in widget.items" :label="widget.label" :name="widget.name" lazy>
      <template v-for="item in widget.list">
        <template v-if="item.type == 'grid'">
          <!-- 每一行元素与基于el-row和el-col生成 -->
          <el-row :key="item.key" type="flex" :gutter="item.options.gutter ? item.options.gutter : 0" :justify="item.options.justify" :align="item.options.align">
            <!-- 生成每一行中的每一列元素 -->
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              <!-- 遍历生成该列所有组件 -->
              <template v-for="citem in col.list">
                <GenerateFormItem
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
        </template>
        <GenerateFormItem v-else :models="models" :key="item.key" :remote="remote" :widget="item" :readOnly="readOnly ? {} : null" />
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'GenerateTabs',
  components: {
    GenerateFormItem: () => import('../../GenerateFormItem.vue'),
  },
})
export default class GenerateTabs extends Vue {
  $refs!: {
    tableForm: HTMLFormElement;
  };

  @Prop()
  models: any;

  @Prop({
    type: Object,
    default: () => ({}),
  })
  widget!: any;

  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote: any;

  @Prop({
    type: Object,
    default: () => ({}),
  })
  formTableConfig: any;

  @Prop({
    type: Object,
    default: null,
  })
  readOnly: any;

  activeName = this.widget.items[0].name;

  // 按钮点击
  btnOnClick(widget) {
    this.$emit('btnOnClick', widget.options.eventName);
  }

  // 图表点击
  chartOnClick(chartObj) {
    this.$emit('chartOnClick', chartObj);
  }

  getTableSelection(selection) {
    this.$emit('selection-change', selection);
  }
}
</script>

<style lang="scss" scoped></style>
