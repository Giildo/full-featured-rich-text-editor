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

export type DialogType =
  | 'p'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'code'
  | 'ul'
  | 'ol'
  | 'info'
  | 'warning'
  | 'img'
  | 'table'
  | 'blockquote'

export interface FFRTEItem {
  title: string
  content: string
}

export interface FFRTEOptions {
  item: FFRTEItem
}
