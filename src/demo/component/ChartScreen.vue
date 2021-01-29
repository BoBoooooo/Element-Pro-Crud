<!--
 * @file: 图表展示
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2020年12月18日16:54:49
-->

<template>
  <div class="page-container">
    <GenerateForm :data="data" :value="value"></GenerateForm>
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator';
import data from './data';

@Component({
  name: 'ChartScreen',
})
export default class ChartScreen extends Vue {
  data = data

  value = {
    chart2: {
      xAxis: {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    },
  }
}
</script>
