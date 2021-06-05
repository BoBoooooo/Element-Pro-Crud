<!--
@file 动态表单最小粒度元素生成
@author BoBo
@createDate 2018年11月15日10:17:01
@copyright GavinZhuLei
部分修改重构
原作者地址 https://github.com/GavinZhuLei/vue-form-making
感谢大佬!
-->
<template>
  <el-form-item :rules="getRules" :prop="formElement.includes(widget.type) ? widget.model : undefined" :label-width="widget.options.hiddenLabel ? '0' : labelWidth" :class="widget.options.className">
    <template #label>
      <template v-if="widget.options.hiddenLabel ? '' : label">
        <span v-html="label"></span>
        <el-popover placement="top-start" title="输入提示" v-if="widget.options.tips" width="200" trigger="hover">
          <i class="el-icon el-icon-question" slot="reference"></i>
          <div style="color: #8492a6" v-html="widget.options.tips"></div>
        </el-popover>
      </template>
    </template>
    <el-form-item v-if="widget.type === 'blank'" :label-width="widget.options.hiddenLabel ? '0' : labelWidth" :prop="widget.model" :key="widget.key" v-show="!widget.hidden">
      <template slot="label">
        <template v-if="!widget.options.hiddenLabel">
          <span>{{ widget.name }}</span>
        </template>
      </template>
      <slot :name="widget.model" :model="models" :widget="widget"></slot>
    </el-form-item>
    <template v-if="widget.type === 'html'">
      <div style="margin-left: 10px" v-html="widget.options.html"></div>
    </template>
    <template v-if="widget.type === 'divider'">
      <el-divider :content-position="widget.options.align">{{ widget.name }}</el-divider>
    </template>
    <template v-if="widget.type == 'input'">
      <el-input
        v-if="['number', 'integer', 'float'].includes(widget.options.dataType)"
        :type="widget.options.dataType"
        v-model.number="models[widget.model]"
        :placeholder="widget.options.placeholder"
        :readonly="readOnly || widget.options.readonly"
        :disabled="readOnly || widget.options.disabled"
        :style="{ width: widget.options.width }"
        v-on="_$listeners"
      ></el-input>
      <el-input
        v-else
        type="text"
        v-model="models[widget.model]"
        :show-word-limit="widget.options.showWordLimit"
        :maxlength="widget.options.maxLength"
        :placeholder="widget.options.placeholder"
        :readonly="readOnly || widget.options.readonly"
        :disabled="readOnly || widget.options.disabled"
        :style="{ width: widget.options.width }"
        :suffix-icon="widget.options.suffix"
        :prefix-icon="widget.options.prefix"
        v-on="_$listeners"
      >
        <span slot="prepend" v-if="widget.options.prepend">
          {{ widget.options.prepend }}
        </span>
        <template slot="append" v-if="widget.options.append || widget.options.appendButton">
          <span v-if="!widget.options.appendButton">
            {{ widget.options.append }}
          </span>
          <el-button icon="el-icon-info" v-else @click="btnOnClick(widget)">
            {{ widget.options.append }}
          </el-button>
        </template>
      </el-input>
    </template>
    <template v-if="widget.type == 'button'">
      <el-button :type="widget.options.btnType" @click="btnOnClick(widget)">{{ widget.options.text }}</el-button>
    </template>
    <template v-if="widget.type == 'text'">
      <h3
        style="padding: 10px; font-family: KaiTi, STKaiti; margin: 0"
        :style="{
          'text-align': widget.options.align,
          'font-size': widget.options.fontSize,
        }"
      >
        {{ widget.name }}
      </h3>
    </template>
    <template v-if="widget.type == 'label'">
      <p>{{ models[widget.model] }}</p>
    </template>
    <template v-if="widget.type == 'select'">
      <el-select
        v-model="models[widget.model]"
        default-first-option
        :disabled="readOnly || widget.options.disabled"
        :readonly="readOnly || widget.options.readonly"
        :multiple="widget.options.multiple"
        allow-create
        clearable
        :placeholder="widget.options.placeholder"
        :style="{ width: widget.options.width || '100%' }"
        filterable
        v-on="_$listeners"
      >
        <el-option v-for="(item, index) in optionsList" :key="index" :value="item.value" :label="widget.options.showLabel || widget.options.remote ? item.label : item.value">
          <span style="float: left">{{ item.label || item.value }}</span>
          <span v-if="item.rightLabel" style="float: right; color: #8492a6; font-size: 1em">{{ item.rightLabel }}</span>
        </el-option>
      </el-select>
    </template>
    <template v-if="widget.type == 'textarea'">
      <el-input
        type="textarea"
        v-on="_$listeners"
        :autosize="{ minRows: 5 }"
        v-model="models[widget.model]"
        :show-word-limit="widget.options.showWordLimit"
        :maxlength="widget.options.maxLength"
        :disabled="readOnly || widget.options.disabled"
        :readonly="readOnly || widget.options.readonly"
        :placeholder="widget.options.placeholder"
        :style="{ width: widget.options.width }"
      ></el-input>
    </template>

    <template v-if="widget.type == 'number'">
      <el-input-number
        v-on="_$listeners"
        v-model="models[widget.model]"
        :style="{ width: widget.options.width }"
        :step="widget.options.step"
        :disabled="readOnly || widget.options.disabled"
        :readonly="readOnly || widget.options.readonly"
        controls-position="right"
      ></el-input-number>
    </template>

    <template v-if="widget.type == 'radio'">
      <el-radio-group v-on="_$listeners" v-model="models[widget.model]" :style="{ width: widget.options.width }" :disabled="readOnly || widget.options.disabled">
        <el-radio :style="{ display: widget.options.inline ? 'inline-block' : 'block' }" :label="item.value" v-for="(item, index) in optionsList" :key="index">
          <template v-if="widget.options.showLabel">{{ item.label }}</template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="widget.type == 'checkbox'">
      <el-checkbox-group v-on="_$listeners" v-model="models[widget.model]" :style="{ width: widget.options.width }">
        <template v-if="!widget.options.buttonStyle">
          <el-checkbox
            :style="{ display: widget.options.inline ? 'inline-block' : 'block' }"
            :label="item.value"
            :min="widget.options.min"
            :max="widget.options.max"
            v-for="(item, index) in optionsList"
            :key="item.value + index"
          >
            {{ widget.options.showLabel ? item.label : item.value }}
          </el-checkbox>
        </template>
        <el-checkbox-button v-else :style="{ display: widget.options.inline ? 'inline-block' : 'block' }" :label="item.value" v-for="(item, index) in optionsList" :key="item.value + index">
          {{ widget.options.showLabel ? item.label : item.value }}
        </el-checkbox-button>
      </el-checkbox-group>
    </template>

    <template v-if="widget.type == 'time'">
      <el-time-picker
        v-on="_$listeners"
        v-model="models[widget.model]"
        :is-range="widget.options.isRange"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="readOnly || widget.options.readonly"
        :disabled="readOnly || widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :arrowControl="widget.options.arrowControl"
        :value-format="widget.options.format"
        :style="{ width: widget.options.width }"
      >
      </el-time-picker>
    </template>

    <template v-if="widget.type == 'date'">
      <el-date-picker
        v-on="_$listeners"
        v-model="models[widget.model]"
        :type="widget.options.type"
        :placeholder="widget.options.placeholder"
        :start-placeholder="widget.options.startPlaceholder"
        :end-placeholder="widget.options.endPlaceholder"
        :readonly="readOnly || widget.options.readonly"
        :disabled="readOnly || widget.options.disabled"
        :editable="widget.options.editable"
        :clearable="widget.options.clearable"
        :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
        :format="widget.options.format"
        :style="{ width: widget.options.width }"
        :picker-options="pickerOptions"
        :default-value="new Date()"
      >
      </el-date-picker>
    </template>

    <template v-if="widget.type == 'rate'">
      <el-rate v-on="_$listeners" v-model="models[widget.model]" :max="widget.options.max" :disabled="readOnly || widget.options.disabled" :allow-half="widget.options.allowHalf"></el-rate>
    </template>

    <template v-if="widget.type == 'color'">
      <el-color-picker v-on="_$listeners" v-model="models[widget.model]" :disabled="readOnly || widget.options.disabled" :show-alpha="widget.options.showAlpha"></el-color-picker>
    </template>

    <template v-if="widget.type == 'switch'">
      <el-switch v-on="_$listeners" v-model="models[widget.model]" :disabled="readOnly || widget.options.disabled"> </el-switch>
    </template>

    <template v-if="widget.type == 'slider'">
      <el-slider
        v-on="_$listeners"
        v-model="models[widget.model]"
        :min="widget.options.min"
        :max="widget.options.max"
        :disabled="readOnly || widget.options.disabled"
        :step="widget.options.step"
        :show-input="widget.options.showInput"
        :range="widget.options.range"
        :style="{ width: widget.options.width }"
      ></el-slider>
    </template>
    <template v-if="widget.type == 'cascader'">
      <el-cascader
        ref="cascader"
        v-on="_$listeners"
        v-model="models[widget.model]"
        :disabled="readOnly || widget.options.disabled"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{ width: widget.options.width }"
        :separator="widget.options.separator == null ? '/' : widget.options.separator"
        :options="optionsList"
        filterable
        :props="{ checkStrictly: widget.options.checkStrictly, multiple: widget.options.multiple, expandTrigger: 'hover', value: widget.options.props.value, label: widget.options.props.label }"
      >
      </el-cascader>
    </template>
    <template v-if="widget.type == 'table'">
      <CrudTable
        :closeOnClickModal="false"
        ref="table"
        @selection-change="getTableSelection"
        :tableName="widget.options.tableName"
        :tableDesignerName="widget.options.tableDesignerName"
        :dialogFormDesignerName="widget.options.dialogFormDesignerName"
        dialogAppendToBody
        :readOnly="readOnly || widget.options.readonly"
        :visibleList="tableVisibleList"
        :showPagination="widget.options.showPagination"
        :isMultiple="widget.options.isMultiple"
        :tableParams="getTableParams"
        :prefill="getTablePrefill"
        :remoteFuncs="remote"
        border
        stripe
      >
      </CrudTable>
    </template>
    <template v-if="widget.type === 'treeselect'">
      <!-- 目前暂时提供了几个常用props,有更多需要自行拓展 -->
      <!-- 官网:https://vue-treeselect.js.org -->
      <treeselect
        v-model="models[widget.model]"
        v-on="_$listeners"
        v-if="visible"
        :placeholder="widget.options.placeholder"
        :maxHeight="+widget.options.maxHeight"
        :multiple="widget.options.multiple"
        :normalizer="normalizer"
        :append-to-body="widget.options.appendToBody"
        :loadOptions="
          ({ action, parentNode, callback }) => {
            if (parentNode.children) parentNode.children = [];
            callback();
          }
        "
        valueConsistsOf="ALL"
        :clearable="widget.options.clearable"
        :searchable="widget.options.searchable"
        :noChildrenText="widget.options.noChildrenText"
        :noOptionsText="widget.options.noOptionsText"
        :noResultsText="widget.options.noResultsText"
        :disabled="readOnly || widget.options.disabled"
        :showCount="widget.options.showCount"
        :disable-branch-nodes="widget.options.disableBranchNodes"
        :options="widget.options.remoteOptions"
        :searchNested="widget.options.searchNested"
      >
      </treeselect>
    </template>
    <template v-if="widget.type == 'richtext'">
      <Tinymce :height="400" v-model="models[widget.model]" :readonly="readOnly || widget.options.readonly"></Tinymce>
    </template>
    <template v-if="widget.type == 'upload'">
      <!-- 附件上传(注意初始值prefill必须传入id) -->
      <FileUpload
        :visibleList="fileVisibleList"
        :fileType="widget.options.fileType"
        :readOnly="readOnly || widget.options.readonly"
        showPagination
        :resourceid="models[widget.options.resourceId]"
      ></FileUpload>
    </template>
    <template v-if="widget.type === 'avatar'">
      <AvatarUpload :readOnly="readOnly" :widget="widget" v-model="models[widget.model]"></AvatarUpload>
    </template>
    <template v-if="widget.type === 'form'">
      <SubForm :widget="widget" :models="models"></SubForm>
    </template>
    <!-- 饼图组件 -->
    <template v-if="widget.type === 'chart-pie'">
      <PieChart @click="chartOnClick" :height="widget.options.height" :data="widget.options.data" :title="widget.name" :hollow="widget.options.hollow" />
    </template>
    <!-- 柱状图组件 -->
    <template v-if="widget.type === 'chart-line'">
      <LineChart
        :height="widget.options.height"
        @click="chartOnClick"
        :data="widget.options.data"
        :title="widget.name"
        :rotate="widget.options.rotate"
        :type="widget.options.type"
        :yAxisMax="widget.options.yAxisMax"
        :xUnit="widget.options.xUnit"
        :yUnit="widget.options.yUnit"
      />
    </template>
    <template v-if="widget.type === 'chart-common'">
      <Echarts :title="widget.name" :height="widget.options.height" :option="widget.options.option" :loop="widget.options.loop"> </Echarts>
    </template>
  </el-form-item>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { DML } from '@/types/common';
