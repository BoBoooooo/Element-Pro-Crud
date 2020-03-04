<!--
@file 动态表单最小粒度元素生成
@author ytyang
@copyright NanJing Anshare Tech .Com
@createDate 2018年11月15日10:17:01
-->
<template>
  <el-form-item :prop="widget.type == 'button'?undefined:widget.model"
                :label-width="labelWidth">
    <template #label>
      {{label}}
      <el-popover placement="top-start"
                  title="输入提示"
                  v-if="widget.options.tips"
                  width="200"
                  trigger="hover">
        <i class="el-icon el-icon-question"
           slot="reference"></i>
        <div style="color:#8492a6" v-html="widget.options.tips"></div>
      </el-popover>
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
      <h3 style="text-align:center;margin:10px auto;font-family:KaiTi, STKaiti">
        {{widget.name}}
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
                 :style="{width: widget.options.width}"
                 :remote="widget.options.remote === 'search'&& widget.options.remoteSearchFunc&&widget.options.remoteSearchFunc!=''"
                 :remote-method="search"
                 filterable
                 :data-searchable="widget.options.remoteSearchFunc
                 &&widget.options.remoteSearchFunc!=''
                 &&widget.options.remote === 'search'"
                 :filter-method="selectFilter">
        <el-option v-for="item in optionsList"
                   :key="item.value"
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
                :rows="5"
                :autosize="{ minRows: 4, maxRows: 15}"
                v-model="dataModel"
                :disabled="widget.options.disabled"
                :readonly="widget.options.readonly"
                :placeholder="widget.options.placeholder"
                :style="{width: widget.options.width}"></el-input>
    </template>

    <template v-if="widget.type == 'number'">
      <el-input-number v-model="widget.options.defaultValue"
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
                  v-for="(item, index) in (widget.options.remote
                    ? widget.options.remoteOptions : widget.options.options)"
                  :key="index">
          <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
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
                   :options="widget.options.remoteOptions"
                   filterable
                   :props="{ checkStrictly: true }">
      </el-cascader>
    </template>
    <template v-if="widget.type == 'table'">
      <CrudTable :close_on_click_modal="false"
                 :tableName="widget.options.tableName"
                 :tableDesignerName="widget.options.tableDesignerName"
                 :dialogFormDesignerName="widget.options.dialogFormDesignerName"
                 appendToBody
                 :visibleList="{
                          conditionTitle:false,
                          btnExport:false,
                          ...widget.options.visibleList,
                          btnAdd:false,
                          btnAddOnColumnHeader:widget.options.visibleList.btnAdd,
                        }"
                 :showPagination="widget.options.showPagination"
                 :tableParams="getTableParams"
                 :prefill="getTablePrefill"
                 :remoteFuncs="remote">
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
                  :loadOptions="()=>{}"
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
  </el-form-item>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect';

// 高级查询单个查询内容
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  props: ['widget', 'models', 'rules', 'remote', 'formTableConfig'],
  data() {
    let normalizer;
    if (this.widget.type === 'treeselect') {
      const { value, label } = this.widget.options.props;
      normalizer = node => ({
        id: node[label],
        label: node[value],
      });
    }

    return {
      dataModel: this.models[this.widget.model],
      copyOption: [], // 备份一份初始选项
      visible: false,
      normalizer,
    };
  },
  created() {
    this.copyOption = this.widget.options.options;
    this.visible = false;
    if (
      this.widget.options.remote === 'custom'
      && this.remote[this.widget.options.remoteFunc]
      && (this.widget.options.remoteSearchFunc == null || this.widget.options.remoteSearchFunc === '')
    ) {
      // 请求自定义接口
      this.remote[this.widget.options.remoteFunc]((data) => {
        if (this.widget.type === 'cascader' || this.widget.type === 'treeselect') {
          this.widget.options.remoteOptions = data;
          // 请求完成后再渲染组件
          this.visible = true;
        } else {
          this.widget.options.remoteOptions = data.map(item => ({
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            rightLabel: item.rightLabel,
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
            rightLabel: item.rightLabel,
          }));
          this.copyOption = this.widget.options.remoteOptions;
        }, this.dataModel);
      }
    }
  },
  components: {
    TreeSelect,
  },
  computed: {
    // 返回当前下拉列表数据
    optionsList() {
      if ('dict,custom,search'.includes(this.widget.options.remote)) {
        return this.widget.options.remoteOptions;
      }
      return this.widget.options.options;
    },
    // 左侧label内容,文本以及意见框组件的时候label为空
    label() {
      return 'text,comment'.includes(this.widget.type) ? '' : this.widget.name;
    },
    // 日期选择器pickOptions
    pickerOptions() {
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
    },
    labelWidth() {
      return 'text,comment'.includes(this.widget.type) ? '0px' : undefined;
    },
    // 子表params
    getTableParams() {
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
      if (this.formTableConfig[this.widget.model] && this.formTableConfig[this.widget.model].tableParams) {
        return this.formTableConfig[this.widget.model].tableParams;
      }
      // 没有传入则直接使用配置的
      // 格式为 子表字段,主表字段 多个用|隔开
      // 例如 subid,id|subid2,id2 格式
      const obj = {};
      // 默认按照|分隔参数名
      const { tableParams } = this.widget.options;
      if (tableParams && tableParams !== '') {
        const params = tableParams.split('|');
        for (const group of params) {
          if (group && group !== '') {
            const key = group.split(',');
            obj[key[0]] = this.models[key[1]];
          }
        }
      }
      return obj;
    },
    // 子表prefill
    getTablePrefill() {
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
          if (group && group !== '') {
            const key = group.split(',');
            obj[key[0]] = this.models[key[1]];
          }
        }
      }
      return obj;
    },
  },
  methods: {
    // 1.后端要求下拉列表传值时要同时给key和value
    currentSel(sel, w) {
      this.models[`${w.model}dict`] = this.getValueByKey(sel);
    },
    // 按钮点击
    btnOnClick(widget) {
      this.$emit('btnOnClick', widget);
    },
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
    },
    // 查询远端数据
    search(txt) {
      this.remote[this.widget.options.remoteSearchFunc]((data) => {
        this.widget.options.remoteOptions = data.map(item => ({
          value: item[this.widget.options.props.value],
          label: item[this.widget.options.props.label],
          rightLabel: item.rightLabel,
        }));
      }, txt);
    },
    selectFilter(val) {
      const arr = this.copyOption.filter(item => this.$pinyinmatch.match(item.label || item.value, val));
      this.widget.options.remoteOptions = arr;
      this.widget.options.options = arr;
    },
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val;
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val,
        });
      },
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model];
        // if (this.widget.type === 'select') {
        //   // 2.后端要求下拉列表传值时要同时给key和value
        //   this.models[`${this.widget.model}dict`] = this.getValueByKey(
        //     val[this.widget.model],
        //   );
        // }
      },
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
p {
  margin: 0;
}
</style>
