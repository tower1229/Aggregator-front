import { defineComponent, ExtractPropTypes, inject, InjectionKey, PropType, provide } from 'vue'

type OnCustomUpload = (
  file: File,
  onProgress: (percent: number) => void
) => Promise<string | undefined>

export const UUploadProviderProps = {
  onUpload: {
    type: Function as PropType<OnCustomUpload>,
    required: true
  }
}

export type UUploadProviderPropsType = ExtractPropTypes<typeof UUploadProviderProps>

export type UUploadProviderState = {
  onUpload: OnCustomUpload
}

export const UUploadSymbol: InjectionKey<UUploadProviderState> = Symbol()

export const UUploadProvider = defineComponent({
  name: 'UUploadProvider',
  props: UUploadProviderProps,
  setup(props, ctx) {
    provide(UUploadSymbol, {
      onUpload: props.onUpload
    })
    return () => ctx.slots.default?.()
  }
})

export function useUpload() {
  const ret = inject(UUploadSymbol)
  if (!ret) {
    throw new Error('useUpload must be used in UUploadProvider')
  }
  return ret
}
