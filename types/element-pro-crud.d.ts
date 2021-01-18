import Vue from 'vue';
import { BaseComponent } from './main';
import { ElProTable } from './crud-table';
import { ElFormDesigner } from './form-designer-dialog';
import { ElTableDesigner } from './table-designer-dialog';
import { ElGenerateForm } from './generate-form';

export interface InstallationOptions {}

/**
 * Install all ElementProCrud components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(ElementProCrud)` to install.
 */
export function install (vue: typeof Vue, options: InstallationOptions): void

/** ElementUI component common definition */
export type Component = BaseComponent

/** FormDesigner Component */
export class FormDesigner extends ElFormDesigner {}

/** TableDesigner Component */
export class TableDesigner extends ElTableDesigner {}

/** GenerateForm Component */
export class GenerateForm extends ElGenerateForm {}

/** ProTable Component */
export class ProTable extends ElProTable {}
