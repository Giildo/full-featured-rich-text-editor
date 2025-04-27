/// <reference types="vite/client" />

import type { BundledLanguage } from 'shiki'

// Full Featured Rich Text Editor
export interface FFRTEItem {
  content: string
  title: string
}

export type FFRTEOptions = FFRTECoreOptions & CodeDialogOptions

export interface FFRTECoreOptions {
  color?: string
  container: HTMLElement
  item: FFRTEItem
}

// Dialog
export interface CoreDialogOptions {
  contentClasses?: string[]
  dialogContent: HTMLElement
  size?: number
  title: string
}

// Dialog code
export interface CodeDialogOptions {
  languages?: BundledLanguage[]
}

export interface CodeDialogFooterButton {
  icon: string
  onClick: (e: Event) => void
  text: string
  type: 'submit' | 'reset' | 'button'
}

export interface ActionButton {
  icon: string
  title: string
  onClick: (e: Event) => void
}

export interface DialogButtonsGroup {
  title: string
  buttons: DialogButton[]
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
export type VisualBlockDialogType = 'alert' | 'info' | 'success' | 'warning'
export type DialogType =
  | BlockquoteDialogType
  | CodeDialogType
  | ImgDialogType
  | ListDialogType
  | SimpleDialogType
  | TableDialogType
  | VisualBlockDialogType

type Siblings = 'next' | 'previous'
type Direction = 'up' | 'down' | 'left' | 'right'

export interface ContextData {
  label: string
  action: (payload: { e?: Event; shadowRoot: ShadowRoot }) => void
}
