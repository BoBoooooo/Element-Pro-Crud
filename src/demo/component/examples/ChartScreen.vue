<!--
 * @file: 图表展示
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020年12月18日16:54:49
-->

<template>
  <ProForm :data="data"></ProForm>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator';
import data from '../data';

@Component({
  name: 'ChartScreen',
})
export default class ChartScreen extends Vue {
  data = data;
}
</script>
