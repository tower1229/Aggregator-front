import type { Prop } from 'vue'

declare type RequiredKeys<T> = {
  [K in keyof T]: T[K] extends {
    required: true
  }
    ? // remove default as it is optional
      // | {
      //     default: any
      //   }
      // | BooleanConstructor
      // | {
      //     type: BooleanConstructor
      //   }
      T[K] extends {
        default: undefined | (() => undefined)
      }
      ? never
      : K
    : never
}[keyof T]

declare type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>

declare type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N

declare type InferPropType<T> = [T] extends [null]
  ? any
  : [T] extends [
      {
        type: null | true
      }
    ]
  ? any
  : [T] extends [
      | ObjectConstructor
      | {
          type: ObjectConstructor
        }
    ]
  ? Record<string, any>
  : [T] extends [
      | BooleanConstructor
      | {
          type: BooleanConstructor
        }
    ]
  ? boolean
  : [T] extends [
      | DateConstructor
      | {
          type: DateConstructor
        }
    ]
  ? Date
  : [T] extends [
      | (infer U)[]
      | {
          type: (infer U)[]
        }
    ]
  ? U extends DateConstructor
    ? Date | InferPropType<U>
    : InferPropType<U>
  : [T] extends [Prop<infer V, infer D>]
  ? unknown extends V
    ? IfAny<V, V, D>
    : V
  : T

export declare type ExtractPropTypes<O> = {
  [K in keyof Pick<O, RequiredKeys<O>>]: InferPropType<O[K]>
} & {
  [K in keyof Pick<O, OptionalKeys<O>>]?: InferPropType<O[K]>
}
