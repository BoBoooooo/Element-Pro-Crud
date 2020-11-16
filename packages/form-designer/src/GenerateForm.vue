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
    <el-form ref="generateForm"
             :class='{"table-form":data.config.isTableClass}'
             :model="models"
             :rules="rules"
             :label-position="data.config.labelPosition"
             :label-width="data.config.labelWidth?data.config.labelWidth+ 'px':'140px'"
             size="small">
      <!-- 遍历从父组件传入的data，data下有list和config两个属性，list下的每个对象是表示一行组件的集合 -->
      <template v-for="item in this.data.list">
        <!-- 如果这一行时网格grid布局 -->
        <template v-if="item.type == 'grid'">
          <!-- 每一行元素与基于el-row和el-col生成 -->
          <el-row :key="item.key"
                  type="flex"
                  :gutter="item.options.gutter ? item.options.gutter : 0"
                  :justify="item.options.justify"
                  :align="item.options.align">
            <!-- 生成每一行中的每一列元素 -->
            <el-col v-for="(col, colIndex) in item.columns"
                    :key="colIndex"
                    :span="col.span">
              <!-- 遍历生成该列所有组件 -->
              <template v-for="citem in col.list">
                <!-- 如果一个元素的type是blank就加载插槽 -->
                <el-form-item v-if="citem.type=='blank'"
                              v-show="!citem.hidden"
                              :label="citem.name"
                              :prop="citem.model"
                              :key="citem.key">
                  <slot :name="citem.model"
                        :widget="citem"
                        :model="models"></slot>
                </el-form-item>
                <!-- 意见框 -->
                <el-form-item v-else-if="citem.type=='comment'"
                              label=""
                              label-width="0px"
                              :prop="citem.model"
                              :key="citem.key"
                              style="margin-top: -10px;margin-bottom: -10px!important;margin-left:-1px">
                  <slot name="comment"></slot>
                </el-form-item>
                <!-- 正常组件通过GenerateFormItem生成 -->
                <GenerateFormItem v-else
                                  @selection="getTableSelection($event,citem)"
                                  :key="citem.key"
                                  :models="models"
                                  :remote="remote"
                                  :rules="rules"
                                  :widget="citem"
                                  :readOnly="setReadOnly"
                                  @btnOnClick="btnOnClick"
                                  v-show="!citem.hidden"
                                  :formTableConfig="formTableConfig">
                  <template slot="tree-select-value-label"
                            slot-scope="{ node }">
                    <slot name="tree-select-value-label"
                          :node="node"></slot>
                  </template>
                  <!-- btnBarPrevBtn -->
                  <template :slot="citem.model+'_btnBarPrevBtn'">
                    <slot :name="citem.model+'_btnBarPrevBtn'">
                    </slot>
                  </template>
                  <!-- btnCustom -->
                  <template :slot="citem.model+'_btnCustom'"
                            slot-scope="{row}">
                    <slot :name="citem.model+'_btnCustom'"
                          :row="row">
                    </slot>
                  </template>
                  <!-- columnFormatter -->
                  <template :slot="citem.model+'_columnFormatter'"
                            slot-scope="{row,prop}">
                    <slot :name="citem.model+'_columnFormatter'"
                          :row="row"
                          :prop="prop">
                    </slot>
                  </template>
                </GenerateFormItem>
              </template>
            </el-col>
          </el-row>
        </template>
        <!-- 不嵌套栅格布局时自定义组件 -->
        <template v-else-if="item.type === 'blank'">
          <el-form-item :label="item.name"
                        :prop="item.model"
                        :key="item.key"
                        v-show="!item.hidden">
            <slot :name="item.model"
                  :model="models"
                  :widget="item"></slot>
          </el-form-item>
        </template>
        <!-- 普通行布局方式 -->
        <template v-else>
          <GenerateFormItem :key="item.key"
                            :models="models"
                            :remote="remote"
                            @selection="getTableSelection($event,item)"
                            :widget="item"
                            :readOnly="setReadOnly"
                            @btnOnClick="btnOnClick"
                            v-show="!item.hidden"
                            :formTableConfig="formTableConfig">
            <template slot="tree-select-value-label"
                      slot-scope="{ node }">
              <slot name="tree-select-value-label"
                    :node="node"></slot>
            </template>
            <!-- btnBarPrevBtn -->
            <template :slot="item.model">
              <slot :name="item.model+'_btnBarPrevBtn'">
              </slot>
            </template>
            <!-- btnCustom -->
            <template :slot="item.model+'_btnCustom'">
              <slot :name="item.model+'_btnCustom'">
              </slot>
            </template>
            <!-- columnFormatter -->
            <template :slot="item.model+'_columnFormatter'">
              <slot :name="item.model+'_columnFormatter'">
              </slot>
            </template>
          </GenerateFormItem>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
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
  };

  @Prop({
    type: Object,
    default: () => ({}),
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
  /**
   * 设置只读,默认Null为全部不只读,传{}为全部只读
   * 以下是分别设置黑白名单
   * {
   *  whiteList:[],  //设置需要只读的
   *  blackList:[]   //设置不需要只读的
   * }
   */
  // 表单当前实时对象

  @Prop({
    type: Object,
    default: null,
  })
  setReadOnly: any;

  // 设置隐藏区域

  @Prop({
    type: Array,
    default: () => [],
  })
  setHidden: any;
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

  models: any = {};

  rules: any = {};

  // 子表表格选中数据
  tableSelections: any = {};

  created() {
    // 根据数据结构生成给子组件的数据源
    this.generateModle(this.data.list);
  }

  getTableSelection($event, item) {
    this.tableSelections[item.model] = $event;
    this.$emit('table-selections', this.tableSelections);
  }

  generateModle(genList) {
    const customValidate = (rule, value, callback) => {
      const { type } = rule;
      if ('string,number'.includes(type)) {
        if (rule.required) {
          callback(new Error(rule.message));
        } else {
          callback();
        }
      }
    };
    // 遍历设计的结构
    for (let i = 0; i < genList.length; i += 1) {
      if (genList[i].type === 'grid') {
        genList[i].columns.forEach((item) => {
          this.generateModle(item.list);
        });
      } else {
        // 获取当前组件
        const row = genList[i];
        // 如果是自定义组件,model值为slotName,不在model中赋属性值
        if (Object.keys(this.value).indexOf(row.model) >= 0 && row.type !== 'blank') {
          this.initFormValue(row);
        } else {
          this.setDefaultValue(row);
        }

        // 表单隐藏设置
        if (this.setHidden.includes(row.model)) {
          row.hidden = true;
        }

        if (this.setReadOnly) {
          // 表单只读控制
          const { whiteList, blackList } = this.setReadOnly;
          // 默认空对象 代表全部只读
          if (whiteList == null && blackList == null) {
            row.options.disabled = true;
          } else if (blackList && !blackList.includes(row.model)) {
            row.options.disabled = true;
          } else if (whiteList && whiteList.includes(row.model)) {
            row.options.disabled = true;
          }
        }
        if (this.rules[genList[i].model]) {
          this.rules[genList[i].model] = [
            ...this.rules[genList[i].model],
            ...genList[i].rules.map((item) => {
              if (item.pattern) {
                // eslint-disable-next-line no-eval
                const rule = { ...item, pattern: eval(item.pattern) };
                rule.trigger = 'blur';
                return rule;
              }
              if ('string,number'.includes(item.type)) {
                item.validator = customValidate;
              }
              return { ...item };
            }),
          ];
        } else {
          this.rules[genList[i].model] = [
            ...genList[i].rules.map((item) => {
              if (item.pattern) {
                // eslint-disable-next-line no-eval
                const rule = { ...item, pattern: eval(item.pattern) };
                rule.trigger = 'blur';
                return rule;
              }
              if ('string,number'.includes(item.type)) {
                item.validator = customValidate;
              }
              return { ...item };
            }),
          ];
        }
      }
    }
  }

  // 多选情况下数组转字符串
  formValueToString() {
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
          resolve(this.formValueToString());
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

  // 重置表单
  resetForm() {
    this.$refs.generateForm.resetFields();
  }

  // 不经过验证直接获取表单内容
  getDataWithoutValidate() {
    return new Promise(resolve => resolve(this.formValueToString()));
  }

  // 生成的按钮点击
  btnOnClick(widget) {
    this.$emit('btnOnClick', widget);
  }

  // 表单默认值回填单独拉出来封装
  setDefaultValue(config) {
    // 如果时间选择器需要默认值,默认回填当前日期
    if (config.type === 'date' && config.options.defaultValue) {
      const { format } = config.options;
      if (format && format !== '') {
        this.models[config.model] = this.dayjs().format(format.toUpperCase());
      }
    } else {
      let { defaultValue } = config.options;
      // 如果默认值设置为$开头,则表示要读取vuex中的全局变量
      // 如设置为 $deptname 则读取 this.$store.getters.deptname
      if (typeof defaultValue === 'string' && defaultValue.includes('$')) {
        defaultValue = this.$store.getters[defaultValue.replace('$', '')];
      } else if (typeof defaultValue === 'boolean') {
        defaultValue = '';
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
    this.$nextTick(() => {
      if (this.$refs.generateForm) {
        this.$refs.generateForm.clearValidate();
      }
    });
    this.models = { ...this.models, ...val };
  }

  @Watch('models', {
    deep: true,
    immediate: true,
  })
  modelsOnChange(val) {
    this.$emit('update:entity', val);
  }
}
</script>
<style lang="scss" scoped>
@import './styles/table-form.scss';
</style>
