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
    <el-form label-position="top" class="form">
      <!-- <el-form-item label="是否隐藏"
                    v-if="data.type != 'table'">
        <el-switch v-model="data.hidden"></el-switch>
      </el-form-item> -->
      <el-form-item label="标题"
                    v-if="data.type!='grid'">
        <el-input v-model="data.name"></el-input>
      </el-form-item>
      <el-form-item label="显示文本"
                    v-if="Object.keys(data.options).indexOf('text')>=0">
        <el-input v-model="data.options.text"></el-input>
      </el-form-item>
      <el-form-item label="回调方法"
                    v-if="Object.keys(data.options).indexOf('btnCommand')>=0">
        <el-input v-model="data.options.btnCommand"></el-input>
      </el-form-item>
      <el-form-item label="标签宽度">
         <el-input-number v-model="data.labelWidth"
                         :min="100"
                         :max="180"
                         :step="10"
                        :disabled="data.options.hiddenLabel"
                        placeholder="自定义标签宽度"></el-input-number>
      </el-form-item>
      <el-form-item label="隐藏标签">
        <el-switch v-model="data.options.hiddenLabel"></el-switch>
      </el-form-item>
      <el-form-item label="组件宽度"
                    v-if="Object.keys(data.options).indexOf('width')>=0">
        <el-input v-model="data.options.width"></el-input>
      </el-form-item>
      <el-form-item label="大小"
                    v-if="Object.keys(data.options).indexOf('size')>=0">
        宽度：<el-input style="width: 90px;"
                  type="number"
                  v-model.number="data.options.size.width"></el-input>
        高度：<el-input style="width: 90px;"
                  type="number"
                  v-model.number="data.options.size.height"></el-input>
      </el-form-item>
      <el-form-item label="占位内容"
                    v-if="Object.keys(data.options).indexOf('placeholder')>=0
                    && (data.type!='time' || data.type!='date')">
        <el-input v-model="data.options.placeholder"></el-input>
      </el-form-item>
      <el-form-item label="tips提示" v-if="data.options.tips">
        <el-input type="textarea"
                  v-model="data.options.tips"></el-input>
      </el-form-item>
      <el-form-item label="布局方式"
                    v-if="Object.keys(data.options).indexOf('inline')>=0">
        <el-radio-group v-model="data.options.inline">
          <el-radio-button :label="false">块级</el-radio-button>
          <el-radio-button :label="true">行内</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="显示输入框"
                    v-if="Object.keys(data.options).indexOf('showInput')>=0">
        <el-switch v-model="data.options.showInput"></el-switch>
      </el-form-item>
      <el-form-item label="最小值"
                    v-if="Object.keys(data.options).indexOf('min')>=0">
        <el-input-number v-model="data.options.min"
                         :min="0"
                         :max="100"
                         :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="最大值"
                    v-if="Object.keys(data.options).indexOf('max')>=0">
        <el-input-number v-model="data.options.max"
                         :min="0"
                         :max="100"
                         :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="步长"
                    v-if="Object.keys(data.options).indexOf('step')>=0">
        <el-input-number v-model="data.options.step"
                         :min="0"
                         :max="100"
                         :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="是否多选"
                    v-if="'cascader,select,treeselect'.includes(data.type)">
        <el-switch v-model="data.options.multiple"
                   @change="handleSelectMuliple"></el-switch>
      </el-form-item>
      <el-form-item label="父子结点是否不关联"
                    v-if="'cascader'.includes(data.type)">
      <el-switch v-model="data.options.checkStrictly"></el-switch>
      </el-form-item>
      <el-form-item label="分隔符"
                    v-if="data.options.separator">
        <el-input type="input"
                  v-model="data.options.separator"></el-input>
      </el-form-item>
      <el-form-item label="是否可创建"
                    v-if="data.type=='select'">
        <el-switch v-model="data.options.allowCreate"></el-switch>
      </el-form-item>
      <el-form-item label="启用按钮样式"
                    v-if="data.type=='checkbox'">
        <el-switch v-model="data.options.buttonStyle"></el-switch>
      </el-form-item>
      <el-form-item label="允许半选"
                    v-if="Object.keys(data.options).indexOf('allowHalf')>=0">
        <el-switch v-model="data.options.allowHalf">
        </el-switch>
      </el-form-item>
      <el-form-item label="支持透明度选择"
                    v-if="Object.keys(data.options).indexOf('showAlpha')>=0">
        <el-switch v-model="data.options.showAlpha">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否显示标签"
                    v-if="Object.keys(data.options).indexOf('showLabel')>=0">
        <el-switch v-model="data.options.showLabel">
        </el-switch>
      </el-form-item>
      <el-form-item label="数据来源"
                    v-if="Object.keys(data.options).indexOf('options')>=0 ||
          Object.keys(data.options).indexOf('remoteOptions')>=0">
        <el-radio-group v-model="data.options.remote"
                        size="mini"
                        style="margin-bottom:10px;">
          <el-radio-button label="dict">字典</el-radio-button>
          <el-radio-button label="static">静态</el-radio-button>
          <el-radio-button label="custom">自定义</el-radio-button>
          <el-radio-button label="search">搜索</el-radio-button>
        </el-radio-group>
        <template v-if="data.options.remote=='dict'">
          <el-select v-model="data.options.dictType"
                     placeholder="字典类型"
                     filterable
                     style="width: 100%">
            <el-option v-for="item in dictType"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template v-else-if="data.options.remote=='custom'">
          <div>
            一次性拉取完整下拉数据
            <el-input size="mini"
                      style=""
                      v-model="data.options.remoteFunc">
              <template slot="prepend">方法名</template>
            </el-input>
            <el-input size="mini"
                      style=""
                      v-model="data.options.props.value">
              <template slot="prepend">值</template>
            </el-input>
            <el-input size="mini"
                      style=""
                      v-model="data.options.props.label">
              <template slot="prepend">标签</template>
            </el-input>
            <el-input size="mini"
                      style=""
                      v-model="data.options.props.rightLabel">
              <template slot="prepend">右侧标签</template>
            </el-input>
          </div>
        </template>
        <template v-else-if="data.options.remote=='search'">
          <div>
            每次输入时，调用方法查询下拉数据
            <el-input size="mini"
                      style=""
                      v-model="data.options.remoteSearchFunc">
              <template slot="prepend">方法名</template>
            </el-input>
            <el-input size="mini"
                      style=""
                      v-model="data.options.props.value">
              <template slot="prepend">值</template>
            </el-input>
            <el-input size="mini"
                      style=""
                      v-model="data.options.props.label">
              <template slot="prepend">标签</template>
            </el-input>
            <el-input size="mini"
                      style=""
                      v-model="data.options.props.rightLabel">
              <template slot="prepend">右侧标签</template>
            </el-input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <el-radio-group v-model="data.options.defaultValue">
              <Draggable tag="ul"
                         :list="data.options.options"
                         v-bind="getDraggableOptions()">
                <li v-for="(item, index) in data.options.options"
                    :key="index">
                  <el-radio :label="item.value"
                            style="margin-right: 5px;">
                    <el-input :style="{'width': data.options.showLabel? '90px': '190px' }"
                              size="mini"
                              v-model="item.value"></el-input>
                    <el-input style="width:100px;"
                              size="mini"
                              v-if="data.options.showLabel"
                              v-model="item.label"></el-input>
                  </el-radio>
                  <i class="drag-item"
                     style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <Icon name="bars"></Icon>
                  </i>
                  <el-button @click="handleOptionsRemove(index)"
                             circle
                             plain
                             type="danger"
                             size="mini"
                             icon="el-icon-minus"
                             style="padding: 4px;margin-left: 5px;"></el-button>
                </li>
              </draggable>
            </el-radio-group>
          </template>

          <template v-if="data.type=='checkbox' || (data.type=='select' && data.options.multiple)">
            <el-checkbox-group v-model="data.options.defaultValue">

              <Draggable tag="ul"
                         :list="data.options.options"
                         v-bind="getDraggableOptions()">
                <li v-for="(item, index) in data.options.options"
                    :key="index">
                  <el-checkbox :label="item.value"
                               style="margin-right: 5px;">
                    <el-input :style="{'width': data.options.showLabel? '90px': '190px' }"
                              size="mini"
                              v-model="item.value"></el-input>
                    <el-input style="width:100px;"
                              size="mini"
                              v-if="data.options.showLabel"
                              v-model="item.label"></el-input>
                  </el-checkbox>
                  <i class="drag-item"
                     style="font-size: 16px;margin: 0 5px;cursor: move;">
                    <Icon name="bars"></Icon>
                  </i>
                  <el-button @click="handleOptionsRemove(index)"
                             circle
                             plain
                             type="danger"
                             size="mini"
                             icon="el-icon-minus"
                             style="padding: 4px;margin-left: 5px;"></el-button>

                </li>
              </draggable>
            </el-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <el-button type="text"
                       @click="handleAddOption">添加选项</el-button>
            <el-button type="text"
                       @click="handleClearOption">清除默认选中项</el-button>
          </div>
        </template>

      </el-form-item>
      <el-form-item label="对齐方式" v-if="data.type === 'text'">
          <el-select style="width:100%" v-model="data.options.align">
            <el-option value="center"
                       label="居中"></el-option>
            <el-option value="left"
                       label="左对齐"></el-option>
            <el-option value="right"
                       label="右对齐"></el-option>
          </el-select>
      </el-form-item>
       <el-form-item label="字体大小" v-if="data.type === 'text'">
          <el-input placeholder="例如(16px)" v-model="data.options.fontSize"></el-input>
      </el-form-item>
      <el-form-item label="默认值"
                    v-if="Object.keys(data.options).indexOf('defaultValue')>=0
                    && (data.type == 'textarea' || data.type == 'input'
                    || data.type=='rate' || data.type=='color'
                    || data.type=='switch'||data.type == 'date' ||data.type == 'select' ||data.type == 'html')">
        <el-input v-if="data.type=='textarea'"
                  type="textarea"
                  :rows="5"
                  v-model="data.options.defaultValue"></el-input>
        <el-input v-if="data.type=='input' || data.type == 'select'"
                  v-model="data.options.defaultValue"></el-input>
        <el-input placeholder="此处输入html" type="textarea" v-if="data.type=='html'" v-model="data.options.defaultValue"></el-input>
        <el-rate v-if="data.type == 'rate'"
                 style="display:inline-block;vertical-align: middle;"
                 :max="data.options.max"
                 :allow-half="data.options.allowHalf"
                 v-model="data.options.defaultValue"></el-rate>
        <el-button type="text"
                   v-if="data.type == 'rate'"
                   style="display:inline-block;vertical-align: middle;margin-left: 10px;"
                   @click="data.options.defaultValue=0">清空</el-button>
        <el-color-picker v-if="data.type == 'color'"
                         v-model="data.options.defaultValue"
                         :show-alpha="data.options.showAlpha"></el-color-picker>
        <el-switch v-if="data.type=='switch' || data.type == 'date'"
                   v-model="data.options.defaultValue"></el-switch>
      </el-form-item>

      <template v-if="data.type == 'time' || data.type == 'date'">
        <el-form-item label="显示类型"
                      v-if="data.type == 'date'">
          <el-select v-model="data.options.type">
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
        <el-form-item label="是否为范围选择"
                      v-if="data.type == 'time'">
          <el-switch v-model="data.options.isRange">
          </el-switch>
        </el-form-item>
        <!-- 日期选择器选择范围 暂时只提供大于当前时间 小于当前时间 -->
        <el-form-item label="选择范围"
                      v-if="data.type == 'date'">
          <el-select v-model="data.options.range"
                     clearable
                     placeholder="暂时只支持跟当前时间比对">
            <el-option label="小于等于当前日期"
                       value="smaller"></el-option>
            <el-option label="大于等于当前日期"
                       value="greater"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否获取时间戳"
                      v-if="data.type == 'date'">
          <el-switch v-model="data.options.timestamp">
          </el-switch>
        </el-form-item>
        <el-form-item label="占位内容"
                      v-if="(!data.options.isRange && data.type == 'time')
                      || (data.type != 'time' && data.options.type != 'datetimerange'
                      && data.options.type != 'daterange')">
          <el-input v-model="data.options.placeholder"></el-input>
        </el-form-item>
        <el-form-item label="开始时间占位内容"
                      v-if="(data.options.isRange) || data.options.type=='datetimerange'
                      || data.options.type=='daterange'">
          <el-input v-model="data.options.startPlaceholder"></el-input>
        </el-form-item>
        <el-form-item label="结束时间占位内容"
                      v-if="data.options.isRange || data.options.type=='datetimerange'
                      || data.options.type=='daterange'">
          <el-input v-model="data.options.endPlaceholder"></el-input>
        </el-form-item>
        <el-form-item label="格式">
          <el-input v-model="data.options.format"></el-input>
        </el-form-item>
        <el-form-item label="默认值"
                      v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0">
          <el-time-picker key="1"
                          style="width: 100%;"
                          v-if="!data.options.isRange"
                          v-model="data.options.defaultValue"
                          :arrowControl="data.options.arrowControl"
                          :value-format="data.options.format">
          </el-time-picker>
          <el-time-picker key="2"
                          v-if="data.options.isRange"
                          style="width: 100%;"
                          v-model="data.options.defaultValue"
                          is-range
                          :arrowControl="data.options.arrowControl"
                          :value-format="data.options.format">
          </el-time-picker>
        </el-form-item>
      </template>

      <!-- <template v-if="data.type=='blank'">
        <el-form-item label="绑定数据类型">
          <el-select v-model="data.options.defaultType">
            <el-option value="String"
                       label="字符"></el-option>
            <el-option value="Object"
                       label="对象"></el-option>
            <el-option value="Array"
                       label="数组"></el-option>
          </el-select>
        </el-form-item>
      </template> -->

      <template v-if="data.type == 'grid'">
        <el-form-item label="栅格间隔">
          <el-input type="number"
                    v-model.number="data.options.gutter"></el-input>
        </el-form-item>
        <el-form-item label="列配置项">
          <Draggable tag="ul"
                     :list="data.columns"
                     v-bind="getDraggableOptions()">
            <li v-for="(item, index) in data.columns"
                :key="index">
              <i class="drag-item"
                 style="font-size: 16px;margin: 0 5px;cursor: move;">
                <Icon name="bars"></Icon>
              </i>
              <el-input placeholder="栅格值"
                        size="mini"
                        style="width: 100px;"
                        type="number"
                        v-model.number="item.span"></el-input>

              <el-button @click="handleOptionsRemove(index)"
                         circle
                         plain
                         type="danger"
                         size="mini"
                         icon="el-icon-minus"
                         style="padding: 4px;margin-left: 5px;"></el-button>

            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text"
                       @click="handleAddColumn">添加列</el-button>
          </div>
        </el-form-item>
        <el-form-item label="水平排列方式">
          <el-select v-model="data.options.justify">
            <el-option value="start"
                       label="左对齐"></el-option>
            <el-option value="end"
                       label="右对齐"></el-option>
            <el-option value="center"
                       label="居中"></el-option>
            <el-option value="space-around"
                       label="两侧间隔相等"></el-option>
            <el-option value="space-between"
                       label="两端对齐"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="垂直排列方式">
          <el-select v-model="data.options.align">
            <el-option value="top"
                       label="顶部对齐"></el-option>
            <el-option value="middle"
                       label="居中"></el-option>
            <el-option value="bottom"
                       label="底部对齐"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type != 'grid'">
        <el-form-item v-if="data.type != 'button' && data.type != 'upload' && data.type != 'text' "
                      :label="data.type === 'blank'? '插槽名(需结合代码)': '后端接口Key'">
          <el-input v-model="data.model"></el-input>
        </el-form-item>
        <el-form-item v-if="data.type === 'upload'"
                      label="关联resourceID字段名">
          <el-input v-model="data.options.resourceId"></el-input>
        </el-form-item>
        <el-form-item v-if="data.type === 'upload'"
                      label="附件类型">
          <el-input v-model="data.options.fileType"
                    placeholder="关联多个附件的情况下需要填写"></el-input>
        </el-form-item>
        <el-form-item label="操作属性"
                      v-if=" data.type !== 'table' && data.type !== 'blank' && data.type !== 'text' && data.type!== 'button'">
          <el-checkbox v-model="data.options.readonly"
                       v-if="Object.keys(data.options).indexOf('readonly')>=0">完全只读</el-checkbox>
          <el-checkbox v-model="data.options.disabled"
                       v-if="Object.keys(data.options).indexOf('disabled')>=0">禁用 </el-checkbox>
          <el-checkbox v-model="data.options.editable"
                       v-if="Object.keys(data.options).indexOf('editable')>=0">文本框可输入</el-checkbox>
          <el-checkbox v-model="data.options.clearable"
                       v-if="Object.keys(data.options).indexOf('clearable')>=0">显示清除按钮</el-checkbox>
          <el-checkbox v-model="data.options.arrowControl"
                       v-if="Object.keys(data.options).indexOf('arrowControl')>=0">
            使用箭头进行时间选择
          </el-checkbox>
        </el-form-item>
        <el-form-item v-if="data.type != 'button' && data.type != 'table' && data.type !== 'blank' && data.type != 'upload' && data.type != 'text'"
                      label="校验">
          <div>
            <el-checkbox v-model="data.options.required">必填</el-checkbox>
          </div>
          <el-select v-if="Object.keys(data.options).indexOf('dataType')>=0"
                     v-model="data.options.dataType"
                     size="mini">
            <el-option value="password"
                       label="密码"></el-option>
            <el-option value="string"
                       label="字符串"></el-option>
            <el-option value="number"
                       label="数字"></el-option>
            <el-option value="boolean"
                       label="布尔值"></el-option>
            <el-option value="integer"
                       label="整数"></el-option>
            <el-option value="float"
                       label="浮点数"></el-option>
            <el-option value="url"
                       label="URL地址"></el-option>
            <el-option value="email"
                       label="邮箱地址"></el-option>
            <el-option value="hex"
                       label="十六进制"></el-option>
          </el-select>

          <div v-if="Object.keys(data.options).indexOf('pattern')>=0">
            <el-input size="mini"
                      v-model.lazy="data.options.pattern"
                      style=" width: 240px;"
                      placeholder="填写正则表达式"></el-input>
            <el-input size="mini"
                      v-model.lazy="data.options.message"
                      style=" width: 240px;"
                      placeholder="自定义错误提示语"></el-input>
          </div>
        </el-form-item>
        <template v-if="data.type=='table'">
          <el-form-item label="后台表名">
            <el-input v-model="data.options.tableName"
                      placeholder="tableName"></el-input>
          </el-form-item>
          <el-form-item label="表格设计名">
            <el-input v-model="data.options.tableDesignerName"
                      placeholder="tableDesignerName"></el-input>
          </el-form-item>
          <el-form-item label="表单设计名">
            <el-input v-model="data.options.dialogFormDesignerName"
                      placeholder="dialogFormDesignerName"></el-input>
          </el-form-item>
          <el-form-item label="表格标题">
            <el-input v-model="data.options.tableTitle"
                      placeholder="表格标题"></el-input>
          </el-form-item>
          <el-form-item label="预设值">
            <el-input v-model="data.options.prefill"
                      placeholder="例如:子表字段1,主表字段1|子表字段2,主表字段2"></el-input>
          </el-form-item>
          <el-form-item label="预设查询参数">
            <el-input v-model="data.options.tableParams"
                      placeholder="例如:子表字段1,主表字段1|子表字段2,主表字段2"></el-input>
          </el-form-item>
          <el-form-item label="是否显示分页">
            <el-switch v-model="data.options.showPagination"></el-switch>
          </el-form-item>
          <el-form-item label="是否多选">
            <el-switch v-model="data.options.isMultiple"></el-switch>
          </el-form-item>
          <el-form-item label="界面元素控制">
            <el-switch v-model="data.options.visibleList.actionColumn"
                       inactive-text="是否显示操作列"
                       style="margin-right:10px"></el-switch>
            <el-switch v-model="data.options.visibleList.btnAdd"
                       inactive-text="新增按钮"
                       style="margin-right:10px"></el-switch>
            <el-switch v-model="data.options.visibleList.actionColumnBtnEdit"
                       inactive-text="编辑按钮"></el-switch>
            <el-switch v-model="data.options.visibleList.actionColumnBtnDel"
                       inactive-text="删除按钮"
                       style="margin-right:10px"></el-switch>
            <el-switch v-model="data.options.visibleList.actionColumnBtnDetail"
                       inactive-text="查看按钮"></el-switch>
            <el-switch v-model="data.options.visibleList.tableTitle"
                       inactive-text="表格标题"
                       style="margin-right:10px"></el-switch>
            <el-switch v-model="data.options.visibleList.searchForm"
                       inactive-text="查询区域"></el-switch>
          </el-form-item>
        </template>
        <template v-if="data.type === 'treeselect'">
          <el-form-item label="最大高度">
            <el-input v-model="data.options.maxHeight"
                      placeholder="maxHeight"></el-input>
          </el-form-item>
          <el-form-item label="value-label">
            <el-switch v-model="data.options.showValueLabelSlot"></el-switch>
          </el-form-item>
          <el-form-item label="父结点禁选">
            <el-switch v-model="data.options.disableBranchNodes"></el-switch>
          </el-form-item>
          <el-form-item label="显示数量">
            <el-switch v-model="data.options.showCount"></el-switch>
          </el-form-item>
          <el-form-item label="append-to-body(弹窗中使用不需要开启)">
            <el-switch v-model="data.options.appendToBody"></el-switch>
          </el-form-item>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/regular/keyboard';
