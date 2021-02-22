<!--
 * @Author: BoBo
 * @Date: 2019-01-04 17:53:03
 * @Description: 基于echarts的饼图组件
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
    className: {
      type: String,
    },
    width: {
      type: String,
      default: '100%',
    },
    // 柱状图宽度
    height: {
      type: String,
      default: '300px',
    },
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '饼图',
    },
    option: {
      type: Object,
      default: null,
    },
    // 是否为空心
    hollow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    legand() {
      const arr = [];
      this.data.forEach((item) => {
        arr.push(item.name);
      });
      return arr;
    },
    chartOption() {
      const defaultOption = {
        color: ['#82C7E4', '#A1AFFB', '#7190FF', '#163abe'],
        title: {
          // eslint-disable-next-line no-eval
          text: `总数${eval(this.data.map(item => item.value).join('+')) || 0}`,
          top: '10%',
          left: '50%',
          textAlign: 'center',
          textStyle: {
            fontSize: 16,
            color: '#fff',
          },
        },
        tooltip: {
          textStyle: {
            fontSize: 18,
          },
          trigger: 'item',
          formatter: '{a}{b} : {c}人 ({d}%)',
        },
        visualMap: {
          show: false,
          min: 0,
          // 以数组中的最大值为最大值
          max: Math.max.apply(
            null,
            this.data.map(item => item.value),
          ),
          // 颜色在 min-max之间自动渐变
          inRange: {
            colorLightness: [1.1, 0.2],
          },
        },
        legend: {
          type: 'scroll',
          icon: 'circle',
          orient: 'vertical',
          show: false,
          itemWidth: 10, // 设置宽度
          itemHeight: 10, // 设置高度
          right: 0,
          top: 40,
          bottom: 20,
          textStyle: {
            fontSize: 16,
            color: '#fff',
          },
          data: this.legand,
          // 保留前六个字符，多余用...代替，四个字符换一行
          formatter(p) {
            if (p.length === 6) return `${p.substring(0, 4)}\n${p.substring(4, 6)}`;
            if (p.length > 5) return `${p.substring(0, 4)}\n${p.substring(4, 6)}...`;
            return p;
          },
        },
        series: [
          {
            name: '',
            type: 'pie',
            center: ['50%', '50%'],
            // 对数据排序
            data: this.data.map(item => item).sort((a, b) => a.value - b.value),
            // roseType: 'area',
            label: {
              color: '#fff',
              position: 'outer',
              alignTo: 'labelLine',
              bleedMargin: 15,
              normal: {
                textStyle: {
                  fontWeight: 'normal',
                  color: '#fff',
                },
                show: true,
                formatter: '{a}{b}',
              },
            },
            labelLine: {
              normal: {
                show: true, // show设置线是否显示，默认为true，可选值：true ¦ false
              },
            },
            itemStyle: {
              color: '#91e7ff',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay(idx) {
              return Math.random() * 200;
            },
          },
        ],
      };
      // 设置为空心饼图
      if (this.hollow) {
        defaultOption.series[0].radius = ['46%', '66%'];
      }
      defaultOption.series[0].center = ['50%', '50%'];
      defaultOption.series[0].label.normal.textStyle.color = '#000';
      defaultOption.series[0].label.normal.formatter = '{a}{b}\n占比:{d}%';
      defaultOption.series[0].itemStyle = {};
      defaultOption.title.top = 'center';
      defaultOption.title.right = '38.5%';
      defaultOption.title.textStyle.color = '#000';
      defaultOption.visualMap.inRange = {};

      // if (this.option) {
      //   this.lodash.merge(defaultOption, this.option);
      // }
      return defaultOption;
    },
  },
  mounted() {
    this.resizeHanlder = () => {
      if (this.chart) {
        this.chart.resize();
      }
    };
    window.addEventListener('resize', debounce(this.resizeHanlder));
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);

      this.chart.setOption(this.chartOption, true);
      // 此处绑定饼图点击事件,把图例内容抛出,用于数据钻取
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
      deep: true,
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
  /deep/ {
    .el-card__header{
      padding: 5px 20px;
    }
  }
}
</style>
