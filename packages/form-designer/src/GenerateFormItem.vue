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
  <el-form-item :prop="widget.type == 'button'?undefined:widget.model"
                :label-width="widget.options.hiddenLabel ? '0' : labelWidth">
    <template #label>
      <template v-if="widget.options.hiddenLabel ? '' : label">
        <span v-html="label"></span>
        <el-popover placement="top-start"
                    title="输入提示"
                    v-if="widget.options.tips"
                    width="200"
                    trigger="hover">
          <i class="el-icon el-icon-question"
            slot="reference"></i>
          <div style="color:#8492a6"
              v-html="widget.options.tips"></div>
        </el-popover>
      </template>
    </template>
    <template v-if="widget.type === 'html'">
       <div style="margin-left:10px" v-html="widget.options.defaultValue"></div>
    </template>
    <template v-if="widget.type === 'divider'">
      <el-divider :content-position="widget.options.align">{{widget.name}}</el-divider>
    </template>
    <template v-if="widget.type == 'input'">
      <el-input v-if="widget.options.dataType == 'number'
                      || widget.options.dataType == 'integer'
                      || widget.options.dataType == 'float'"
                :type="widget.options.dataType"
                v-model.number="dataModel"
                :placeholder="widget.options.placeholder"
                :readonly="widget.options.readonly"
                :disabled="widget.options.disabled"
                :style="{width: widget.options.width}"></el-input>
      <el-input v-else
                :type="widget.options.dataType"
                v-model="dataModel"
                :placeholder="widget.options.placeholder"
                :readonly="widget.options.readonly"
                :disabled="widget.options.disabled"
                :style="{width: widget.options.width}"></el-input>
    </template>
    <template v-if="widget.type == 'button'">
      <el-button type="primary"
                 @click="btnOnClick(widget)">{{widget.options.text}}</el-button>
    </template>
    <template v-if="widget.type == 'text'">
      <h3
        style="
          padding: 10px;
          font-family: KaiTi, STKaiti;
          margin: 0;
        "
        :style="{
          'text-align': widget.options.align,
          'font-size': widget.options.fontSize
        }">
        {{ widget.name }}
      </h3>
    </template>
    <template v-if="widget.type == 'label'">
      <p>{{dataModel}}</p>
    </template>
    <template v-if="widget.type == 'select'">
      <el-select v-model="dataModel"
                 default-first-option
                 :disabled="widget.options.disabled"
                 :multiple="widget.options.multiple"
                 allow-create
                 clearable
                 :placeholder="widget.options.placeholder"
                 :style="{width: widget.options.width || '100%'}"
                 :remote="widget.options.remote === 'search'&& widget.options.remoteSearchFunc&&widget.options.remoteSearchFunc!=''"
                 :remote-method="search"
                 filterable
                 :data-searchable="widget.options.remoteSearchFunc
                 &&widget.options.remoteSearchFunc!=''
                 &&widget.options.remote === 'search'">
        <el-option v-for="(item,index) in optionsList"
                   :key="index"
                   :value="item.value"
                   :label="widget.options.showLabel
                           || widget.options.remote
                           ?item.label:item.value">
          <span style="float: left">{{ item.label || item.value }}</span>
          <span v-if="item.rightLabel"
                style="float: right; color: #8492a6; font-size: 1em">{{ item.rightLabel }}</span>
        </el-option>
      </el-select>
    </template>
    <template v-if="widget.type == 'textarea'">
      <el-input type="textarea"
                :autosize="{ minRows: 5}"
                v-model="dataModel"
                :disabled="widget.options.disabled"
                :readonly="widget.options.readonly"
                :placeholder="widget.options.placeholder"
                :style="{width: widget.options.width}"></el-input>
    </template>

    <template v-if="widget.type == 'number'">
      <el-input-number v-model="dataModel"
                       :style="{width: widget.options.width}"
                       :step="widget.options.step"
                       :disabled="widget.options.disabled"
                       controls-position="right"></el-input-number>
    </template>

    <template v-if="widget.type == 'radio'">
      <el-radio-group v-model="dataModel"
                      :style="{width: widget.options.width}"
                      :disabled="widget.options.disabled">
        <el-radio :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
                  :label="item.value"
                   v-for="(item, index) in optionsList"
                  :key="index">
              <template v-if="widget.options.showLabel">{{ item.label }}</template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="widget.type == 'checkbox'">

      <el-checkbox-group v-model="dataModel"
                         :style="{width: widget.options.width}">
        <template v-if="!widget.options.buttonStyle">
          <el-checkbox :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
                       :label="item.value"
                       :min="widget.options.min"
                       :max="widget.options.max"
                       v-for="(item, index) in optionsList"
                       :key="item.value + index">
            {{widget.options.showLabel ? item.label : item.value}}
          </el-checkbox>
        </template>
        <el-checkbox-button v-else
                            :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
                            :label="item.value"
                            v-for="(item, index) in optionsList"
                            :key="item.value + index">
          {{widget.options.showLabel ? item.label : item.value}}
        </el-checkbox-button>
      </el-checkbox-group>
    </template>

    <template v-if="widget.type == 'time'">
      <el-time-picker v-model="dataModel"
                      :is-range="widget.options.isRange"
                      :placeholder="widget.options.placeholder"
                      :start-placeholder="widget.options.startPlaceholder"
                      :end-placeholder="widget.options.endPlaceholder"
                      :readonly="widget.options.readonly"
                      :disabled="widget.options.disabled"
                      :editable="widget.options.editable"
                      :clearable="widget.options.clearable"
                      :arrowControl="widget.options.arrowControl"
                      :value-format="widget.options.format"
                      :style="{width: widget.options.width}">
      </el-time-picker>
    </template>

    <template v-if="widget.type=='date'">
      <el-date-picker v-model="dataModel"
                      :type="widget.options.type"
                      :placeholder="widget.options.placeholder"
                      :start-placeholder="widget.options.startPlaceholder"
                      :end-placeholder="widget.options.endPlaceholder"
                      :readonly="widget.options.readonly"
                      :disabled="widget.options.disabled"
                      :editable="widget.options.editable"
                      :clearable="widget.options.clearable"
                      :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
                      :format="widget.options.format"
                      :style="{width: widget.options.width}"
                      :picker-options="pickerOptions">
      </el-date-picker>
    </template>

    <template v-if="widget.type =='rate'">
      <el-rate v-model="dataModel"
               :max="widget.options.max"
               :disabled="widget.options.disabled"
               :allow-half="widget.options.allowHalf"></el-rate>
    </template>

    <template v-if="widget.type == 'color'">
      <el-color-picker v-model="dataModel"
                       :disabled="widget.options.disabled"
                       :show-alpha="widget.options.showAlpha"></el-color-picker>
    </template>

    <template v-if="widget.type=='switch'">
      <el-switch v-model="dataModel"
                 :disabled="widget.options.disabled">
      </el-switch>
    </template>

    <template v-if="widget.type=='slider'">
      <el-slider v-model="dataModel"
                 :min="widget.options.min"
                 :max="widget.options.max"
                 :disabled="widget.options.disabled"
                 :step="widget.options.step"
                 :show-input="widget.options.showInput"
                 :range="widget.options.range"
                 :style="{width: widget.options.width}"></el-slider>
    </template>
    <template v-if="widget.type == 'cascader'">
      <el-cascader v-model="dataModel"
                   :disabled="widget.options.disabled"
                   :clearable="widget.options.clearable"
                   :placeholder="widget.options.placeholder"
                   :style="{width: widget.options.width}"
                   :separator="widget.options.separator == null ?'/':widget.options.separator"
                   :options="optionsList"
                   filterable
                   :props="{ checkStrictly: widget.options.checkStrictly }">
      </el-cascader>
    </template>
    <template v-if="widget.type == 'table'">
      <CrudTable :closeOnClickModal="false"
                 ref="table"
                 @selection="getTableSelection"
                 :tableName="widget.options.tableName"
                 :tableDesignerName="widget.options.tableDesignerName"
                 :dialogFormDesignerName="widget.options.dialogFormDesignerName"
                 appendToBody
                 :visibleList="visibleList"
                 :showPagination="widget.options.showPagination"
                 :isMultiple="widget.options.isMultiple"
                 :tableParams="getTableParams"
                 :prefill="getTablePrefill"
                 :remoteFuncs="remote">
        <template #btnBarPrevBtn>
          <slot :name="widget.model+'_btnBarPrevBtn'">
          </slot>
        </template>
        <template #btnCustom="{row}">
          <slot :name="widget.model+'_btnCustom'"
                :row="row">
          </slot>
        </template>
        <template #columnFormatter="{row, prop}">
          <slot :name="widget.model+'_columnFormatter'"
                :row="row"
                :prop="prop">
          </slot>
        </template>
      </CrudTable>
    </template>
    <template v-if="widget.type === 'treeselect'">
      <!-- 目前暂时提供了几个常用props,有更多需要自行拓展 -->
      <!-- 官网:https://vue-treeselect.js.org -->
      <TreeSelect v-model="dataModel"
                  v-if="visible"
                  :placeholder="widget.options.placeholder"
                  :maxHeight="+widget.options.maxHeight"
                  :multiple="widget.options.multiple"
                  :normalizer="normalizer"
                  :append-to-body="widget.options.appendToBody"
                  :loadOptions="({ action, parentNode, callback })=> {
                    if(parentNode.children )  parentNode.children = []
                     callback()
                  }"
                  valueConsistsOf="ALL"
                  :clearable="widget.options.clearable"
                  :searchable="widget.options.searchable"
                  :noChildrenText="widget.options.noChildrenText"
                  :noOptionsText="widget.options.noOptionsText"
                  :noResultsText="widget.options.noResultsText"
                  :disabled="widget.options.disabled"
                  :showCount="widget.options.showCount"
                  :disable-branch-nodes="widget.options.disableBranchNodes"
                  :options="widget.options.remoteOptions"
                  :searchNested="widget.options.searchNested">
        <!-- <template  slot="value-label" slot-scope="{ node }" v-if="widget.options.showValueLabelSlot">
        <slot name="tree-select-value-label" :node="node"></slot>
      </template> -->
      </TreeSelect>
    </template>
    <template v-if="widget.type=='richtext'">
      <Tinymce :height="400"
               v-model="dataModel"
               :readonly="widget.options.readonly"></Tinymce>

    </template>
    <template v-if="widget.type=='upload'">
      <!-- 附件上传(注意初始值prefill必须传入id) -->
      <FileUpload :visibleList="fileVisibleList"
                  :fileType='widget.options.fileType'
                  :readOnly="widget.options.readonly || readOnly === {}"
                  showPagination
                  :resourceid="models[widget.options.resourceId]"></FileUpload>
    </template>
    <template v-if="widget.type === 'form'">
      <GenerateSubForm :widget="widget"></GenerateSubForm>
    </template>
  </el-form-item>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import TreeSelect from '@riophae/vue-treeselect';
