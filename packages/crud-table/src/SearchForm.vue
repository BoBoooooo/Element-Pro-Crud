<!--
 * @file: 查询区域,基于老杨版本重构
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年02月20 14:05:12
 -->

<template>
  <div class="search-form-container">
    <el-input placeholder="请输入查询内容"
              @clear="clearEvent"
              clearable
              @change="changeEvent"
              v-model="searchContent"
              class="input">
      <div slot="suffix">
        <el-tooltip class="item"
                    effect="dark"
                    content="查询"
                    placement="top">
          <i class="el-input__icon el-icon-search"
             @click="btnSearchOnClick()"
             style="display:inline"></i>
        </el-tooltip>
        <!-- 高级查询表单 -->
        <SeniorSearchForm v-if="showSeniorSearchFormButton"
                          :remoteFuncs="remoteFuncs"
                          @fetchSearch="getFetchParamsSearch"
                          :columns="columns"> </SeniorSearchForm>
        <el-tooltip class="item"
                    effect="dark"
                    content="清空"
                    placement="top">
          <i class="el-input__icon el-icon-refresh"
             @click="clearEvent()"
             style="display:inline;color:orange;"></i>
        </el-tooltip>
      </div>
    </el-input>
    <!-- 自定义高级查询表单-->
    <slot name="SeniorSearchForm"></slot>
    <div class="tips">
      <!-- 提示当前查询内容 -->
      <template v-if="isArray">
        <el-tag v-for="(item,index) in paramsTips"
                size="small"
                effect="plain"
                :key="index"
                closable
                @close="handleClose(item)">
          {{item.label +':'+item.value}}
        </el-tag>
      </template>
      <template v-else>
        <span v-if="paramsTips">当前查询: {{paramsTips}}</span>
      </template>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SeniorSearchForm from './SeniorSearchForm.vue';

@Component({
  components: {
    SeniorSearchForm,
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

  // 查询输入框内容
  searchContent = '';

  // 查询tips
  paramsTips:any = null;

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
    let params:any = [];
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
    const params:any = [];
    Object.keys(data).forEach((key) => {
      if (key && data[key]) {
        if (Array.isArray(data[key])) {
          const [startDate, endDate] = data[key];
          params.push({
            field: key,
            operator: 'egt',
            value: startDate,
          });
          params.push({
            field: key,
            operator: 'elt',
            value: endDate,
          });
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
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.search-form-container {
  float: left;
  .input {
    /deep/ .el-input__inner {
      height: 28px;
      line-height: 28px;
      border-radius: 0;
      display: inline-block;
    }
  }
  /deep/.el-input {
    /deep/.el-input__suffix-inner > div {
      display: inline;
    }
    display: inline-block;
    width: 25vw;
  }
  /deep/.el-input__suffix {
    top: -5px;
  }

  /deep/.el-input-group__append {
    span {
      display: inline-block;
      width: 30px;
      margin-left: 30px;
    }
  }
  /deep/.el-input__icon {
    cursor: pointer;
    font-weight: 600;
  }
  .tips {
    display: inline-block;
    vertical-align: 1px;
    margin-left: 5px;
    /deep/.el-tag {
      border-radius: 0;
      margin-right: 5px;
    }
  }
}
</style>
