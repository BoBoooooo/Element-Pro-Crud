import Vue from 'vue';
import { BaseComponent } from './main';
import { ElProTable } from './pro-table';
import { ElFormDesigner } from './form-designer-dialog';
import { ElTableDesigner } from './table-designer-dialog';
import { ElProForm } from './pro-form';
import { ElCrudTable } from './crud-table';

export interface InstallationOptions {}

/**
 * Install all ElementProCrud components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(ElementProCrud)` to install.
 */
export function install(vue: typeof Vue, options: InstallationOptions): void;

/** ElementUI component common definition */
export type Component = BaseComponent;

/** FormDesigner Component */
export class FormDesigner extends ElFormDesigner {}

/** TableDesigner Component */
export class TableDesigner extends ElTableDesigner {}

/** ProForm Component */
export class ProForm extends ElProForm {}

/** ProTable Component */
export class ProTable extends ElProTable {}

/** CrudTable Component */
export class CrudTable extends ElCrudTable {}
