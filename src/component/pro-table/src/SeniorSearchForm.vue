<!--
 * @file: 高级查询表单
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2019年12月10 14:27:03
 -->
<template>
  <el-popover width="800" placement="bottom" trigger="manual" v-model="visible">
    <el-card
      style="margin: -13px"
      class="card"
      :body-style="{
        padding: '5px 10px',
        maxHeight: '60vh',
        overflow: 'auto',
      }"
    >
      <div slot="header" class="clearfix">
        <i class="el-icon el-icon-search" style="margin-right: 10px"></i>
        <span>高级查询</span>
      </div>
      <div>
        <GenerateForm ref="generateDialogForm" :data="formDesign" :remote="remoteFuncs" :entity.sync="entity" />
        <div style="float: right">
          <el-button size="small" type="primary" icon="el-icon-search" @click="getSearchFormData()">查询</el-button>
          <el-button size="small" style="margin-right: 10px" icon="el-icon-close" @click="resetForm">关闭</el-button>
        </div>
      </div>
    </el-card>
    <el-tooltip class="item" slot="reference" effect="dark" content="高级查询" placement="top">
      <el-button type="primary" size="small" class="tool-btn" icon="el-icon-s-help" @click="visible = true">高级查询</el-button>
    </el-tooltip>
  </el-popover>
</template>

<script lang="ts">
import GenerateForm from '@/component/form-designer/src/GenerateForm.vue';
import { diGuiTree } from '@/utils/utils';

import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'SeniorSearchForm',
  components: {
    GenerateForm,
  },
})
export default class SeniorSearchForm extends Vue {
  visible = false;

  entity: any = {};

  formDesign = {
    config: {},
    list: [],
  };

  @Prop({
    type: Array,
    default: () => [],
    required: true,
  })
  columns;

  // 远程数据方法
  @Prop({ default: () => ({}), type: Object }) remoteFuncs!: any;

  $refs!: {
    generateDialogForm: HTMLFormElement;
  };

  resetForm() {
    this.$refs.generateDialogForm.resetForm();
    this.visible = false;
  }

  getSearchFormData() {
    this.$emit('fetchSearch', this.entity);
    this.resetForm();
  }

  // 生成查询表单 待  重构!!!
  // 暂时默认时间类型的为起止范围查询
  // 输入框类型的为手动输入
  autoGenerateFormByBackend() {
    this.visible = false;
    const formJson: any = {
      list: [],
      config: {
        labelWidth: 110,
        labelPosition: 'right',
        size: 'small',
        isTableClass: false,
      },
    };
    const columns = diGuiTree()(this.columns);

    for (const column of columns) {
      const { label, prop, option } = column;
      const input: any = {
        type: 'input',
        name: label,
        options: {
          type: 'input',
          dataType: 'string',
          placeholder: `请输入${label}`,
          width: '100%',
        },
        model: prop,
        rules: [],
      };
      const date: any = {
        type: 'date',
        name: label,
        model: prop,
        rules: [],
        options: {
          editable: true,
          clearable: true,
          startPlaceholder: '请选择开始时间',
          endPlaceholder: '请选择结束时间',
          type: 'monthrange',
          format: 'yyyy-MM',
          width: '100%',
        },
      };
      const select: any = {
        type: 'select',
        name: label,
        options: {
          clearable: true,
          options: [],
          allowCreate: false,
          remote: 'dict',
          remoteOptions: [],
          props: {
            value: 'value',
            label: 'label',
          },
          remoteFunc: '',
          dictType: '',
          ...option,
          placeholder: `请选择${label}`,
          width: '100%',
        },
        model: prop,
        rules: [],
      };
      if (prop.includes('date') || prop.includes('time') || label.includes('日期') || label.includes('时间')) {
        formJson.list.push(date);
      } else if (option && option.type === 'select') {
        formJson.list.push(select);
      } else {
        formJson.list.push(input);
      }
    }
    this.formDesign = formJson;
  }

  @Watch('columns', { deep: true, immediate: true })
  onChange(val) {
    this.autoGenerateFormByBackend();
  }
}
</script>
<style scoped>
.card >>> .el-card__header {
  background: #b7ddff !important;
}
.card {
  border: none !important;
}
</style>
