import { debounce } from '@aggregator/utils'
import { NSelect, SelectProps } from 'naive-ui'
import type { SelectBaseOption } from 'naive-ui/lib/select/src/interface'
import type { InjectionKey, PropType } from 'vue'
import { provide, inject, defineComponent, ref } from 'vue'

export type UHashInputOnSearch = (
  value: string,
  category: string
) => Promise<{ label: string; value: string | number }[]>

export interface UHashInputState {
  onSearch: UHashInputOnSearch
}

export const UHashInputSymbol: InjectionKey<UHashInputState> = Symbol()

export type UHashInputPropsType = SelectProps

const UHashInput = defineComponent({
  name: 'UHashInput',
  extends: NSelect,
  props: {
    category: {
      type: String as PropType<'comerSkill' | 'startup' | 'bounty'>,
      required: true
    }
    /**
     * max bytes for custom input
     */
    // byteMaxLength: {
    //   type: Number,
    //   default: 16
    // }
  },
  setup(props, ctx) {
    const searchingValue = ref('')
    const loading = ref(false)
    const options = ref<SelectBaseOption[]>([])

    const hashInputState = inject(UHashInputSymbol)
    if (!hashInputState) {
      throw new Error('UHashInput must be used in UHashInputProvider')
    }

    const remoteSearch = debounce(async (value: string) => {
      const result = await hashInputState.onSearch?.(value, props.category)
      if (result.some(item => item.value === value)) {
        options.value = result
      } else {
        options.value = [...result, { label: `#${value}#(new)`, value: value }]
      }
      return result
    }, 500)

    const doSearch = async (inputValue: string) => {
      if (inputValue.startsWith('#')) {
        const value = inputValue.replace(/^#+/, '').replace(/#+$/, '')
        if (!value) {
          searchingValue.value = ''
          return
        }
        searchingValue.value = value
        // if (props.byteMaxLength) {
        //   const byteLength = new Blob([value]).size
        //   if (byteLength > props.byteMaxLength) {
        //     return
        //   }
        // }
        loading.value = true
        options.value = await remoteSearch(value)
        loading.value = false
      } else {
        options.value = []
        loading.value = false
        searchingValue.value = inputValue.replace(/^#+/, '').replace(/#+$/, '')
      }
    }

    const onChange = (value: string | string[]) => {
      ctx.emit('update:value', value)
      searchingValue.value = ''
      options.value = []
      loading.value = false
    }

    return () => (
      <NSelect
        // @ts-ignore
        {...props}
        // placeholder="#UI design#  #UX design#"
        consistentMenuWidth={false}
        clearable
        loading={loading.value}
        maxTagCount={props.maxTagCount ?? 5}
        multiple
        remote
        options={options.value}
        // renderLabel={({ option }: { option: SelectOption }) =>
        //   option.label.toString().replace(/^#/, '').replace(/#$/, '')
        // }
        // renderOption={({ option }: { option: SelectOption }) => `#${option.value}#`}
        tag
        filterable
        onSearch={doSearch}
        onUpdateValue={onChange}
      />
    )
  }
})

export default UHashInput

export const UHashInputProvider = defineComponent({
  name: 'UHashInputProvider',
  props: {
    onSearch: {
      type: Function as PropType<UHashInputOnSearch>,
      required: true
    }
  },
  setup(props, ctx) {
    provide(UHashInputSymbol, { onSearch: props.onSearch })
    return () => ctx.slots.default?.()
  }
})
