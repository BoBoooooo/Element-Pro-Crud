// 基础组件
export const basicComponents = [
  {
    type: 'input',
    name: '单行文本',
    labelWidth: undefined,
    hidden: false,
    icon: 'regular/keyboard',
    options: {
      width: '100%',
      defaultValue: '',
      readonly: false,
      disabled: false,
      showWordLimit: false,
      required: false,
      dataType: 'string',
      pattern: '',
      maxLength: '',
      placeholder: '',
      hiddenLabel: false,
      appendButton: false, // 后缀功能按钮
    },
  },
  {
    type: 'textarea',
    name: '多行文本',
    icon: 'regular/keyboard',
    labelWidth: undefined,
    hidden: false,
    options: {
      width: '100%',
      defaultValue: '',
      readonly: false,
      disabled: false,
      showWordLimit: false,
      required: false,
      maxLength: '',
      pattern: '',
      placeholder: '',
      hiddenLabel: false,
    },
  },
  {
    type: 'number',
    name: '计数器',
    icon: 'sort-numeric-up',
    labelWidth: undefined,
    hidden: false,
    options: {
      width: '100%',
      required: false,
      defaultValue: 0,
      min: '',
      max: '',
      step: 1,
      disabled: false,
      controlsPosition: '',
      hiddenLabel: false,
    },
  },
  {
    type: 'radio',
    name: '单选框组',
    icon: 'regular/dot-circle',
    labelWidth: undefined,
    hidden: false,
    options: {
      inline: true,
      defaultValue: '',
      showLabel: false,
      hiddenLabel: false,
      options: [
        {
          value: '选项1',
          label: '选项1',
        },
        {
          value: '选项2',
          label: '选项2',
        },
        {
          value: '选项3',
          label: '选项3',
        },
      ],
      required: false,
      disabled: false,
      width: '100%',
      remote: 'static',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
      },
      remoteFunc: '',
    },
  },
  {
    type: 'checkbox',
    name: '多选框组',
    icon: 'regular/check-square',
    labelWidth: undefined,
    hidden: false,
    options: {
      inline: true,
      buttonStyle: false,
      defaultValue: [],
      showLabel: false,
      disabled: false,
      min: null,
      max: null,
      hiddenLabel: false,
      options: [
        {
          value: '选项1',
        },
        {
          value: '选项2',
        },
        {
          value: '选项3',
        },
      ],
      required: false,
      width: '100%',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
      },
      remoteFunc: '',
    },
  },
  {
    type: 'date',
    name: '日期选择器',
    labelWidth: undefined,
    hidden: false,
    icon: 'regular/calendar-alt',
    options: {
      hiddenLabel: false,
      defaultValue: false,
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'yyyy-MM-dd',
      timestamp: false,
      required: false,
      width: '100%',
    },
  },
  {
    type: 'time',
    name: '时间选择器',
    labelWidth: undefined,
    hidden: false,
    icon: 'clock',
    options: {
      hiddenLabel: false,
      defaultValue: false,
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'datetime',
      format: 'hh:mm:ss',
      timestamp: false,
      required: false,
      width: '100%',
    },
  },
  {
    type: 'rate',
    name: '评分',
    icon: 'regular/star',
    labelWidth: undefined,
    hidden: false,
    options: {
      hiddenLabel: false,
      defaultValue: null,
      max: 5,
      disabled: false,
      allowHalf: false,
      required: false,
    },
  },
  {
    type: 'color',
    name: '颜色选择器',
    icon: 'palette',
    labelWidth: undefined,
    hidden: false,
    options: {
      hiddenLabel: false,
      defaultValue: '',
      disabled: false,
      showAlpha: false,
      required: false,
    },
  },
  {
    type: 'select',
    name: '下拉选择框',
    labelWidth: undefined,
    hidden: false,
    icon: 'regular/caret-square-down',
    options: {
      hiddenLabel: false,
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      showLabel: false,
      allowCreate: false,
      width: '100%',
      options: [
        {
          value: '下拉框1',
        },
        {
          value: '下拉框2',
        },
        {
          value: '下拉框3',
        },
      ],
      remote: 'static',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
      },
      remoteFunc: '',
    },
  },
  {
    type: 'switch',
    name: '开关',
    labelWidth: undefined,
    hidden: false,
    icon: 'toggle-off',
    options: {
      hiddenLabel: false,
      defaultValue: false,
      required: false,
      disabled: false,
    },
  },
  {
    type: 'slider',
    name: '滑块',
    icon: 'sliders-h',
    labelWidth: undefined,
    hidden: false,
    options: {
      hiddenLabel: false,
      defaultValue: 0,
      disabled: false,
      required: false,
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
      width: '100%',
    },
  },
  {
    type: 'text',
    name: '文本',
    icon: 'language',
    options: {
      defaultValue: '',
      remoteFunc: '',
      align: 'center',
      fontSize: '16px',
      hiddenLabel: false,
    },
  },
  {
    type: 'html',
    name: 'HTML',
    icon: 'heading',
    labelWidth: undefined,
    options: {
      html: null,
      hiddenLabel: false,
    },
  },
  {
    type: 'cascader',
    name: '级联选择器',
    icon: 'random',
    labelWidth: undefined,
    options: {
      defaultValue: [],
      width: '100%',
      separator: '/',
      placeholder: '',
      required: false,
      multiple: false,
      disabled: false,
      clearable: false,
      checkStrictly: false,
      remote: 'static',
      remoteOptions: [],
      options: [
        {
          value: 'A',
          label: 'A',
          children: [
            {
              value: 'AA',
              label: 'AA',
              children: [
                {
                  value: 'AAA',
                  label: 'AAA',
                },
              ],
            },
          ],
        },
      ],
      props: {
        value: 'value',
        label: 'label',
        children: 'children',
      },
      remoteFunc: '',
      hiddenLabel: false,
    },
  },
  // 目前暂时提供了几个常用props,有更多需要自行拓展
  // 官网:https://vue-treeselect.js.org
  {
    type: 'treeselect',
    name: '树形下拉框',
    icon: 'tree',
    labelWidth: undefined,
    options: {
      remoteFunc: '',
      placeholder: '',
      width: '100%',
      defaultValue: null,
      maxHeight: 300,
      multiple: false,
      remote: 'custom',
      appendToBody: false,
      props: {
        value: 'value',
        label: 'label',
        children: 'children',
      },
      clearable: true,
      searchable: true,
      noChildrenText: '暂无数据',
      noOptionsText: '暂无数据',
      noResultsText: '暂无数据',
      searchNested: true,
      required: false,
      showValueLabelSlot: false,
      disabled: false,
      showCount: false,
      disableBranchNodes: true,
      remoteOptions: [
        {
          value: '测试数据A',
          label: '测试数据A',
          children: [
            {
              value: '测试数据AA',
              label: '测试数据AA',
            },
            {
              value: '测试数据AB',
              label: '测试数据AB',
            },
          ],
        },
        {
          value: '测试数据B',
          label: '测试数据B',
        },
        {
          value: '测试数据C',
          label: '测试数据C',
        },
      ],
      hiddenLabel: false,
    },
  },
  {
    type: 'richtext',
    name: '富文本',
    icon: 'text-width',
    labelWidth: undefined,
    hidden: false,
    options: {
      defaultValue: '',
      readonly: false,
      hiddenLabel: false,
      required: false,
    },
  },
];

