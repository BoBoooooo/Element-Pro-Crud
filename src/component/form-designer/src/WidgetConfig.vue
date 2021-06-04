<!--
 * @file: 表单设计器右侧配置项区域
 * @author: BoBo
 * @Date: 2019-07-09 14:30:43
 * @copyright GavinZhuLei
  部分修改重构
  原作者地址 https://github.com/GavinZhuLei/vue-form-making
  感谢大佬!
 -->
<template>
  <div v-if="show">
    <el-form label-position="top" class="form" size="mini">
      <el-form-item
        v-if="elementConfig.type != 'button' && elementConfig.type != 'upload' && elementConfig.type != 'text' && elementConfig.type != 'grid'"
        :label="elementConfig.type === 'blank' ? '插槽名(需结合代码)' : '字段标识'"
      >
        <el-input size="mini" v-model="elementConfig.model"></el-input>
      </el-form-item>
      <el-form-item label="标题" v-if="!elementConfig.type.includes('grid') && elementConfig.type !== 'td' && elementConfig.type !== 'button'">
        <el-input size="mini" v-model="elementConfig.name"></el-input>
      </el-form-item>
      <el-form-item label="自定义className">
        <el-input size="mini" v-model="elementConfig.options.className"></el-input>
      </el-form-item>
      <el-form-item label="显示文本" v-if="Object.keys(elementConfig.options).indexOf('text') >= 0">
        <el-input size="mini" v-model="elementConfig.options.text"></el-input>
      </el-form-item>
      <el-form-item label="按钮类型" v-if="Object.keys(elementConfig.options).indexOf('btnType') >= 0">
        <el-select size="mini" v-model="elementConfig.options.btnType">
          <el-option value="primary" label="primary" />
          <el-option value="sussess" label="sussess" />
          <el-option value="warning" label="warning" />
          <el-option value="danger" label="danger" />
          <el-option value="info" label="info" />
          <el-option value="text" label="text" />
        </el-select>
      </el-form-item>
      <el-form-item :label="elementConfig.type === 'html' ? 'HTML' : '图表数据'" v-if="elementConfig.type === 'html' || elementConfig.type.includes('chart-')">
        <el-button style="float: right" icon="el-icon-check" size="mini" @click="saveJson">保存修改</el-button>
        <div id="jsoneditor2" ref="jsoneditor2" style="height: 300px; width: 100%"></div>
      </el-form-item>
      <el-form-item label="是否空心" v-if="Object.keys(elementConfig.options).indexOf('hollow') >= 0">
        <el-switch v-model="elementConfig.options.hollow"></el-switch>
      </el-form-item>
      <el-form-item label="高度" v-if="Object.keys(elementConfig.options).indexOf('height') >= 0">
        <el-input size="mini" v-model="elementConfig.options.height"></el-input>
      </el-form-item>
      <el-form-item label="是否循环" v-if="Object.keys(elementConfig.options).indexOf('loop') >= 0">
        <el-switch v-model="elementConfig.options.loop"></el-switch>
      </el-form-item>
      <!-- 柱状/折线图特有属性 -->
      <template v-if="elementConfig.type == 'chart-line'">
        <el-form-item label="图表类型">
          <el-select size="mini" v-model="elementConfig.options.type">
            <el-option value="bar" label="柱状图"></el-option>
            <el-option value="line" label="折线图"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="xy轴反向" v-if="Object.keys(elementConfig.options).indexOf('rotate') >= 0">
          <el-switch v-model="elementConfig.options.rotate"></el-switch>
        </el-form-item>
        <el-form-item label="x轴单位" v-if="Object.keys(elementConfig.options).indexOf('xUnit') >= 0">
          <el-input size="mini" v-model.number="elementConfig.options.xUnit"></el-input>
        </el-form-item>
        <el-form-item label="y轴单位" v-if="Object.keys(elementConfig.options).indexOf('yUnit') >= 0">
          <el-input size="mini" v-model.number="elementConfig.options.yUnit"></el-input>
        </el-form-item>
        <el-form-item label="y轴最大值" v-if="Object.keys(elementConfig.options).indexOf('yAxisMax') >= 0">
          <el-input size="mini" v-model="elementConfig.options.yAxisMax"></el-input>
        </el-form-item>
      </template>
      <!-- 柱状图属性结束 -->
      <el-form-item label="回调方法" v-if="Object.keys(elementConfig.options).indexOf('eventName') >= 0 && elementConfig.type === 'button'">
        <el-input size="mini" v-model="elementConfig.options.eventName"></el-input>
      </el-form-item>
      <el-form-item label="标签宽度">
        <el-input-number
          size="mini"
          v-model.number="elementConfig.labelWidth"
          :min="50"
          :max="180"
          :step="10"
          style="width: 100%"
          :disabled="elementConfig.options.hiddenLabel"
          placeholder="自定义标签宽度"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="隐藏标签" v-if="elementConfig.options.hiddenLabel !== undefined">
        <el-switch :disabled="elementConfig.type === 'button'" v-model="elementConfig.options.hiddenLabel"></el-switch>
      </el-form-item>
      <el-form-item label="组件宽度" v-if="Object.keys(elementConfig.options).indexOf('width') >= 0">
        <el-input size="mini" v-model="elementConfig.options.width"></el-input>
      </el-form-item>
      <el-form-item label="大小" v-if="Object.keys(elementConfig.options).indexOf('size') >= 0">
        宽度：<el-input size="mini" style="width: 90px" type="number" v-model.number="elementConfig.options.size.width"></el-input> 高度：<el-input
          size="mini"
          style="width: 90px"
          type="number"
          v-model.number="elementConfig.options.size.height"
        ></el-input>
      </el-form-item>
      <el-form-item label="占位内容" v-if="Object.keys(elementConfig.options).indexOf('placeholder') >= 0 && (elementConfig.type != 'time' || elementConfig.type != 'date')">
        <el-input size="mini" v-model="elementConfig.options.placeholder"></el-input>
      </el-form-item>
      <el-form-item label="tips提示" v-if="elementConfig.options.tips">
        <el-input size="mini" type="textarea" v-model="elementConfig.options.tips"></el-input>
      </el-form-item>
      <el-form-item label="布局方式" v-if="Object.keys(elementConfig.options).indexOf('inline') >= 0">
        <el-radio-group size="mini" v-model="elementConfig.options.inline">
          <el-radio-button :label="false">块级</el-radio-button>
          <el-radio-button :label="true">行内</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示输入框" v-if="Object.keys(elementConfig.options).indexOf('showInput') >= 0">
        <el-switch v-model="elementConfig.options.showInput"></el-switch>
      </el-form-item>
      <el-form-item label="最小值" v-if="Object.keys(elementConfig.options).indexOf('min') >= 0">
        <el-input-number size="mini" v-model="elementConfig.options.min" :min="0" :max="100" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="最大值" v-if="Object.keys(elementConfig.options).indexOf('max') >= 0">
        <el-input-number size="mini" v-model="elementConfig.options.max" :min="0" :max="100" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="步长" v-if="Object.keys(elementConfig.options).indexOf('step') >= 0">
        <el-input-number size="mini" v-model="elementConfig.options.step" :min="0" :max="100" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="是否多选" v-if="'cascader,select,treeselect'.includes(elementConfig.type)">
        <el-switch v-model="elementConfig.options.multiple" @change="handleSelectMuliple"></el-switch>
      </el-form-item>
      <el-form-item label="父子结点是否不关联" v-if="'cascader'.includes(elementConfig.type)">
        <el-switch v-model="elementConfig.options.checkStrictly"></el-switch>
      </el-form-item>
      <el-form-item label="分隔符" v-if="elementConfig.options.separator">
        <el-input size="mini" type="input" v-model="elementConfig.options.separator"></el-input>
      </el-form-item>
      <el-form-item label="是否可创建" v-if="elementConfig.type == 'select'">
        <el-switch v-model="elementConfig.options.allowCreate"></el-switch>
      </el-form-item>
      <el-form-item label="默认隐藏">
        <el-switch v-model="elementConfig.hidden"></el-switch>
      </el-form-item>
      <el-form-item label="启用按钮样式" v-if="elementConfig.type == 'checkbox'">
        <el-switch v-model="elementConfig.options.buttonStyle"></el-switch>
      </el-form-item>
      <el-form-item label="允许半选" v-if="Object.keys(elementConfig.options).indexOf('allowHalf') >= 0">
        <el-switch v-model="elementConfig.options.allowHalf"> </el-switch>
      </el-form-item>
      <el-form-item label="支持透明度选择" v-if="Object.keys(elementConfig.options).indexOf('showAlpha') >= 0">
        <el-switch v-model="elementConfig.options.showAlpha"> </el-switch>
      </el-form-item>
      <el-form-item label="是否显示标签" v-if="Object.keys(elementConfig.options).indexOf('showLabel') >= 0">
        <el-switch v-model="elementConfig.options.showLabel"> </el-switch>
      </el-form-item>
      <el-form-item label="数据来源" v-if="Object.keys(elementConfig.options).indexOf('options') >= 0 || Object.keys(elementConfig.options).indexOf('remoteOptions') >= 0">
        <el-radio-group v-model="elementConfig.options.remote" size="mini" style="margin-bottom: 10px">
          <el-radio-button v-if="!isRemoteComponent && dictType && dictType.length > 0" label="dict">字典</el-radio-button>
          <el-radio-button v-if="!isRemoteComponent" label="static">静态</el-radio-button>
          <el-radio-button label="custom">自定义</el-radio-button>
        </el-radio-group>
        <template v-if="elementConfig.options.remote == 'dict' && dictType && dictType.length > 0">
          <el-select size="mini" v-model="elementConfig.options.dictType" placeholder="字典类型" filterable style="width: 100%">
            <el-option v-for="item in dictType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </template>
        <template v-else-if="elementConfig.options.remote == 'custom'">
          <div>
            一次性拉取完整下拉数据
            <el-input size="mini" style="" v-model="elementConfig.options.remoteFunc">
              <template slot="prepend">方法名</template>
            </el-input>
            <el-input size="mini" style="" v-model="elementConfig.options.props.value">
              <template slot="prepend">值</template>
            </el-input>
            <el-input size="mini" style="" v-model="elementConfig.options.props.label">
              <template slot="prepend">标签</template>
            </el-input>
            <el-input size="mini" style="" v-model="elementConfig.options.props.rightLabel">
              <template slot="prepend">右侧标签</template>
            </el-input>
          </div>
        </template>
        <template v-else>
          <template v-if="elementConfig.type == 'radio' || (elementConfig.type == 'select' && !elementConfig.options.multiple)">
            <el-radio-group v-model="elementConfig.options.defaultValue">
              <Draggable tag="ul" :list="elementConfig.options.options" v-bind="getDraggableOptions()">
                <li v-for="(item, index) in elementConfig.options.options" :key="index">
                  <el-radio :label="item.value" style="margin-right: 5px">
                    <el-input size="mini" :style="{ width: elementConfig.options.showLabel ? '80px' : '170px' }" v-model="item.value"></el-input>
                    <el-input size="mini" style="width: 100px" v-if="elementConfig.options.showLabel" v-model="item.label"></el-input>
                  </el-radio>
                  <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move">
                    <Icon name="bars"></Icon>
                  </i>
                  <el-button size="mini" @click="handleOptionsRemove(index)" circle plain type="danger" icon="el-icon-minus" style="padding: 4px; margin-left: 5px"></el-button>
                </li>
              </Draggable>
            </el-radio-group>
          </template>

          <template v-if="elementConfig.type == 'checkbox' || (elementConfig.type == 'select' && elementConfig.options.multiple)">
            <el-checkbox-group v-model="elementConfig.options.defaultValue">
              <Draggable tag="ul" :list="elementConfig.options.options" v-bind="getDraggableOptions()">
                <li v-for="(item, index) in elementConfig.options.options" :key="index">
                  <el-checkbox :label="item.value" style="margin-right: 5px">
                    <el-input size="mini" :style="{ width: elementConfig.options.showLabel ? '90px' : '190px' }" v-model="item.value"></el-input>
                    <el-input size="mini" style="width: 100px" v-if="elementConfig.options.showLabel" v-model="item.label"></el-input>
                  </el-checkbox>
                  <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move">
                    <Icon name="bars"></Icon>
                  </i>
                  <el-button size="mini" @click="handleOptionsRemove(index)" circle plain type="danger" icon="el-icon-minus" style="padding: 4px; margin-left: 5px"></el-button>
                </li>
              </Draggable>
            </el-checkbox-group>
          </template>
          <div style="margin-left: 22px" v-if="elementConfig.type !== 'cascader'">
            <el-button size="mini" type="text" @click="handleAddOption">添加选项</el-button>
            <el-button size="mini" type="text" @click="handleClearOption">清除默认选中项</el-button>
          </div>
        </template>
      </el-form-item>
      <el-form-item label="对齐方式" v-if="elementConfig.type === 'text'">
        <el-select size="mini" style="width: 100%" v-model="elementConfig.options.align">
          <el-option value="center" label="居中"></el-option>
          <el-option value="left" label="左对齐"></el-option>
          <el-option value="right" label="右对齐"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字体大小" v-if="elementConfig.type === 'text'">
        <el-input size="mini" placeholder="例如(16px)" v-model="elementConfig.options.fontSize"></el-input>
      </el-form-item>
      <el-form-item
        label="默认值"
        v-if="
          Object.keys(elementConfig.options).indexOf('defaultValue') >= 0 &&
          (elementConfig.type == 'textarea' ||
            elementConfig.type == 'input' ||
            elementConfig.type == 'rate' ||
            elementConfig.type == 'color' ||
            elementConfig.type == 'switch' ||
            elementConfig.type == 'date' ||
            elementConfig.type == 'time' ||
            elementConfig.type == 'select' ||
            elementConfig.type == 'html')
        "
      >
        <el-input size="mini" v-if="elementConfig.type == 'textarea'" type="textarea" :rows="5" v-model="elementConfig.options.defaultValue"></el-input>
        <el-input size="mini" v-if="elementConfig.type == 'input' || elementConfig.type == 'select'" v-model="elementConfig.options.defaultValue"></el-input>
        <el-input size="mini" placeholder="此处输入html" type="textarea" v-if="elementConfig.type == 'html'" v-model="elementConfig.options.defaultValue"></el-input>
        <el-rate
          v-if="elementConfig.type == 'rate'"
          style="display: inline-block; vertical-align: middle"
          :max="elementConfig.options.max"
          :allow-half="elementConfig.options.allowHalf"
          v-model="elementConfig.options.defaultValue"
        ></el-rate>
        <el-button size="mini" type="text" v-if="elementConfig.type == 'rate'" style="display: inline-block; vertical-align: middle; margin-left: 10px" @click="elementConfig.options.defaultValue = 0"
          >清空</el-button
        >
        <el-color-picker v-if="elementConfig.type == 'color'" v-model="elementConfig.options.defaultValue" :show-alpha="elementConfig.options.showAlpha"></el-color-picker>
        <el-switch v-else-if="elementConfig.type == 'switch' || elementConfig.type == 'date' || elementConfig.type == 'time'" v-model="elementConfig.options.defaultValue"></el-switch>
      </el-form-item>
      <el-form-item label="最多输入" v-if="elementConfig.options.maxLength !== undefined">
        <el-input v-model="elementConfig.options.maxLength" placeholder="请输入最大长度">
          <span slot="append">个字符</span>
        </el-input>
      </el-form-item>
      <template v-if="elementConfig.type == 'input'">
        <el-form-item label="前图标">
          <el-input v-model="elementConfig.options.prefix" placeholder="请输入图标名(例如el-icon-message)"> </el-input>
        </el-form-item>
        <el-form-item label="后图标">
          <el-input v-model="elementConfig.options.suffix" placeholder="请输入图标名(例如el-icon-message)"> </el-input>
        </el-form-item>
        <el-form-item label="前缀">
          <el-input v-model="elementConfig.options.prepend" placeholder="请输入前缀"> </el-input>
        </el-form-item>
        <el-form-item label="后缀">
          <el-input style="width: 50%" v-model="elementConfig.options.append"> </el-input>
          <el-switch style="margin-left: 10px" inactive-text="功能按钮" v-model="elementConfig.options.appendButton"> </el-switch>
        </el-form-item>
        <el-form-item v-if="elementConfig.options.appendButton" label="回调事件名称">
          <el-input v-model="elementConfig.options.eventName" placeholder="回调事件名"> </el-input>
        </el-form-item>
      </template>
      <template v-if="elementConfig.type == 'time' || elementConfig.type == 'date'">
        <el-form-item label="显示类型" v-if="elementConfig.type == 'date'">
          <el-select size="mini" v-model="elementConfig.options.type">
            <el-option value="year"></el-option>
            <el-option value="month"></el-option>
            <el-option value="date"></el-option>
            <el-option value="dates"></el-option>
            <!-- <el-option value="week"></el-option> -->
            <el-option value="datetime"></el-option>
            <el-option value="monthrange"></el-option>
            <el-option value="datetimerange"></el-option>
            <el-option value="daterange"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为范围选择" v-if="elementConfig.type == 'time'">
          <el-switch v-model="elementConfig.options.isRange"> </el-switch>
        </el-form-item>
        <!-- 日期选择器选择范围 暂时只提供大于当前时间 小于当前时间 -->
        <el-form-item label="选择范围" v-if="elementConfig.type == 'date'">
          <el-select size="mini" v-model="elementConfig.options.range" clearable placeholder="暂时只支持跟当前时间比对">
            <el-option label="小于等于当前日期" value="smaller"></el-option>
            <el-option label="大于等于当前日期" value="greater"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否获取时间戳" v-if="elementConfig.type == 'date'">
          <el-switch v-model="elementConfig.options.timestamp"> </el-switch>
        </el-form-item>
        <el-form-item
          label="占位内容"
          v-if="
            (!elementConfig.options.isRange && elementConfig.type == 'time') ||
            (elementConfig.type != 'time' && elementConfig.options.type != 'datetimerange' && elementConfig.options.type != 'daterange')
          "
        >
          <el-input size="mini" v-model="elementConfig.options.placeholder"></el-input>
        </el-form-item>
        <el-form-item label="开始时间占位内容" v-if="elementConfig.options.isRange || elementConfig.options.type == 'datetimerange' || elementConfig.options.type == 'daterange'">
          <el-input size="mini" v-model="elementConfig.options.startPlaceholder"></el-input>
        </el-form-item>
        <el-form-item label="结束时间占位内容" v-if="elementConfig.options.isRange || elementConfig.options.type == 'datetimerange' || elementConfig.options.type == 'daterange'">
          <el-input size="mini" v-model="elementConfig.options.endPlaceholder"></el-input>
        </el-form-item>
        <el-form-item label="格式">
          <el-input size="mini" v-model="elementConfig.options.format"></el-input>
        </el-form-item>
        <el-form-item label="默认值" v-if="elementConfig.type == 'time' && Object.keys(elementConfig.options).indexOf('isRange') >= 0">
          <el-time-picker
            key="1"
            style="width: 100%"
            v-if="!elementConfig.options.isRange"
            v-model="elementConfig.options.defaultValue"
            :arrowControl="elementConfig.options.arrowControl"
            :value-format="elementConfig.options.format"
          >
          </el-time-picker>
          <el-time-picker
            key="2"
            v-if="elementConfig.options.isRange"
            style="width: 100%"
            v-model="elementConfig.options.defaultValue"
            is-range
            :arrowControl="elementConfig.options.arrowControl"
            :value-format="elementConfig.options.format"
          >
          </el-time-picker>
        </el-form-item>
      </template>
      <template v-if="elementConfig.type == 'grid'">
        <el-form-item label="栅格间隔">
          <el-input-number size="mini" :min="0" :max="50" :step="5" v-model="elementConfig.options.gutter"></el-input-number>
        </el-form-item>
        <el-form-item label="列配置项">
          <Draggable tag="ul" :list="elementConfig.columns" v-bind="getDraggableOptions()">
            <li v-for="(item, index) in elementConfig.columns" :key="index">
              <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move">
                <Icon name="bars"></Icon>
              </i>
              <span>第{{ index + 1 }}列</span>
              <el-input size="mini" placeholder="栅格值" style="width: 100px" type="number" v-model.number="item.span"></el-input>
              <el-button size="mini" @click="handleOptionsRemove(index)" circle plain type="danger" icon="el-icon-minus" style="padding: 4px; margin-left: 5px"></el-button>
            </li>
          </Draggable>
          <el-button size="mini" type="text" @click="handleAddColumn">添加栅格</el-button>
        </el-form-item>
        <el-form-item label="水平排列方式">
          <el-select size="mini" v-model="elementConfig.options.justify">
            <el-option value="start" label="左对齐"></el-option>
            <el-option value="end" label="右对齐"></el-option>
            <el-option value="center" label="居中"></el-option>
            <el-option value="space-around" label="两侧间隔相等"></el-option>
            <el-option value="space-between" label="两端对齐"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="垂直排列方式">
          <el-select size="mini" v-model="elementConfig.options.align">
            <el-option value="top" label="顶部对齐"></el-option>
            <el-option value="middle" label="居中"></el-option>
            <el-option value="bottom" label="底部对齐"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <!-- tab布局 -->
      <template v-if="elementConfig.type == 'tabs'">
        <el-form-item label="选项卡样式">
          <el-radio-group v-model="elementConfig.options.type" size="small">
            <el-radio-button v-for="item in elementComponentConfig.tabs.type" :label="item.value" :key="item.value">{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项卡位置">
          <el-radio-group v-model="elementConfig.options.position" size="small">
            <el-radio-button v-for="item in elementComponentConfig.tabs.position" :label="item.value" :key="item.value">{{ item.label }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签配置项">
          <Draggable tag="ul" :list="elementConfig.items" v-bind="getDraggableOptions()">
            <li v-for="(item, index) in elementConfig.items" :key="index">
              <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move">
                <Icon name="bars"></Icon>
              </i>
              <el-input size="mini" placeholder="标签名" style="width: 100px" v-model="item.label"></el-input>
              <el-button size="mini" @click="handleOptionsRemove(index)" circle plain type="danger" icon="el-icon-minus" style="padding: 4px; margin-left: 5px"></el-button>
            </li>
          </Draggable>
          <el-button size="mini" type="text" @click="handleAddOption">添加标签</el-button>
        </el-form-item>
      </template>

      <template v-if="elementConfig.type !== 'grid'">
        <el-form-item v-if="Object.keys(elementConfig.options).indexOf('resourceId') >= 0" label="关联字段名">
          <el-input size="mini" v-model="elementConfig.options.resourceId"></el-input>
        </el-form-item>
        <el-form-item v-if="Object.keys(elementConfig.options).indexOf('uploadUrl') >= 0" label="接口地址">
          <el-input size="mini" v-model="elementConfig.options.uploadUrl"></el-input>
        </el-form-item>
        <el-form-item v-if="elementConfig.type === 'upload'" label="附件类型">
          <el-input size="mini" v-model="elementConfig.options.fileType" placeholder="关联多个附件的情况下需要填写"></el-input>
        </el-form-item>
        <el-form-item label="操作属性" v-if="formElement.includes(elementConfig.type) || elementConfig.type === 'upload'">
          <el-checkbox v-model="elementConfig.options.readonly" v-if="Object.keys(elementConfig.options).indexOf('readonly') >= 0">完全只读</el-checkbox>
          <el-checkbox v-model="elementConfig.options.disabled" v-if="Object.keys(elementConfig.options).indexOf('disabled') >= 0">禁用 </el-checkbox>
          <el-checkbox v-model="elementConfig.options.editable" v-if="Object.keys(elementConfig.options).indexOf('editable') >= 0">文本框可输入</el-checkbox>
          <el-checkbox v-model="elementConfig.options.showWordLimit" v-if="Object.keys(elementConfig.options).indexOf('showWordLimit') >= 0">输入统计</el-checkbox>
          <el-checkbox v-model="elementConfig.options.clearable" v-if="Object.keys(elementConfig.options).indexOf('clearable') >= 0">显示清除按钮</el-checkbox>
          <el-checkbox v-model="elementConfig.options.arrowControl" v-if="Object.keys(elementConfig.options).indexOf('arrowControl') >= 0"> 使用箭头进行时间选择 </el-checkbox>
        </el-form-item>
        <el-form-item v-if="formElement.includes(elementConfig.type)" label="校验">
          <div>
            <el-checkbox v-if="Object.keys(elementConfig.options).indexOf('required') >= 0" v-model="elementConfig.options.required">必填</el-checkbox>
          </div>
          <el-select v-if="Object.keys(elementConfig.options).indexOf('dataType') >= 0" v-model="elementConfig.options.dataType" size="mini">
            <el-option value="password" label="密码"></el-option>
            <el-option value="string" label="字符串"></el-option>
            <el-option value="number" label="数字"></el-option>
            <el-option value="boolean" label="布尔值"></el-option>
            <el-option value="integer" label="整数"></el-option>
            <el-option value="float" label="浮点数"></el-option>
            <el-option value="url" label="URL地址"></el-option>
            <el-option value="email" label="邮箱地址"></el-option>
            <el-option value="hex" label="十六进制"></el-option>
          </el-select>

          <div v-if="Object.keys(elementConfig.options).indexOf('pattern') >= 0">
            <el-input size="mini" v-model.lazy="elementConfig.options.pattern" style="width: 240px" placeholder="填写正则表达式"></el-input>
            <el-input size="mini" v-model.lazy="elementConfig.options.message" style="width: 240px" placeholder="自定义错误提示语"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="后台表名" v-if="elementConfig.options.tableName !== undefined">
          <el-input size="mini" v-model="elementConfig.options.tableName" placeholder="tableName"></el-input>
        </el-form-item>
        <el-form-item label="表格设计名" v-if="elementConfig.options.tableDesignerName !== undefined">
          <el-input size="mini" v-model="elementConfig.options.tableDesignerName" placeholder="tableDesignerName"></el-input>
        </el-form-item>
        <el-form-item label="表单设计名" v-if="elementConfig.options.dialogFormDesignerName !== undefined">
          <el-input size="mini" v-model="elementConfig.options.dialogFormDesignerName" placeholder="dialogFormDesignerName"></el-input>
        </el-form-item>
        <el-form-item label="表格标题" v-if="elementConfig.options.tableTitle !== undefined">
          <el-input size="mini" v-model="elementConfig.options.tableTitle" placeholder="表格标题"></el-input>
        </el-form-item>
        <el-form-item label="预设值" v-if="elementConfig.options.prefill !== undefined">
          <el-input size="mini" v-model="elementConfig.options.prefill" placeholder="例如:子表字段1,主表字段1|子表字段2,主表字段2"></el-input>
        </el-form-item>
        <el-form-item label="预设查询参数" v-if="elementConfig.options.tableParams !== undefined">
          <el-input size="mini" v-model="elementConfig.options.tableParams" placeholder="例如:子表字段1,主表字段1|子表字段2,主表字段2"></el-input>
        </el-form-item>
        <el-form-item label="是否显示分页" v-if="elementConfig.options.showPagination !== undefined">
          <el-switch v-model="elementConfig.options.showPagination"></el-switch>
        </el-form-item>
        <el-form-item label="是否多选" v-if="elementConfig.options.isMultiple !== undefined">
          <el-switch v-model="elementConfig.options.isMultiple"></el-switch>
        </el-form-item>
        <el-form-item label="界面元素控制" v-if="elementConfig.options.visibleList !== undefined">
          <el-switch v-model="elementConfig.options.visibleList.actionColumn" inactive-text="是否显示操作列" style="margin-right: 10px"></el-switch>
          <el-switch v-model="elementConfig.options.visibleList.btnAdd" inactive-text="新增按钮" style="margin-right: 10px"></el-switch>
          <el-switch v-model="elementConfig.options.visibleList.actionColumnBtnEdit" inactive-text="编辑按钮"></el-switch>
          <el-switch v-model="elementConfig.options.visibleList.actionColumnBtnDel" inactive-text="删除按钮" style="margin-right: 10px"></el-switch>
          <el-switch v-model="elementConfig.options.visibleList.actionColumnBtnDetail" inactive-text="查看按钮"></el-switch>
          <el-switch v-model="elementConfig.options.visibleList.tableTitle" inactive-text="表格标题" style="margin-right: 10px"></el-switch>
          <el-switch v-model="elementConfig.options.visibleList.searchForm" inactive-text="查询区域"></el-switch>
        </el-form-item>
        <template v-if="elementConfig.type === 'treeselect'">
          <el-form-item label="最大高度">
            <el-input size="mini" v-model="elementConfig.options.maxHeight" placeholder="maxHeight"></el-input>
          </el-form-item>
          <el-form-item label="value-label">
            <el-switch v-model="elementConfig.options.showValueLabelSlot"></el-switch>
          </el-form-item>
          <el-form-item label="父结点禁选">
            <el-switch v-model="elementConfig.options.disableBranchNodes"></el-switch>
          </el-form-item>
          <el-form-item label="显示数量">
            <el-switch v-model="elementConfig.options.showCount"></el-switch>
          </el-form-item>
          <el-form-item label="append-to-body(弹窗中使用不需要开启)">
            <el-switch v-model="elementConfig.options.appendToBody"></el-switch>
          </el-form-item>
        </template>
        <template v-if="elementConfig.type === 'divider'">
          <el-radio-group v-model="elementConfig.options.align" size="small">
            <el-radio-button v-for="align in ['left', 'center', 'right']" :label="align" :key="align">{{ align }}</el-radio-button>
          </el-radio-group>
        </template>
        <!-- 表格布局table属性配置 支持配置边框宽度 边框颜色  -->
        <template v-if="elementConfig.type === 'grid-table'">
          <el-form-item label="边框宽度">
            <el-input v-model.number="elementConfig.options.borderWidth" placeholder="请输入边框宽度">
              <template slot="append">px</template>
            </el-input>
          </el-form-item>
          <el-form-item label="边框颜色">
            <el-color-picker v-model="elementConfig.options.borderColor"></el-color-picker>
          </el-form-item>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/bars';
import { DML } from '@/types/common';
import { formElement, elementComponentConfig } from './componentsConfig';

export default {
  name: 'WidgetConfig',
  components: {
    Draggable,
    Icon,
  },
  props: {
    elementConfig: {
      type: Object,
      default: () => ({}),
    },
    dictType: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      elementComponentConfig,
      jsonTemplate: '',
      jsonEditor: null,
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null,
      },
      formElement,
    };
  },
  computed: {
    show() {
      if (this.elementConfig && Object.keys(this.elementConfig).length > 0) {
        return true;
      }
      return false;
    },
    // 依赖自定义数据源组件
    isRemoteComponent() {
      return this.elementConfig && ['treeselect'].includes(this.elementConfig.type);
    },
  },
  methods: {
    saveJson() {
      const { type } = this.elementConfig;
      if (type === 'html') {
        this.elementConfig.options.html = this.jsonEditor.getValue();
      } else if (type === 'chart-common') {
        this.elementConfig.options.option = JSON.parse(this.jsonEditor.getValue());
      } else {
        this.elementConfig.options.data = JSON.parse(this.jsonEditor.getValue());
      }
    },
    getDraggableOptions() {
      return {
        group: { name: 'options' },
        ghostClass: 'ghost',
        handle: '.drag-item',
      };
    },
    handleOptionsRemove(index) {
      if (this.elementConfig.type === 'grid') {
        this.elementConfig.columns.splice(index, 1);
      } else if (this.elementConfig.type === 'tabs') {
        this.elementConfig.items.splice(index, 1);
      } else {
        this.elementConfig.options.options.splice(index, 1);
      }
    },
    // 添加选项
    handleAddOption() {
      if (this.elementConfig.options.showLabel) {
        this.elementConfig.options.options.push({
          value: 'value',
          label: 'label',
        });
      } else if (this.elementConfig.items) {
        const { length } = this.elementConfig.items;
        this.elementConfig.items.push({
          name: `标签页${length + 1}`,
          label: `标签页${length + 1}`,
          list: [],
        });
      } else {
        this.elementConfig.options.options.push({
          value: 'value',
        });
      }
    },
    // 清除默认选中项
    handleClearOption() {
      this.elementConfig.options.defaultValue = null;
    },
    handleAddColumn() {
      this.elementConfig.columns.push({
        span: 24,
        list: [],
        key: `grid_${Math.ceil(Math.random() * 99999)}`,
      });
    },
    generateRule() {
      this.$set(this.elementConfig, 'rules', []);
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) {
          this.elementConfig.rules.push(this.validator[key]);
        }
      });
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.elementConfig.options.defaultValue) {
          this.elementConfig.options.defaultValue = [this.elementConfig.options.defaultValue];
        } else {
          this.elementConfig.options.defaultValue = [];
        }
      } else if (this.elementConfig.options.defaultValue.length > 0) {
        [this.elementConfig.options.defaultValue] = this.elementConfig.options.defaultValue;
      } else {
        this.elementConfig.options.defaultValue = '';
      }
    },
    validateRequired(val) {
      if (val) {
        this.validator.required = {
          required: true,
          message: `${this.elementConfig.name}必须填写`,
        };
      } else {
        this.validator.required = null;
      }

      this.$nextTick(() => {
        this.generateRule();
      });
    },
    validateDataType(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.type = { type: val, message: `${this.elementConfig.name}格式不正确` };
      } else {
        this.validator.type = null;
      }

      this.generateRule();
      return null;
    },
    valiatePattern(val) {
      let message = `${this.elementConfig.name}格式不匹配`;
      if (!this.show) {
        return false;
      }
      if (val) {
        // 如果自定义了错误提示语则赋值
        if (this.elementConfig.options && this.elementConfig.options.message) {
          // eslint-disable-next-line prefer-destructuring
          message = this.elementConfig.options.message;
        }
        this.validator.pattern = { pattern: new RegExp(val), message, trigger: 'blur' };
      } else {
        this.validator.pattern = null;
      }
      this.generateRule();
      return null;
    },
  },
  watch: {
    isRemoteComponent: function watchRemoteComponent(val) {
      // 级联选择器/树形下拉框需要依赖remoteFuncs,默认选中自定义
      if (val) {
        this.elementConfig.options.remote = 'custom';
      }
    },
    // eslint-disable-next-line func-names
    'elementConfig.type': {
      immediate: true,
      handler(val) {
        if (val.includes('chart-')) {
          const jsonData = val === 'chart-common' ? this.elementConfig.options.option : this.elementConfig.options.data;
          const jsonString = JSON.stringify(jsonData || '', null, 2);
          setTimeout(() => {
            this.jsonEditor = ace.edit('jsoneditor2');
            this.jsonEditor.session.setMode('ace/mode/json');
            this.jsonEditor.setValue(jsonString);
            console.log(val);
          }, 100);
        } else if (val === 'html') {
          const jsonString = JSON.stringify(this.elementConfig.options.html || '', null, 2);
          setTimeout(() => {
            this.jsonEditor = ace.edit('jsoneditor2');
            this.jsonEditor.setValue(jsonString);
            this.jsonEditor.session.setMode('ace/mode/html');
          }, 100);
        }
      },
    },
    // eslint-disable-next-line func-names
    'elementConfig.options.isRange': function (val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.elementConfig.options.defaultValue = null;
        } else if (Object.keys(this.elementConfig.options).indexOf('defaultValue') >= 0) this.elementConfig.options.defaultValue = '';
      }
    },
    // eslint-disable-next-line func-names
    'elementConfig.options.required': function (val) {
      this.validateRequired(val);
    },
    // eslint-disable-next-line func-names
    'elementConfig.options.dataType': function (val) {
      this.validateDataType(val);
    },
    // eslint-disable-next-line func-names
    'elementConfig.options.pattern': function (val) {
      this.valiatePattern(val);
    },
    // eslint-disable-next-line func-names
    'elementConfig.options.message': function () {
      this.valiatePattern(this.elementConfig.options.pattern);
    },
    // eslint-disable-next-line func-names
    'elementConfig.name': function (val) {
      if (this.elementConfig.options) {
        this.validateRequired(this.elementConfig.options.required);
        this.validateDataType(this.elementConfig.options.dataType);
        this.valiatePattern(this.elementConfig.options.pattern);
      }
      if (formElement.includes(this.elementConfig.type)) {
        this.elementConfig.options.placeholder = `请填写${val}`;
      }
    },
  },
};
</script>