import 'vue-awesome/icons/regular/trash-alt';
import 'vue-awesome/icons/regular/clone';
import 'vue-awesome/icons/regular/dot-circle';
import 'vue-awesome/icons/regular/check-square';
import 'vue-awesome/icons/bars';
import 'vue-awesome/icons/table';

import 'vue-awesome/icons/regular/calendar-alt';
import 'vue-awesome/icons/regular/clock';
import 'vue-awesome/icons/th';
import 'vue-awesome/icons/language';

import 'vue-awesome/icons/sort-numeric-up';
import 'vue-awesome/icons/regular/star';
import 'vue-awesome/icons/palette';
import 'vue-awesome/icons/regular/caret-square-down';
import 'vue-awesome/icons/toggle-off';
import 'vue-awesome/icons/sliders-h';
import 'vue-awesome/icons/regular/image';
import 'vue-awesome/icons/chalkboard';
import { DML } from '@/types/common';

export default {
  name: 'WidgetConfig',
  components: {
    Draggable,
    Icon,
  },
  props: ['data'],
  data() {
    return {
      // 字典类型
      dictType: [],
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null,
      },
    };
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
  },
  created() {
    // 请求字典分类
    this.$PROCRUD.crud(DML.SELECT, 'ad_codelist_type').then((res) => {
      this.dictType = res.data.list.map(item => ({
        label: item.typeName,
        value: item.id,
      }));
    });
  },
  methods: {
    getDraggableOptions() {
      return {
        group: { name: 'options' },
        ghostClass: 'ghost',
        handle: '.drag-item',
      };
    },
    handleOptionsRemove(index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1);
      } else {
        this.data.options.options.splice(index, 1);
      }
    },
    // 添加选项
    handleAddOption() {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: 'value',
          label: 'label',
        });
      } else {
        this.data.options.options.push({
          value: 'value',
        });
      }
    },
    // 清除默认选中项
    handleClearOption() {
      this.data.options.defaultValue = null;
    },
    handleAddColumn() {
      this.data.columns.push({
        span: '',
        list: [],
      });
    },
    generateRule() {
      this.$set(this.data, 'rules', []);
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key]);
        }
      });
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue];
        } else {
          this.data.options.defaultValue = [];
        }
      } else if (this.data.options.defaultValue.length > 0) {
        [this.data.options.defaultValue] = this.data.options.defaultValue;
      } else {
        this.data.options.defaultValue = '';
      }
    },
  },
  watch: {
    'data.options.isRange': function watchIsRange(val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null;
        } else if (Object.keys(this.data.options).indexOf('defaultValue') >= 0) {
          this.data.options.defaultValue = '';
        }
      }
    },
    'data.options.required': function watchRequired(val) {
      if (val) {
        this.validator.required = { required: true, message: `${this.data.name}必须填写` };
      } else {
        this.validator.required = null;
      }
      this.$nextTick(() => {
        this.generateRule();
      });
    },
    'data.options.dataType': function watchDataType(val) {
      let message = `${this.data.name}格式不正确`;
      // 如果自定义了错误提示语则赋值
      if (this.data.options.message != null && this.data.options.message !== '') {
        // eslint-disable-next-line prefer-destructuring
        message = this.data.options.message;
      }
      if (!this.show) {
        return false;
      }
      if (val) {
        this.validator.type = { type: val, message };
      } else {
        this.validator.type = null;
      }
      this.generateRule();
      return null;
    },
    'data.options.pattern': function watchPattern(val) {
      let message = `${this.data.name}格式不正确`;
      // 如果自定义了错误提示语则赋值
      if (this.data.options.message != null && this.data.options.message !== '') {
        // eslint-disable-next-line prefer-destructuring
        message = this.data.options.message;
      }

      if (!this.show) {
        return false;
      }
      if (val) {
        this.validator.pattern = { pattern: val, message };
      } else {
        this.validator.pattern = null;
      }
      this.generateRule();
      return null;
    },
  },
};
</script>
