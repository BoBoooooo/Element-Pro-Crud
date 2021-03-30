<!--
@file 用于动态表单保存的对话框
@author BoBo
@copyright BoBo
@createDate 2018年11月16日19:31:29
-->
<template>
  <!-- 对话框 -->
  <el-dialog
    v-if="visible"
    ref="dialog"
    :title="dialogTitle"
    :visible.sync="visible"
    :width="dialogWidth"
    :append-to-body="dialogAppendToBody"
    :fullscreen="dialogFullscreen"
    :close-on-click-modal="dialogCloseOnClickModal"
  >
    <!-- 对话框内动态表单 -->
    <GenerateForm
      ref="generateDialogForm"
      :value="formValues"
      :data="formDesign"
      :rules="rules"
      :readOnly="isReadOnly"
      :remote="remoteFuncs"
      :entity.sync="entity"
      @btn-on-click="btnOnClick"
      :formTableConfig="formTableConfig"
    />
    <el-row type="flex" justify="end" slot="footer">
      <slot name="dialogFooter"></slot>
      <template v-if="isReadOnly">
        <el-button @click="visible = false">关 闭</el-button>
      </template>
      <template v-else>
        <el-button type="primary" icon="el-icon-check" @click="btnSaveOnClick()" :loading="btnSaveIsLoading">保存</el-button>
        <el-button icon="el-icon-close" @click="btnCancelOnClick()">取消</el-button>
      </template>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import GenerateForm from '@/component/form-designer/src/GenerateForm.vue';
import guid from '@/utils/generator';
import { Component, Vue, Emit, Watch, Prop } from 'vue-property-decorator';
import { DML } from '@/types/common';

const STATUS = {
  CREATE: 0,
  UPDATE: 1,
  DETAIL: 2,
};

@Component({
  components: {
    GenerateForm,
  },
  name: 'GenerateFormDialog',
})
export default class GenerateFormDialog extends Vue {
  // 异步更新表单数据
  @Prop({ default: () => ({}), type: Object }) formValuesAsync!: any;

  // 子表tableConfig 详情看GenerateFormItem中解释
  @Prop({ default: () => ({}), type: Object }) formTableConfig!: any;

  // 设置只读
  @Prop({ default: false, type: Boolean }) readOnly!: boolean;

  // 对话框内加载FormDesigner的表名
  @Prop({
    type: String,
    default: null,
  })
  dialogFormDesignerName!: string;

  // 内部元素显示控制
  @Prop({ default: () => ({}), type: Object }) visibleList!: any;

  // 按钮名字
  @Prop({ default: () => ({}), type: Object }) textMap!: any;

  // 对话框宽度
  @Prop({
    type: String,
    default: '80%',
  })
  dialogWidth!: string;

  // 表名
  @Prop({
    type: String,
    default: '',
  })
  tableName!: string;

  // 表格参数
  @Prop([Object, Array]) tableParams!: any;

  // 代理保存方法
  @Prop({ default: null, type: Function }) promiseForSave!: any;

  // 远程数据方法
  @Prop({ default: () => ({}), type: Object }) remoteFuncs!: any;

  // 弹出表单appendToBody
  @Prop({ default: true, type: Boolean }) dialogAppendToBody!: boolean;

  // 点击阴影弹框是否可以关闭
  @Prop({ default: true, type: Boolean }) dialogCloseOnClickModal!: boolean;

  // 表单是否全屏
  @Prop({ default: false, type: Boolean }) dialogFullscreen!: boolean;

  // 组件联动规则
  @Prop({
    type: Array,
    default: () => [],
  })
  rules!: any[];

  $refs!: {
    generateDialogForm: HTMLFormElement;
  };

  // 对话框内文本框们填写的值
  formValues: any = {};

  // 对话框设计结构json
  formDesign: any = {};

  // 对话框是否显示
  visible = false;

  // 保存按钮Loading状态
  btnSaveIsLoading = false;

  // 当前整个表单的entity
  entity = {};

