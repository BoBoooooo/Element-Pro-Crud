/**
 * @file 表格设计功能列配置
 * @author ytyang
 * @copyright NanJing Anshare Tech .Com
 * @createDate 2018年12月26日11:28:17
 */

export default [
  {
    name: '#',
    is: 'i',
    show: true,
    bodyStyle: 'el-icon-sort',
    tootip: '拖拽我上下滑动可以改变字段顺序',
  },
  {
    name: '字段',
    field: 'prop',
    is: 'input',
    show: true,
  },
  {
    name: '列名',
    field: 'label',
    is: 'input',
    headStyle: 'width:150px',
    show: true,
  },
  {
    name: '高级查询',
    field: 'option',
    is: 'popover',
    headStyle: 'width:90px',
    show: true,
    tootip: '默认为文本框，可转为下拉菜单',
  },
  {
    name: '列宽',
    field: 'width',
    is: 'input',
    headStyle: 'width:70px',
    show: false,
  },
  {
    name: '最小宽',
    field: 'minWidth',
    is: 'input',
    headStyle: 'width:70px',
    tootip: '加粗黑色表示非默认宽度',
    show: true,
  },
  {
    name: '表格对齐',
    field: 'align',
    is: 'select',
    list: [
      {
        label: '靠左',
        value: 'left',
      },
      {
        label: '居中',
        value: 'center',
      },
      {
        label: '靠右',
        value: 'right',
      },
      {
        label: '默认对齐',
        value: undefined,
      },
    ],
    show: true,
  },
  {
    name: '表头对齐',
    field: 'headerAlign',
    is: 'select',
    headStyle: 'width:50px',
    list: [
      {
        label: '靠左',
        value: 'left',
      },
      {
        label: '居中',
        value: 'center',
      },
      {
        label: '靠右',
        value: 'right',
      },
      {
        label: '默认对齐',
        value: undefined,
      },
    ],
    show: true,
  },
  {
    name: '固定方式',
    field: 'fixed',
    is: 'select',
    headStyle: 'width:50px',
    list: [
      {
        label: '靠左',
        value: 'left',
      },
      {
        label: '靠右',
        value: 'right',
      },
      {
        label: '不固定',
        value: false,
      },
    ],
    show: true,
  },
  {
    name: '溢出隐藏',
    field: 'showOverflowTooltip',
    headStyle: 'width:80px',
    is: 'switch',
    show: true,
  },
  {
    name: '排序方式',
    field: 'sortable',
    is: 'select',
    headStyle: 'width:120px',
    // 区分客户端和服务端排序，所以value统一使用string
    list: [
      {
        label: '不排序',
        value: 'false',
      },
      // {
      //   label: '客户端排序',
      //   value: 'true',
      // },
      {
        label: '服务端排序',
        value: 'custom',
      },
    ],
    show: true,
  },
  {
    name: '是否检索',
    field: 'searchable',
    headStyle: 'width:80px',
    is: 'switch',
    tootip: '是否在表格顶部高级查询区域显示',
    show: true,
  },
  {
    name: '插槽',
    field: 'slotName',
    is: 'input',
    show: true,
  },
  {
    name: '操作',
    show: true,
  },
];
