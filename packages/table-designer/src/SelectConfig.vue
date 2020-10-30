<!--
@file 下拉菜单配置页面
@author ytyang
@copyright NanJing Anshare Tech .Com
@createDate 2018年12月26日16:45:31
-->
<template>
  <div v-if="localOption">
    <div class="detailTitleBar">
      <h2>下拉菜单数据来源</h2>
      <el-radio-group v-model="localOption.remote"
                      size="mini"
                      style="margin: 3px 0 0 0;">
        <el-radio-button label="dict">字典</el-radio-button>
        <el-radio-button label="static">静态</el-radio-button>
        <el-radio-button label="custom">自定义</el-radio-button>
      </el-radio-group>
    </div>
    <div class="bar">
      <h2>查询条件使用</h2>
      <el-radio-group v-model="localOption.selectBy"
                      size="mini"
                      style="margin: 3px 0 0 0;">
        <el-radio-button label="value">value</el-radio-button>
        <el-radio-button label="label">label</el-radio-button>
      </el-radio-group>
    </div>
    <template v-if="localOption.remote=='dict'">
      <el-select v-model="localOption.dictType"
                 placeholder="字典类型"
                 filterable>
        <el-option v-for="item in dictType"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </el-option>
      </el-select>
    </template>
    <template v-else-if="localOption.remote=='custom'">
      <div>
        <el-input style="margin:0 0 8px 0;"
                  v-model="localOption.remoteFunc">
          <template slot="prepend">远端方法</template>
        </el-input>
        <el-input style="margin:0 0 8px 0;"
                  v-model="localOption.props.value">
          <template slot="prepend">值</template>
        </el-input>
        <el-input style="margin:0 0 8px 0;"
                  v-model="localOption.props.label">
          <template slot="prepend">标签</template>
        </el-input>
      </div>
    </template>
    <template v-else>
      <el-button type="primary"
                 plain
                 @click="btnAddOption">添加选项</el-button>
      <template v-if="localOption.type=='radio' ||
      (localOption.type=='select'&&!localOption.multiple)">
        <Draggable tag="ul"
                   :list="localOption.options"
                   style="padding: 0;list-style: none;"
                   :options="{
                            group: {name:'options'},
                            ghostClass: 'ghost',
                            handle: '.drag-item'
                          }">
          <li v-for="(item, index) in localOption.options"
              :key="index"
              style="margin:10px 0;">
            <el-input :style="{'width':'120px',marginRight:'10px'}"
                      v-model="item.value"></el-input>
            <el-input style="width:100px;margin-right:'10px'"
                      v-model="item.label"></el-input>
            <i class="drag-item"
               style="font-size: 16px;margin: 0 5px;cursor: move;">
              <Icon name="bars"></Icon>
            </i>
            <el-button @click="btnRemoveOption(index)"
                       circle
                       plain
                       type="danger"
                       size="mini"
                       icon="el-icon-minus"
                       style="padding: 4px;margin-left: 5px;">
            </el-button>
          </li>
        </draggable>
      </template>
    </template>
  </div>
</template>

<script>
import 'vue-awesome/icons/bars';
import Draggable from 'vuedraggable';
import Icon from 'vue-awesome/components/Icon.vue';
import { DML, crud } from '@/api/public/crud';

export default {
  components: {
    Draggable,
    Icon,
  },
  data() {
    return {
      // 字典类型
      dictType: [],
      // 当前组件内部options
      localOption: null,
    };
  },
  props: {
    // 外部原option
    sourceOption: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    // 请求字典分类
    crud(DML.SELECT, 'ad_codelist_type').then((res) => {
      this.dictType = res.data.list.map(item => ({
        label: item.codename,
        value: item.codevalue,
      }));
    });
    // 把外部option同步到组件内部
    this.localOption = this.sourceOption;
    // 表单设计中没有根据什么查询的选项
    if (this.localOption.selectBy == null) {
      this.$set(this.localOption, 'selectBy', 'label');
    }
  },
  methods: {
    // 添加下拉列表固定选项
    btnAddOption() {
      if (this.localOption.options == null) {
        this.$set(this.localOption, 'options', []);
      }
      this.localOption.options.push({
        value: 'value',
        label: 'label',
      });
    },
    btnRemoveOption(index) {
      if (this.localOption.type === 'grid') {
        this.localOption.columns.splice(index, 1);
      } else {
        this.localOption.options.splice(index, 1);
      }
    },
  },
  watch: {
    // 把内部option同步到外部
    localOption(newValue) {
      this.$emit('update:localOption', newValue);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.detailTitleBar {
  border-bottom: 1px dashed #ededed;
  margin-bottom: 5px;
  padding-bottom: 10px;
  h2 {
    font-size: 19px;
    font-weight: normal;
    float: left;
    margin: 5px 20px 0 0;
  }
}
.bar {
  border-bottom: 1px dashed #ededed;
  margin-bottom: 15px;
  padding-bottom: 10px;
  h2 {
    font-size: 19px;
    font-weight: normal;
    float: left;
    margin: 5px 20px 0 0;
  }
}
</style>