import CrudTable from '@/component/crud-table/src/CrudTable.vue';
import { isChinese } from '@/utils/utils';
import { formElement } from '@/component/form-designer/src/componentsConfig';
import { AvatarUpload, Echarts, PieChart, LineChart, Tinymce, FileUpload } from '@/component/modules/index';
import SubForm from './components/SubForm/index.vue';

@Component({
  components: {
    Tinymce,
    FileUpload,
    SubForm,
    Echarts,
    PieChart,
    LineChart,
    AvatarUpload,
  },
  name: 'ProFormItem',
})
export default class ProFormItem extends Vue {
  $refs!: {
    table: HTMLFormElement;
    cascader: HTMLFormElement;
  };

  @Prop({
    type: Object,
    default: () => ({}),
  })
  widget: any;

  @Prop({
    type: Object,
    default: () => ({}),
  })
  models: any;

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
    type: Boolean,
    default: false,
  })
  readOnly!: boolean;

  copyOption: any = []; // 备份一份初始选项

  visible = false;

  normalizer: any;

  formElement = formElement;

  initData() {
    const { type, model } = this.widget;
    let normalizer;
    // tree-select组件初始化
    if (type === 'treeselect') {
      const { value, label } = this.widget.options.props;
      normalizer = (node) => {
        // 去掉children=null的属性
        if (node.children === null || node.children === 'null') {
          delete node.children;
        }
        return {
          id: node[value],
          label: node[label],
        };
      };
    } else if (type.includes('chart-')) {
      // 图表预设option
      // 如果是通用图表则传入的值为option
      if (type === 'chart-common') {
        if (this.models[model]) {
          this.widget.options.option = this.models[model];
        }
      } else {
        // 指定图表默认转入data
        // eslint-disable-next-line no-lonely-if
        if (this.models[model]) {
          this.widget.options.data = this.models[model];
        }
      }
    }
    this.normalizer = normalizer;
  }

  created() {
    this.initData();
    this.copyOption = this.widget.options.options;
    this.visible = false;
    // 请求字典
    if ('radio,select,checkbox,cascader'.includes(this.widget.type) && this.widget.options.remote === 'dict' && this.widget.options.dictType) {
      this.$PROCRUD
        .crud(DML.SELECT, 'ad_codelist', {
          searchCondition: [
            {
              field: 'codeType',
              operator: 'eq',
              value: this.widget.options.dictType,
            },
          ],
        })
        .then((res) => {
          if (this.widget.type === 'cascader') {
            this.widget.options.remoteOptions = JSON.parse(res.data.list[0].codevalue);
            // 请求完成后再渲染组件
            this.visible = true;
          } else {
            this.widget.options.remoteOptions = res.data.list.map((item) => ({
              value: item.codeValue,
              label: item.codeName,
            }));
          }

          this.copyOption = this.widget.options.remoteOptions;
        });
    } else if (
      // 请求自定义方法
      this.widget.options.remote === 'custom' &&
      this.remote[this.widget.options.remoteFunc]
    ) {
      // 请求自定义接口
      this.remote[this.widget.options.remoteFunc]((data) => {
        if (this.widget.type === 'cascader' || this.widget.type === 'treeselect') {
          // 此处递归洗数据,去掉children为null的情况
          this.diGuiTree(data);
          this.widget.options.remoteOptions = data;
          // 请求完成后再渲染组件
          this.visible = true;
        } else {
          this.widget.options.remoteOptions = data.map((item) => ({
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            rightLabel: item[this.widget.options.props.rightLabel] || '',
          }));
        }
        this.copyOption = this.widget.options.remoteOptions;
      });
    } else if (this.widget.options.remote === 'custom') {
      this.visible = true;
    }
  }

  get getRules() {
    const arr = this.widget.rules || [];
    if (arr) {
      arr.forEach((element) => {
        if (element.pattern) {
          element.pattern = new RegExp(this.widget.options.pattern);
        }
      });
    }
    return arr;
  }

  // 子表在只读模式下隐藏增删改按钮
  get tableVisibleList() {
    const view = {
      ...this.widget.options.visibleList,
      btnAdd: false,
      btnAddOnColumnHeader: this.widget.options.visibleList.btnAdd,
    };
    return view;
  }

  // 附件列表在只读模式下隐藏增删改按钮
  get fileVisibleList() {
    const view: any = {};
    if (this.readOnly || this.widget.options.readonly) {
      view.upload = false;
      view.btnEdit = false;
      view.btnDel = false;
    }
    return view;
  }

  // 返回当前下拉列表数据
  get optionsList() {
    if ('dict,custom,search'.includes(this.widget.options.remote)) {
      return this.widget.options.remoteOptions;
    }
    if (typeof this.widget.options.options === 'string') {
      return JSON.parse(this.widget.options.options);
    }
    return this.widget.options.options;
  }

  get label() {
    return 'text'.includes(this.widget.type) ? '' : this.widget.name;
  }

  // 日期选择器pickOptions
  get pickerOptions() {
    const { range } = this.widget.options;
    if (range != null && range !== '') {
      return {
        disabledDate(time) {
          if (range === 'smaller') {
            return time.getTime() >= Date.now();
          }
          if (range === 'greater') {
            return time.getTime() <= Date.now() - 24 * 3600 * 1000;
          }
          return true;
        },
      };
    }
    return {};
  }

  get labelWidth() {
    const { type, labelWidth } = this.widget;
    let label = 'text,comment'.includes(type) ? '0px' : labelWidth || undefined;
    if (label) {
      label = label.toString();
      if (!label.includes('px')) {
        label += 'px';
      }
    }
    return label;
  }

  // 子表params
  get getTableParams() {
    /*  如果外侧传入优先使用传入的params
          此处考虑到一个表单内有多个子表的情况
          通过表格组件中"后端绑定key输入框"中的内容作为子表唯一标识
          格式例如
        formTableConfig:{
          subTable1:{
            tableParams:{
              sid:123
            },
            prefill:{
              sid:456
            }
          },
          subTable2:{
            tableParams:{
              sid:123
            },
            prefill:{
              sid:456
            }
          }
        }
       */
    const table = this.formTableConfig[this.widget.model];
    if (table) {
      const { tableParams } = table;
      if (tableParams) {
        return tableParams;
      }
    }
    // 没有传入则直接使用配置的
    // 格式为 子表字段,主表字段 多个用|隔开
    // 例如 subid,id|subid2,id2 格式
    const obj = {};
    // 默认按照|分隔参数名
    const { tableParams } = this.widget.options;
    if (tableParams) {
      const params = tableParams.split('|');
      for (const group of params) {
        if (group) {
          const key = group.split(',');
          const [field, value] = key;
          // 如果包含中文则默认为直接传参,否则读取相关字段值
          const result = isChinese(value) ? (obj[field] = value) : (obj[field] = this.models[value]);
        }
      }
    }
    return obj;
  }

  // 子表prefill
  get getTablePrefill() {
    // 如果外侧传入了则优先使用外侧传入的params
    if (this.formTableConfig[this.widget.model] && this.formTableConfig[this.widget.model].prefill) {
      return this.formTableConfig[this.widget.model].prefill;
    }
    // 没有传入则直接使用配置的 例如 subid,id|subid2,id2 格式
    const obj = {};
    // 默认按照|分隔参数名
    const { prefill } = this.widget.options;
    if (prefill && prefill !== '') {
      const fills = prefill.split('|');
      for (const group of fills) {
        if (group) {
          const key = group.split(',');
          const [field, value] = key;
          // 如果包含中文则默认为直接传参,否则读取相关字段值
          const result = isChinese(value) ? (obj[field] = value) : (obj[field] = this.models[value]);
        }
      }
    }
    return obj;
  }

  get _$listeners() {
    const _l = {};
    Object.keys(this.$listeners).forEach((k) => {
      if (k.includes(this.widget.model)) {
        _l[k.split(':')[1]] = this.$listeners[k];
      }
    });
    return _l;
  }

  diGuiTree(tree) {
    // 递归便利树结构
    tree.forEach((item) => {
      // eslint-disable-next-line no-unused-expressions
      item.children === '' || item.children === undefined || item.children === null ? delete item.children : this.diGuiTree(item.children);
    });
  }

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

  // 如果表格预设参数发生变化 自动刷新表格
  @Watch('getTableParams', {
    deep: true,
  })
  getTableParamsHandler(val, oldVal) {
    if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
      this.$refs.table.tableReload();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
p {
  margin: 0;
}
.el-radio-group {
  padding-left: 10px;
}
</style>
