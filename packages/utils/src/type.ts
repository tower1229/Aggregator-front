export type DeepWriteable<T> = {
  -readonly [P in keyof T]: T[P] extends Record<string, any> ? DeepWriteable<T[P]> : T[P]
}

export type VueComponentPropsType<T extends Record<string, any>> = Exclude<
  DeepWriteable<T>,
  Record<string, never>
>
