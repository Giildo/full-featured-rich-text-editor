/// <reference types="vite/client" />

export interface ActionButton {
  icon: string
  title: string
  onClick: (e: Event) => void
}

export interface DialogButton {
  icon: string
  text: string
  type: DialogType
}

export type BlockquoteDialogType = 'blockquote'
export type CodeDialogType = 'code'
export type ImgDialogType = 'img'
export type ListDialogType = 'ul' | 'ol'
export type SimpleDialogType = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type TableDialogType = 'table'
export type VisualBlockDialogType = 'info' | 'warning'
export type DialogType =
  | BlockquoteDialogType
  | CodeDialogType
  | ImgDialogType
  | ListDialogType
  | SimpleDialogType
  | TableDialogType
  | VisualBlockDialogType

export interface FFRTEItem {
  title: string
  content: string
}

export interface FFRTEOptions {
  item: FFRTEItem
}

// Objects
export interface EditorAddTagDialogInterface extends HTMLElement {
  dialog: HTMLDialogElement
}

export interface EditorCodeDialogInterface extends HTMLElement {
  dialog: HTMLDialogElement
}

export interface CoreDialogInterface extends HTMLElement {
  dialog: HTMLDialogElement
}