  // 表单状态
  dialogStatus = 0;

  // 表格参数
  dialogParams: any = {};

  // 对话框标题
  get dialogTitle() {
    let title = '';
    switch (this.dialogStatus) {
      case STATUS.CREATE:
        title = this.textMap.add;
        break;
      case STATUS.UPDATE:
        title = this.textMap.edit;
        break;
      case STATUS.DETAIL:
        title = this.textMap.detail;
        break;
      default:
        title = '';
    }
    return title;
  }

  get isReadOnly() {
    return this.dialogStatus === STATUS.DETAIL || this.readOnly;
  }

  // 内部元素显示控制
  get view() {
    return {
      ...this.visibleList,
    };
  }

  /**
   * 显示对话框，父元素调用
   *
   * @param {Object} param 对话框保存时的参数
   * @param {Number} status 对话框状态[添加:0,编辑:1]，必须是STATUS枚举
   * @param {Object} formValues 编辑时传入所有字段的默认值
   */
  showDialog(param = {}, status = STATUS.CREATE, formValues = {}) {
    // 保存参数用于save方法
    this.dialogParams = param;
    this.dialogStatus = status;
    // 请求对话框内的动态表单json
    this.$PROCRUD.getFormDetail(this.dialogFormDesignerName ? this.dialogFormDesignerName : this.tableName).then((res) => {
      this.formDesign = JSON.parse(res.data.formJson);
      if (this.dialogStatus === STATUS.UPDATE) {
        // 填写编辑框
        this.formValues = { ...formValues };
      } else {
        // add 默认生成id
        this.formValues = {
          id: guid(),
          ...formValues,
        };
      }
      this.visible = true;
    });
  }

  // 保存按钮点击
  btnSaveOnClick(prefill = {}) {
    this.btnSaveIsLoading = true;
    // 调用此方法验证表单数据和获取表单数据
    this.$refs.generateDialogForm
      .getData()
      .then((formValue) => {
        let type;
        let msg;
        // 如果select,radio,checkbox等多选情况返回数组的话，默认拼接成逗号分隔的字符串传给后台
        Object.keys(formValue).forEach((k) => {
          if (Array.isArray(formValue[k])) {
            formValue[k] = formValue[k].toString();
          }
        });
        // 根据对话框状态判断保存或编辑
        if (this.dialogStatus === STATUS.CREATE) {
          type = DML.INSERT;
          msg = '添加成功';
        } else {
          type = DML.UPDATE;
          msg = '编辑成功';
        }
        let promise;
        // 如果有代理的保存方法
        if (this.promiseForSave) {
          promise = this.promiseForSave(formValue, type);
        } else {
          promise = this.$PROCRUD.crud(type, this.tableName, formValue);
        }

        promise.then((res) => {
          if (res.code !== 200) {
            this.$message({
              type: 'error',
              message: `保存失败，原因：${res.message}`,
            });
            this.btnSaveIsLoading = false;
            return;
          }
          this.btnSaveIsLoading = false;
          this.visible = false;
          this.$message({
            type: 'success',
            message: msg,
          });
          this.$emit('afterSave', {
            status: this.dialogStatus,
            dialogParams: this.dialogParams,
          });
        });
      })
      .catch(() => {
        this.btnSaveIsLoading = false;
        // 数据校验失败
      });
  }

  // 取消按钮点击
  btnCancelOnClick() {
    this.visible = false;
    this.$emit('cancel');
  }

  // 生成的按钮点击
  btnOnClick(widget) {
    this.$emit('btnOnClick', widget);
  }

  @Watch('entity', { deep: true })
  onDataChange(value: any) {
    // 抛出当前表单对象以及当前表单json
    this.$emit('change', {
      formEntity: value,
      formDesign: this.formDesign,
    });
  }

  @Watch('formValuesAsync', { deep: true })
  onValueChange(value: any) {
    Object.keys(value).forEach((k) => {
      // 异步赋值
      this.$set(this.formValues, k, value[k]);
    });
  }
}
</script>
