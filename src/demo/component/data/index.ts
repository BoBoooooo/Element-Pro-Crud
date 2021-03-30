/*
 * @file: 图表json
 * @author: BoBo
 * @copyright: NanJing Anshare Tech .Com
 * @Date: 2021-01-29 13:48:22
 */
const xAxisData: any = [];
const data1: any = [];
const data2: any = [];
for (let i = 0; i < 100; i += 1) {
  xAxisData.push(`类目${i}`);
  data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
  data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
}

export default {
  list: [
    {
      type: 'grid',
      name: '栅格布局',
      icon: 'th',
      columns: [
        {
          span: 8,
          list: [
            {
              type: 'chart-pie',
              name: '饼图',
              icon: 'chart-pie',
              options: {
                className: '',
                width: '100%',
                option: '',
                hiddenLabel: true,
                hollow: true,
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
                remoteFunc: 'func_chart-pie_33111',
              },
              key: 'chart-pie_33111',
              model: 'chart-pie_33111',
              rules: [],
            },
          ],
        },
        {
          span: 8,
          list: [
            {
              type: 'chart-line',
              name: '柱状图',
              icon: 'chart-line',
              options: {
                className: '',
                yAxisMax: null,
                width: '100%',
                type: 'bar',
                option: '',
                rotate: false,
                xUnit: '',
                yUnit: '个',
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
                remoteFunc: 'func_chart-line_10673',
              },
              key: 'chart-line_10673',
              model: 'chart-line_10673',
              rules: [],
            },
          ],
          key: '[object Object]_61291',
        },
        {
          span: 8,
          list: [
            {
              type: 'chart-line',
              name: '折线图',
              icon: 'chart-line',
              options: {
                className: '',
                yAxisMax: null,
                width: '100%',
                type: 'line',
                option: '',
                rotate: false,
                xUnit: '',
                yUnit: '个',
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
                remoteFunc: 'func_chart-line_10624',
              },
              key: 'chart-line_10624',
              model: 'chart-line_10624',
              rules: [],
            },
          ],
          key: '[object Object]_17310',
        },
      ],
      options: {
        gutter: 20,
        justify: 'start',
        align: 'top',
        remoteFunc: 'func_grid_54448',
      },
      key: 'grid_54448',
      model: 'grid_54448',
      rules: [],
    },
    {
      type: 'grid',
      name: '栅格布局',
      icon: 'th',
      columns: [
        {
          span: 8,
          list: [
            {
              type: 'chart-common',
              name: '散点图',
              icon: 'chart-bar',
              options: {
                className: '',
                height: '400px',
                hiddenLabel: true,
                width: '100%',
                loop: false,
                option: {
                  xAxis: {},
                  yAxis: {},
                  series: [
                    {
                      symbolSize: 20,
                      data: [
                        [10.0, 8.04],
                        [8.07, 6.95],
                        [13.0, 7.58],
                        [9.05, 8.81],
                        [11.0, 8.33],
                        [14.0, 7.66],
                        [13.4, 6.81],
                        [10.0, 6.33],
                        [14.0, 8.96],
                        [12.5, 6.82],
                        [9.15, 7.2],
                        [11.5, 7.2],
                        [3.03, 4.23],
                        [12.2, 7.83],
                        [2.02, 4.47],
                        [1.05, 3.33],
                        [4.05, 4.96],
                        [6.03, 7.24],
                        [12.0, 6.26],
                        [12.0, 8.84],
                        [7.08, 5.82],
                        [5.02, 5.68],
                      ],
                      type: 'scatter',
                    },
                  ],
                },
                remoteFunc: 'func_chart-common_26877',
              },
              key: 'chart-common_26877',
              model: 'chart-common_26877',
              rules: [],
            },
          ],
        },
        {
          span: 8,
          list: [
            {
              type: 'chart-common',
              name: '雷达图',
              icon: 'chart-bar',
              options: {
                className: '',
                height: '400px',
                hiddenLabel: true,
                width: '100%',
                loop: false,
                option: {
                  tooltip: {},
                  legend: {
                    data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）'],
                  },
                  radar: {
                    // shape: 'circle',
                    name: {
                      textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5],
                      },
                    },
                    indicator: [
                      { name: '销售（sales）', max: 6500 },
                      { name: '管理（Administration）', max: 16000 },
                      { name: '信息技术（Information Techology）', max: 30000 },
                      { name: '客服（Customer Support）', max: 38000 },
                      { name: '研发（Development）', max: 52000 },
                      { name: '市场（Marketing）', max: 25000 },
                    ],
                  },
                  series: [
                    {
                      name: '预算 vs 开销（Budget vs spending）',
                      type: 'radar',
                      // areaStyle: {normal: {}},
                      data: [
                        {
                          value: [4300, 10000, 28000, 35000, 50000, 19000],
                          name: '预算分配（Allocated Budget）',
                        },
                        {
                          value: [5000, 14000, 28000, 31000, 42000, 21000],
                          name: '实际开销（Actual Spending）',
                        },
                      ],
                    },
                  ],
                },
                remoteFunc: 'func_chart-common_76476',
              },
              key: 'chart-common_76476',
              model: 'chart-common_76476',
              rules: [],
            },
          ],
          key: '[object Object]_31888',
        },
        {
          span: 8,
          list: [
            {
              type: 'chart-common',
              name: '柱状图动画',
              icon: 'chart-bar',
              options: {
                className: '',
                height: '400px',
                hiddenLabel: true,
                width: '100%',
                loop: false,
                option: {
                  legend: {
                    data: ['bar', 'bar2'],
                  },
                  toolbox: {
                    // y: 'bottom',
                    feature: {
                      magicType: {
                        type: ['stack', 'tiled'],
                      },
                      dataView: {},
                      saveAsImage: {
                        pixelRatio: 2,
                      },
                    },
                  },
                  tooltip: {},
                  xAxis: {
                    data: xAxisData,
                    splitLine: {
                      show: false,
                    },
                  },
                  yAxis: {},
                  series: [
                    {
                      name: 'bar',
                      type: 'bar',
                      data: data1,
                      emphasis: {
                        focus: 'series',
                      },
                      animationDelay(idx) {
                        return idx * 10;
                      },
                    },
                    {
                      name: 'bar2',
                      type: 'bar',
                      data: data2,
                      emphasis: {
                        focus: 'series',
                      },
                      animationDelay(idx) {
                        return idx * 10 + 100;
                      },
                    },
                  ],
                  animationEasing: 'elasticOut',
                  animationDelayUpdate(idx) {
                    return idx * 5;
                  },
                },
                remoteFunc: 'func_chart-common_14493',
              },
              key: 'chart-common_14493',
              model: 'chart-common_14493',
              rules: [],
            },
          ],
          key: '[object Object]_97258',
        },
      ],
      options: {
        gutter: 20,
        justify: 'start',
        align: 'top',
        remoteFunc: 'func_grid_58177',
      },
      key: 'grid_58177',
      model: 'grid_58177',
      rules: [],
    },
  ],
  config: {
    labelWidth: 140,
    labelPosition: 'right',
    size: 'small',
    customClass: '',
  },
};

