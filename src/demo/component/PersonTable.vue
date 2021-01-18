<!--
 * @file: Demo ProTable
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020年12月18日16:54:49
-->

<template>
  <div class="page-container">
    <ProTable
      ref="table"
      :request="request"
      tableName="person"
      tableTitle="员工管理"
      fullHeight
      orderCondition="timestamp desc"
      :visibleList="{
        btnDel: true,
        tableTitle: true,
      }">
      <template #column_jobno="{row}">
        <el-tag>{{ row.jobno }}</el-tag>
      </template>
      <template #column_personname="{row}">
        <span><i class="el-icon el-icon-user" style="color: red"></i>{{ row.personname }}</span>
      </template>
    </ProTable>
  </div>
</template>

<script>
import { DML } from '@/types/common';
import { Vue, Component } from 'vue-property-decorator';


@Component({
  name: 'PersonTable',
})
export default class PersonTable extends Vue {
  async request(axiosParams) {
    const res = await this.$PROCRUD.crud(DML.SELECT, 'person', axiosParams);
    return {
      data: res.data.list,
      total: res.data.total,
    };
  }
}
</script>
