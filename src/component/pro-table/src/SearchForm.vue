<!--
 * @file: 查询区域,基于老杨版本重构
 * @copyright: BoBo
 * @author: BoBo
 * @Date: 2020年02月20 14:05:12
 -->

<template>
  <div class="search-form-container">
    <el-input placeholder="请输入查询内容" @clear="clearEvent" @keyup.enter.native="btnSearchOnClick" clearable size="small" v-model="searchContent" class="input"> </el-input>
    <el-button size="small" type="primary" icon="el-icon-search" @click="btnSearchOnClick" class="tool-btn">查询</el-button>
    <!-- 高级查询表单 -->
    <SeniorSearchForm v-if="showSeniorSearchFormButton" :remoteFuncs="remoteFuncs" @fetchSearch="getFetchParamsSearch" :columns="columns"> </SeniorSearchForm>
    <el-button size="small" icon="el-icon-refresh" @click="clearEvent()" class="tool-btn">清空</el-button>
    <div class="tips">
      <!-- 提示当前查询内容 -->
      <template v-if="paramsTips.length > 0">
        <el-tag v-for="(item, index) in paramsTips" size="small" effect="plain" :key="index" closable @close="handleClose(item)">
          {{ item.label + ':' + item.value }}
        </el-tag>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { diGuiTree } from '@/utils/utils';
import { Component, Vue, Prop } from 'vue-property-decorator';
import VueCompositionApi, { defineComponent, PropType, ref, reactive, computed } from '@vue/composition-api';
import { columnConfig, searchParamsEntity } from '@/types/common';
import SeniorSearchForm from './SeniorSearchForm.vue';

Vue.use(VueCompositionApi);

export default defineComponent({
  name: 'SearchForm',
  components: {
    SeniorSearchForm,
  },
  emits: ['update:searchFormCondition', 'click'],
  props: {
    columns: {
      type: Array as PropType<columnConfig[]>,
      default: () => [],
      required: true,
    },
    remoteFuncs: {
      default: () => ({}),
      type: Object,
    },
    showSeniorSearchFormButton: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    // 查询输入框内容
    const searchContent = ref('');

    // 高级查询表单是否显示,手动控制
    const triggleVisible = ref(false);

    // 查询tips
    const paramsTips = ref<searchParamsEntity[]>([]);

    // 递归查询可检索字段
    const seachableColumns = computed(() => {
      return diGuiTree()(props.columns);
    });

    // 标签关闭事件
    const handleClose = (tag) => {
      paramsTips.value = (paramsTips.value as searchParamsEntity[]).filter((item) => item.field !== tag.field);
      emit('update:searchFormCondition', paramsTips.value);
      emit('click');
    };

    const clearEvent = () => {
      searchContent.value = '';
      paramsTips.value = [];
      emit('update:searchFormCondition', []);
      emit('clear');
    };

    // 查询按钮点击
    const btnSearchOnClick = () => {
      getParams();
      emit('click');
    };

    /**
     * 获取查询条件
     */
    const getParams = () => {
      let params: any = [];
      // 拿到所有字段
      const props = seachableColumns.value.map((item) => item.prop);
      const str = props.toString();
      if (searchContent.value) {
        params = [
          {
            field: str,
            operator: 'orlike',
            value: searchContent.value,
          },
        ];
      }
      // 一键搜需要清空高级查询条件
      paramsTips.value = [];
      emit('update:searchFormCondition', params);
    };

    // 获取高级查询组件中的查询条件
    const getFetchParamsSearch = (data) => {
      paramsTips.value = [];
      triggleVisible.value = false;
      const params: searchParamsEntity[] = [];
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
      paramsTips.value = params.map((item) => ({
        field: item.field,
        value: item.value,
        operator: item.operator,
        label: seachableColumns.value.find((s) => s.prop === item.field)!.label,
      }));
      searchContent.value = '';
      emit('update:searchFormCondition', params);
      emit('click');
    };

    return {
      searchContent,
      triggleVisible,
      paramsTips,
      seachableColumns,
      handleClose,
      clearEvent,
      btnSearchOnClick,
      getParams,
      getFetchParamsSearch,
    };
  },
});
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
  flex: 1;
  ::v-deep.tool-btn {
    display: inline;
    margin-left: 10px;
  }
  .input {
    display: inline-block;
    width: 300px;
  }
  .tips {
    display: inline-block;
    margin-left: 10px;
    ::v-deep.el-tag {
      margin-right: 5px;
    }
  }
}
</style>
