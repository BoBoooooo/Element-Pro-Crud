<template>
  <el-dialog class="cus-dialog-container"
             :title="title"
             :visible.sync="dialogVisible"
             :width="width"
             ref="elDialog"
             :id="id"
             append-to-body>
    <span v-if="show">
      <slot></slot>
    </span>

    <span v-if="action"
          slot="footer"
          class="dialog-footer"
          v-loading="loading"
          :element-loading-text="loadingText">
      <slot name="action">
        <el-button @click="close">取消</el-button>
        <el-button type="primary"
                   @click="submit">确 定</el-button>
      </slot>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import {
  Component, Vue, Watch, Prop,
} from 'vue-property-decorator';

@Component
export default class CusDialog extends Vue {
  loading = false;

  id = `dialog ${new Date().getTime()}`;

  showForm = false;

  @Prop(Boolean)
  visible!: boolean;

  @Prop({
    type: String,
    default: '',
  })
  loadingText!: string;

  @Prop({
    type: String,
    default: '预览',
  })
  title!: string;

  @Prop({
    type: String,
    default: '600px',
  })
  width!: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  form!: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  action!: boolean;

  dialogVisible = this.visible;

  get show() {
    if (this.form) {
      return this.showForm;
    }
    return true;
  }

  close() {
    this.dialogVisible = false;
  }

  submit() {
    this.loading = true;

    this.$emit('on-submit');
  }

  end() {
    this.loading = false;
  }

  @Watch('dialogVisible')
  dialogVisibleChange(val) {
    if (!val) {
      this.loading = false;
      this.$emit('on-close');
      setTimeout(() => {
        this.showForm = false;
      }, 300);
    } else {
      this.showForm = true;
    }
  }

  @Watch('visible')
  visibleChange(val) {
    this.dialogVisible = val;
  }
}
</script>

<style lang="scss">
.cus-dialog-container {
  .el-dialog__body{
    overflow: auto;
  }
  .el-dialog__footer {
    // margin: 0 20px;
    // border-top: 1px dashed #ccc;
    padding: 15px 0 16px;
    text-align: center;
    position: relative;

    .dialog-footer {
      display: block;

      .circular {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        width: 24px;
        height: 24px;
      }

      .el-loading-text {
        display: inline-block;
        vertical-align: middle;
      }

      .el-loading-spinner {
        margin-top: -12px;
      }
    }
  }
}
</style>
