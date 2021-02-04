<!--
 * @Author: BoBo
 * @Date: 2019-01-06 23:08:21
 * @Description: 基于echarts的柱状图组件
 -->
<template>
  <el-card shadow="hover" class="card" :body-style="{ height: height, width: width ,padding: 0}">
    <div slot="header">
      <span>{{ title }}</span>
    </div>
    <div :class="className" ref="chart" :style="{ height: '100%', width: width, padding: '20px' }" />
  </el-card>
</template>

<script>
import { debounce } from '@/utils/utils';

export default {
  props: {
    // 容器className
    className: {
      type: String,
    },
    // y轴最大值
    yAxisMax: {
      type: String,
      default: null,
    },
    // 柱状图宽度
    width: {
      type: String,
      default: '100%',
    },
    // 柱状图宽度
    height: {
      type: String,
      default: '300px',
    },
    // 柱状图/折线图
    type: {
      type: String,
      default: 'bar',
    },
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    option: {
      type: Object,
      default: () => {},
    },
    // 图表是否旋转（X,Y轴互换）
    rotate: {
      type: Boolean,
      default: false,
    },
    // x轴单位
    xUnit: {
      type: String,
      default: '',
    },
    // y轴单位
    yUnit: {
      type: String,
      default: '个',
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.resizeHanlder = () => {
      if (this.chart) {
        this.chart.resize();
      }
    };
    window.addEventListener('resize', debounce(this.resizeHanlder));
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
  computed: {
    xData() {
      const arr = [];
      this.data.forEach((item) => {
        arr.push(item.name + this.xUnit);
      });
      return arr;
    },
    chartOption() {
      const option = {
        color: ['#7190FF'],
        tooltip: {
          textStyle: {
            fontSize: 18,
          },
          trigger: 'axis',
          formatter: `{b}：{c} ${this.yUnit}`,
        },
        dataZoom: [
          {
            type: 'inside',
            show: true,
            start: 0,
            // 柱状图情况下，条数大于6默认展示前六条，剩余可鼠标拖动
            endValue: this.xData.length > 6 ? 5 : this.xData.length,
            xAxisIndex: [0],
            // 禁止缩放
            zoomLock: true,
          },
        ],
        title: {
          // text: this.title,
          left: '50%',
          top: '0',
          textAlign: 'center',
          textStyle: {
            fontSize: 16,
            color: '#000',
          },
        },
        // 定位
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.xData,
            axisLine: {
              lineStyle: {
                color: '#2a343f',
              },
            },
            axisLabel: {
              // 坐标轴刻度标签的相关设置。
              interval: 0,
              textStyle: {
                color: '#000',
              },
              formatter(p) {
                if (p.length === 6) return `${p.substring(0, 4)}\n${p.substring(4, 6)}`;
                if (p.length > 5) return `${p.substring(0, 4)}\n${p.substring(4, 6)}...`;
                return p;
              },
            },
            // 分割线的颜色
            splitLine: {
              lineStyle: {
                color: '#2a343f',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: this.yUnit,
            max: this.yAxisMax,
            minInterval: 1,
            textStyle: {
              color: '#000',
            },
            axisLine: {
              lineStyle: {
                color: '#2a343f',
              },
            },
            axisLabel: {
              color: '#000',
              textStyle: {
                color: '#000',
              },
            },
            splitLine: {
              lineStyle: {
                color: '#2a343f',
              },
            },
          },
        ],
        series: [
          {
            barWidth: 30, // 柱图宽度
            name: this.yUnit,
            type: this.type,
            data: this.data.map(item => item.value),
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#66e0ef', // 改变折线颜色
                },
                label: { show: true, color: '#fff' },
              },
            },
          },
        ],
      };
      // 改变折线颜色
      option.series[0].itemStyle.normal.lineStyle.color = '#0B8A82';
      option.grid = {
        top: '8%',
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
      };

      // bar 型 hover 使用 阴影
      if (this.type === 'bar') {
        option.tooltip.axisPointer = { type: 'shadow' };
      }
      // bar 型 是否横向
      if (this.rotate) {
        [option.xAxis, option.yAxis] = [option.yAxis, option.xAxis];
        option.yAxis[0].data = option.yAxis[0].data.reverse();
        option.series[0].data = option.series[0].data.reverse();
        option.xAxis[0].position = 'top';
        // 只显示4条
        option.dataZoom[0] = {
          type: 'inside',
          show: true,
          startValue: 4,
          endValue: 7,
          yAxisIndex: [0],
          zoomLock: true,
        };
        option.series[0].barWidth = null;
      }
      return option;
    },
  },
  methods: {
    initChart() {
      if (!this.$refs.chart) {
        return;
      }
      this.chart = echarts.init(this.$refs.chart);

      this.chart.setOption(this.chartOption, true);

      // 此处绑定点击事件,把图例内容抛出,用于数据钻取
      this.chart.off('click');
      this.chart.on('click', (obj) => {
        this.$emit('click', obj);
      });
      this.chart.resize();
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          this.initChart();
        });
      },
    },
    chartOption: {
      handler(val) {
        this.$nextTick(() => {
          this.initChart();
        });
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.card{
  ::v-deep {
    .el-card__header{
      padding: 5px 20px;
    }
  }
}
</style>
