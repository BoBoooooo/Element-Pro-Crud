<!--
 * @file: Demo ProTable
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020年12月18日16:54:49
-->

<template>
  <div class="page-container">
    <ProTable ref="table" :request="request" tableTitle="员工管理" fullHeight orderCondition="timestamp desc" :visibleList="visibleList" v-bind="$attrs" v-on="$listeners">
      <template #columnFormatter="{row,prop}">
        <el-tag v-if="prop === 'jobno'">{{ row.jobno }}</el-tag>
        <span v-if="prop === 'personname'"><i class="el-icon el-icon-user" style="color: red"></i>{{ row.personname }}</span>
      </template>
    </ProTable>
  </div>
</template>

<script>
import CrudTable from '@/component/crud-table/src/CrudTable.vue';
import { DML } from '@/types/common';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'PersonTable',
  components: {
    CrudTable,
  },
})
export default class PersonTable extends Vue {
  @Prop(Object)
  visibleList;

  async request(axiosParams) {
    const res = await this.$PROCRUD.crud(DML.SELECT, 'person', axiosParams);
    return {
      data: res.data.list,
      total: res.total,
    };
  }
}
</script>
