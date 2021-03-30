<!--
@file 表单生成
@author BoBo
@createDate 2018年11月15日21:40:56
@copyright GavinZhuLei
部分修改重构
原作者地址 https://github.com/GavinZhuLei/vue-form-making
感谢大佬!

-->
<template>
  <div class="table-form-wrapper">
    <el-form
      ref="generateForm"
      :class="{
        'table-form': data.config && data.config.isTableClass,
        pad: deviceMode === 'pad',
        mobile: deviceMode === 'mobile',
      }"
      class="form"
      :model="models"
      :label-position="data.config && data.config.labelPosition"
      :label-width="data.config && data.config.labelWidth ? data.config.labelWidth + 'px' : '140px'"
      :size="data.config.size"
    >
      <!-- 遍历从父组件传入的data，data下有list和config两个属性，list下的每个对象是表示一行组件的集合 -->
      <template v-for="item in this.data.list">
        <!-- 如果这一行时网格grid布局 -->
        <template v-if="item.type == 'grid'">
          <!-- 每一行元素与基于el-row和el-col生成 -->
          <el-row :key="item.key" type="flex" :gutter="item.options.gutter ? item.options.gutter : 0" :justify="item.options.justify" :align="item.options.align">
            <!-- 生成每一行中的每一列元素 -->
            <el-col
              v-for="(col, colIndex) in item.columns"
              :key="colIndex"
              :span="col.span"
              :style="{
                border: isNoBorder(col, item) ? 'none!important' : '',
              }"
            >
              <!-- 遍历生成该列所有组件 -->
              <template v-for="citem in col.list">
                <!-- 如果一个元素的type是blank就加载插槽 -->
                <el-form-item v-if="citem.type == 'blank'" :label-width="citem.options.hiddenLabel ? '0' : labelWidth(citem)" v-show="!citem.hidden" :prop="citem.model" :key="citem.key">
                  <template slot="label">
                    <template v-if="!citem.options.hiddenLabel">
                      <span>{{ citem.name }}</span>
                    </template>
                  </template>
                  <slot :name="citem.model" :widget="citem" :model="models"></slot>
                </el-form-item>
                <!-- 正常组件通过GenerateFormItem生成 -->
                <GenerateFormItem
                  v-else
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
        <!-- 不嵌套栅格布局时自定义组件 -->
        <template v-else-if="item.type === 'blank'">
          <el-form-item :label-width="item.options.hiddenLabel ? '0' : labelWidth(item)" :prop="item.model" :key="item.key" v-show="!item.hidden">
            <template slot="label">
              <template v-if="!item.options.hiddenLabel">
                <span>{{ item.name }}</span>
              </template>
            </template>
            <slot :name="item.model" :model="models" :widget="item"></slot>
          </el-form-item>
        </template>
        <!-- 表格布局 -->
        <template v-else-if="item.type === 'grid-table'">
          <table
            class="grid-table"
            :key="item.key"
            style="width: 100%; border: solid"
            :style="{
              'border-width': item.options.borderWidth.toString() + 'px',
              borderColor: item.options.borderColor,
            }"
          >
            <tr v-for="(row, rowIndex) in item.rows" :key="rowIndex">
              <td
                v-for="(col, colIndex) in row.columns"
                :key="colIndex"
                :colspan="col.options.colspan || 1"
                :rowspan="col.options.rowspan || 1"
                @click.stop="clickTdAutoFocus($event, col)"
                valign="middle"
                align="left"
                class="grid-table-td"
                :style="{
                  'border-width': item.options.borderWidth.toString() + 'px',
                  borderColor: item.options.borderColor,
                  width: col.options.width,
                  height: col.options.height,
                  display: col.list.every((_) => _.hidden) ? 'none' : '',
                }"
              >
                <GenerateFormItem
                  v-for="citem in col.list"
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
              </td>
            </tr>
          </table>
        </template>
        <!-- 普通行布局方式 -->
        <template v-else>
          <GenerateFormItem
            :key="item.key"
            :models="models"
            :remote="remote"
            @selection-change="getTableSelection($event, item)"
            :widget="item"
            :readOnly="readOnly"
            @chartOnClick="chartOnClick"
            @btnOnClick="btnOnClick"
            v-show="!item.hidden"
            :formTableConfig="formTableConfig"
          >
          </GenerateFormItem>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import GenerateFormItem from './GenerateFormItem.vue';

@Component({
  components: {
    GenerateFormItem,
  },
  name: 'GenerateForm',
})
export default class GenerateForm extends Vue {
  $refs!: {
    generateForm: HTMLFormElement;
    FormDesigner: HTMLFormElement;
  };

  @Prop({
    type: Object,
    default: () => ({
      config: {},
    }),
  })
  data: any;

  // 表单初始值
  @Prop({
    type: Object,
    default: () => ({}),
  })
  value: any;

  // 表单当前实时对象
  @Prop({
    type: Object,
    default: () => ({}),
  })
  entity: any;

  // 是否只读
  @Prop({
    type: Boolean,
    default: false,
  })
  readOnly!: boolean;

