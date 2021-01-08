<template>
  <el-form-item class="widget-view "
                v-if="element && element.key"
                :class="{
                  active: selectWidget.key == element.key,
                  'is_req': element.options.required
                  }"
                :label-width="element.options.hiddenLabel ? '0' : labelWidth"
                @click.native.stop="handleSelectWidget(index)">
    <template #label>
      <template v-if="element.options.hiddenLabel ? '' : label">
        <span v-html="label"></span>
        <i v-if="element.options.tips" class="el-icon el-icon-question"></i>
      </template>
    </template>
    <template v-if="element.type === 'input'">
      <el-input v-model="element.options.defaultValue"
                :style="{width: element.options.width}"
                :placeholder="element.options.placeholder"></el-input>
    </template>
     <template v-if="element.type === 'text'">
        <h3 style="
            padding: 10px;
            font-family: KaiTi, STKaiti;
            margin: 0;
          "
          :style="{
            'text-align': element.options.align,
            'font-size': element.options.fontSize
          }">
         {{element.name}}
       </h3>
    </template>
    <template v-if="element.type === 'html'">
       <div style="margin-left:30px" v-html="element.options.defaultValue"></div>
    </template>
    <template v-if="element.type === 'divider'">
      <el-divider :content-position="element.options.align">{{element.name}}</el-divider>
    </template>
    <template v-if="element.type === 'button'">
      <el-button type="primary">{{element.options.text}}</el-button>
    </template>
    <template v-if="element.type === 'textarea'">
      <el-input type="textarea"
                :rows="5"
                v-model="element.options.defaultValue"
                :style="{width: element.options.width}"
                :placeholder="element.options.placeholder"></el-input>
    </template>

    <template v-if="element.type === 'number'">
      <el-input-number v-model="element.options.defaultValue"
                       :disabled="element.options.disabled"
                       :controls-position="element.options.controlsPosition"
                       :style="{width: element.options.width}"></el-input-number>
    </template>

    <template v-if="element.type === 'radio'">
      <el-radio-group v-model="element.options.defaultValue"
                      :style="{width: element.options.width}">
        <el-radio :style="{display: element.options.inline ? 'inline-block' : 'block'}"
                  :label="item.value"
                  v-for="(item, index) in element.options.options"
                  :key="item.value + index">
          {{element.options.showLabel ? item.label : item.value}}
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type === 'checkbox'">
      <el-checkbox-group v-model="element.options.defaultValue"
                         :style="{width: element.options.width}">
        <template v-if="!element.options.buttonStyle">
            <el-checkbox
                        :style="{display: element.options.inline ? 'inline-block' : 'block'}"
                        :label="item.value"
                        v-for="(item, index) in element.options.options"
                        :key="item.value + index">
              {{element.options.showLabel ? item.label : item.value}}
            </el-checkbox>

        </template>

         <el-checkbox-button v-else :style="{display: element.options.inline ? 'inline-block' : 'block'}"
                     :label="item.value"
                     v-for="(item, index) in element.options.options"
                     :key="item.value + index">
          {{element.options.showLabel ? item.label : item.value}}
        </el-checkbox-button>
      </el-checkbox-group>
    </template>

    <template v-if="element.type === 'time'">
      <el-time-picker v-model="element.options.defaultValue"
                      :is-range="element.options.isRange"
                      :placeholder="element.options.placeholder"
                      :start-placeholder="element.options.startPlaceholder"
                      :end-placeholder="element.options.endPlaceholder"
                      :readonly="element.options.readonly"
                      :disabled="element.options.disabled"
                      :editable="element.options.editable"
                      :clearable="element.options.clearable"
                      :arrowControl="element.options.arrowControl"
                      :style="{width: element.options.width}">
      </el-time-picker>
    </template>

    <template v-if="element.type === 'date'">
      <el-date-picker v-model="element.options.defaultValue"
                      :type="element.options.type"
                      :is-range="element.options.isRange"
                      :placeholder="element.options.placeholder"
                      :start-placeholder="element.options.startPlaceholder"
                      :end-placeholder="element.options.endPlaceholder"
                      :readonly="element.options.readonly"
                      :disabled="element.options.disabled"
                      :editable="element.options.editable"
                      :clearable="element.options.clearable"
                      :style="{width: element.options.width}">
      </el-date-picker>
    </template>

    <template v-if="element.type === 'rate'">
      <el-rate v-model="element.options.defaultValue"
               :max="element.options.max"
               :disabled="element.options.disabled"
               :allow-half="element.options.allowHalf"></el-rate>
    </template>

    <template v-if="element.type === 'color'">
      <el-color-picker v-model="element.options.defaultValue"
                       :disabled="element.options.disabled"
                       :show-alpha="element.options.showAlpha"></el-color-picker>
    </template>

    <template v-if="element.type === 'select'">
      <el-select v-model="element.options.defaultValue"
                 :disabled="element.options.disabled"
                 :multiple="element.options.multiple"
                 :clearable="element.options.clearable"
                 :placeholder="element.options.placeholder"
                 :style="{width: element.options.width}">
        <el-option v-for="item in element.options.options"
                   :key="item.value"
                   :value="item.value"
                   :label="element.options.showLabel?item.label:item.value"></el-option>
      </el-select>
    </template>

    <template v-if="element.type ==='switch'">
      <el-switch v-model="element.options.defaultValue"
                 :disabled="element.options.disabled">
      </el-switch>
    </template>

    <template v-if="element.type ==='slider'">
      <el-slider v-model="element.options.defaultValue"
                 :min="element.options.min"
                 :max="element.options.max"
                 :disabled="element.options.disabled"
                 :step="element.options.step"
                 :show-input="element.options.showInput"
                 :range="element.options.range"
                 :style="{width: element.options.width}"></el-slider>
    </template>
    <template v-if="element.type === 'cascader'">
      <el-cascader v-model="element.options.defaultValue"
                   :disabled="element.options.disabled"
                   :clearable="element.options.clearable"
                   :placeholder="element.options.placeholder"
                   :style="{width: element.options.width}"
                   :options="element.options.remoteOptions">
      </el-cascader>
    </template>
      <template v-if="element.type ==='comment'">
       <h4 style="text-align:center;margin:0">意见框</h4>
    </template>
     <template v-if="element.type ==='table'">
       <h4 style="text-align:center;margin:0">表格({{element.model}})</h4>
    </template>
      <template v-if="element.type === 'treeselect'">
       <h4 style="text-align:center;margin:0">树形下拉框({{element.model}})</h4>
    </template>
    <template v-if="element.type === 'richtext'">
      <Tinymce :height="400"
               v-model="element.options.defaultValue" />
    </template>
    <template v-if="element.type === 'upload'">
      <h4 style="text-align:center;margin:0">附件上传</h4>
    </template>
    <!-- <template v-if="element.type === 'form'">
      <WidgetSubForm :element="element" :select="select" :index="index" :data="data"></WidgetSubForm>
    </template> -->
    <div class="widget-view-action" v-if="selectWidget.key == element.key">
          <i class="el-icon el-icon-document-copy" @click.stop="handleWidgetClone(index)"></i>
          <i class="el-icon el-icon-delete-solid" @click.stop="handleWidgetDelete(index)"></i>
    </div>
    <div class="widget-view-drag" v-if="selectWidget.key == element.key">
      <i class="drag-widget el-icon el-icon-rank"></i>
    </div>
    <div class="widget-view-model"><span>{{element.model}}</span></div>
  </el-form-item>
</template>

<script>
import WidgetSubForm from './components/SubForm/WidgetSubForm.vue';
import Tinymce from './components/Tinymce'; // 富文本编辑器

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
    // WidgetSubForm,
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
      this.selectWidget = this.data.list[index];
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
      console.log(field);

      this.$nextTick(() => {
        field.splice(index, 1);
      });
    },
    handleWidgetClone(index) {
      const field = this.customListField || this.data.list;
      let cloneData = {
        ...field[index],
        options: { ...field[index].options },
        key: `${field[index].type}_${Math.ceil(Math.random() * 99999)}`,
      };

      if (
        field[index].type === 'radio'
        || field[index].type === 'checkbox'
      ) {
        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map(item => ({ ...item })),
          },
        };
      }

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