export const proTableJson = {
  columns: [
    {
      label: '人员基本信息',
      headerAlign: 'center',
      children: [
        {
          prop: 'avatar',
          label: '照片',
          align: 'center',
          headerAlign: 'center',
          showOverflowTooltip: true,
          minWidth: 80,
          sortable: 'custom',
          searchable: true,
          slotName: 'columnFormatter',
        },
        {
          prop: 'jobno',
          label: '工号',
          minWidth: '100',
          align: 'center',
          headerAlign: 'center',
          showOverflowTooltip: true,
          sortable: 'custom',
          slotName: 'columnFormatter',
          searchable: true,
        },
        {
          prop: 'personname',
          label: '姓名',
          minWidth: '70',
          align: 'center',
          headerAlign: 'center',
          showOverflowTooltip: true,
          sortable: 'custom',
          slotName: 'columnFormatter',
          searchable: true,
        },
        {
          prop: 'mobile',
          label: '联系方式',
          minWidth: 140,
          align: 'center',
          headerAlign: 'center',
          showOverflowTooltip: true,
          sortable: 'custom',
          slotName: '',
          searchable: true,
        },
      ],
    },
    {
      label: '职位信息',
      headerAlign: 'center',
      children: [
        {
          prop: 'jobtime',
          label: '入职时间',
          minWidth: 140,
          align: 'center',
          headerAlign: 'center',
          showOverflowTooltip: true,
          sortable: 'custom',
          slotName: '',
          searchable: true,
        },
        {
          prop: 'deptname',
          label: '所在部门',
          minWidth: '100',
          align: 'center',
          headerAlign: 'center',
          showOverflowTooltip: true,
          sortable: 'custom',
          slotName: '',
          searchable: true,
        },
        {
          prop: 'post',
          label: '岗位',
          minWidth: '100',
          align: 'center',
          headerAlign: 'center',
          showOverflowTooltip: true,
          sortable: 'custom',
          slotName: '',
          searchable: true,
        },
        {
          prop: 'level',
          label: '职级',
          minWidth: '100',
          align: 'center',
          headerAlign: 'center',
          showOverflowTooltip: true,
          sortable: 'custom',
          slotName: '',
          searchable: true,
        },
      ],
    },
  ],
  name: 'person',
  position: '员工管理',
};
