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
    <ProForm
      ref="generateDialogForm"
      :value="formValues"
      :data="formDesign"
      :rules="rules"
      :readOnly="isReadOnly"
      :remote="remoteFuncs"
      :entity.sync="entity"
      @btn-on-click="btnOnClick"
      :formTableConfig="formTableConfig"
    >
      <template :slot="slotName" v-for="slotName in Object.keys($scopedSlots)">
        <slot :name="slotName" :entity="entity"></slot>
      </template>
    </ProForm>
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
import guid from '@/utils/generator';
import { DML, fn } from '@/types/common';
import VueCompositionApi, { defineComponent, PropType, ref, Ref, reactive, computed, set, watch, watchEffect, h } from '@vue/composition-api';
import ProForm from '@/component/pro-form/src/ProForm.vue';
import Vue, { VNode } from 'vue';

Vue.use(VueCompositionApi);

const STATUS = {
  CREATE: 0,
  UPDATE: 1,
  DETAIL: 2,
};

export default defineComponent({
  name: 'ProFormDialog',
  components: {
    ProForm,
  },
  emits: ['cancel', 'change', 'afterSave', 'btnOnClick'],
  props: {
    readOnly: {
      default: false,
      type: Boolean,
    },
    dialogAppendToBody: {
      default: true,
      type: Boolean,
    },
    dialogWidth: {
      default: '80%',
      type: String,
    },
    dialogFormDesignerName: {
      type: String,
      default: null,
    },
    visibleList: {
      default: () => ({}),
      type: Object,
    },
    tableName: {
      type: String,
      default: '',
    },
    textMap: {
      default: () => ({}),
      type: Object,
    },
    promiseForSave: {
      default: null,
      type: Function as PropType<fn>,
    },
    remoteFuncs: {
      default: () => ({}),
      type: Object,
    },
    dialogCloseOnClickModal: {
      default: true,
      type: Boolean,
    },
    dialogFullscreen: {
      default: false,
      type: Boolean,
    },
    rules: {
      default: () => [],
      type: Array,
    },
    formValuesAsync: {
      default: () => ({}),
      type: Object,
    },
    formTableConfig: {
      default: () => ({}),
      type: Object,
    },
  },
  setup(props, { root, emit }) {
    const { $PROCRUD, $message, $notify } = root;

    const generateDialogForm: Ref<any> = ref(null);

    // 对话框内文本框们填写的值
    const formValues = ref({});

    // 对话框设计结构json
    const formDesign = ref({});

    // 对话框是否显示
    const visible = ref(false);

    // 保存按钮Loading状态
    const btnSaveIsLoading = ref(false);

    // 当前整个表单的entity
    const entity = ref({});

    // 表单状态
    const dialogStatus = ref(0);

    // 表格参数
    const dialogParams = ref({});

    // 对话框标题
    const dialogTitle = computed(() => {
      let title = '';
      switch (dialogStatus.value) {
        case STATUS.CREATE:
          title = props.textMap.add;
          break;
        case STATUS.UPDATE:
          title = props.textMap.edit;
          break;
        case STATUS.DETAIL:
          title = props.textMap.detail;
          break;
        default:
          title = '';
      }
      return title;
    });

    const isReadOnly = computed(() => {
      return dialogStatus.value === STATUS.DETAIL || props.readOnly;
    });

    // 内部元素显示控制
    const view = computed(() => ({
      ...props.visibleList,
    }));

    /**
     * 显示对话框，父元素调用
     *
     * @param {Object} param 对话框保存时的参数
     * @param {Number} status 对话框状态[添加:0,编辑:1]，必须是STATUS枚举
     * @param {Object} formValues 编辑时传入所有字段的默认值
     */
    const showDialog = (param = {}, status = STATUS.CREATE, values = {}) => {
      // 保存参数用于save方法
      dialogParams.value = param;
      dialogStatus.value = status;
      // 请求对话框内的动态表单json
      $PROCRUD.getFormDetail(props.dialogFormDesignerName || props.tableName).then((res) => {
        formDesign.value = JSON.parse(res.data.formJson);
        if (dialogStatus.value === STATUS.UPDATE) {
          // 填写编辑框
          formValues.value = { ...values };
        } else {
          // add 默认生成id
          formValues.value = {
            id: guid(),
            ...values,
          };
        }
        visible.value = true;
      });
    };

    // 保存按钮点击
    const btnSaveOnClick = (prefill = {}) => {
      btnSaveIsLoading.value = true;
      // 调用此方法验证表单数据和获取表单数据
      generateDialogForm.value
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
          if (dialogStatus.value === STATUS.CREATE) {
            type = DML.INSERT;
            msg = '添加成功';
          } else {
            type = DML.UPDATE;
            msg = '编辑成功';
          }
          let promise;
          // 如果有代理的保存方法
          if (props.promiseForSave) {
            promise = props.promiseForSave(formValue, type);
          } else {
            promise = $PROCRUD.crud(type, props.tableName, formValue);
          }

          promise.then((res) => {
            if (res.code !== 200) {
              $message({
                type: 'error',
                message: `保存失败，原因：${res.message}`,
              });
              btnSaveIsLoading.value = false;
              return;
            }
            btnSaveIsLoading.value = false;
            visible.value = false;
            $message({
              type: 'success',
              message: msg,
            });
            emit('afterSave', {
              status: dialogStatus.value,
              dialogParams: dialogParams.value,
            });
          });
        })
        .catch(() => {
          // 数据校验失败
          $message.error('表单校验失败,请检查');
          btnSaveIsLoading.value = false;
        });
    };

    // 取消按钮点击
    const btnCancelOnClick = () => {
      visible.value = false;
      emit('cancel');
    };

    // 生成的按钮点击
    const btnOnClick = (widget) => {
      emit('btnOnClick', widget);
    };

    // 监听
    watchEffect(() => {
      // 抛出当前表单对象以及当前表单json
      emit('change', {
        formEntity: entity.value,
        formDesign: formDesign.value,
      });
    });

    // 监听
    watch(
      () => props.formValuesAsync,
      (val) => {
        // 抛出当前表单对象以及当前表单json
        Object.keys(val).forEach((k) => {
          // 异步赋值
          set(formValues, k, val[k]);
        });
      },
    );

    return {
      generateDialogForm,
      formValues,
      formDesign,
      visible,
      btnSaveIsLoading,
      entity,
      dialogStatus,
      dialogParams,
      isReadOnly,
      view,
      dialogTitle,
      showDialog,
      btnSaveOnClick,
      btnCancelOnClick,
      btnOnClick,
    };
  },
});
</script>
