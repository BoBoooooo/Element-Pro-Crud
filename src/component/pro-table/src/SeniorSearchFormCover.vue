<!--
 * @file: 高级查询表单平铺
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2019年12月10 14:27:03
 -->
<template>
  <div ref="container">
    <GenerateForm ref="generateDialogForm"
                  :data="searchFormJson"
                  class="form"
                  :remote="remoteFuncs"
                  :entity.sync="entity" />
    <slot></slot>
    <el-button size="mini"
               icon="el-icon-delete"
               style="float:right"
               @click="btnRemoveOnClick()">清空</el-button>
    <el-button size="mini"
               type="primary"
               icon="el-icon-search"
               style="float:right"
               @click="getSearchFormData()">查询</el-button>
    <el-tooltip class="item"
                effect="dark"
                :content="collpaseButtonText"
                placement="bottom">
      <el-button size="mini"
                 v-if="formDesign.list.length>2"
                 icon="el-icon-sort"
                 style="float:right;margin-right:10px;"
                 @click="collpase()">更多查询</el-button>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import { GenerateForm } from '@/component/form-designer';
import { chunk } from '@/utils/utils';
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';

@Component({
  name: 'SeniorSearchFormCover',
  components: {
    GenerateForm,
  },
})
export default class SeniorSearchFormCover extends Vue {
  isCollpase = true;

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

  get searchFormJson() {
    const formJson: any = {
      list: [],
      config: {
        labelWidth: 110,
        labelPosition: 'right',
        size: 'small',
        isTableClass: false,
      },
    };
    if (this.formDesign.list.length > 2 && this.isCollpase) {
      formJson.list = this.formDesign.list.slice(0, 2);
      return formJson;
    }
    return this.formDesign;
  }

  get collpaseButtonText() {
    return this.isCollpase ? '更多查询' : '收起查询';
  }

  collpase() {
    this.isCollpase = !this.isCollpase;
  }

  resetForm() {
    this.$refs.generateDialogForm.resetForm();
  }

  // 退出当前查询条件
  btnRemoveOnClick(index) {
    this.$emit('fetchSearch', {});
    this.resetForm();
  }

  getSearchFormData() {
    this.$emit('fetchSearch', this.entity);
    this.resetForm();
  }

  // 生成查询表单 待  重构!!!
  // 暂时默认时间类型的为起止范围查询
  // 输入框类型的为手动输入
  autoGenerateFormByBackend() {
    if (this.columns.length === 0) {
      return;
    }
    const formJson: any = {
      list: [],
      config: {
        labelWidth: 110,
        labelPosition: 'right',
        size: 'small',
        isTableClass: false,
      },
    };
    const chunkArr = chunk(
      this.columns.filter(item => item.searchable),
      4,
    );
    for (const arr of chunkArr.filter(item => item)) {
      const row: any = {
        type: 'grid',
        columns: [],
        options: {
          gutter: 0,
        },
        model: '1575516929000_36539',
        rules: [],
      };
      for (const column of arr) {
        const {
          type, label, prop, option,
        } = column;
        const input: any = {
          span: 6,
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
          span: 6,
          list: [
            {
              type: 'date',
              name: label,
              model: prop,
              rules: [],
              options: {
                editable: true,
                clearable: true,
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间',
                type: 'monthrange',
                format: 'yyyy-MM',
                width: '100%',
              },
            },
          ],
        };
        const select: any = {
          span: 6,
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
                width: '100%',
              },
              model: prop,
              rules: [],
            },
          ],
        };
        if (
          prop.includes('date')
          || prop.includes('time')
          || label.includes('日期')
          || label.includes('时间')
        ) {
          row.columns.push(date);
        } else if (option && option.type === 'select') {
          row.columns.push(select);
        } else {
          row.columns.push(input);
        }
      }
      formJson.list.push(row);
    }
    this.formDesign = formJson;
  }

  @Watch('columns', { deep: true, immediate: true })
  onChange(val) {
    if (val) {
      this.autoGenerateFormByBackend();
    }
  }
}
</script>
<style scoped>
.form >>> .el-select .el-input .el-select__caret {
  margin-top: 5px;
}
</style>