import { DML } from '@/types/common';
import { isChinese } from '@/utils/utils';
import Tinymce from './components/Tinymce/index.vue'; // 富文本编辑器
import FileUpload from './components/FileUpload/FileUpload.vue';
import GenerateSubForm from './components/SubForm/GenerateSubForm.vue';

// 高级查询单个查询内容
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

@Component({
  components: {
    TreeSelect,
    Tinymce,
    FileUpload,
    GenerateSubForm,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  name: 'GenerateFormItem',
})
export default class GenerateFormItem extends Vue {
  $refs!: {
    table: HTMLFormElement;
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
    type: Object,
    default: () => ({}),
  })
  readOnly: any;

  // 子表单单个组件value
  @Prop()
  value: any;

  // 子表单单个组件初始值model
  @Prop()
  model: any;

  // 当前组件对象
  dataModel: string | number | null | object = this.models[this.widget.model] || null;

  copyOption: any = []; // 备份一份初始选项

  visible = false;

  normalizer: any;

  initData() {
    // 如果是子表单
    if (this.model) {
      if (this.widget.options.multiple || 'cascader,checkbox'.includes(this.widget.type)) {
        this.dataModel = typeof this.model === 'string' ? this.model.split(',') : this.model;
      } else {
        this.dataModel = this.model;
      }
      return;
    }
    let normalizer;
    if (this.widget.type === 'treeselect') {
      const { value, label } = this.widget.options.props;
      normalizer = (node) => {
        // 去掉children=null的属性
        if (node.children === null || node.children === 'null') {
          delete node.children;
        }
        // 此处暂时写反了...暂时不做修改
        return {
          id: node[value],
          label: node[label],
        };
      };
    }
    const model = this.models[this.widget.model];
    this.normalizer = normalizer;
    this.dataModel = model;
  }

  created() {
    this.initData();
    if (this.widget.type === 'table') {
      // eslint-disable-next-line no-unused-expressions
      this.$EventBus && this.$EventBus.$on(`refresh:subTable:${this.widget.model}`, () => {
        this.$refs.table.tableReload();
      });
    }
    this.copyOption = this.widget.options.options;
    this.visible = false;
    // 请求字典
    if ('radio,select,checkbox,cascader'.includes(this.widget.type) && this.widget.options.remote === 'dict' && this.widget.options.dictType) {
      this.$PROCRUD.crud(DML.SELECT, 'ad_codelist', {
        searchCondition: [
          {
            field: 'codeType',
            operator: 'eq',
            value: this.widget.options.dictType,
          },
        ],
      }).then((res) => {
        if (this.widget.type === 'cascader') {
          this.widget.options.remoteOptions = JSON.parse(res.data.list[0].codevalue);
          // 请求完成后再渲染组件
          this.visible = true;
        } else {
          this.widget.options.remoteOptions = res.data.list.map(item => ({
            value: item.codeValue,
            label: item.codeName,
          }));
        }

        this.copyOption = this.widget.options.remoteOptions;
      });
    } else if (
      this.widget.options.remote === 'custom'
      && this.remote[this.widget.options.remoteFunc]
      && (this.widget.options.remoteSearchFunc == null || this.widget.options.remoteSearchFunc === '')
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
          this.widget.options.remoteOptions = data.map(item => ({
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            rightLabel: item[this.widget.options.props.rightLabel] || '',
          }));
        }
        this.copyOption = this.widget.options.remoteOptions;
      });
    } else if (this.widget.options.remoteSearchFunc != null && this.widget.options.remoteSearchFunc !== '') {
      // 模糊查询
      this.widget.options.remoteOptions = [];
      // 根据默认值加载下拉菜单
      if (this.dataModel != null && this.dataModel !== '') {
        this.remote[`${this.widget.options.remoteSearchFunc}ForLoad`]((data) => {
          this.widget.options.remoteOptions = data.map(item => ({
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            rightLabel: item[this.widget.options.props.rightLabel],
          }));
          this.copyOption = this.widget.options.remoteOptions;
        }, this.dataModel);
      }
    }
  }

  // 子表在只读模式下隐藏增删改按钮
  get visibleList() {
    const view = {
      ...this.widget.options.visibleList,
      btnAdd: false,
      btnAddOnColumnHeader: this.widget.options.visibleList.btnAdd,
    };
    if ((this.readOnly && Object.keys(this.readOnly).length === 0) || this.widget.options.readonly) {
      view.btnAddOnColumnHeader = false;
      view.actionColumnBtnDel = false;
      view.actionColumnBtnEdit = false;
      view.actionColumnBtnDetail = true;
      view.btnImport = false;
    }
    return view;
  }

  // 附件列表在只读模式下隐藏增删改按钮
  get fileVisibleList() {
    const view: any = {};
    if ((this.readOnly && Object.keys(this.readOnly).length === 0) || this.widget.options.readonly) {
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
    return this.widget.options.options;
  }

  // 左侧label内容,文本以及意见框组件的时候label为空
  get label() {
    return 'text,comment'.includes(this.widget.type) ? '' : this.widget.name;
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

  diGuiTree(tree) {
    // 递归便利树结构
    tree.forEach((item) => {
      // eslint-disable-next-line no-unused-expressions
      item.children === '' || item.children === undefined || item.children === null ? delete item.children : this.diGuiTree(item.children);
    });
  }

  // 1.后端要求下拉列表传值时要同时给key和value
  currentSel(sel, w) {
    this.models[`${w.model}dict`] = this.getValueByKey(sel);
  }

  // 按钮点击
  btnOnClick(widget) {
    this.$emit('btnOnClick', widget);
  }

  // 根据选中的key获取value
  getValueByKey(key) {
    if (key === '' || key == null) {
      return null;
    }
    // 根据key找到下拉列表项
    const selected = this.optionsList.find(item => item.value === key);
    let label;
    // 如果找到匹配列表项
    if (selected) {
      ({ label } = selected);
    } else {
      // this.$notify({
      //   title: `[${this.widget.name}]匹配菜单项失败`,
      //   message: `${key}无法找到对应的值`,
      //   duration: 5000,
      // });
    }
    return label;
  }

  // 查询远端数据
  search(txt) {
    this.remote[this.widget.options.remoteSearchFunc]((data) => {
      this.widget.options.remoteOptions = data.map(item => ({
        value: item[this.widget.options.props.value],
        label: item[this.widget.options.props.label],
        rightLabel: item.rightLabel,
      }));
    }, txt);
  }

  selectFilter(val) {
    if (val) {
      const arr = this.copyOption.filter(item => this.$pinyinmatch.match(item.label || item.value, val));
      this.widget.options.remoteOptions = arr;
      this.widget.options.options = arr;
    } else {
      this.widget.options.options = this.copyOption;
      this.widget.options.remoteOptions = this.copyOption;
    }
  }

  getTableSelection(selection) {
    this.$emit('selection', selection);
  }

  beforeDestroy() {
    // eslint-disable-next-line no-unused-expressions
    this.$EventBus && this.$EventBus.$off(`refresh:subTable:${this.widget.model}`);
  }

  @Watch('dataModel')
  dataModelHandler(val) {
    this.$set(this.models, this.widget.model, val);
    this.$emit('change', val);
  }

  @Watch('models', {
    deep: true,
  })
  modelsHandler(val) {
    const updateVal = val[this.widget.model];
    if (updateVal !== this.dataModel) {
      if (this.widget.options.multiple || 'cascader,checkbox'.includes(this.widget.type)) {
        const value = val[this.widget.model];
        this.dataModel = typeof value === 'string' ? value.split(',') : value;
      } else {
        this.dataModel = val[this.widget.model];
      }
    }
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
</style>
