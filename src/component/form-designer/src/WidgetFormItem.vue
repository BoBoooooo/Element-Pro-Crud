<template>
  <el-form-item
    class="widget-view"
    v-if="element && element.key"
    :class="{
      active: element && selectWidget && selectWidget.key == element.key,
      is_req: element.options.required,
    }"
    :label-width="element.options.hiddenLabel ? '0' : labelWidth"
    @click.native.stop="handleSelectWidget(index)"
  >
    <template #label>
      <template v-if="element.options.hiddenLabel ? '' : label">
        <el-tooltip :content="label" placement="bottom" effect="dark">
          <span v-html="label"></span>
        </el-tooltip>
        <i v-if="element.options.tips" class="el-icon el-icon-question"></i>
      </template>
    </template>
    <template v-if="element.type === 'input'">
      <el-input
        v-model="element.options.defaultValue"
        :show-word-limit="element.options.showWordLimit"
        :maxlength="element.options.maxLength"
        :style="{ width: element.options.width }"
        :placeholder="element.options.placeholder"
        :suffix-icon="element.options.suffix"
        :prefix-icon="element.options.prefix"
      >
        <span slot="prepend" v-if="element.options.prepend">
          {{ element.options.prepend }}
        </span>
        <template slot="append" v-if="element.options.append || element.options.appendButton">
          <span v-if="!element.options.appendButton">
            {{ element.options.append }}
          </span>
          <el-button icon="el-icon-info" v-else>
            {{ element.options.append }}
          </el-button>
        </template>
      </el-input>
    </template>
    <template v-if="element.type === 'text'">
      <h3
        style="padding: 10px; font-family: KaiTi, STKaiti; margin: 0"
        :style="{
          'text-align': element.options.align,
          'font-size': element.options.fontSize,
        }"
      >
        {{ element.name }}
      </h3>
    </template>
    <template v-if="element.type === 'html'">
      <div style="margin-left: 30px" v-html="element.options.html"></div>
    </template>
    <template v-if="element.type === 'divider'">
      <el-divider :content-position="element.options.align">{{ element.name }}</el-divider>
    </template>
    <template v-if="element.type === 'button'">
      <el-button :type="element.options.btnType">{{ element.options.text }}</el-button>
    </template>
    <template v-if="element.type === 'textarea'">
      <el-input
        type="textarea"
        :rows="5"
        :maxlength="element.options.maxLength"
        :show-word-limit="element.options.showWordLimit"
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :placeholder="element.options.placeholder"
      ></el-input>
    </template>

    <template v-if="element.type === 'number'">
      <el-input-number
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :controls-position="element.options.controlsPosition"
        :style="{ width: element.options.width }"
      ></el-input-number>
    </template>

    <template v-if="element.type === 'radio'">
      <el-radio-group v-model="element.options.defaultValue" :style="{ width: element.options.width }">
        <el-radio :style="{ display: element.options.inline ? 'inline-block' : 'block' }" :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index">
          {{ element.options.showLabel ? item.label : item.value }}
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type === 'checkbox'">
      <el-checkbox-group v-model="element.options.defaultValue" :style="{ width: element.options.width }">
        <template v-if="!element.options.buttonStyle">
          <el-checkbox :style="{ display: element.options.inline ? 'inline-block' : 'block' }" :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index">
            {{ element.options.showLabel ? item.label : item.value }}
          </el-checkbox>
        </template>

        <el-checkbox-button
          v-else
          :style="{ display: element.options.inline ? 'inline-block' : 'block' }"
          :label="item.value"
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
        >
          {{ element.options.showLabel ? item.label : item.value }}
        </el-checkbox-button>
      </el-checkbox-group>
    </template>

    <template v-if="element.type === 'time'">
      <el-time-picker
        v-model="element.options.defaultValue"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :arrowControl="element.options.arrowControl"
        :style="{ width: element.options.width }"
      >
      </el-time-picker>
    </template>

    <template v-if="element.type === 'date'">
      <el-date-picker
        v-model="element.options.defaultValue"
        :type="element.options.type"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :style="{ width: element.options.width }"
      >
      </el-date-picker>
    </template>

    <template v-if="element.type === 'rate'">
      <el-rate v-model="element.options.defaultValue" :max="element.options.max" :disabled="element.options.disabled" :allow-half="element.options.allowHalf"></el-rate>
    </template>

    <template v-if="element.type === 'color'">
      <el-color-picker v-model="element.options.defaultValue" :disabled="element.options.disabled" :show-alpha="element.options.showAlpha"></el-color-picker>
    </template>

    <template v-if="element.type === 'select'">
      <el-select
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :multiple="element.options.multiple"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{ width: element.options.width }"
      >
        <el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel ? item.label : item.value"></el-option>
      </el-select>
    </template>

    <template v-if="element.type === 'switch'">
      <el-switch v-model="element.options.defaultValue" :disabled="element.options.disabled"> </el-switch>
    </template>

    <template v-if="element.type === 'slider'">
      <el-slider
        v-model="element.options.defaultValue"
        :min="element.options.min"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :step="element.options.step"
        :show-input="element.options.showInput"
        :range="element.options.range"
        :style="{ width: element.options.width }"
      ></el-slider>
    </template>
    <template v-if="element.type === 'cascader'">
      <el-cascader
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{ width: element.options.width }"
        :options="element.options.remoteOptions"
      >
      </el-cascader>
    </template>
    <template v-if="element.type === 'table'">
      <h4 style="text-align: center; margin: 0">表格({{ element.model }})</h4>
    </template>
    <template v-if="element.type == 'blank'">
      <h4 style="text-align: center; margin: 0">自定义插槽({{ element.model }})</h4>
    </template>
    <template v-if="element.type === 'treeselect'">
      <treeselect v-model="element.options.defaultValue" :options="[]" :placeholder="element.options.placeholder" />
    </template>
    <template v-if="element.type === 'richtext'">
      <Tinymce :height="400" v-model="element.options.defaultValue" />
    </template>
    <template v-if="element.type === 'upload'">
      <h4 style="text-align: center; margin: 0">附件上传</h4>
    </template>
    <template v-if="element.type === 'avatar'">
      <AvatarUpload :widget="element"></AvatarUpload>
    </template>
    <template v-if="element.type === 'chart-pie'">
      <PieChart :data="element.options.data" :height="element.options.height" :title="element.name" :hollow="element.options.hollow" />
    </template>
    <template v-if="element.type === 'chart-line'">
      <LineChart
        :height="element.options.height"
        :data="element.options.data"
        :title="element.name"
        :rotate="element.options.rotate"
        :type="element.options.type"
        :yAxisMax="element.options.yAxisMax"
        :xUnit="element.options.xUnit"
        :yUnit="element.options.yUnit"
      />
    </template>
    <template v-if="element.type === 'chart-common'">
      <Echarts :title="element.name" :height="element.options.height" :option="element.options.option" :loop="element.options.loop"> </Echarts>
    </template>
    <template v-if="element.type === 'form'">
      <WidgetSubForm
        v-if="element && element.key"
        :key="element.key"
        :element="element"
        :select.sync="selectWidget"
        :index="index"
        :data="data"
        @click.native.stop="handleSelectWidget(index)"
      ></WidgetSubForm>
    </template>
    <div class="widget-view-action" v-if="selectWidget && selectWidget.key == element.key">
      <i class="el-icon el-icon-document-copy" @click.stop="handleWidgetClone(index)"></i>
      <i class="el-icon el-icon-delete-solid" @click.stop="handleWidgetDelete(index)"></i>
    </div>
    <div class="widget-view-drag" v-if="selectWidget && selectWidget.key == element.key">
      <i class="drag-widget el-icon el-icon-rank"></i>
    </div>
    <div class="widget-view-model">
      <span>{{ element.model }}</span>
    </div>
  </el-form-item>