  // 组件联动规则
  @Prop({
    type: Array,
    default: () => [],
  })
  rules!: any[];

  // 远端数据
  @Prop({
    type: Object,
    default: () => ({}),
  })
  remote: any;

  // 表格组件 tableParams以及prefill
  @Prop({
    type: Object,
    default: () => ({}),
  })
  formTableConfig: any;

  // deviceMode
  @Prop({
    type: String,
    default: 'pc',
  })
  deviceMode!: string;

  // 当前表单实体对象
  models: any = {};

  // 内部属性记录字段对应组件,用于联动时快速修改
  fieldMap: any = {};

  // 内部属性记录字段已联动的组件,用于字段值切换时重置原先组件状态
  linkEffect: any = {};

  created() {
    if (this.data.list) {
      // 根据数据结构生成给子组件的数据源
      this.generateModel(this.data.list);
    }
  }

  // 若为表格布局并且当前栅格内只有一个元素并且为隐藏状态,隐藏边框线
  isNoBorder(col, item) {
    const { list } = col;
    return this.data.config && this.data.config.isTableClass && list.every((_) => _.hidden) && item.columns.length === 1;
  }

  // 组件联动handler
  controlFieldHandler(model) {
    this.rules.forEach((r) => {
      const value = this.models[r.field];
      // 若该字段已经联动其他组件,先恢复被联动组件为原先状态
      if (this.linkEffect[r.field]) {
        this.resetComponent(this.linkEffect[r.field]);
      }
      if (value) {
        const controlRule = r.control.filter((_) => value.includes(_.value));
        if (controlRule.length > 0) {
          const insideRule: any = [];
          for (const rules of controlRule) {
            insideRule.push(...rules.rule);
          }
          if (insideRule.length > 0) {
            this.linkEffect[r.field] = [];
            insideRule.forEach((_: any) => {
              const field = this.fieldMap[_.field];
              if (field) {
                switch (_.operator) {
                  case 'show':
                    this.$set(field, 'hidden', false);
                    // 如果被联动组件值为空,默认显示规则中默认值
                    if ((!this.models[_.field] || this.models[_.field].length === 0) && _.value) {
                      if (Array.isArray(this.models[_.field])) {
                        this.models[_.field].push(_.value);
                      } else {
                        this.models[_.field] = _.value;
                      }
                    }
                    break;
                  case 'hidden':
                    this.$set(field, 'hidden', true);
                    break;
                  case 'required':
                    this.setRequired(field);
                    break;
                  case 'unrequired':
                    this.setUnRequired(field);
                    break;
                  default:
                    break;
                }
                // linkEffect 缓存当前字段跟其他组件联动的关系
                this.linkEffect[r.field].push(_);
              }
            });
          }
        }
      }
    });
  }

  setRequired(field: any) {
    if (!field.options.required) {
      field.options.required = true;
      field.rules.push({
        message: `${field.name}必须填写`,
        required: true,
      });
    }
  }

  resetComponent(effect) {
    effect.forEach((_) => {
      const field = this.fieldMap[_.field];
      if (field) {
        switch (_.operator) {
          case 'show':
            this.$set(field, 'hidden', true);
            break;
          case 'hidden':
            this.$set(field, 'hidden', false);
            this.models[_.field] = _.value;
            break;
          case 'required':
            this.setUnRequired(field);
            break;
          case 'unrequired':
            this.setRequired(field);
            break;
          default:
            break;
        }
      }
    });
  }

  setUnRequired(field: any) {
    field.options.required = false;
    field.rules = field.rules.filter((_) => !_.required);
  }

  getTableSelection($event, item) {
    const tableSelections = {};
    tableSelections[item.model] = $event;
    this.$emit('table-selections', tableSelections);
  }

  generateModel(genList) {
    // 遍历设计的结构
    for (let i = 0; i < genList.length; i += 1) {
      if (genList[i].type === 'grid') {
        genList[i].columns.forEach((item) => {
          this.generateModel(item.list);
        });
      } else if (genList[i].type === 'grid-table') {
        genList[i].rows.forEach((item) => {
          this.generateModel(item.columns);
        });
      } else if (genList[i].type === 'td') {
        this.generateModel(genList[i].list);
      } else if (genList[i].type === 'form') {
        this.generateModel(genList[i].tableColumns);
      } else {
        // 获取当前组件
        const row = genList[i];
        // 如果是自定义组件,model值为slotName,不在model中赋属性值
        if (Object.keys(this.value).indexOf(row.model) >= 0 && row.type !== 'blank') {
          this.initFormValue(row);
        } else {
          this.setDefaultValue(row);
        }
        // 组件option跟字段映射
        this.$set(this.fieldMap, row.model, row);
      }
    }
    this.models = { ...this.value, ...this.models };
  }

  // 多选情况下数组转字符串
  filterFormData() {
    const model = { ...this.models };
    Object.keys(model).forEach((k) => {
      if (Array.isArray(model[k])) {
        model[k] = model[k].toString();
      }
    });
    return model;
  }

