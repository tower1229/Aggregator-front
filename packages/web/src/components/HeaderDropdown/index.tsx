import { UDropdown, UDropdownPropsType } from '@aggregator/components'
import { defineComponent, PropType, VNodeChild } from 'vue'
import styles from './index.module.css'

const HeaderDropdown = defineComponent({
  name: 'HeaderDropdown',
  props: {
    width: {
      type: Number
    },
    title: {
      type: String
    },
    value: {
      type: [String, Number]
    },
    trigger: {
      type: String as PropType<'click' | 'hover'>,
      default: 'click'
    },
    placement: {
      type: String as PropType<UDropdownPropsType['placement']>,
      default: 'bottom-start'
    },
    options: {
      type: Array as PropType<
        {
          key: string | number
          icon?: () => VNodeChild
          disabled?: boolean
          label: string | (() => VNodeChild)
        }[]
      >,
      required: true
    }
  },
  emits: ['select'],
  setup(props, ctx) {
    const onSelect = (v: string | number) => {
      ctx.emit('select', v)
    }
    return () => (
      <UDropdown
        class={styles.dropdown}
        trigger={props.trigger}
        width={props.width}
        value={props.value}
        placement={props.placement}
        themeOverrides={{
          optionOpacityDisabled: '0.4'
        }}
        options={
          props.title
            ? [
                {
                  type: 'group',
                  label: props.title,
                  key: 'label',
                  children: props.options
                }
              ]
            : props.options
        }
        onSelect={onSelect}
      >
        {ctx.slots.default?.()}
      </UDropdown>
    )
  }
})

export default HeaderDropdown
