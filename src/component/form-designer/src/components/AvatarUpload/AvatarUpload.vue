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
    <img v-if="hasImage" :src="imageUrl" class="avatar" />
    <div v-else class="uploader-container">
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </div>
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
      hasImage: false,
      prefix: window.__HOST__URL__ + window.__PREFIX__URL__,
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
  created() {
    if (this.value) {
      this.hasImage = true;
    }
  },
  computed: {
    imageUrl() {
      return this.prefix + this.value;
    },
    action() {
      return this.prefix + this.widget.options.uploadUrl;
    },
    headers() {
      return { Authorization: sessionStorage.getItem('token') };
    },
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.hasImage = true;
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
  margin: 0 auto;
  overflow: hidden;
}
.avatar-uploader >>> .el-upload{
  height:100%;
  display: block;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.upload-container{
  height:100%;
  width: 100%;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  position: absolute;
  text-align: center;
  left: 50%;
  cursor: pointer;
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