  /**
   * 如果select,radio,checkbox等组件为多选情况  后台返回逗号分隔字符串 => 数组
   * 如果 this.value为null 则会按默认值赋值相应字段
   * @param {String} 当前表单json.list
   */
  initFormValue(row) {
    if (row.options.multiple || 'cascader,checkbox'.includes(row.type) || (row.options.type && row.options.type.includes('range'))) {
      if (this.value[row.model] != null && this.value[row.model] !== '') {
        this.models[row.model] = this.value[row.model].split(',');
      } else {
        this.models[row.model] = [];
      }
    } else if (this.value[row.model] == null || this.value[row.model] === '') {
      this.setDefaultValue(row);
    } else {
      this.models[row.model] = this.value[row.model];
    }
  }

  // 先验证再获取表单内容
  getData() {
    return new Promise((resolve, reject) => {
      this.$refs.generateForm.validate((valid) => {
        if (valid) {
          resolve(this.filterFormData());
        } else {
          // 校验失败时focus到文本框
          // 注意此处没有考虑textarea的情况,多行文本会失败
          setTimeout(() => {
            const isError: any = document.getElementsByClassName('is-error');
            isError[0].querySelector('input').focus();
          }, 100);
          reject(new Error('请检查必填项是否填写').message);
        }
      });
    });
  }

  labelWidth(item) {
    const { type, labelWidth } = item;
    let label = 'text,comment'.includes(type) ? '0px' : labelWidth || undefined;
    if (label) {
      label = label.toString();
      if (!label.includes('px')) {
        label += 'px';
      }
    }
    return label;
  }

  // 单元格中为input,select,textarea时会默认聚焦
  clickTdAutoFocus(event, td) {
    // 判断单元格中是否有组件
    if (td.list.length > 0) {
      const dom = event.target;
      const [target] = td.list;
      // 当点击单元格时,聚焦组件
      if (dom.tagName === 'TD') {
        switch (target.type) {
          case 'input':
            dom.getElementsByTagName('INPUT')[0].focus();
            break;
          case 'select':
            dom.getElementsByTagName('INPUT')[0].focus();
            break;
          case 'textarea':
            dom.getElementsByTagName('TEXTAREA')[0].focus();
            break;
          default:
            return false;
        }
      }
      return false;
    }
    return false;
  }

  // 重置表单
  resetForm() {
    this.$refs.generateForm.resetFields();
  }

  // 校验表单
  validate() {
    return new Promise((resolve, reject) => {
      this.$refs.generateForm.validate((valid) => {
        if (valid) {
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  // 不经过验证直接获取表单内容
  getDataWithoutValidate() {
    return new Promise((resolve) => resolve(this.filterFormData()));
  }

  // 生成的按钮点击
  btnOnClick(event) {
    this.$emit('btn-on-click', {
      event,
      model: this.models,
    });
  }

  // 图表点击
  chartOnClick(chart) {
    this.$emit('chart-on-click', {
      chart,
      model: this.models,
    });
  }

  // 表单默认值回填单独拉出来封装
  setDefaultValue(config) {
    // 如果时间选择器需要默认值,默认回填当前日期
    if (config.type === 'date') {
      if (config.options.defaultValue) {
        const { format } = config.options;
        if (format && format !== '') {
          this.models[config.model] = this.dayjs().format(format.toUpperCase());
        }
      } else {
        this.models[config.model] = null;
      }
    } else {
      let { defaultValue } = config.options;
      // 如果默认值设置为$开头,则表示要读取vuex中的全局变量
      // 如设置为 $deptname 则读取 this.$store.getters.deptname
      if (typeof defaultValue === 'string' && defaultValue.includes('$')) {
        defaultValue = this.$store.getters[defaultValue.replace('$', '')];
      } else if (defaultValue === '') {
        defaultValue = null;
      }
      this.models[config.model] = defaultValue;
    }
  }

  @Watch('value', {
    deep: true,
  })
  valueOnChange(val) {
    if (this.$refs.generateForm) {
      this.$refs.generateForm.clearValidate();
    }
    this.models = { ...this.models, ...val };
  }

  @Watch('models', {
    deep: true,
    // immediate: true,
  })
  modelsOnChange(val) {
    // 组件值改变时检查是否需要联动其他组件
    if (this.rules.length > 0) {
      this.controlFieldHandler(val);
      if (this.$refs.generateForm) {
        this.$refs.generateForm.clearValidate();
      }
    }
    this.$emit('update:entity', val);
  }

  /**
   * 下列为dev模式代码,不需要可自行删除
   *
   */
  formOnSave({ formDesign }) {
    this.data = formDesign;
  }

  async showFormDesigner() {
    const res = await this.$PROCRUD.getFormDetail(this.data.config.name);
    this.$refs.FormDesigner.showDialog({ id: res.data.id }, 1, res.data);
  }
}
</script>
<style lang="scss" scoped>
@import './styles/table-form.scss';
@import './styles/grid-table-form.scss';

.dev-module {
  position: absolute;
  left: 20px;
  top: 30px;
  z-index: 2;
}
.no-border {
  border: none !important;
}
</style>
