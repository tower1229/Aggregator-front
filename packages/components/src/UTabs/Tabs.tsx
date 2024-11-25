import { NTabs, TabsProps } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'

export type UTabsPropsType = TabsProps

/**
 * custom class:
 * no-border
 * */

const UTabs = defineComponent({
  name: 'UTabs',
  extends: NTabs,
  setup(props, ctx) {
    return () => <NTabs {...props} class={`u-tabs ${ctx.attrs.class}`} v-slots={ctx.slots} />
  }
})

export default UTabs
