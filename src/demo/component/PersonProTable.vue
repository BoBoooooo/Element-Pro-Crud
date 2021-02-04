<!--
 * @file: Demo ProTable
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020年12月18日16:54:49
-->

<template>
  <ProTable ref="table" :request="request" :columns="columns" tableTitle="员工管理" fullHeight orderCondition="timestamp desc" v-bind="$attrs" v-on="$listeners">
     <template #columnFormatter="{row,prop}">
        <el-tag v-if="prop === 'jobno'">{{ row.jobno }}</el-tag>
        <span v-if="prop === 'personname'"><i class="el-icon el-icon-user" style="color: red"></i>{{ row.personname }}</span>
        <el-image style="width: 50px; height: 50px" fit="fill" v-if="prop === 'avatar'" :src="getAvatarUrl(row)" :preview-src-list="[getAvatarUrl(row)]">
          <div slot="error" style="height: 100%">
            <div class="error"><i class="el-icon-picture-outline"></i></div>
          </div>
        </el-image>
      </template>
  </ProTable>
</template>

<script lang="ts">
import { DataSource, DML, Params } from '@/types/common';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'PersonProTable',
})
export default class PersonProTable extends Vue {
  columns = {
    columns: [
      {
        prop: 'avatar',
        label: '照片',
        align: 'center',
        headerAlign: 'center',
        showOverflowTooltip: true,
        minWidth: 140,
        sortable: 'custom',
        searchable: true,
        slotName: 'columnFormatter',
      },
      {
        prop: 'jobno',
        label: '工号',
        minWidth: '100',
        align: 'center',
        headerAlign: 'center',
        showOverflowTooltip: true,
        sortable: 'custom',
        slotName: 'columnFormatter',
        searchable: true,
      },
      {
        prop: 'personname',
        label: '姓名',
        minWidth: '70',
        align: 'center',
        headerAlign: 'center',
        showOverflowTooltip: true,
        sortable: 'custom',
        slotName: 'columnFormatter',
        searchable: true,
      },
      {
        prop: 'jobtime',
        label: '入职时间',
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        showOverflowTooltip: true,
        sortable: 'custom',
        slotName: '',
        searchable: true,
      },
      {
        prop: 'deptname',
        label: '所在部门',
        minWidth: '100',
        align: 'center',
        headerAlign: 'center',
        showOverflowTooltip: true,
        sortable: 'custom',
        slotName: '',
        searchable: true,
      },
      {
        prop: 'post',
        label: '岗位',
        minWidth: '100',
        align: 'center',
        headerAlign: 'center',
        showOverflowTooltip: true,
        sortable: 'custom',
        slotName: '',
        searchable: true,
      },
      {
        prop: 'level',
        label: '职级',
        minWidth: '100',
        align: 'center',
        headerAlign: 'center',
        showOverflowTooltip: true,
        sortable: 'custom',
        slotName: '',
        searchable: true,
      },
      {
        prop: 'mobile',
        label: '联系方式',
        minWidth: 140,
        align: 'center',
        headerAlign: 'center',
        showOverflowTooltip: true,
        sortable: 'custom',
        slotName: '',
        searchable: true,
      },
    ],
    name: 'person',
    position: '员工管理',
  }

  async request(axiosParams: Params): Promise<DataSource> {
    const res = await this.$PROCRUD.crud(DML.SELECT, 'person', axiosParams);
    return {
      data: res.data.list,
      total: res.data.total,
    };
  }

  getAvatarUrl(row) {
    return window.__HOST__URL__ + row.avatar;
  }
}
</script>
<style lang="scss" scoped>
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}
</style>
