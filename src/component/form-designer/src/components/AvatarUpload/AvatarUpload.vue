<!--
 * @file: 头像上传
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2021-12-30 21:41:26
-->

<template>
  <el-upload
    :style="{
      width: widget.options.width,
      height: widget.options.width,
    }"
    class="avatar-uploader"
    :class="{
      'is-disabled' : readOnly
    }"
    :headers="headers"
    :action="action"
    :before-upload="beforeUpload"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
  >
    <img :src="imageUrl" class="avatar" />
  </el-upload>
</template>

<script>
export default {
  name: 'AvatarUpload',
  model: {
    prop: 'value',
    event: 'change',
  },
  data() {
    return {
      imageUrl: this.value,
    };
  },
  props: {
    // 初始值
    value: {
      type: String,
      default: '',
    },
    widget: {
      type: Object,
      default: () => ({
        options: {
          width: '',
        },
      }),
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    action() {
      const __GLOBAL__URL__ = window.__HOST__URL__ + window.__PREFIX__URL__;
      return __GLOBAL__URL__ + this.widget.options.uploadUrl;
    },
    headers() {
      return { Authorization: sessionStorage.getItem('token') };
    },
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$emit('change', res.data);
    },
    beforeUpload() {
      // 只读时禁止上传
      if (this.readOnly) {
        return false;
      }
      return true;
    },
  },
};
</script>
<style scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  position: absolute;
  text-align: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
.is-disabled{
  cursor: not-allowed;
}
</style>