// 高级组件
export const advanceComponents = [
  {
    type: 'blank',
    name: '自定义(插槽)',
    icon: 'chalkboard',
    labelWidth: undefined,
    options: {
      defaultType: 'String',
      hiddenLabel: false,
    },
  },
  {
    type: 'button',
    name: '按钮',
    icon: 'mouse-pointer',
    labelWidth: undefined,
    hidden: false,
    options: {
      text: '确认',
      eventName: 'btnCallback',
      btnType: 'primary',
      hiddenLabel: true,
    },
  },
  {
    type: 'upload',
    name: '附件',
    icon: 'upload',
    labelWidth: undefined,
    options: {
      resourceId: 'id',
      fileType: '',
      defaultValue: '',
      remoteFunc: '',
      readonly: false,
      hiddenLabel: false,
    },
  },
  {
    type: 'avatar',
    name: '头像',
    icon: 'user',
    labelWidth: undefined,
    options: {
      resourceId: 'id',
      uploadUrl: '/file/upload',
      width: '180px',
      hiddenLabel: true,
    },
  },
  {
    type: 'table',
    name: '子表格',
    icon: 'table',
    labelWidth: undefined,
    options: {
      remoteFunc: '',
      visibleList: {
        actionColumnBtnEdit: true,
        actionColumnBtnDetail: false,
        btnAdd: true,
        actionColumn: true,
        tableTitle: false,
        searchForm: false,
        actionColumnBtnDel: true,
      },
      tableParams: '',
      prefill: '',
      tableTitle: '',
      showPagination: true,
      isMultiple: false,
      tableName: '',
      tableDesignerName: '',
      dialogFormDesignerName: '',
      hiddenLabel: false,
    },
  },
  {
    type: 'form',
    name: '子表单',
    icon: 'file-word',
    labelWidth: undefined,
    tableColumns: [],
    options: {
      hiddenLabel: true,
      remote: 'custom',
      remoteFunc: '',
      tableParams: '',
      prefill: '',
      tableName: '',
    },
  },
];