</template>

<script>
import { random } from '@/utils/generator';
import { AvatarUpload, Echarts, PieChart, LineChart, Tinymce } from '@/component/modules/index';
import WidgetSubForm from './components/SubForm/WidgetSubForm.vue';

export default {
  name: 'WidgetFormItem',
  props: {
    element: {
      type: Object,
      default: () => ({}),
    },
    select: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    customListField: {
      type: Array,
      default: null,
    },
  },
  components: {
    Tinymce,
    PieChart,
    LineChart,
    Echarts,
    AvatarUpload,
    WidgetSubForm,
  },
  data() {
    return {
      selectWidget: this.select,
    };
  },
  computed: {
    labelWidth() {
      const { type, labelWidth } = this.element;
      let label = 'text,comment'.includes(type) ? '0px' : labelWidth || undefined;
      if (label) {
        label = label.toString();
        if (!label.includes('px')) {
          label += 'px';
        }
      }
      return label;
    },
    // 左侧label内容,文本以及意见框组件的时候label为空
    label() {
      return 'text,comment'.includes(this.element.type) ? '' : this.element.name;
    },
  },
  methods: {
    handleSelectWidget(index) {
      const fieldList = this.customListField || this.data.list;
      this.selectWidget = fieldList[index];
    },
    handleWidgetDelete(index) {
      const field = this.customListField || this.data.list;
      if (field.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = field[index - 1];
        }
      } else {
        this.selectWidget = field[index + 1];
      }
      this.$nextTick(() => {
        field.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      const field = this.customListField || this.data.list;
      const cloneData = {
        ...JSON.parse(JSON.stringify(field[index])),
        key: `${field[index].type}_${random()}`,
      };

      field.splice(index, 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = field[index + 1];
      });
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val);
      },
      deep: true,
    },
  },
};
</script>
