<!--
 * @file: Demo ProTable
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020年12月18日16:54:49
-->

<template>
  <CrudTable ref="table" tableName="person" tableTitle="员工管理" fullHeight orderCondition="timestamp desc" :visibleList="visibleList" v-bind="$attrs" v-on="$listeners">
    <template #columnFormatter="{row,prop}">
      <el-tag v-if="prop === 'jobno'">{{ row.jobno }}</el-tag>
      <span v-if="prop === 'personname'"><i class="el-icon el-icon-user" style="color: red"></i>{{ row.personname }}</span>
    </template>
    <template #btnCustom="{row}">
      <el-button size="mini" @click="getRowData(row)">自定义</el-button>
    </template>
  </CrudTable>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'PersonTable',
})
export default class PersonTable extends Vue {
  @Prop(Object)
  visibleList

  getRowData(row) {
    this.$alert(JSON.stringify(row));
  }
}
</script>
