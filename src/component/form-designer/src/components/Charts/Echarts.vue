<!--
 * @file: 原生Echarts封装
 * @author: BoBo
 * @copyright: NanJing Anshare Tech .Com
 * @Date: 2021-01-29 09:22:24
-->
<template>
  <el-card shadow="hover" class="card" :body-style="{ height: height, width: '100%', padding: 0 }">
    <div slot="header">
      <span>{{ title }}</span>
    </div>

    <div class="native-echarts-wrap" @mouseover.stop="clearLoop" :class="className" :style="{ height: '100%', width: '100%', padding: '20px' }" @mouseout.stop="startLoop" ref="native-echarts-wrap">
      <div ref="native-echarts" class="native-echarts"></div>
    </div>
  </el-card>
</template>

<script>
import { debounce } from '@/utils/utils';

export default {
  name: 'Echarts',
  props: {
    // 配置项
    option: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    className: {
      type: String,
    },
    height: {
      type: String,
      default: '300px',
    },
    title: {
      type: String,
      default: '',
    },
    map: {
      type: Object,
      default: null,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    wait: {
      type: Number,
      default: 10000,
    },
  },

  data() {
    return {
      chart: null,
      resizeTimer: null,
      loopTimer: [],
    };
  },
  computed: {
    eDom() {
      return this.$refs['native-echarts'];
    },
  },
  mounted() {
    this.initEcharts();
    this.resizeHanlder = () => {
      if (this.chart) {
        this.chart.resize();
      }
    };
    window.addEventListener('resize', debounce(this.resizeHanlder));
  },
  methods: {
    // echarts dom初始化
    initEcharts() {
      if (this.map) {
        echarts.registerMap(this.map.type, this.map.json);
      }
      // 获得实例对象
      this.chart = echarts.init(this.eDom);
      // 事件注册
      this.initEvent();
      // 运行配置参数
      this.setOption();
      // if (this.loop) {
      //   this.initLoopFn();
      // }
    },
    initLoopFn() {
      const timer = setInterval(() => {
        this.chart.clear();
        this.setOption(true);
      }, this.wait);
      this.loopTimer.push(timer);
    },
    clearLoop() {
      this.loopTimer.forEach((timer) => {
        window.clearInterval(timer);
      });
      this.loopTimer = [];
    },
    startLoop() {
      const timer = setTimeout(() => {
        this.initLoopFn();
      });
      this.loopTimer.push(timer);
    },
    initEvent() {
      Object.keys(this.$listeners).forEach((eventName) => {
        this.chart.on(eventName, this.$listeners[eventName]);
      });
    },
    setOption(notMerge = this.notMerge) {
      if (this.chart) {
        this.chart.setOption(this.option, true);
        // 此处绑定饼图点击事件,把图例内容抛出,用于数据钻取
        this.chart.on('click', (obj) => {
          this.$emit('click', obj);
        });
        this.chart.resize();
      }
    },
  },
  watch: {
    option: {
      deep: true,
      handler() {
        this.setOption(true);
      },
    },
    loop(val) {
      if (val) {
        this.initLoopFn();
      } else {
        this.clearLoop();
      }
    },
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.resizeHanlder);
    this.chart.dispose();
    this.chart = null;
    if (this.loop) {
      this.clearLoop();
    }
  },
};
</script>

<style lang="scss" scoped>
.card {
  /deep/ {
    .el-card__header {
      padding: 5px 20px;
    }
  }
  .native-echarts-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    .native-echarts {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
