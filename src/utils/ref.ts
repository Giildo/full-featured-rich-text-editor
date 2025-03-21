type ObserverCallback = (newValue: unknown, oldValue: unknown) => void

export interface Ref<T> {
  value: T
}

export const ref = <T>(value?: T): Ref<T | null> => ({ value: value ?? null })

export const watch = <T extends Ref<unknown>>(value: T, observer: ObserverCallback): T => {
  return new Proxy(value, {
    set(target: T, key: string, value: unknown): boolean {
      const oldValue = target[key as keyof T]
      target[key as keyof T] = value as T[keyof T]
      observer(value, oldValue)
      return true
    },
  })
}