// 布局组件
export const layoutComponents = [
  {
    type: 'grid',
    name: '栅格布局',
    icon: 'th',
    columns: [
      {
        span: 24,
        list: [],
      },
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top',
    },
  },
  {
    type: 'grid-table',
    name: '表格布局',
    icon: 'table',
    beta: true,
    options: {
      borderWidth: 1,
      borderColor: '#999',
      width: '100%',
      sumColSpan: 1,
      sumRowSpan: 1,
    },
    rows: [
      {
        columns: [],
      },
    ],
  },
  {
    type: 'tabs',
    name: '标签页',
    icon: 'tags',
    beta: true,
    items: [
      {
        name: '标签页1',
        label: '标签页1',
        list: [],
      },
    ],
    options: {
      type: '',
      hiddenLabel: true,
      position: 'top',
    },
  },
  {
    type: 'divider',
    name: '分割线',
    icon: 'divide',
    labelWidth: undefined,
    options: {
      align: 'center',
      hiddenLabel: true,
    },
  },
];

// 图表组件
export const chartComponents = [
  {
    type: 'chart-pie',
    name: '饼图',
    icon: 'chart-pie',
    options: {
      className: '',
      width: '100%',
      // title: '饼图',
      option: '',
      hiddenLabel: true,
      hollow: true,
      height: '300px',
      data: [
        {
          name: '商品一',
          value: '20',
        },
        {
          name: '商品二',
          value: '5',
        },
        {
          name: '商品三',
          value: '10',
        },
      ],
    },
  },
  {
    type: 'chart-line',
    name: '柱状/折线图',
    icon: 'chart-line',
    options: {
      className: '',
      yAxisMax: null,
      width: '100%',
      type: 'bar',
      // title: '饼图',
      option: '',
      rotate: false, // x,y轴互换
      xUnit: '', // x轴单位
      yUnit: '个', // y轴单位
      hiddenLabel: true,
      height: '400px',
      data: [
        {
          name: '商品一',
          value: '20',
        },
        {
          name: '商品二',
          value: '5',
        },
        {
          name: '商品三',
          value: '10',
        },
      ],
    },
  },
  {
    type: 'chart-common',
    name: '通用图表',
    icon: 'chart-bar',

    options: {
      className: '',
      height: '400px',
      hiddenLabel: true,
      width: '100%',
      loop: false,
      option: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
          },
        ],
      },
    },
  },
];

// 组件配置信息枚举
export const elementComponentConfig = {
  tabs: {
    type: [
      { label: '普通', value: '' },
      { label: '选项卡', value: 'card' },
      { label: '卡片化', value: 'border-card' },
    ],
    position: [
      { label: '顶部', value: 'top' },
      { label: '左侧', value: 'left' },
      { label: '右侧', value: 'right' },
      { label: '底部', value: 'bottom' },
    ],
  },
};

// 表单类组件枚举
export const formElement = ['input', 'textarea', 'number', 'radio', 'checkbox', 'date', 'time', 'rate', 'color', 'select', 'switch', 'slider', 'cascader', 'treeselect', 'richtext'];
