<!--
 * @file: 布局组件 tab
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020-12-25 20:35:40
-->

<template>
  <el-tabs class="tabs" v-model="activeName" :tab-position="widget.options.position" :type="widget.options.type" style="width: 100%">
    <el-tab-pane :key="item.name" v-for="item in widget.items" :label="item.label" :name="item.name" lazy>
      <template v-for="element in item.list">
        <GenerateFormItem :key="element.key" :remote="remote" :widget="element" :rules="element.rules" :readOnly="readOnly ? {} : null" />
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';

@Component({
  name: 'GenerateTabs',
  components: {
    GenerateFormItem: () => import('../../GenerateFormItem.vue'),
  },
})
export default class GenerateTabs extends Vue {
  $refs!: {
    tableForm: HTMLFormElement
  }

  @Prop({
    type: Object,
    default: () => ({}),
  })
  widget!: any

  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote: any

  @Prop({
    type: Object,
    default: null,
  })
  readOnly: any

  models: any = {}

  activeName = this.widget.items[0].name
}
</script>

<style lang="scss" scoped></style>
