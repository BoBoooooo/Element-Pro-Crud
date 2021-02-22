<!--
 * @file: 查询区域,基于老杨版本重构
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年02月20 14:05:12
 -->

<template>
  <div class="search-form-container"
       :style="{
    float: searchMode === 'cover' ? 'none' : 'left'
  }">
    <template v-if="searchMode === 'popover'">
      <el-input placeholder="请输入查询内容"
                @clear="clearEvent"
                clearable
                @change="changeEvent"
                v-model="searchContent"
                class="input">
      </el-input>
      <el-button-group>
        <el-button size="mini"
                   type="primary"
                   icon="el-icon-search"
                   @click="btnSearchOnClick()"
                   class="tool-btn">查询</el-button>
        <!-- 高级查询表单 -->
        <SeniorSearchForm v-if="showSeniorSearchFormButton"
                          :remoteFuncs="remoteFuncs"
                          @fetchSearch="getFetchParamsSearch"
                          :columns="columns">
        </SeniorSearchForm>
        <el-button size="mini"
                   icon="el-icon-refresh"
                   @click="clearEvent()"
                   class="tool-btn">清空</el-button>
      </el-button-group>
    </template>
    <template v-else>
      <!-- 高级查询表单 -->
      <SeniorSearchFormCover v-if="showSeniorSearchFormButton"
                             :remoteFuncs="remoteFuncs"
                             @fetchSearch="getFetchParamsSearch"
                             :columns="columns">
        <slot></slot>
      </SeniorSearchFormCover>
    </template>

    <div class="tips">
      <!-- 提示当前查询内容 -->
      <template v-if="isArray">
        <el-tag v-for="(item, index) in paramsTips"
                size="small"
                effect="plain"
                :key="index"
                closable
                @close="handleClose(item)">
          {{ item.label + ":" + item.value }}
        </el-tag>
      </template>
      <template v-else>
        <span v-if="paramsTips">当前查询: {{ paramsTips }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SeniorSearchForm from './SeniorSearchForm.vue';
import SeniorSearchFormCover from './SeniorSearchFormCover.vue';

@Component({
  name: 'SearchForm',
  components: {
    SeniorSearchForm,
    SeniorSearchFormCover,
  },
})
export default class SearchForm extends Vue {
  // 远程数据方法
  @Prop({ default: () => ({}), type: Object }) remoteFuncs!: any;

  // 是否显示高级查询按钮
  @Prop({ default: true, type: Boolean }) showSeniorSearchFormButton!: boolean;

  // 表格设计json
  @Prop({
    type: Array,
    required: true,
  })
  columns: any;

  // 查询模式
  @Prop({
    type: String,
    default: 'popover',
  })
  searchMode!: string;

  // 查询输入框内容
  searchContent = '';

  // 高级查询表单是否显示,手动控制
  triggleVisible = false;

  // 查询tips
  paramsTips: any = null;

  get isArray() {
    return Array.isArray(this.paramsTips);
  }

  // 标签关闭事件
  handleClose(tag) {
    this.paramsTips = this.paramsTips.filter(item => item.field !== tag.field);
    this.$emit(
      'update:searchFormCondition',
      this.paramsTips.map(item => ({
        field: item.field,
        value: item.value,
        operator: item.operator,
      })),
    );
    this.$emit('click');
  }

  clearEvent() {
    this.searchContent = '';
    this.paramsTips = null;
    this.$emit('update:searchFormCondition', []);
    this.$emit('clear');
  }

  // 查询按钮点击
  btnSearchOnClick() {
    this.getParams();
    this.$emit('click');
  }

  /**
   * 获取查询条件
   */
  getParams() {
    let params: any = [];
    // 拿到所有字段
    const props = this.columns.filter(item => item.searchable).map(item => item.prop);
    const str = props.toString();
    if (this.searchContent) {
      params = [
        {
          field: str,
          operator: 'orlike',
          value: this.searchContent,
        },
      ];
    }
    this.$emit('update:searchFormCondition', params);
  }

  // 输入框change事件
  changeEvent(val) {
    this.getParams();
    this.paramsTips = val;
    this.$emit('click');
  }

  // 获取高级查询组件中的查询条件
  getFetchParamsSearch(data) {
    this.paramsTips = [];
    this.triggleVisible = false;
    const params: any = [];
    Object.keys(data).forEach((key) => {
      if (key && data[key]) {
        if (Array.isArray(data[key])) {
          const [startDate, endDate] = data[key];
          if (startDate) {
            params.push({
              field: key,
              operator: 'egt',
              value: startDate,
            });
          }
          if (endDate) {
            params.push({
              field: key,
              operator: 'elt',
              value: endDate,
            });
          }
        } else {
          params.push({
            field: key,
            operator: 'like',
            value: data[key],
          });
        }
      }
    });
    this.paramsTips = params.map(item => ({
      field: item.field,
      value: item.value,
      operator: item.operator,
      label: this.columns.find(s => s.prop === item.field).label,
    }));
    this.$emit('update:searchFormCondition', params);
    this.$emit('click');
  }
}
</script>
<style scoped>
.input-with-select >>> .el-input-group__prepend {
  background-color: #fff;
}
.dropdown-menu >>> .popper__arrow {
  display: none;
}
.dropdown >>> .el-button {
  height: 29px !important;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.search-form-container {
  float: left;
  .tool-btn {
    display: inline;
    height: 29px;
    border-radius: 0;
  }
  ::v-deep.el-input__suffix {
    top: -5px;
  }
  .input {
    display: inline-block;
    width: 300px;
    ::v-deep .el-input__inner {
      height: 29px;
      line-height: 29px;
      border-radius: 0;
      display: inline-block;
    }
  }
  .tips {
    display: inline-block;
    vertical-align: 1px;
    margin-left: 5px;
    ::v-deep.el-tag {
      border-radius: 0;
      margin-right: 5px;
    }
  }
}
</style>
