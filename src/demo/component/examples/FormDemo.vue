<!--
 * @file: 表单示例
 * @author: BoBo
 * @copyright: BoBo
 * @Date: 2021-03-09 20:37:46
-->
<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 10px">
      <el-col :span="8">
        <el-card shadow="never" :body-style="{ padding: '0' }">
          <div slot="header">
            <span>表单初始值</span>
          </div>
          <div id="jsoneditor2" style="height: 300px; width: 100%">{{ jsonTemplate2 }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" :body-style="{ padding: '0' }">
          <div slot="header">
            <span>当前表单值</span>
          </div>
          <div id="jsoneditor1" style="height: 300px; width: 100%">{{ jsonTemplate1 }}</div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" :body-style="{ padding: '0' }">
          <div slot="header">
            <span>表单json</span>
          </div>
          <div id="jsoneditor3" style="height: 300px; width: 100%">{{ jsonTemplate3 }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <pro-form @personname:input="change" @jobno:change="change" :data="jsonData" :remote="remoteFuncs" :value="value" ref="proForm" :entity.sync="entity"> </pro-form>
      </el-col>
      <el-col :span="8" class="button-container">
        <template v-for="(btn, index) in btnList">
          <el-tooltip :key="index" :content="btn.content" placement="top" effect="dark">
            <el-button type="primary" @click="btn.func">{{ btn.name }}</el-button>
          </el-tooltip>
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import jsonData from '../data/form-demo';

export default {
  name: 'FormDemo',
  data() {
    return {
      jsonData,
      value: {
        sex: '男',
        personname: '张三',
        jobno: '20190893082',
        education: '研究生',
        deptname: '研发部',
        post: '研发工程师',
        level: 'P5',
        jobtime: '2021-03-02',
        salary: '15k',
        mobile: '1397894xxxx',
        major: '软件工程',
        birthdate: '1996-02',
      },
      remoteFuncs: {
        func_1608433134000_41081(resolve) {
          // 文化程度 education
          // Call callback function once get the data from remote server
          // resolve(data)
        },

        func_1608433344000_95961(resolve) {
          // 职级 level
          // Call callback function once get the data from remote server
          // resolve(data)
        },
      },
      entity: {},
      jsonTemplate1: '',
      jsonTemplate2: '',
      jsonTemplate3: '',
      formApi: null,
      btnList: [
        {
          name: '异步更新字段',
          func: this.setFieldValue,
          content: 'setFieldValue',
        },
        {
          name: '异步更新表单',
          func: this.setFormValue,
          content: 'setFormValue',
        },
        {
          name: '校验表单必填项',
          func: this.validate,
          content: 'validate',
        },
        {
          name: '获取表单值不校验',
          func: this.getDataWithoutValidate,
          content: 'getDataWithoutValidate',
        },
        {
          name: '异步更新字段',
          func: this.setFieldValue,
          content: 'setFieldValue',
        },
        {
          name: '隐藏字段',
          func: this.hidden,
          content: 'hidden',
        },
        {
          name: '恢复隐藏字段',
          func: () => this.hidden(false),
          content: 'hidden(false)',
        },
        {
          content: 'disabled',
          func: this.disabled,
          name: '禁用字段',
        },
        {
          content: 'disabled(false)',
          func: () => this.disabled(false),
          name: '恢复禁用字段',
        },
        {
          content: 'getData',
          func: this.handleSubmit,
          name: '获取表单值',
        },
        {
          content: 'getFieldValue',
          func: this.getFieldValue,
          name: '获取某个字段值',
        },
        {
          content: 'resetForm',
          func: this.resetForm,
          name: '重置表单',
        },
      ],
    };
  },
  mounted() {
    this.formApi = this.$refs.proForm;
    this.handleGenerateJson();
  },
  methods: {
    change(data) {
      console.log(data);
    },
    handleGenerateJson() {
      this.jsonTemplate1 = JSON.stringify(this.entity, null, 2);
      this.jsonTemplate2 = JSON.stringify(this.value, null, 2);
      this.jsonTemplate3 = JSON.stringify(this.jsonData, null, 2);

      this.$nextTick(() => {
        const editor1 = ace.edit('jsoneditor1');
        editor1.session.setMode('ace/mode/json');
        const editor2 = ace.edit('jsoneditor2');
        editor2.session.setMode('ace/mode/json');
        const editor3 = ace.edit('jsoneditor3');
        editor3.session.setMode('ace/mode/json');
      });
    },
    handleSubmit() {
      this.$refs.proForm
        .getData()
        .then((data) => {
          this.$alert(data, '');
        })
        .catch((e) => {
          this.$alert(JSON.stringify(e));
        });
    },
    resetForm() {
      this.formApi.resetForm();
      this.$message('已重置表单为初始值');
    },
    // 异步更新时需要先获取当前表单已输入内容,否则初始化后已输入内容会丢失
    setFieldValue() {
      // this.formApi.setFieldValue('sex', '女');
      // this.formApi.setFieldValue('personname', '李四');
      this.formApi.setFieldValue({
        sex: '女',
        personname: '李四',
      });
      this.$message('已更新性别为女,姓名为李四');
    },

    // 不经过验证直接获取表单内容
    getDataWithoutValidate() {
      this.$refs.proForm
        .getDataWithoutValidate()
        .then((data) => {
          this.$alert(data, '');
        })
        .catch((e) => {
          // data check failed
        });
    },

    /**
     * 获取某个字段值
     */
    getFieldValue() {
      this.$alert(`personname值为:${this.formApi.getFieldValue('personname')}`);
    },
    // 校验表单
    validate() {
      this.$refs.proForm
        .validate()
        .then(() => {
          this.$message('校验通过');
        })
        .catch((err) => {
          this.$alert(JSON.stringify(err));
        });
    },

    // 隐藏字段
    hidden(status) {
      this.formApi.hidden(status, 'personname');
    },

    // 设置表单值
    setFormValue() {
      this.formApi.setFormValue({
        ...this.value,
        personname: '王五',
        jobno: '001',
      });
      this.$message('已更新姓名为王五,工号为001');
    },

    // 禁用字段
    disabled(status) {
      this.formApi.disabled(status, 'personname');
    },
  },
  watch: {
    entity: {
      deep: true,
      handler() {
        const editor1 = ace.edit('jsoneditor1');
        editor1.session.setValue(JSON.stringify(this.entity, null, 2));
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.button-container {
  ::v-deep .el-button {
    margin: 10px;
  }
}
</style>
