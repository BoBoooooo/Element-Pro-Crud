<!--
 * @file: Demo ProTable
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020年12月18日16:54:49
-->

<template>
  <div class="page-container">
    <ProTable ref="table" :request="request" :columns="columns" tableTitle="员工管理" fullHeight orderCondition="timestamp desc"  v-bind="$attrs" v-on="$listeners">
      <template #columnFormatter="{row,prop}">
        <el-tag v-if="prop === 'jobno'">{{ row.jobno }}</el-tag>
        <span v-if="prop === 'personname'"><i class="el-icon el-icon-user" style="color: red"></i>{{ row.personname }}</span>
      </template>
    </ProTable>
  </div>
</template>

<script>
import { DML } from '@/types/common';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'PersonProTable',
})
export default class PersonProTable extends Vue {
   columns = {
     name: 'person',
     position: '人员信息列表',
     columns: [{
       prop: 'jobno',
       label: '工号',
       minWidth: 140,
       align: 'center',
       headerAlign: 'center',
       showOverflowTooltip: true,
       sortable: 'custom',
       slotName: '',
       searchable: true,
     }, {
       prop: 'personname',
       label: '姓名',
       minWidth: 140,
       align: 'center',
       headerAlign: 'center',
       showOverflowTooltip: true,
       sortable: 'custom',
       slotName: '',
       searchable: true,
     }, {
       prop: 'jobtime',
       label: '入职时间',
       minWidth: 140,
       align: 'center',
       headerAlign: 'center',
       showOverflowTooltip: true,
       sortable: 'custom',
       slotName: '',
       searchable: true,
     }, {
       prop: 'deptname',
       label: '所在部门',
       minWidth: 140,
       align: 'center',
       headerAlign: 'center',
       showOverflowTooltip: true,
       sortable: 'custom',
       slotName: '',
       searchable: true,
     }, {
       prop: 'post',
       label: '岗位',
       minWidth: 140,
       align: 'center',
       headerAlign: 'center',
       showOverflowTooltip: true,
       sortable: 'custom',
       slotName: '',
       searchable: true,
     }, {
       prop: 'level',
       label: '职级',
       minWidth: 140,
       align: 'center',
       headerAlign: 'center',
       showOverflowTooltip: true,
       sortable: 'custom',
       slotName: '',
       searchable: true,
     }, {
       prop: 'mobile',
       label: '联系方式',
       minWidth: 140,
       align: 'center',
       headerAlign: 'center',
       showOverflowTooltip: true,
       sortable: 'custom',
       slotName: '',
       searchable: true,
     }],
   }

   async request(axiosParams) {
     const res = await this.$PROCRUD.crud(DML.SELECT, 'person', axiosParams);
     return {
       data: res.data.list,
       total: res.total,
     };
   }
}
</script>
