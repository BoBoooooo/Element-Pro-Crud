<!--
 * @file: 高级查询表单
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2019年12月10 14:27:03
 -->
<template>
  <el-popover width="700"
              placement="bottom"
              @hide="getSearchFormData"
              trigger="click">
    <el-card style="margin:-12px;"
             :body-style="{
      padding:'5px',
      maxHeight:'70vh',
      overflow:'auto'
    }">
      <div slot="header"
           class="clearfix">
        <i class="el-icon el-icon-search"
           style="margin-right:10px"></i>
        <span>高级查询</span>
      </div>
      <div>
        <GenerateForm ref="generateDialogForm"
                      :data="formDesign"
                      style="width:auto"
                      v-if="visible"
                      :remote="remoteFuncs"
                      :entity.sync="entity" />
      </div>
    </el-card>
    <el-tooltip class="item"
                slot="reference"
                effect="dark"
                content="高级查询"
                placement="top">
      <i style="color:green"
         class="el-input__icon el-icon-zoom-in el-icon"
         @click="visible = true"></i>
    </el-tooltip>
  </el-popover>
</template>

<script lang="ts">
import GenerateForm from 'packages/form-designer/src/GenerateForm.vue';
import { DML, crud } from '@/api/public/crud';
import { getFormDetail } from '@/api/system/form';

import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';

@Component({
  components: {
    GenerateForm,
  },
})
export default class SeniorSearchForm extends Vue {
  $refs!: {
    generateDialogForm: HTMLFormElement;
  };

  visible = false;

  entity: any = {};

  formDesign = {};

  @Prop({
    type: Array,
    default: () => [],
    required: true,
  })
  columns;

  // 远程数据方法
  @Prop({ default: () => ({}), type: Object }) remoteFuncs!: any;

  created() {
    this.autoGenerateFormByBackend();
  }

  resetForm() {
    this.$refs.generateDialogForm.resetForm();
  }

  getSearchFormData() {
    this.$emit('fetchSearch', this.entity);
    this.visible = false;
  }

  // 生成查询表单 待  重构!!!
  // 暂时默认时间类型的为起止范围查询
  // 输入框类型的为手动输入
  autoGenerateFormByBackend() {
    const formJson: any = {
      list: [],
      config: {
        labelWidth: 110,
        labelPosition: 'right',
        size: 'small',
        isTableClass: false,
      },
    };

    for (const column of this.columns.filter(item => item.searchable)) {
      const {
        type, label, prop, option,
      } = column;
      const row: any = {
        type: 'grid',
        columns: [],
        options: {
          gutter: 0,
        },
        model: '1575516929000_36539',
        rules: [],
      };
      const input: any = {
        span: 24,
        list: [
          {
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
          },
        ],
      };
      const date: any = {
        span: 24,
        list: [
          {
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
          },
        ],
      };
      const select: any = {
        span: 24,
        list: [
          {
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
            },
            model: prop,
            rules: [],
            width: '100%',
          },
        ],
      };
      if (prop.includes('date') || prop.includes('time') || label.includes('日期') || label.includes('时间')) {
        row.columns.push(date);
      } else if (option && option.type === 'select') {
        row.columns.push(select);
      } else {
        row.columns.push(input);
      }
      formJson.list.push(row);
    }
    this.formDesign = formJson;
  }

  @Watch('columns', { deep: true })
  onChange() {
    this.autoGenerateFormByBackend();
  }
}
</script>
