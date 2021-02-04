<!--
 * @file: 头像上传
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2021-12-30 21:41:26
-->

<template>
  <el-upload class="avatar-uploader" :headers="headers" :action="action" :show-file-list="false" :on-success="handleAvatarSuccess">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
  name: 'AvatarUpload',
  data() {
    return {
      imageUrl: '',
    };
  },
  props: {
    uploadUrl: {
      type: String,
      default: '',
    },
  },
  computed: {
    action() {
      const __GLOBAL__URL__ = window.__HOST__URL__ + window.__PREFIX__URL__;
      return __GLOBAL__URL__ + this.uploadUrl;
    },
    headers() {
      return { Authorization: sessionStorage.getItem('token') };
    },
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
