import Vue from 'vue'
import { BaseComponent } from './main'
import { ElCrudTable } from './crud-table'
import { ElFormDesignerDialog } from './form-designer-dialog'
import { ElTableDesignerDialog } from './table-designer-dialog'
import { ElGenerateForm } from './generate-form'

export interface InstallationOptions {}

/**
 * Install all ElementProCrud components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(ElementProCrud)` to install.
 */
export function install (vue: typeof Vue, options: InstallationOptions): void

/** ElementUI component common definition */
export type Component = BaseComponent

/** FormDesignerDialog Component */
export class FormDesignerDialog extends ElFormDesignerDialog {}

/** TableDesignerDialog Component */
export class TableDesignerDialog extends ElTableDesignerDialog {}

/** GenerateForm Component */
export class GenerateForm extends ElGenerateForm {}

/** CrudTable Component */
export class CrudTable extends ElCrudTable {}
