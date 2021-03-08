<!--
@file SVG图标组件，在src\icons\autoImportSvg.js中加载
@author BoBo
@copyright BoBo
@createDate 2018年11月14日09:48:32
-->
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return `SvgIcon ${this.className}`;
      }
      return 'SvgIcon';
    },
  },
};
</script>

<style scoped>
.SvgIcon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
