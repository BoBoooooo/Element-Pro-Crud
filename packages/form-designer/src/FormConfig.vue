<!--
 * @file: 表单属性
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年09月14 18:01:58
-->
<template>
  <div class="form-config-container">
    <el-form label-position="top">
      <el-form-item label="是否使用表格布局">
        <el-switch v-model="data.isTableClass"
                   @change="isTableClass"></el-switch>
      </el-form-item>
      <el-form-item label="标签对齐方式">
        <el-radio-group v-model="data.labelPosition">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
          <el-radio-button label="top">顶部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="表单字段宽度">
        <el-input-number v-model="data.labelWidth"
                         :min="0"
                         :max="200"
                         :step="10"></el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';

@Component
export default class FormConfig extends Vue {
  // 是否使用table布局
  useTableClass = false;

  @Prop(Object)
  data: any;

  isTableClass() {
    if (this.data.isTableClass) {
      this.data.labelPosition = 'right';
      this.data.labelWidth = 110;
    }
  }
}
</script>
