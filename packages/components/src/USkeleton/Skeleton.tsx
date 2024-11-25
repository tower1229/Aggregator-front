import type { SkeletonProps } from 'naive-ui'
import { NSkeleton } from 'naive-ui'
import { defineComponent } from 'vue'

export type USkeletonPropsType = SkeletonProps

const USkeleton = defineComponent({
  name: 'USkeleton',
  extends: NSkeleton,
  inheritAttrs: true,
  setup(props, ctx) {
    return () => <NSkeleton {...props} v-slots={ctx.slots} />
  }
})

export default USkeleton
