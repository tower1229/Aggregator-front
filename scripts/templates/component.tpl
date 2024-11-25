import { defineComponent } from 'vue'

// import './index.css'

export interface <%= name %>Props {
  //
}

const <%= name %> = defineComponent<<%= name %>Props>({
  name: '<%= name %>',
  setup(props, ctx) {
    return () => <span>{ctx.slots.default?.()}</span>
  }
})

export default <%= name %>
